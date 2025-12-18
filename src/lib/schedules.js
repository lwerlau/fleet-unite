import { supabase } from './supabase'

/**
 * Fetch maintenance schedules for equipment
 */
export async function fetchMaintenanceSchedules(equipmentId) {
  try {
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error)
    return { data: [], error }
  }
}

/**
 * Create or update maintenance schedule
 */
export async function saveMaintenanceSchedule(equipmentId, scheduleData) {
  try {
    // Check if schedule already exists for this equipment and type
    const { data: existing } = await supabase
      .from('maintenance_schedules')
      .select('id')
      .eq('equipment_id', equipmentId)
      .eq('type', scheduleData.type)
      .single()

    if (existing) {
      // Update existing schedule
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .update({
          interval_type: scheduleData.interval_type,
          interval_value: parseFloat(scheduleData.interval_value),
          last_service_date: scheduleData.last_service_date || null,
          last_service_mileage: scheduleData.last_service_mileage || null,
          last_service_hours: scheduleData.last_service_hours || null,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } else {
      // Create new schedule
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .insert([
          {
            equipment_id: equipmentId,
            type: scheduleData.type,
            interval_type: scheduleData.interval_type,
            interval_value: parseFloat(scheduleData.interval_value),
            last_service_date: scheduleData.last_service_date || null,
            last_service_mileage: scheduleData.last_service_mileage || null,
            last_service_hours: scheduleData.last_service_hours || null,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    }
  } catch (error) {
    console.error('Error saving maintenance schedule:', error)
    return { data: null, error }
  }
}

/**
 * Delete maintenance schedule
 */
export async function deleteMaintenanceSchedule(scheduleId) {
  try {
    const { error } = await supabase
      .from('maintenance_schedules')
      .delete()
      .eq('id', scheduleId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting maintenance schedule:', error)
    return { error }
  }
}

/**
 * Calculate usage patterns from maintenance history
 * Returns average daily usage for mileage and weekly usage for hours
 */
export function calculateUsagePatterns(maintenanceHistory, equipment) {
  if (!maintenanceHistory || maintenanceHistory.length < 2) {
    // Not enough data - return default estimates
    return {
      milesPerDay: 50, // Default estimate
      hoursPerWeek: 5, // Default estimate
      confidence: 'low',
    }
  }

  // Sort by date (oldest first)
  const sorted = [...maintenanceHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  let totalMiles = 0
  let totalDays = 0
  let totalHours = 0
  let totalWeeks = 0
  let validMileagePairs = 0
  let validHoursPairs = 0

  // Calculate mileage usage
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]

    if (
      prev.mileage_at_service !== null &&
      curr.mileage_at_service !== null &&
      prev.mileage_at_service < curr.mileage_at_service
    ) {
      const miles = curr.mileage_at_service - prev.mileage_at_service
      const days =
        (new Date(curr.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24)
      
      if (days > 0) {
        totalMiles += miles
        totalDays += days
        validMileagePairs++
      }
    }

    if (
      prev.hours_at_service !== null &&
      curr.hours_at_service !== null &&
      prev.hours_at_service < curr.hours_at_service
    ) {
      const hours = curr.hours_at_service - prev.hours_at_service
      const weeks =
        (new Date(curr.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24 * 7)
      
      if (weeks > 0) {
        totalHours += hours
        totalWeeks += weeks
        validHoursPairs++
      }
    }
  }

  // Calculate averages
  const milesPerDay = totalDays > 0 ? totalMiles / totalDays : 50
  const hoursPerWeek = totalWeeks > 0 ? totalHours / totalWeeks : 5

  // Determine confidence
  let confidence = 'low'
  if (validMileagePairs >= 3 || validHoursPairs >= 3) {
    confidence = 'high'
  } else if (validMileagePairs >= 1 || validHoursPairs >= 1) {
    confidence = 'medium'
  }

  return {
    milesPerDay: Math.max(1, Math.round(milesPerDay * 10) / 10), // Round to 1 decimal, min 1
    hoursPerWeek: Math.max(0.1, Math.round(hoursPerWeek * 10) / 10), // Round to 1 decimal, min 0.1
    confidence,
  }
}

/**
 * Calculate next due date for a maintenance schedule
 * Uses usage patterns to predict when maintenance will be due
 */
export function calculateNextDueDate(schedule, equipment, usagePatterns) {
  if (!schedule || !equipment) return null

  const now = new Date()
  let nextDueDate = null
  let daysUntilDue = null

  if (schedule.interval_type === 'mileage') {
    if (!equipment.mileage || schedule.last_service_mileage === null) {
      return null
    }

    const currentMileage = equipment.mileage
    const lastServiceMileage = schedule.last_service_mileage || 0
    const milesSinceService = currentMileage - lastServiceMileage
    const milesUntilDue = schedule.interval_value - milesSinceService

    if (milesUntilDue <= 0) {
      // Already overdue
      daysUntilDue = 0
    } else {
      // Use usage pattern to estimate days
      const milesPerDay = usagePatterns?.milesPerDay || 50
      daysUntilDue = Math.ceil(milesUntilDue / milesPerDay)
    }

    nextDueDate = new Date(now.getTime() + daysUntilDue * 24 * 60 * 60 * 1000)
  } else if (schedule.interval_type === 'hours') {
    if (!equipment.hours || schedule.last_service_hours === null) {
      return null
    }

    const currentHours = equipment.hours
    const lastServiceHours = schedule.last_service_hours || 0
    const hoursSinceService = currentHours - lastServiceHours
    const hoursUntilDue = schedule.interval_value - hoursSinceService

    if (hoursUntilDue <= 0) {
      // Already overdue
      daysUntilDue = 0
    } else {
      // Use usage pattern to estimate days
      const hoursPerWeek = usagePatterns?.hoursPerWeek || 5
      const hoursPerDay = hoursPerWeek / 7
      daysUntilDue = Math.ceil(hoursUntilDue / hoursPerDay)
    }

    nextDueDate = new Date(now.getTime() + daysUntilDue * 24 * 60 * 60 * 1000)
  } else if (schedule.interval_type === 'days') {
    if (!schedule.last_service_date) {
      return null
    }

    const lastServiceDate = new Date(schedule.last_service_date)
    const daysSinceService = Math.floor(
      (now - lastServiceDate) / (1000 * 60 * 60 * 24)
    )
    const daysUntilDue = schedule.interval_value - daysSinceService

    if (daysUntilDue <= 0) {
      daysUntilDue = 0
    }

    nextDueDate = new Date(lastServiceDate.getTime() + schedule.interval_value * 24 * 60 * 60 * 1000)
  }

  return {
    nextDueDate,
    daysUntilDue: daysUntilDue || 0,
    isOverdue: daysUntilDue < 0,
    isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 14,
  }
}

/**
 * Get status for a schedule (good, due_soon, overdue)
 */
export function getScheduleStatus(schedule, equipment, usagePatterns) {
  const nextDue = calculateNextDueDate(schedule, equipment, usagePatterns)
  
  if (!nextDue) return 'good'
  
  if (nextDue.isOverdue) return 'overdue'
  if (nextDue.isDueSoon) return 'due_soon'
  return 'good'
}

/**
 * Find last maintenance event of a specific type
 */
export function findLastMaintenanceOfType(maintenanceHistory, type) {
  if (!maintenanceHistory || maintenanceHistory.length === 0) return null

  const matching = maintenanceHistory.filter(
    (m) => m.maintenance_type === type
  )

  if (matching.length === 0) return null

  // Return most recent
  return matching.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
}

/**
 * Normalize equipment type for matching
 */
function normalizeEquipmentType(equipmentType) {
  if (!equipmentType) return 'other'
  return equipmentType.toLowerCase().trim()
}

/**
 * Get relevant maintenance schedules based on equipment type
 */
export function getRelevantSchedules(equipmentType) {
  const type = normalizeEquipmentType(equipmentType)

  // Truck/Vehicle Types
  const vehicleTypes = [
    'truck',
    'pickup',
    'van',
    'car',
    'semi truck',
    'dump truck',
    'box truck',
    'flatbed',
  ]
  if (vehicleTypes.includes(type)) {
    return [
      {
        type: 'Oil Change',
        defaultInterval: 3000,
        defaultIntervalType: 'mileage',
        description: 'Regular oil and filter change',
      },
      {
        type: 'Tire Rotation',
        defaultInterval: 5000,
        defaultIntervalType: 'mileage',
        description: 'Rotate tires for even wear',
      },
      {
        type: 'Filter Replacement',
        defaultInterval: 15000,
        defaultIntervalType: 'mileage',
        description: 'Replace air and cabin filters',
      },
      {
        type: 'Brake Service',
        defaultInterval: 30000,
        defaultIntervalType: 'mileage',
        description: 'Inspect and service brake system',
      },
      {
        type: 'Annual Inspection',
        defaultInterval: 12,
        defaultIntervalType: 'days',
        description: 'Annual safety and performance inspection',
      },
    ]
  }

  // Excavator/Heavy Equipment Types
  const heavyEquipmentTypes = [
    'excavator',
    'mini excavator',
    'backhoe',
    'bulldozer',
    'dozer',
    'crawler dozer',
    'wheel loader',
    'track loader',
    'skid steer',
    'compact track loader',
    'grader',
    'motor grader',
    'compactor',
    'roller',
  ]
  if (heavyEquipmentTypes.includes(type)) {
    return [
      {
        type: 'Oil Change',
        defaultInterval: 50,
        defaultIntervalType: 'hours',
        description: 'Hydraulic oil and engine oil change',
      },
      {
        type: 'Filter Replacement',
        defaultInterval: 100,
        defaultIntervalType: 'hours',
        description: 'Replace hydraulic and air filters',
      },
      {
        type: 'Hydraulic Service',
        defaultInterval: 500,
        defaultIntervalType: 'hours',
        description: 'Hydraulic system inspection and service',
      },
      {
        type: 'Track/Undercarriage Inspection',
        defaultInterval: 250,
        defaultIntervalType: 'hours',
        description: 'Inspect tracks, rollers, and undercarriage',
      },
      {
        type: 'Annual Inspection',
        defaultInterval: 12,
        defaultIntervalType: 'days',
        description: 'Annual safety and performance inspection',
      },
    ]
  }

  // Tractor/Farm Equipment Types
  const farmEquipmentTypes = [
    'tractor',
    'farm tractor',
    'compact tractor',
    'combine',
    'combine harvester',
    'farm equipment',
    'hay baler',
    'planter',
    'sprayer',
    'mower',
    'bush hog',
  ]
  if (farmEquipmentTypes.includes(type)) {
    return [
      {
        type: 'Oil Change',
        defaultInterval: 50,
        defaultIntervalType: 'hours',
        description: 'Engine oil and filter change',
      },
      {
        type: 'Filter Replacement',
        defaultInterval: 100,
        defaultIntervalType: 'hours',
        description: 'Replace air and fuel filters',
      },
      {
        type: 'Hydraulic Service',
        defaultInterval: 200,
        defaultIntervalType: 'hours',
        description: 'Hydraulic fluid and filter change',
      },
      {
        type: 'Grease Service',
        defaultInterval: 10,
        defaultIntervalType: 'hours',
        description: 'Lubricate all grease fittings',
      },
      {
        type: 'Annual Inspection',
        defaultInterval: 12,
        defaultIntervalType: 'days',
        description: 'Annual safety and performance inspection',
      },
    ]
  }

  // Utility Vehicle Types
  const utilityTypes = [
    'utility vehicle',
    'utv',
    'atv',
    'side-by-side',
    'gator',
    'ranger',
    'mule',
  ]
  if (utilityTypes.includes(type)) {
    return [
      {
        type: 'Oil Change',
        defaultInterval: 25,
        defaultIntervalType: 'hours',
        description: 'Engine oil and filter change',
      },
      {
        type: 'Filter Replacement',
        defaultInterval: 50,
        defaultIntervalType: 'hours',
        description: 'Replace air filter',
      },
      {
        type: 'Tire Inspection',
        defaultInterval: 100,
        defaultIntervalType: 'hours',
        description: 'Inspect tires for wear and damage',
      },
      {
        type: 'Grease Service',
        defaultInterval: 10,
        defaultIntervalType: 'hours',
        description: 'Lubricate all grease fittings',
      },
      {
        type: 'Annual Inspection',
        defaultInterval: 12,
        defaultIntervalType: 'days',
        description: 'Annual safety and performance inspection',
      },
    ]
  }

  // Chainsaw/Small Equipment
  if (type === 'chainsaw' || type === 'mower') {
    return [
      {
        type: 'Oil Change',
        defaultInterval: 25,
        defaultIntervalType: 'hours',
        description: 'Engine oil change',
      },
      {
        type: 'Filter Replacement',
        defaultInterval: 50,
        defaultIntervalType: 'hours',
        description: 'Replace air filter',
      },
      {
        type: 'Spark Plug Replacement',
        defaultInterval: 100,
        defaultIntervalType: 'hours',
        description: 'Replace spark plug',
      },
      {
        type: 'Chain/Blade Sharpening',
        defaultInterval: 10,
        defaultIntervalType: 'hours',
        description: 'Sharpen chain or blade',
      },
    ]
  }

  // Trailer Types
  const trailerTypes = [
    'trailer',
    'flatbed trailer',
    'enclosed trailer',
    'equipment trailer',
  ]
  if (trailerTypes.includes(type)) {
    return [
      {
        type: 'Tire Inspection',
        defaultInterval: 3000,
        defaultIntervalType: 'mileage',
        description: 'Inspect tires for wear and pressure',
      },
      {
        type: 'Brake Service',
        defaultInterval: 12000,
        defaultIntervalType: 'mileage',
        description: 'Inspect and service brakes',
      },
      {
        type: 'Light Check',
        defaultInterval: 3,
        defaultIntervalType: 'days',
        description: 'Check all lights and wiring',
      },
      {
        type: 'Annual Inspection',
        defaultInterval: 12,
        defaultIntervalType: 'days',
        description: 'Annual safety inspection',
      },
    ]
  }

  // Default/Other - Basic schedules
  return [
    {
      type: 'Oil Change',
      defaultInterval: 50,
      defaultIntervalType: 'hours',
      description: 'Regular oil and filter change',
    },
    {
      type: 'Filter Replacement',
      defaultInterval: 100,
      defaultIntervalType: 'hours',
      description: 'Replace filters',
    },
    {
      type: 'Annual Inspection',
      defaultInterval: 12,
      defaultIntervalType: 'days',
      description: 'Annual safety and performance inspection',
    },
  ]
}

/**
 * Common maintenance schedule types (deprecated - use getRelevantSchedules instead)
 * Kept for backward compatibility
 */
export const COMMON_SCHEDULE_TYPES = [
  {
    type: 'Oil Change',
    defaultInterval: 3000,
    defaultIntervalType: 'mileage',
    description: 'Regular oil and filter change',
  },
  {
    type: 'Tire Rotation',
    defaultInterval: 5000,
    defaultIntervalType: 'mileage',
    description: 'Rotate tires for even wear',
  },
  {
    type: 'Filter Replacement',
    defaultInterval: 15000,
    defaultIntervalType: 'mileage',
    description: 'Replace air and cabin filters',
  },
  {
    type: 'Brake Service',
    defaultInterval: 30000,
    defaultIntervalType: 'mileage',
    description: 'Inspect and service brake system',
  },
  {
    type: 'Annual Inspection',
    defaultInterval: 12,
    defaultIntervalType: 'days',
    description: 'Annual safety and performance inspection',
  },
]


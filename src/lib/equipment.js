import { supabase } from './supabase'

/**
 * Fetch all equipment for the current user
 */
export async function fetchEquipment(userId) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return { data: null, error }
  }
}

/**
 * Create new equipment
 */
export async function createEquipment(userId, equipmentData) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert([
        {
          user_id: userId,
          ...equipmentData,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating equipment:', error)
    return { data: null, error }
  }
}

/**
 * Update equipment
 */
export async function updateEquipment(equipmentId, equipmentData) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .update(equipmentData)
      .eq('id', equipmentId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating equipment:', error)
    return { data: null, error }
  }
}

/**
 * Delete equipment
 */
export async function deleteEquipment(equipmentId) {
  try {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', equipmentId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return { error }
  }
}

/**
 * Fetch maintenance schedules for equipment
 */
export async function fetchMaintenanceSchedules(equipmentIds) {
  if (!equipmentIds || equipmentIds.length === 0) {
    return { data: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select('*')
      .in('equipment_id', equipmentIds)

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error)
    return { data: [], error }
  }
}

/**
 * Calculate equipment status based on maintenance schedules
 * Returns: 'good', 'due_soon', or 'overdue'
 */
export function calculateEquipmentStatus(equipment, schedules = []) {
  if (!schedules || schedules.length === 0) {
    return 'good' // No schedules = no maintenance due
  }

  const now = new Date()
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

  let hasOverdue = false
  let hasDueSoon = false

  for (const schedule of schedules) {
    if (schedule.equipment_id !== equipment.id) continue

    let nextDueDate = null
    let currentValue = null

    // Calculate next due date based on interval type
    if (schedule.interval_type === 'mileage') {
      if (!equipment.mileage || !schedule.last_service_mileage) continue
      
      currentValue = equipment.mileage
      const interval = schedule.interval_value
      const lastServiceMileage = schedule.last_service_mileage || 0
      const milesSinceService = currentValue - lastServiceMileage
      const milesUntilDue = interval - milesSinceService

      // Estimate days until due (rough calculation: assume 50 miles/day average)
      // This is a simplified calculation - you can improve this with actual usage patterns
      const estimatedDaysUntilDue = (milesUntilDue / 50)
      nextDueDate = new Date(now.getTime() + estimatedDaysUntilDue * 24 * 60 * 60 * 1000)

      if (milesSinceService >= interval) {
        hasOverdue = true
      } else if (milesUntilDue <= (interval * 0.1)) { // Within 10% of interval
        hasDueSoon = true
      }
    } else if (schedule.interval_type === 'hours') {
      if (!equipment.hours || !schedule.last_service_hours) continue
      
      currentValue = equipment.hours
      const interval = schedule.interval_value
      const lastServiceHours = schedule.last_service_hours || 0
      const hoursSinceService = currentValue - lastServiceHours
      const hoursUntilDue = interval - hoursSinceService

      // Estimate days until due (rough calculation: assume 5 hours/week average)
      const estimatedDaysUntilDue = (hoursUntilDue / 5) * 7
      nextDueDate = new Date(now.getTime() + estimatedDaysUntilDue * 24 * 60 * 60 * 1000)

      if (hoursSinceService >= interval) {
        hasOverdue = true
      } else if (hoursUntilDue <= (interval * 0.1)) { // Within 10% of interval
        hasDueSoon = true
      }
    } else if (schedule.interval_type === 'days') {
      if (!schedule.last_service_date) continue
      
      const lastServiceDate = new Date(schedule.last_service_date)
      const daysSinceService = Math.floor((now - lastServiceDate) / (1000 * 60 * 60 * 24))
      const daysUntilDue = schedule.interval_value - daysSinceService

      nextDueDate = new Date(lastServiceDate.getTime() + schedule.interval_value * 24 * 60 * 60 * 1000)

      if (daysSinceService >= schedule.interval_value) {
        hasOverdue = true
      } else if (daysUntilDue <= 14) { // Within 2 weeks
        hasDueSoon = true
      }
    }

    // Check if next due date is within 2 weeks
    if (nextDueDate && nextDueDate <= twoWeeksFromNow && nextDueDate >= now) {
      hasDueSoon = true
    }
  }

  if (hasOverdue) return 'overdue'
  if (hasDueSoon) return 'due_soon'
  return 'good'
}


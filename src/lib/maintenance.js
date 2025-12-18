import { supabase } from './supabase'

/**
 * Fetch maintenance history for equipment
 */
export async function fetchMaintenanceHistory(equipmentId) {
  try {
    const { data, error } = await supabase
      .from('maintenance_events')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('date', { ascending: false })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching maintenance history:', error)
    return { data: [], error }
  }
}

/**
 * Create maintenance event and update equipment values
 */
export async function logMaintenance(equipmentId, maintenanceData) {
  try {
    // 1. Insert maintenance event
    const { data: maintenanceEvent, error: maintenanceError } = await supabase
      .from('maintenance_events')
      .insert([
        {
          equipment_id: equipmentId,
          maintenance_type: maintenanceData.type,
          date: maintenanceData.date,
          cost: maintenanceData.cost ? parseFloat(maintenanceData.cost) : null,
          mileage_at_service: maintenanceData.mileage ? parseFloat(maintenanceData.mileage) : null,
          hours_at_service: maintenanceData.hours ? parseFloat(maintenanceData.hours) : null,
          notes: maintenanceData.notes || null,
        },
      ])
      .select()
      .single()

    if (maintenanceError) throw maintenanceError

    // 2. Update equipment current values if mileage or hours provided
    if (maintenanceData.mileage || maintenanceData.hours) {
      const updateData = {}
      
      if (maintenanceData.mileage !== null && maintenanceData.mileage !== undefined && maintenanceData.mileage !== '') {
        updateData.mileage = parseFloat(maintenanceData.mileage)
      }
      
      if (maintenanceData.hours !== null && maintenanceData.hours !== undefined && maintenanceData.hours !== '') {
        updateData.hours = parseFloat(maintenanceData.hours)
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('equipment')
          .update(updateData)
          .eq('id', equipmentId)

        if (updateError) {
          console.error('Error updating equipment:', updateError)
          // Don't throw - maintenance was logged successfully
        }
      }
    }

    return { data: maintenanceEvent, error: null }
  } catch (error) {
    console.error('Error logging maintenance:', error)
    return { data: null, error }
  }
}

/**
 * Update maintenance event
 */
export async function updateMaintenanceEvent(maintenanceId, maintenanceData) {
  try {
    const { data, error } = await supabase
      .from('maintenance_events')
      .update({
        maintenance_type: maintenanceData.type,
        date: maintenanceData.date,
        cost: maintenanceData.cost ? parseFloat(maintenanceData.cost) : null,
        mileage_at_service: maintenanceData.mileage ? parseFloat(maintenanceData.mileage) : null,
        hours_at_service: maintenanceData.hours ? parseFloat(maintenanceData.hours) : null,
        notes: maintenanceData.notes || null,
      })
      .eq('id', maintenanceId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating maintenance event:', error)
    return { data: null, error }
  }
}

/**
 * Delete maintenance event
 */
export async function deleteMaintenanceEvent(maintenanceId) {
  try {
    const { error } = await supabase
      .from('maintenance_events')
      .delete()
      .eq('id', maintenanceId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting maintenance event:', error)
    return { error }
  }
}

/**
 * Get maintenance type configuration (icon, color, etc.)
 */
export function getMaintenanceTypeConfig(type) {
  const configs = {
    'Oil Change': {
      icon: '🛢️',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      iconColor: 'text-gray-900',
    },
    'Tire Rotation': {
      icon: '🔄',
      color: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-600',
    },
    'Brake Service': {
      icon: '🛑',
      color: 'bg-red-100 text-red-800 border-red-200',
      iconColor: 'text-red-600',
    },
    'Filter Replacement': {
      icon: '🔧',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      iconColor: 'text-orange-600',
    },
    'Repair': {
      icon: '🔨',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconColor: 'text-yellow-600',
    },
    'Inspection': {
      icon: '✓',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      iconColor: 'text-purple-600',
    },
    'Other': {
      icon: '⚙️',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      iconColor: 'text-gray-600',
    },
  }

  return configs[type] || configs['Other']
}

export const MAINTENANCE_TYPES = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Filter Replacement',
  'Repair',
  'Inspection',
  'Other',
]

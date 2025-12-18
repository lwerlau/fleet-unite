import { useState, useEffect } from 'react'
import { Calendar, TrendingUp } from 'lucide-react'
import ScheduleCard from './ScheduleCard'
import {
  fetchMaintenanceSchedules,
  saveMaintenanceSchedule,
  deleteMaintenanceSchedule,
  calculateUsagePatterns,
  getRelevantSchedules,
} from '../../lib/schedules'

export default function ScheduleManager({
  equipment,
  maintenanceHistory,
  onSchedulesChange,
}) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [usagePatterns, setUsagePatterns] = useState(null)

  useEffect(() => {
    if (equipment?.id) {
      loadSchedules()
    }
  }, [equipment?.id])

  useEffect(() => {
    if (maintenanceHistory && maintenanceHistory.length > 0 && equipment) {
      const patterns = calculateUsagePatterns(maintenanceHistory, equipment)
      setUsagePatterns(patterns)
    }
  }, [maintenanceHistory, equipment])

  const loadSchedules = async () => {
    setLoading(true)
    try {
      const { data, error } = await fetchMaintenanceSchedules(equipment.id)
      if (error) throw error
      setSchedules(data || [])
    } catch (err) {
      console.error('Error loading schedules:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (scheduleType, scheduleData) => {
    setSavingId(scheduleType.type)
    try {
      const { data, error } = await saveMaintenanceSchedule(
        equipment.id,
        scheduleData
      )
      if (error) throw error

      // Reload schedules
      await loadSchedules()

      // Notify parent
      if (onSchedulesChange) {
        onSchedulesChange()
      }
    } catch (err) {
      console.error('Error saving schedule:', err)
      alert('Failed to save schedule: ' + (err.message || 'Unknown error'))
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (scheduleId) => {
    try {
      const { error } = await deleteMaintenanceSchedule(scheduleId)
      if (error) throw error

      // Reload schedules
      await loadSchedules()

      // Notify parent
      if (onSchedulesChange) {
        onSchedulesChange()
      }
    } catch (err) {
      console.error('Error deleting schedule:', err)
      alert('Failed to delete schedule: ' + (err.message || 'Unknown error'))
    }
  }

  const getScheduleForType = (type) => {
    return schedules.find((s) => s.type === type)
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Usage Patterns */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Maintenance Schedules
          </h2>
        </div>

        {usagePatterns && usagePatterns.confidence !== 'low' && (
          <div className="card bg-blue-50 border-blue-200 mb-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Smart Usage Detection Active
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {equipment.mileage !== null &&
                    equipment.mileage !== undefined && (
                      <span>
                        Average: {usagePatterns.milesPerDay} miles/day
                      </span>
                    )}
                  {equipment.hours !== null &&
                    equipment.hours !== undefined && (
                      <span>
                        {equipment.mileage !== null && equipment.mileage !== undefined && ' • '}
                        Average: {usagePatterns.hoursPerWeek} hours/week
                      </span>
                    )}
                  {' • '}
                  Confidence: {usagePatterns.confidence}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Next maintenance dates are calculated based on your actual usage patterns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {getRelevantSchedules(equipment?.type).map((scheduleType) => {
          const schedule = getScheduleForType(scheduleType.type)
          return (
            <ScheduleCard
              key={scheduleType.type}
              scheduleType={scheduleType}
              schedule={schedule}
              equipment={equipment}
              usagePatterns={usagePatterns}
              maintenanceHistory={maintenanceHistory}
              onSave={(scheduleData) => handleSave(scheduleType, scheduleData)}
              onDelete={handleDelete}
              isSaving={savingId === scheduleType.type}
            />
          )
        })}
      </div>
    </div>
  )
}


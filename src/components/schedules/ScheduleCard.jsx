import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { calculateNextDueDate, getScheduleStatus } from '../../lib/schedules'

export default function ScheduleCard({
  scheduleType,
  schedule,
  equipment,
  usagePatterns,
  maintenanceHistory,
  onSave,
  onDelete,
  isSaving,
}) {
  const [isEnabled, setIsEnabled] = useState(!!schedule)
  const [intervalValue, setIntervalValue] = useState(
    schedule?.interval_value?.toString() || scheduleType.defaultInterval.toString()
  )
  const [intervalType, setIntervalType] = useState(
    schedule?.interval_type || scheduleType.defaultIntervalType
  )

  // Find last maintenance of this type
  const lastMaintenance = maintenanceHistory?.find(
    (m) => m.maintenance_type === scheduleType.type
  )

  // Calculate next due date
  const currentSchedule = isEnabled
    ? {
        ...schedule,
        interval_value: parseFloat(intervalValue) || scheduleType.defaultInterval,
        interval_type: intervalType,
        last_service_date: lastMaintenance?.date || schedule?.last_service_date,
        last_service_mileage:
          lastMaintenance?.mileage_at_service || schedule?.last_service_mileage,
        last_service_hours:
          lastMaintenance?.hours_at_service || schedule?.last_service_hours,
      }
    : null

  const nextDue = currentSchedule
    ? calculateNextDueDate(currentSchedule, equipment, usagePatterns)
    : null
  const status = currentSchedule
    ? getScheduleStatus(currentSchedule, equipment, usagePatterns)
    : 'good'

  const hasChanges =
    !schedule ||
    schedule.interval_value !== parseFloat(intervalValue) ||
    schedule.interval_type !== intervalType

  const handleSave = () => {
    if (!isEnabled) {
      if (schedule && onDelete) {
        onDelete(schedule.id)
      }
      return
    }

    const scheduleData = {
      type: scheduleType.type,
      interval_type: intervalType,
      interval_value: parseFloat(intervalValue) || scheduleType.defaultInterval,
      last_service_date: lastMaintenance?.date || schedule?.last_service_date || null,
      last_service_mileage:
        lastMaintenance?.mileage_at_service || schedule?.last_service_mileage || null,
      last_service_hours:
        lastMaintenance?.hours_at_service || schedule?.last_service_hours || null,
    }

    onSave(scheduleData)
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'overdue':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Overdue',
        }
      case 'due_soon':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Due Soon',
        }
      default:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Up to Date',
        }
    }
  }

  const statusConfig = getStatusConfig(status)

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {scheduleType.type}
            </h3>
            {isEnabled && nextDue && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
              >
                <statusConfig.icon className="h-3 w-3" />
                <span>{statusConfig.label}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {scheduleType.description}
          </p>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-4 ml-7">
          {/* Interval Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label text-xs">Interval Value</label>
              <input
                type="number"
                value={intervalValue}
                onChange={(e) => setIntervalValue(e.target.value)}
                className="input"
                min="1"
                step="1"
                placeholder={scheduleType.defaultInterval.toString()}
              />
            </div>
            <div>
              <label className="label text-xs">Interval Type</label>
              <select
                value={intervalType}
                onChange={(e) => setIntervalType(e.target.value)}
                className="input"
              >
                {equipment.mileage !== null && equipment.mileage !== undefined && (
                  <option value="mileage">Miles</option>
                )}
                {equipment.hours !== null && equipment.hours !== undefined && (
                  <option value="hours">Hours</option>
                )}
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* Last Done */}
          {lastMaintenance && (
            <div className="text-sm">
              <span className="text-gray-500">Last done: </span>
              <span className="font-medium text-gray-900">
                {format(new Date(lastMaintenance.date), 'MMM d, yyyy')}
              </span>
              {lastMaintenance.mileage_at_service !== null &&
                lastMaintenance.mileage_at_service !== undefined && (
                  <span className="text-gray-500 ml-2">
                    at {lastMaintenance.mileage_at_service.toLocaleString()} miles
                  </span>
                )}
              {lastMaintenance.hours_at_service !== null &&
                lastMaintenance.hours_at_service !== undefined && (
                  <span className="text-gray-500 ml-2">
                    at {lastMaintenance.hours_at_service.toLocaleString()} hours
                  </span>
                )}
            </div>
          )}

          {/* Next Due */}
          {nextDue && nextDue.nextDueDate && (
            <div className="text-sm">
              <span className="text-gray-500">Next due: </span>
              <span
                className={`font-medium ${
                  nextDue.isOverdue
                    ? 'text-red-600'
                    : nextDue.isDueSoon
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {format(nextDue.nextDueDate, 'MMM d, yyyy')}
              </span>
              {nextDue.daysUntilDue !== null && (
                <span className="text-gray-500 ml-2">
                  ({nextDue.daysUntilDue === 0
                    ? 'Due now'
                    : nextDue.daysUntilDue < 0
                    ? `${Math.abs(nextDue.daysUntilDue)} days overdue`
                    : `in ${nextDue.daysUntilDue} days`})
                </span>
              )}
            </div>
          )}

          {/* Save Button */}
          {hasChanges && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !intervalValue}
                className="btn-primary flex items-center text-sm py-1.5 px-3"
              >
                <Save className="h-4 w-4 mr-1.5" />
                {isSaving ? 'Saving...' : 'Save Schedule'}
              </button>
              {schedule && (
                <button
                  onClick={() => {
                    setIsEnabled(false)
                    if (onDelete) onDelete(schedule.id)
                  }}
                  className="btn-secondary flex items-center text-sm py-1.5 px-3 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Disable
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


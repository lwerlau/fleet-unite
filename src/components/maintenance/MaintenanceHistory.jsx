import { useState } from 'react'
import { Wrench } from 'lucide-react'
import MaintenanceHistoryItem from './MaintenanceHistoryItem'
import { deleteMaintenanceEvent } from '../../lib/maintenance'

export default function MaintenanceHistory({ 
  maintenanceHistory, 
  onRefresh,
  onEdit 
}) {
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)

  const handleDelete = async (maintenanceId) => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) {
      return
    }

    setDeletingId(maintenanceId)
    setError(null)

    try {
      const { error: deleteError } = await deleteMaintenanceEvent(maintenanceId)

      if (deleteError) throw deleteError

      // Refresh the history
      if (onRefresh) {
        onRefresh()
      }
    } catch (err) {
      console.error('Error deleting maintenance:', err)
      setError(err.message || 'Failed to delete maintenance record')
    } finally {
      setDeletingId(null)
    }
  }

  if (maintenanceHistory.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance history yet</h3>
          <p className="text-sm text-gray-500">
            Log your first maintenance event to start tracking service history.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {maintenanceHistory.map((maintenance) => (
          <MaintenanceHistoryItem
            key={maintenance.id}
            maintenance={maintenance}
            onEdit={onEdit}
            onDelete={handleDelete}
            isDeleting={deletingId === maintenance.id}
          />
        ))}
      </div>
    </div>
  )
}

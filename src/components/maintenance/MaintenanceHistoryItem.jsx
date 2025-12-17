import { format } from 'date-fns'
import { Edit, Trash2, DollarSign, Gauge, Truck } from 'lucide-react'
import MaintenanceTypeBadge from './MaintenanceTypeBadge'

export default function MaintenanceHistoryItem({ 
  maintenance, 
  onEdit, 
  onDelete,
  isDeleting 
}) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <MaintenanceTypeBadge type={maintenance.maintenance_type} />
            <span className="text-sm text-gray-500">
              {format(new Date(maintenance.date), 'MMM d, yyyy')}
            </span>
          </div>

          {maintenance.cost !== null && maintenance.cost !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">
                ${parseFloat(maintenance.cost).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
            {maintenance.mileage_at_service !== null && maintenance.mileage_at_service !== undefined && (
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-gray-400" />
                <span>{maintenance.mileage_at_service.toLocaleString()} miles</span>
              </div>
            )}
            
            {maintenance.hours_at_service !== null && maintenance.hours_at_service !== undefined && (
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-gray-400" />
                <span>{maintenance.hours_at_service.toLocaleString()} hours</span>
              </div>
            )}
          </div>

          {maintenance.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{maintenance.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(maintenance)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            aria-label="Edit maintenance"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(maintenance.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            disabled={isDeleting}
            aria-label="Delete maintenance"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

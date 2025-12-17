import { Link } from 'react-router-dom'
import { Truck, Gauge, Calendar } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { format } from 'date-fns'

export default function EquipmentCard({ equipment, status = 'good' }) {
  return (
    <Link
      to={`/equipment/${equipment.id}`}
      className="block"
    >
      <div className="card hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{equipment.type}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-2 mt-4">
          {equipment.mileage !== null && equipment.mileage !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Gauge className="h-4 w-4 mr-2 text-gray-400" />
              <span>{equipment.mileage.toLocaleString()} miles</span>
            </div>
          )}
          
          {equipment.hours !== null && equipment.hours !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="h-4 w-4 mr-2 text-gray-400" />
              <span>{equipment.hours.toLocaleString()} hours</span>
            </div>
          )}

          {equipment.purchase_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>Purchased {format(new Date(equipment.purchase_date), 'MMM yyyy')}</span>
            </div>
          )}
        </div>

        {equipment.notes && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2">{equipment.notes}</p>
        )}
      </div>
    </Link>
  )
}


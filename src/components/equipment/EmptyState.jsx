import { Truck, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyState({ onAddClick }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Truck className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Get started by adding your first piece of equipment. Track maintenance, predict breakdowns, and save money.
      </p>
      <button
        onClick={onAddClick}
        className="btn-primary inline-flex items-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Your First Equipment
      </button>
    </div>
  )
}


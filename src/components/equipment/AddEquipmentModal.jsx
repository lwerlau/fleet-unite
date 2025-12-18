import { useState } from 'react'
import { X } from 'lucide-react'

// Equipment types sorted alphabetically for easier finding
const EQUIPMENT_TYPES = [
  'ATV',
  'Backhoe',
  'Box Truck',
  'Bulldozer',
  'Bush Hog',
  'Car',
  'Chainsaw',
  'Combine',
  'Combine Harvester',
  'Compact Track Loader',
  'Compact Tractor',
  'Compactor',
  'Dozer',
  'Dump Truck',
  'Enclosed Trailer',
  'Equipment Trailer',
  'Excavator',
  'Farm Equipment',
  'Flatbed',
  'Flatbed Trailer',
  'Gator',
  'Grader',
  'Hay Baler',
  'Mini Excavator',
  'Mower',
  'Mule',
  'Motor Grader',
  'Other',
  'Pickup',
  'Planter',
  'Ranger',
  'Roller',
  'Semi Truck',
  'Side-by-Side',
  'Skid Steer',
  'Sprayer',
  'Track Loader',
  'Tractor',
  'Trailer',
  'Truck',
  'UTV',
  'Utility Vehicle',
  'Van',
  'Wheel Loader',
]

export default function AddEquipmentModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Truck',
    mileage: '',
    hours: '',
    purchase_date: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required'
    }
    
    if (!formData.type) {
      newErrors.type = 'Equipment type is required'
    }

    if (formData.mileage && (isNaN(formData.mileage) || parseFloat(formData.mileage) < 0)) {
      newErrors.mileage = 'Mileage must be a valid number'
    }

    if (formData.hours && (isNaN(formData.hours) || parseFloat(formData.hours) < 0)) {
      newErrors.hours = 'Hours must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      type: formData.type,
      mileage: formData.mileage ? parseFloat(formData.mileage) : null,
      hours: formData.hours ? parseFloat(formData.hours) : null,
      purchase_date: formData.purchase_date || null,
      notes: formData.notes.trim() || null,
    }

    onSubmit(submitData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'Truck',
      mileage: '',
      hours: '',
      purchase_date: '',
      notes: '',
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Equipment</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Equipment Name */}
              <div>
                <label htmlFor="name" className="label">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="e.g., Ford F-150, John Deere 5075E"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Equipment Type */}
              <div>
                <label htmlFor="type" className="label">
                  Equipment Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`input ${errors.type ? 'border-red-300' : ''}`}
                  required
                >
                  {EQUIPMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Mileage and Hours Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mileage" className="label">
                    Current Mileage
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className={`input ${errors.mileage ? 'border-red-300' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.mileage && (
                    <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="hours" className="label">
                    Current Hours
                  </label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    className={`input ${errors.hours ? 'border-red-300' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.hours && (
                    <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
                  )}
                </div>
              </div>

              {/* Purchase Date */}
              <div>
                <label htmlFor="purchase_date" className="label">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  className="input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="input"
                  placeholder="Additional information about this equipment..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


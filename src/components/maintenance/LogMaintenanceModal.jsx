import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { MAINTENANCE_TYPES, getMaintenanceTypeConfig } from '../../lib/maintenance'

export default function LogMaintenanceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading,
  equipment 
}) {
  const [formData, setFormData] = useState({
    type: 'Oil Change',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    mileage: '',
    hours: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  // Pre-fill mileage/hours from equipment when modal opens
  useEffect(() => {
    if (isOpen && equipment) {
      setFormData((prev) => ({
        ...prev,
        mileage: equipment.mileage ? equipment.mileage.toString() : '',
        hours: equipment.hours ? equipment.hours.toString() : '',
      }))
    }
  }, [isOpen, equipment])

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

    if (!formData.type) {
      newErrors.type = 'Maintenance type is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future'
      }
    }

    if (formData.cost && (isNaN(formData.cost) || parseFloat(formData.cost) < 0)) {
      newErrors.cost = 'Cost must be a positive number'
    }

    if (formData.mileage && (isNaN(formData.mileage) || parseFloat(formData.mileage) < 0)) {
      newErrors.mileage = 'Mileage must be a valid positive number'
    }

    if (formData.hours && (isNaN(formData.hours) || parseFloat(formData.hours) < 0)) {
      newErrors.hours = 'Hours must be a valid positive number'
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must be 500 characters or less'
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
      type: formData.type,
      date: formData.date,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      mileage: formData.mileage ? parseFloat(formData.mileage) : null,
      hours: formData.hours ? parseFloat(formData.hours) : null,
      notes: formData.notes.trim() || null,
    }

    onSubmit(submitData)
  }

  const handleClose = () => {
    setFormData({
      type: 'Oil Change',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      mileage: equipment?.mileage ? equipment.mileage.toString() : '',
      hours: equipment?.hours ? equipment.hours.toString() : '',
      notes: '',
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  const typeConfig = getMaintenanceTypeConfig(formData.type)

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
              <div className="flex items-center gap-2">
                <span className="text-2xl">{typeConfig.icon}</span>
                <h3 className="text-lg font-medium text-gray-900">Log Maintenance</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Maintenance Type */}
              <div>
                <label htmlFor="type" className="label">
                  Maintenance Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`input ${errors.type ? 'border-red-300' : ''}`}
                  required
                >
                  {MAINTENANCE_TYPES.map((type) => {
                    const config = getMaintenanceTypeConfig(type)
                    return (
                      <option key={type} value={type}>
                        {config.icon} {type}
                      </option>
                    )
                  })}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="label">
                  Date Performed *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`input ${errors.date ? 'border-red-300' : ''}`}
                  required
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Cost */}
              <div>
                <label htmlFor="cost" className="label">
                  Cost ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    className={`input pl-7 ${errors.cost ? 'border-red-300' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                )}
              </div>

              {/* Mileage and Hours Row */}
              <div className="grid grid-cols-2 gap-4">
                {equipment && (equipment.mileage !== null || equipment.mileage !== undefined) && (
                  <div>
                    <label htmlFor="mileage" className="label">
                      Mileage at Service
                    </label>
                    <input
                      type="number"
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      className={`input ${errors.mileage ? 'border-red-300' : ''}`}
                      placeholder={equipment.mileage?.toString() || '0'}
                      min="0"
                      step="0.01"
                    />
                    {errors.mileage && (
                      <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
                    )}
                  </div>
                )}

                {equipment && (equipment.hours !== null || equipment.hours !== undefined) && (
                  <div>
                    <label htmlFor="hours" className="label">
                      Hours at Service
                    </label>
                    <input
                      type="number"
                      id="hours"
                      name="hours"
                      value={formData.hours}
                      onChange={handleChange}
                      className={`input ${errors.hours ? 'border-red-300' : ''}`}
                      placeholder={equipment.hours?.toString() || '0'}
                      min="0"
                      step="0.01"
                    />
                    {errors.hours && (
                      <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="label">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className={`input ${errors.notes ? 'border-red-300' : ''}`}
                  placeholder="Additional details about this maintenance..."
                  maxLength={500}
                />
                <div className="mt-1 flex justify-between">
                  {errors.notes && (
                    <p className="text-sm text-red-600">{errors.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.notes.length}/500 characters
                  </p>
                </div>
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
                  {loading ? 'Logging...' : 'Log Maintenance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

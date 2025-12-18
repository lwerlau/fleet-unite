import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchEquipment, deleteEquipment } from '../lib/equipment'
import { fetchMaintenanceHistory, logMaintenance } from '../lib/maintenance'
import { ArrowLeft, Trash2, Truck, Gauge, Calendar, Plus, Wrench } from 'lucide-react'
import { format } from 'date-fns'
import MaintenanceHistory from '../components/maintenance/MaintenanceHistory'
import LogMaintenanceModal from '../components/maintenance/LogMaintenanceModal'
import ScheduleManager from '../components/schedules/ScheduleManager'

export default function EquipmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [equipment, setEquipment] = useState(null)
  const [maintenanceHistory, setMaintenanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLogging, setIsLogging] = useState(false)

  useEffect(() => {
    if (user && id) {
      loadEquipment()
      loadMaintenanceHistory()
    }
  }, [user, id])

  const loadEquipment = async () => {
    try {
      const { data, error: fetchError } = await fetchEquipment(user.id)
      
      if (fetchError) throw fetchError

      const found = data?.find((eq) => eq.id === id)
      
      if (!found) {
        setError('Equipment not found')
      } else {
        setEquipment(found)
      }
    } catch (err) {
      console.error('Error loading equipment:', err)
      setError(err.message || 'Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const loadMaintenanceHistory = async () => {
    setMaintenanceLoading(true)
    try {
      const { data, error: historyError } = await fetchMaintenanceHistory(id)
      
      if (historyError) {
        console.error('Error loading maintenance history:', historyError)
        // Don't set error state - just log it
      } else {
        setMaintenanceHistory(data || [])
      }
    } catch (err) {
      console.error('Error loading maintenance history:', err)
    } finally {
      setMaintenanceLoading(false)
    }
  }

  const handleLogMaintenance = async (maintenanceData) => {
    setIsLogging(true)
    setError(null)

    try {
      const { data, error: logError } = await logMaintenance(id, maintenanceData)

      if (logError) throw logError

      // Refresh both equipment (to get updated mileage/hours) and maintenance history
      await Promise.all([
        loadEquipment(),
        loadMaintenanceHistory(),
      ])

      // Close modal
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error logging maintenance:', err)
      setError(err.message || 'Failed to log maintenance')
    } finally {
      setIsLogging(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error: deleteError } = await deleteEquipment(id)
      
      if (deleteError) throw deleteError

      navigate('/dashboard')
    } catch (err) {
      console.error('Error deleting equipment:', err)
      setError(err.message || 'Failed to delete equipment')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error && !equipment) {
    return (
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-gray-900 hover:text-gray-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <div className="card">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return null
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-gray-900 hover:text-gray-700 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Equipment Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
            <p className="text-lg text-gray-600">{equipment.type}</p>
          </div>
          <div className="flex gap-2">
            {/* Edit button removed for MVP - users can delete and re-add if needed */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-secondary text-red-600 hover:bg-red-50 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment Information</h2>
          <div className="space-y-4">
            {equipment.mileage !== null && equipment.mileage !== undefined && (
              <div className="flex items-center">
                <Gauge className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Current Mileage</p>
                  <p className="text-lg font-medium text-gray-900">
                    {equipment.mileage.toLocaleString()} miles
                  </p>
                </div>
              </div>
            )}

            {equipment.hours !== null && equipment.hours !== undefined && (
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Current Hours</p>
                  <p className="text-lg font-medium text-gray-900">
                    {equipment.hours.toLocaleString()} hours
                  </p>
                </div>
              </div>
            )}

            {equipment.purchase_date && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="text-lg font-medium text-gray-900">
                    {format(new Date(equipment.purchase_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {equipment.notes && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{equipment.notes}</p>
          </div>
        )}
      </div>

      {/* Maintenance Schedules Section */}
      <div className="mb-6">
        <ScheduleManager
          equipment={equipment}
          maintenanceHistory={maintenanceHistory}
          onSchedulesChange={() => {
            // Refresh maintenance history to update status indicators
            loadMaintenanceHistory()
          }}
        />
      </div>

      {/* Maintenance History Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-gray-900" />
            Maintenance History
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Maintenance
          </button>
        </div>

        {maintenanceLoading ? (
          <div className="card">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        ) : (
          <MaintenanceHistory
            maintenanceHistory={maintenanceHistory}
            onRefresh={loadMaintenanceHistory}
            onEdit={(maintenance) => {
              // Edit functionality will be added later
              console.log('Edit maintenance:', maintenance)
            }}
          />
        )}
      </div>

      {/* Log Maintenance Modal */}
      <LogMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLogMaintenance}
        loading={isLogging}
        equipment={equipment}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Equipment?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>{equipment.name}</strong>? This action cannot be undone and will also delete all associated maintenance records.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

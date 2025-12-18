import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Truck, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { fetchEquipment, fetchMaintenanceSchedules, calculateEquipmentStatus, createEquipment } from '../lib/equipment'
import EquipmentGrid from '../components/equipment/EquipmentGrid'
import EmptyState from '../components/equipment/EmptyState'
import AddEquipmentModal from '../components/equipment/AddEquipmentModal'

export default function Dashboard() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    dueSoon: 0,
    overdue: 0,
    good: 0,
  })

  useEffect(() => {
    if (user) {
      loadEquipment()
    }
  }, [user])

  const loadEquipment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch equipment
      const { data: equipmentData, error: equipmentError } = await fetchEquipment(user.id)
      
      if (equipmentError) throw equipmentError

      setEquipment(equipmentData || [])

      // Fetch maintenance schedules if we have equipment
      let schedulesData = []
      if (equipmentData && equipmentData.length > 0) {
        const equipmentIds = equipmentData.map((eq) => eq.id)
        const { data } = await fetchMaintenanceSchedules(equipmentIds)
        schedulesData = data || []
        setSchedules(schedulesData)
      } else {
        setSchedules([])
      }

      // Calculate stats
      calculateStats(equipmentData || [], schedulesData)
    } catch (err) {
      console.error('Error loading equipment:', err)
      setError(err.message || 'Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (equipmentList, schedulesList) => {
    let dueSoon = 0
    let overdue = 0
    let good = 0

    equipmentList.forEach((eq) => {
      const status = calculateEquipmentStatus(eq, schedulesList)
      if (status === 'overdue') overdue++
      else if (status === 'due_soon') dueSoon++
      else good++
    })

    setStats({
      total: equipmentList.length,
      dueSoon,
      overdue,
      good,
    })
  }

  const getStatusForEquipment = (eq) => {
    return calculateEquipmentStatus(eq, schedules)
  }

  const handleAddEquipment = async (equipmentData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error: createError } = await createEquipment(user.id, equipmentData)

      if (createError) throw createError

      // Refresh equipment list
      await loadEquipment()

      // Close modal
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding equipment:', err)
      setError(err.message || 'Failed to add equipment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Overview of your equipment fleet</p>
          </div>
          {equipment.length === 0 && (
            <Link
              to="/demo"
              className="btn-secondary text-sm"
            >
              Generate Demo Data
            </Link>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-8 w-8 text-gray-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Equipment</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Good Condition</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.good}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Due Soon</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.dueSoon}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Equipment</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {equipment.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : (
          <EquipmentGrid equipment={equipment} getStatus={getStatusForEquipment} />
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 lg:hidden h-14 w-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center z-40"
        aria-label="Add Equipment"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEquipment}
        loading={isSubmitting}
      />
    </div>
  )
}

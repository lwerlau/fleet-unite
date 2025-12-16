import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Truck, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    dueSoon: 0,
    overdue: 0,
    good: 0,
  })

  useEffect(() => {
    if (user) {
      fetchEquipment()
    }
  }, [user])

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setEquipment(data || [])
      
      // Calculate stats (simplified for now - will enhance with maintenance data)
      setStats({
        total: data?.length || 0,
        dueSoon: 0, // Will calculate based on maintenance schedules
        overdue: 0, // Will calculate based on maintenance schedules
        good: data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'due_soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="h-5 w-5" />
      case 'due_soon':
        return <Clock className="h-5 w-5" />
      case 'good':
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your equipment fleet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-8 w-8 text-primary-600" />
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

      {/* Equipment List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Equipment</h2>
          <Link
            to="/equipment/new"
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Equipment
          </Link>
        </div>

        {equipment.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first piece of equipment.
            </p>
            <div className="mt-6">
              <Link to="/equipment/new" className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Equipment
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <Link
                key={item.id}
                to={`/equipment/${item.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.type}</p>
                    <div className="mt-3 space-y-1">
                      {item.mileage && (
                        <p className="text-sm text-gray-600">
                          Mileage: {item.mileage.toLocaleString()} miles
                        </p>
                      )}
                      {item.hours && (
                        <p className="text-sm text-gray-600">
                          Hours: {item.hours.toLocaleString()} hrs
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`ml-4 px-2 py-1 rounded-full border flex items-center ${getStatusColor('good')}`}>
                    {getStatusIcon('good')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


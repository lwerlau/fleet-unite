import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { generateDemoData } from '../utils/demoData'
import { CheckCircle, Loader, Sparkles } from 'lucide-react'

export default function DemoData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerateDemo = async () => {
    if (!user) {
      setError('You must be logged in to generate demo data')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await generateDemoData(user.id)
      
      if (result.success) {
        setSuccess(true)
        // Reload page after 2 seconds to show new data
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setError(result.error?.message || 'Failed to generate demo data')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Generate Demo Data</h1>
          <p className="text-gray-600 mb-6">
            This will create sample equipment, maintenance history, and schedules for testing.
            Perfect for seeing how Fleet Unite works with realistic data.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Demo data created successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">What will be created:</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>5 equipment items (Truck, Tractor, Excavator, Utility Vehicle, Trailer)</li>
              <li>10+ maintenance history records</li>
              <li>8+ maintenance schedules</li>
              <li>Realistic usage patterns</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateDemo}
            disabled={loading || success}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Generating Demo Data...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete!
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Demo Data
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Note: This will add data to your account. You can delete it later if needed.
          </p>
        </div>
      </div>
    </div>
  )
}


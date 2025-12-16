import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Truck, LogOut, LayoutDashboard, Wrench, BarChart3 } from 'lucide-react'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
            Fleet Unite
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary-600">Fleet Unite</h1>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive('/dashboard')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/equipment"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive('/equipment')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="mr-3 h-5 w-5" />
                  Equipment
                </Link>
                <Link
                  to="/maintenance"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive('/maintenance')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="mr-3 h-5 w-5" />
                  Maintenance
                </Link>
                <Link
                  to="/analytics"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive('/analytics')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center py-2 ${
              isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link
            to="/equipment"
            className={`flex flex-col items-center py-2 ${
              isActive('/equipment') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Equipment</span>
          </Link>
          <Link
            to="/maintenance"
            className={`flex flex-col items-center py-2 ${
              isActive('/maintenance') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Wrench className="h-5 w-5" />
            <span className="text-xs mt-1">Maintenance</span>
          </Link>
          <Link
            to="/analytics"
            className={`flex flex-col items-center py-2 ${
              isActive('/analytics') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Analytics</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


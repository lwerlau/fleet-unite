import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function StatusBadge({ status }) {
  const statusConfig = {
    good: {
      label: 'Good',
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
    due_soon: {
      label: 'Due Soon',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
  }

  const config = statusConfig[status] || statusConfig.good
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  )
}


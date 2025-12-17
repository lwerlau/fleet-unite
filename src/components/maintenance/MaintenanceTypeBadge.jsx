import { getMaintenanceTypeConfig } from '../../lib/maintenance'

export default function MaintenanceTypeBadge({ type }) {
  const config = getMaintenanceTypeConfig(type)

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-medium ${config.color}`}>
      <span className="text-base">{config.icon}</span>
      <span>{type}</span>
    </div>
  )
}

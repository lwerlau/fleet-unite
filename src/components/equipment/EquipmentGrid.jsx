import EquipmentCard from './EquipmentCard'

export default function EquipmentGrid({ equipment, getStatus }) {
  if (!equipment || equipment.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {equipment.map((item) => (
        <EquipmentCard
          key={item.id}
          equipment={item}
          status={getStatus ? getStatus(item) : 'good'}
        />
      ))}
    </div>
  )
}


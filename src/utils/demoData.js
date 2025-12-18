/**
 * Demo Data Generator for Fleet Unite
 * 
 * This utility helps populate the database with realistic demo data
 */

import { createEquipment } from '../lib/equipment'
import { logMaintenance } from '../lib/maintenance'
import { saveMaintenanceSchedule } from '../lib/schedules'

export async function generateDemoData(userId) {
  console.log('🚀 Starting demo data generation...')
  
  const equipmentData = [
    {
      name: 'Ford F-150',
      type: 'Truck',
      mileage: 120000,
      hours: null,
      purchase_date: '2018-06-15',
      notes: 'Main work truck for hauling and daily operations. Reliable and well-maintained.',
      maintenance: [
        {
          type: 'Oil Change',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 75.00,
          mileage: 115000,
          hours: null,
          notes: 'Standard oil and filter change',
        },
        {
          type: 'Tire Rotation',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 60.00,
          mileage: 112000,
          hours: null,
          notes: 'Rotated all four tires',
        },
        {
          type: 'Brake Service',
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 320.00,
          mileage: 110000,
          hours: null,
          notes: 'Replaced brake pads and rotors',
        },
      ],
      schedules: [
        {
          type: 'Oil Change',
          interval_type: 'mileage',
          interval_value: 3000,
        },
        {
          type: 'Tire Rotation',
          interval_type: 'mileage',
          interval_value: 5000,
        },
      ],
    },
    {
      name: 'John Deere 5075E',
      type: 'Tractor',
      mileage: null,
      hours: 1200,
      purchase_date: '2020-03-20',
      notes: 'Primary tractor for field work and heavy lifting. Main workhorse.',
      maintenance: [
        {
          type: 'Oil Change',
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 85.00,
          mileage: null,
          hours: 1150,
          notes: 'Engine oil and filter change',
        },
        {
          type: 'Filter Replacement',
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 45.00,
          mileage: null,
          hours: 1100,
          notes: 'Replaced air and fuel filters',
        },
        {
          type: 'Grease Service',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 25.00,
          mileage: null,
          hours: 1195,
          notes: 'Lubricated all grease fittings',
        },
      ],
      schedules: [
        {
          type: 'Oil Change',
          interval_type: 'hours',
          interval_value: 50,
        },
        {
          type: 'Grease Service',
          interval_type: 'hours',
          interval_value: 10,
        },
      ],
    },
    {
      name: 'Bobcat E35',
      type: 'Excavator',
      mileage: null,
      hours: 890,
      purchase_date: '2019-11-10',
      notes: 'Used for excavation and earthmoving projects. Excellent condition.',
      maintenance: [
        {
          type: 'Oil Change',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 120.00,
          mileage: null,
          hours: 840,
          notes: 'Hydraulic oil and engine oil change',
        },
        {
          type: 'Filter Replacement',
          date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 65.00,
          mileage: null,
          hours: 790,
          notes: 'Replaced hydraulic and air filters',
        },
      ],
      schedules: [
        {
          type: 'Oil Change',
          interval_type: 'hours',
          interval_value: 50,
        },
        {
          type: 'Hydraulic Service',
          interval_type: 'hours',
          interval_value: 500,
        },
      ],
    },
    {
      name: 'Honda Pioneer 1000',
      type: 'Utility Vehicle',
      mileage: 3500,
      hours: 280,
      purchase_date: '2022-02-14',
      notes: 'Utility vehicle for farm operations. Great for rough terrain.',
      maintenance: [
        {
          type: 'Oil Change',
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 45.00,
          mileage: 3400,
          hours: 275,
          notes: 'Engine oil change',
        },
        {
          type: 'Grease Service',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 20.00,
          mileage: 3490,
          hours: 278,
          notes: 'Lubricated all fittings',
        },
      ],
      schedules: [
        {
          type: 'Oil Change',
          interval_type: 'hours',
          interval_value: 25,
        },
      ],
    },
    {
      name: '16ft Utility Trailer',
      type: 'Trailer',
      mileage: null,
      hours: null,
      purchase_date: '2019-11-10',
      notes: 'Equipment transport trailer. Heavy duty.',
      maintenance: [
        {
          type: 'Tire Inspection',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 0,
          mileage: null,
          hours: null,
          notes: 'Checked tire pressure and wear',
        },
      ],
      schedules: [
        {
          type: 'Tire Inspection',
          interval_type: 'days',
          interval_value: 90,
        },
      ],
    },
  ]

  const createdEquipment = []

  try {
    // Create equipment
    for (const eq of equipmentData) {
      console.log(`Creating equipment: ${eq.name}...`)
      const { data, error } = await createEquipment(userId, {
        name: eq.name,
        type: eq.type,
        mileage: eq.mileage,
        hours: eq.hours,
        purchase_date: eq.purchase_date,
        notes: eq.notes,
      })

      if (error) {
        console.error(`Error creating ${eq.name}:`, error)
        continue
      }

      createdEquipment.push(data)

      // Add maintenance history
      if (eq.maintenance && eq.maintenance.length > 0) {
        for (const maint of eq.maintenance) {
          console.log(`  Adding maintenance: ${maint.type}...`)
          await logMaintenance(data.id, {
            type: maint.type,
            date: maint.date,
            cost: maint.cost,
            mileage: maint.mileage,
            hours: maint.hours,
            notes: maint.notes,
          })
        }
      }

      // Add maintenance schedules
      if (eq.schedules && eq.schedules.length > 0) {
        for (const schedule of eq.schedules) {
          console.log(`  Adding schedule: ${schedule.type}...`)
          // Find last maintenance of this type
          const lastMaint = eq.maintenance?.find((m) => m.type === schedule.type)
          await saveMaintenanceSchedule(data.id, {
            type: schedule.type,
            interval_type: schedule.interval_type,
            interval_value: schedule.interval_value,
            last_service_date: lastMaint?.date || null,
            last_service_mileage: lastMaint?.mileage || null,
            last_service_hours: lastMaint?.hours || null,
          })
        }
      }
    }

    console.log('✅ Demo data generation complete!')
    console.log(`Created ${createdEquipment.length} equipment items`)
    return { success: true, equipment: createdEquipment }
  } catch (error) {
    console.error('❌ Error generating demo data:', error)
    return { success: false, error }
  }
}

// Usage in browser console:
// import { generateDemoData } from './utils/demoData'
// const { user } = useAuth()
// await generateDemoData(user.id)


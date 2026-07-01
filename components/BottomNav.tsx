'use client'

import { LayoutDashboard, Utensils, Zap, Activity, CalendarDays } from 'lucide-react'

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'nutrition',  icon: Utensils,        label: 'Nutrition' },
  { id: 'workouts',   icon: Zap,             label: 'Workouts' },
  { id: 'activity',   icon: Activity,        label: 'Activity' },
  { id: 'schedule',   icon: CalendarDays,    label: 'Schedule' },
]

export default function BottomNav({
  active,
  setActive,
}: {
  active: string
  setActive: (t: string) => void
}) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe z-40">
      <div className="flex">
        {TABS.map(tab => {
          const isActive = active === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-all"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-coral' : ''
              }`}>
                <Icon
                  size={18}
                  className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${
                isActive ? 'text-coral' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

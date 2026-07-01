'use client'

import { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import Dashboard from '@/components/screens/Dashboard'
import Nutrition from '@/components/screens/Nutrition'
import Workouts from '@/components/screens/Workouts'
import Activity from '@/components/screens/Activity'
import Schedule from '@/components/screens/Schedule'

type Tab = 'dashboard' | 'nutrition' | 'workouts' | 'activity' | 'schedule'

export default function VidaFitApp() {
  const [tab, setTab] = useState<Tab>('dashboard')

  const screens: Record<Tab, React.ReactNode> = {
    dashboard: <Dashboard setTab={setTab} />,
    nutrition:  <Nutrition />,
    workouts:   <Workouts />,
    activity:   <Activity />,
    schedule:   <Schedule />,
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-[#F0F2F5]">
        {/* Screen content */}
        <main className="flex-1 overflow-y-auto" key={tab}>
          <div className="screen-enter">
            {screens[tab]}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav active={tab} setActive={(t) => setTab(t as Tab)} />
      </div>
    </div>
  )
}

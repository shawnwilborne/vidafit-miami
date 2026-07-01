'use client'

import { useState } from 'react'
import { Zap, Droplets, Footprints, TrendingUp, ChevronRight, Play, Plus } from 'lucide-react'
import { USER, TODAY, AI_INSIGHTS, SCHEDULE_WINDOWS, WORKOUTS } from '@/lib/data'

function MacroRing({ value, goal, color, label, unit = 'g' }: {
  value: number; goal: number; color: string; label: string; unit?: string
}) {
  const pct = Math.min(value / goal, 1)
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="#E8ECF0" strokeWidth="7" />
        <circle
          cx="38" cy="38" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="progress-ring-circle"
        />
        <text x="38" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
          {value}
        </text>
      </svg>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-[10px] text-gray-400">{unit === 'kcal' ? `${goal} kcal` : `${goal}${unit}`}</span>
    </div>
  )
}

function WaterTracker({ current, goal }: { current: number; goal: number }) {
  const [water, setWater] = useState(current)
  return (
    <div className="bg-white rounded-3xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-ocean/10 flex items-center justify-center">
            <Droplets size={16} className="text-ocean" />
          </div>
          <span className="font-semibold text-midnight text-sm">Hydration</span>
        </div>
        <span className="text-xs font-medium text-gray-400">Miami heat advisory 🌡️</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: goal }).map((_, i) => (
          <button
            key={i}
            onClick={() => setWater(i < water ? i : i + 1)}
            className={`text-lg transition-all duration-200 ${i < water ? 'scale-110' : 'opacity-30 grayscale'}`}
          >
            💧
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-midnight">{water} / {goal} glasses</span>
        <button
          onClick={() => setWater(Math.min(water + 1, goal))}
          className="text-xs bg-ocean/10 text-ocean font-semibold px-3 py-1.5 rounded-full"
        >
          + Add glass
        </button>
      </div>
    </div>
  )
}

export default function Dashboard({ setTab }: { setTab: (t: string) => void }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const insight = AI_INSIGHTS[now.getDay() % AI_INSIGHTS.length]
  const nextWindow = SCHEDULE_WINDOWS[1]
  const suggestedWorkout = WORKOUTS.find(w => w.name === nextWindow.suggested)!

  const calPct = TODAY.calories / USER.calorieGoal

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Hero Header */}
      <div className="bg-miami-gradient px-5 pt-14 pb-8 rounded-b-[2rem]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium">{greeting},</p>
            <h1 className="text-white text-2xl font-display font-bold">{USER.name} 👋</h1>
            <p className="text-white/70 text-xs mt-0.5">{USER.neighborhood} · {dateStr}</p>
          </div>
          <div className="flex flex-col items-center bg-white/20 rounded-2xl px-3 py-2 backdrop-blur-sm">
            <span className="text-2xl flame-pulse">🔥</span>
            <span className="text-white font-bold text-lg leading-none">{USER.streak}</span>
            <span className="text-white/80 text-[10px] font-medium">day streak</span>
          </div>
        </div>

        {/* Calorie ring summary */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">Today's Calories</span>
            <span className="text-white/80 text-xs">{TODAY.calories} / {USER.calorieGoal} kcal</span>
          </div>
          <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(calPct * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-white/70 text-xs">{USER.calorieGoal - TODAY.calories} kcal remaining</span>
            <span className="text-white/70 text-xs">{Math.round(calPct * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1">
            <Footprints size={20} className="text-palm" />
            <span className="font-bold text-midnight text-base">{TODAY.steps.toLocaleString()}</span>
            <span className="text-[11px] text-gray-400">steps</span>
            <div className="w-full h-1 bg-gray-100 rounded-full">
              <div className="h-full bg-palm rounded-full" style={{ width: `${Math.min((TODAY.steps / USER.stepGoal) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1">
            <Zap size={20} className="text-sand" />
            <span className="font-bold text-midnight text-base">{TODAY.activeMinutes}</span>
            <span className="text-[11px] text-gray-400">active min</span>
            <div className="w-full h-1 bg-gray-100 rounded-full">
              <div className="h-full bg-sand rounded-full" style={{ width: `${Math.min((TODAY.activeMinutes / 60) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1">
            <span className="text-xl">😴</span>
            <span className="font-bold text-midnight text-base">{TODAY.sleep}h</span>
            <span className="text-[11px] text-gray-400">sleep</span>
            <div className="w-full h-1 bg-gray-100 rounded-full">
              <div className="h-full bg-ocean rounded-full" style={{ width: `${Math.min((TODAY.sleep / 8) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-midnight text-sm">Today's Macros</span>
            <button onClick={() => setTab('nutrition')} className="text-xs text-coral font-semibold flex items-center gap-0.5">
              Details <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex justify-around">
            <MacroRing value={TODAY.calories} goal={USER.calorieGoal} color="#FF4757" label="Calories" unit="kcal" />
            <MacroRing value={TODAY.protein} goal={USER.proteinGoal} color="#06D6A0" label="Protein" />
            <MacroRing value={TODAY.carbs} goal={USER.carbGoal} color="#00B4D8" label="Carbs" />
            <MacroRing value={TODAY.fat} goal={USER.fatGoal} color="#FFD166" label="Fat" />
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-night-gradient rounded-3xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-coral/20 flex items-center justify-center">
              <TrendingUp size={14} className="text-coral" />
            </div>
            <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-white text-sm leading-relaxed">"{insight}"</p>
        </div>

        {/* Hydration */}
        <WaterTracker current={TODAY.water} goal={USER.waterGoal} />

        {/* Next workout window */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-midnight text-sm">⏱️ You have a 20-min gap</span>
            <span className="text-xs text-gray-400">{nextWindow.time}</span>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #00B4D8, #06D6A0)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">{suggestedWorkout.name}</p>
                <p className="text-white/80 text-xs mt-0.5">{suggestedWorkout.duration} min · {suggestedWorkout.calories} cal · {suggestedWorkout.location}</p>
              </div>
              <button
                onClick={() => setTab('workouts')}
                className="w-10 h-10 bg-white/25 backdrop-blur rounded-xl flex items-center justify-center"
              >
                <Play size={18} className="text-white ml-0.5" fill="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🍽️', label: 'Log Meal', tab: 'nutrition' },
            { icon: '⚡', label: 'Quick Workout', tab: 'workouts' },
            { icon: '📋', label: 'Check-in', tab: 'activity' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => setTab(a.tab)}
              className="bg-white rounded-2xl p-3 shadow-card flex flex-col items-center gap-1.5 card-hover"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-midnight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Check, TrendingUp, Moon, Footprints, Zap } from 'lucide-react'
import { TODAY, USER, WEEKLY_DATA, AI_INSIGHTS } from '@/lib/data'

const MOODS = [
  { emoji: '😴', label: 'Drained' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😄', label: 'Great' },
  { emoji: '🚀', label: 'Fired up' },
]

function WeeklyChart() {
  const max = Math.max(...WEEKLY_DATA.map(d => d.calories))
  return (
    <div className="bg-white rounded-3xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-midnight text-sm">This Week</span>
        <span className="text-xs text-gray-400">calories / day</span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {WEEKLY_DATA.map((d, i) => {
          const pct = (d.calories / max) * 100
          const isToday = i === WEEKLY_DATA.length - 1
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-400 font-medium">{d.calories}</span>
              <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                <div
                  className={`w-full rounded-lg week-bar transition-all ${
                    isToday ? 'bg-miami-gradient' : d.workout ? 'bg-palm/50' : 'bg-gray-200'
                  }`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${d.workout ? 'bg-coral' : 'bg-transparent'}`} />
              <span className={`text-[10px] font-medium ${isToday ? 'text-coral' : 'text-gray-400'}`}>{d.day}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-coral" />
          <span className="text-[10px] text-gray-400">Workout day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <span className="text-[10px] text-gray-400">Rest day</span>
        </div>
      </div>
    </div>
  )
}

export default function Activity() {
  const [mood, setMood] = useState<string | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [checkedIn, setCheckedIn] = useState(false)

  const workoutDays = WEEKLY_DATA.filter(d => d.workout).length
  const avgCalories = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.calories, 0) / 7)

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 rounded-b-[2rem]"
        style={{ background: 'linear-gradient(135deg, #8338ec 0%, #FF4757 100%)' }}
      >
        <h2 className="text-white font-display font-bold text-2xl mb-1">Activity</h2>
        <p className="text-white/75 text-sm">Log your day · track your patterns</p>

        {/* Weekly stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Workouts', val: workoutDays, unit: 'this week' },
            { label: 'Avg Cal', val: avgCalories, unit: 'kcal/day' },
            { label: 'Best Day', val: 'Tue', unit: 'most steps' },
          ].map(s => (
            <div key={s.label} className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-white font-bold text-lg">{s.val}</p>
              <p className="text-white/75 text-[10px]">{s.unit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Daily check-in */}
        {!checkedIn ? (
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-bold text-midnight text-base mb-4">Today's Check-in</h3>

            {/* Mood */}
            <p className="text-sm font-semibold text-gray-600 mb-2">How are you feeling?</p>
            <div className="flex justify-between mb-5">
              {MOODS.map(m => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex flex-col items-center gap-1 mood-btn ${mood === m.label ? 'selected' : ''}`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className={`text-[10px] font-medium ${mood === m.label ? 'text-coral' : 'text-gray-400'}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Energy level */}
            <p className="text-sm font-semibold text-gray-600 mb-2">Energy level (1–5)</p>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setEnergy(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    energy !== null && n <= energy
                      ? 'bg-sand text-midnight'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => { if (mood && energy) setCheckedIn(true) }}
              disabled={!mood || !energy}
              className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all ${
                mood && energy
                  ? 'bg-miami-gradient text-white shadow-coral'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              Save Check-in
            </button>
          </div>
        ) : (
          <div className="bg-palm/10 border border-palm/20 rounded-3xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-palm flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-midnight text-sm">Check-in saved!</p>
              <p className="text-xs text-gray-500">Mood: {mood} · Energy: {energy}/5</p>
            </div>
          </div>
        )}

        {/* Today's stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Footprints size={16} className="text-palm" />
              <span className="text-xs font-semibold text-gray-600">Steps Today</span>
            </div>
            <p className="font-display font-bold text-midnight text-2xl">{TODAY.steps.toLocaleString()}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
              <div
                className="h-full bg-palm rounded-full"
                style={{ width: `${Math.min((TODAY.steps / USER.stepGoal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Goal: {USER.stepGoal.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={16} className="text-ocean" />
              <span className="text-xs font-semibold text-gray-600">Sleep Last Night</span>
            </div>
            <p className="font-display font-bold text-midnight text-2xl">{TODAY.sleep}h</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
              <div
                className="h-full bg-ocean rounded-full"
                style={{ width: `${Math.min((TODAY.sleep / 8) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Goal: 8h</p>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-sand" />
              <span className="text-xs font-semibold text-gray-600">Active Minutes</span>
            </div>
            <p className="font-display font-bold text-midnight text-2xl">{TODAY.activeMinutes}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
              <div
                className="h-full bg-sand rounded-full"
                style={{ width: `${Math.min((TODAY.activeMinutes / 60) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Goal: 60 min</p>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-semibold text-gray-600">Streak</span>
            </div>
            <p className="font-display font-bold text-midnight text-2xl">12 🔥</p>
            <p className="text-[10px] text-gray-400 mt-3">Personal best: 18 days</p>
            <p className="text-[10px] text-coral font-semibold mt-0.5">6 days to break it!</p>
          </div>
        </div>

        {/* Weekly chart */}
        <WeeklyChart />

        {/* AI insight */}
        <div className="bg-night-gradient rounded-3xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-coral" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Pattern Detected</span>
          </div>
          <p className="text-white text-sm leading-relaxed">"{AI_INSIGHTS[3]}"</p>
        </div>
      </div>
    </div>
  )
}

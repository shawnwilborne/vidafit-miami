'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, MapPin, Zap, Clock, Flame, X } from 'lucide-react'
import { WORKOUTS, NEIGHBORHOODS } from '@/lib/data'

const DURATIONS = [0, 5, 10, 15, 20] as const
type Dur = typeof DURATIONS[number]

function WorkoutTimer({ workout, onClose }: { workout: typeof WORKOUTS[0]; onClose: () => void }) {
  const totalSecs = workout.duration * 60
  const [remaining, setRemaining] = useState(totalSecs)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining(r => {
        if (r <= 1) { setRunning(false); setDone(true); return 0 }
        return r - 1
      }), 1000)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running, remaining])

  const pct = 1 - remaining / totalSecs
  const r = 70
  const circ = 2 * Math.PI * r
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="fixed inset-0 z-50 bg-midnight flex flex-col">
      <div className="flex items-center justify-between p-5 pt-14">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X size={18} className="text-white" />
        </button>
        <span className="text-white font-semibold text-sm">{workout.tag}</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <h2 className="text-white font-display font-bold text-xl">{workout.name}</h2>
          <p className="text-white/60 text-sm mt-1">{workout.location}</p>
        </div>

        {/* Timer ring */}
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="90" cy="90" r={r} fill="none"
              stroke={done ? '#06D6A0' : '#FF4757'} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              className="progress-ring-circle"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {done ? (
              <span className="text-5xl">🎉</span>
            ) : (
              <>
                <span className="text-white font-display font-bold text-4xl">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </span>
                <span className="text-white/50 text-xs mt-1">remaining</span>
              </>
            )}
          </div>
        </div>

        {done ? (
          <div className="text-center">
            <p className="text-white font-bold text-2xl">Workout Complete! 🔥</p>
            <p className="text-white/60 text-sm mt-1">~{workout.calories} calories burned</p>
          </div>
        ) : (
          /* Exercise list */
          <div className="w-full bg-white/5 rounded-3xl p-4 flex flex-col gap-2">
            {workout.exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60">
                  {i + 1}
                </div>
                <span className="text-white/80 text-sm">{ex}</span>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setRemaining(totalSecs); setRunning(false); setDone(false) }}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <RotateCcw size={20} className="text-white" />
          </button>
          <button
            onClick={() => setRunning(r => !r)}
            disabled={done}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-coral transition-all ${
              done ? 'bg-palm' : 'bg-miami-gradient'
            }`}
          >
            {running
              ? <Pause size={28} className="text-white" fill="white" />
              : <Play size={28} className="text-white ml-1" fill="white" />
            }
          </button>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Flame size={20} className="text-sand" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Workouts() {
  const [durationFilter, setDurationFilter] = useState<Dur>(0)
  const [activeWorkout, setActiveWorkout] = useState<typeof WORKOUTS[0] | null>(null)
  const [view, setView] = useState<'workouts' | 'outdoor'>('workouts')

  const filtered = durationFilter === 0
    ? WORKOUTS
    : WORKOUTS.filter(w => w.duration === durationFilter)

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 rounded-b-[2rem]"
        style={{ background: 'linear-gradient(135deg, #06D6A0 0%, #00B4D8 100%)' }}
      >
        <h2 className="text-white font-display font-bold text-2xl mb-1">Micro-Workouts</h2>
        <p className="text-white/75 text-sm">No equipment needed · Miami outdoor options</p>

        {/* Duration pills */}
        <div className="mt-4 flex gap-2">
          {DURATIONS.map(d => (
            <button
              key={d}
              onClick={() => setDurationFilter(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                durationFilter === d
                  ? 'bg-white text-midnight shadow-md'
                  : 'bg-white/20 text-white'
              }`}
            >
              {d === 0 ? 'All' : `${d} min`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* View toggle */}
        <div className="flex gap-2 bg-gray-200 rounded-2xl p-1">
          {(['workouts', 'outdoor'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                view === v ? 'bg-white text-midnight shadow-card' : 'text-gray-500'
              }`}
            >
              {v === 'workouts' ? '⚡ Workouts' : '🌴 Outdoor Miami'}
            </button>
          ))}
        </div>

        {view === 'workouts' ? (
          <div className="flex flex-col gap-3">
            {filtered.map(w => (
              <div key={w.id} className="bg-white rounded-3xl overflow-hidden shadow-card">
                <div className={`bg-gradient-to-r ${w.color} p-4`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{w.tag}</span>
                      <h3 className="text-white font-display font-bold text-lg mt-0.5">{w.name}</h3>
                      <p className="text-white/75 text-xs mt-0.5">{w.location}</p>
                    </div>
                    <button
                      onClick={() => setActiveWorkout(w)}
                      className="w-12 h-12 bg-white/25 backdrop-blur rounded-2xl flex items-center justify-center mt-0.5"
                    >
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </button>
                  </div>
                </div>
                <div className="flex divide-x divide-gray-100">
                  {[
                    { icon: <Clock size={13} />, val: `${w.duration} min` },
                    { icon: <Flame size={13} />, val: `~${w.calories} cal` },
                    { icon: <Zap size={13} />, val: w.difficulty },
                  ].map(s => (
                    <div key={s.val} className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-gray-500">
                      {s.icon} {s.val}
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5">
                  {w.exercises.slice(0, 3).map(ex => (
                    <span key={ex} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ex}</span>
                  ))}
                  {w.exercises.length > 3 && (
                    <span className="text-[11px] text-gray-400 px-1">+{w.exercises.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Outdoor spots */
          <div className="flex flex-col gap-3">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 flex items-center gap-2">
              <span className="text-lg">🌡️</span>
              <div>
                <p className="text-xs font-semibold text-orange-800">Miami Heat Advisory</p>
                <p className="text-xs text-orange-700">89°F · High humidity · Hydrate every 15 mins · Best before 9am or after 6pm</p>
              </div>
            </div>
            {NEIGHBORHOODS.map(n => (
              <div key={n.name} className="bg-white rounded-3xl p-4 shadow-card card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{n.emoji}</span>
                    <div>
                      <p className="font-bold text-midnight">{n.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.vibe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-coral">{n.temp}</p>
                    <div className="flex items-center gap-0.5 mt-1 justify-end">
                      <MapPin size={10} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400">{n.distance}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {WORKOUTS.filter(w => w.location.includes(n.name.split(' ')[0])).slice(0, 2).map(w => (
                    <button
                      key={w.id}
                      onClick={() => setActiveWorkout(w)}
                      className={`flex-1 bg-gradient-to-r ${w.color} rounded-xl p-2.5 text-left`}
                    >
                      <p className="text-white text-xs font-bold">{w.name}</p>
                      <p className="text-white/75 text-[10px]">{w.duration} min</p>
                    </button>
                  ))}
                  {WORKOUTS.filter(w => w.location.includes(n.name.split(' ')[0])).length === 0 && (
                    <button
                      onClick={() => setActiveWorkout(WORKOUTS[0])}
                      className="flex-1 bg-gray-100 rounded-xl p-2.5 text-left"
                    >
                      <p className="text-gray-600 text-xs font-bold">Bodyweight Circuit</p>
                      <p className="text-gray-400 text-[10px]">10 min · adapt to space</p>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeWorkout && <WorkoutTimer workout={activeWorkout} onClose={() => setActiveWorkout(null)} />}
    </div>
  )
}

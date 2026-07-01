'use client'

import { useState } from 'react'
import { Calendar, Clock, Dumbbell, Zap, RefreshCw, ChevronRight } from 'lucide-react'
import { SCHEDULE_WINDOWS, WORKOUTS } from '@/lib/data'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TODAY_IDX = 0 // Monday

const WEEK_EVENTS = [
  { day: 0, events: ['9am standup', '11am client call', '2pm review'] },
  { day: 1, events: ['8am gym', '1pm lunch w/ team', '3pm sprint'] },
  { day: 2, events: ['9am standup', '2pm design review'] },
  { day: 3, events: ['All-day offsite'] },
  { day: 4, events: ['9am standup', 'noon demo', '5pm happy hour'] },
  { day: 5, events: [] },
  { day: 6, events: ['10am brunch'] },
]

function WindowCard({ win, onSwap }: { win: typeof SCHEDULE_WINDOWS[0]; onSwap: () => void }) {
  const workout = WORKOUTS.find(w => w.name === win.suggested)!
  const [swapped, setSwapped] = useState(false)
  return (
    <div className="bg-white rounded-3xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-coral/10 flex items-center justify-center">
            <Clock size={14} className="text-coral" />
          </div>
          <div>
            <p className="font-semibold text-midnight text-sm">{win.time}</p>
            <p className="text-xs text-gray-400">{win.type}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-palm bg-palm/10 px-2 py-1 rounded-full">{win.duration} min free</span>
      </div>

      <div className={`bg-gradient-to-r ${workout.color} rounded-2xl p-3`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">{workout.name}</p>
            <p className="text-white/75 text-xs">{workout.tag} · {workout.calories} cal · {workout.location}</p>
          </div>
          <Zap size={18} className="text-white/80" fill="white" />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button className="flex-1 bg-coral text-white py-2.5 rounded-xl text-xs font-bold shadow-coral">
          Schedule It
        </button>
        <button
          onClick={() => setSwapped(!swapped)}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-2.5 rounded-xl text-xs font-semibold"
        >
          <RefreshCw size={12} />
          Swap
        </button>
      </div>

      {swapped && (
        <div className="mt-2 bg-ocean/10 rounded-xl p-3">
          <p className="text-xs font-semibold text-ocean mb-2">Alternative workouts:</p>
          {WORKOUTS.filter(w => w.duration <= win.duration && w.name !== win.suggested).slice(0, 2).map(w => (
            <button key={w.id} className="w-full flex items-center justify-between py-1.5">
              <span className="text-xs text-midnight">{w.name}</span>
              <span className="text-xs text-gray-400">{w.duration} min</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX)

  const dayEvents = WEEK_EVENTS.find(d => d.day === selectedDay)?.events ?? []
  const freeWindows = SCHEDULE_WINDOWS.filter((_, i) => i < 3)

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 rounded-b-[2rem]"
        style={{ background: 'linear-gradient(135deg, #FFD166 0%, #FF4757 100%)' }}
      >
        <h2 className="text-white font-display font-bold text-2xl mb-1">Smart Schedule</h2>
        <p className="text-white/75 text-sm">Workout windows auto-detected</p>

        {/* Week strip */}
        <div className="mt-4 flex gap-1.5">
          {WEEK_DAYS.map((d, i) => {
            const hasEvents = WEEK_EVENTS[i].events.length > 0
            const isSelected = selectedDay === i
            const isToday = i === TODAY_IDX
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(i)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                  isSelected ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <span className={`text-[10px] font-bold ${isSelected ? 'text-gray-500' : 'text-white/70'}`}>{d}</span>
                <span className={`text-sm font-bold ${isSelected ? 'text-coral' : 'text-white'}`}>
                  {30 + i}
                </span>
                {hasEvents && (
                  <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-coral' : 'bg-white/60'}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Day events */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-sand" />
            <span className="font-semibold text-midnight text-sm">
              {WEEK_DAYS[selectedDay]}, June {30 + selectedDay}
            </span>
          </div>
          {dayEvents.length > 0 ? (
            <div className="flex flex-col gap-2">
              {dayEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-sm text-midnight">{ev}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-3xl">🌴</span>
              <p className="text-sm text-gray-500 mt-2">Rest day — no events scheduled</p>
              <p className="text-xs text-gray-400">Great time for a longer outdoor workout!</p>
            </div>
          )}
        </div>

        {/* Workout windows */}
        {selectedDay === TODAY_IDX && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-midnight text-sm">Today's Workout Windows</span>
              <span className="text-xs text-gray-400">{SCHEDULE_WINDOWS.length} gaps found</span>
            </div>
            {SCHEDULE_WINDOWS.map((win, i) => (
              <WindowCard key={i} win={win} onSwap={() => {}} />
            ))}
          </>
        )}

        {selectedDay !== TODAY_IDX && (
          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell size={16} className="text-ocean" />
              <span className="font-semibold text-midnight text-sm">Suggested Workout</span>
            </div>
            {(() => {
              const w = dayEvents.length === 0
                ? WORKOUTS[2]
                : dayEvents.length < 2
                ? WORKOUTS[0]
                : WORKOUTS[3]
              return (
                <div className={`bg-gradient-to-r ${w.color} rounded-2xl p-4`}>
                  <p className="text-white font-bold">{w.name}</p>
                  <p className="text-white/75 text-xs mt-0.5">{w.duration} min · {w.tag} · {w.calories} cal</p>
                  <button className="mt-3 bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    Add to Calendar
                  </button>
                </div>
              )
            })()}
          </div>
        )}

        {/* Can't make the gym */}
        <div className="bg-night-gradient rounded-3xl p-4 shadow-card">
          <p className="text-white font-bold text-sm mb-1">Can't make the gym today? 🏋️</p>
          <p className="text-white/60 text-xs mb-3">Instant home workout swap — no equipment, full intensity.</p>
          <div className="flex gap-2">
            {WORKOUTS.filter(w => w.location.includes('Home')).map(w => (
              <button
                key={w.id}
                className={`flex-1 bg-gradient-to-r ${w.color} rounded-xl p-2.5`}
              >
                <p className="text-white text-xs font-bold">{w.name}</p>
                <p className="text-white/75 text-[10px]">{w.duration} min</p>
              </button>
            ))}
          </div>
        </div>

        {/* Connect calendar CTA */}
        <button className="w-full bg-white rounded-3xl p-4 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
              <Calendar size={18} className="text-ocean" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-midnight text-sm">Connect Google Calendar</p>
              <p className="text-xs text-gray-400">Auto-detect workout windows daily</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}

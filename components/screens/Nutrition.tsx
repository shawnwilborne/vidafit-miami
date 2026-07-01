'use client'

import { useState } from 'react'
import { Search, Plus, ChevronDown, ChevronUp, X, Check } from 'lucide-react'
import { USER, TODAY, MEALS, MIAMI_RESTAURANTS, MIAMI_PLATES } from '@/lib/data'

function MacroBar({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  const pct = Math.min((value / goal) * 100, 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="text-gray-400">{value} / {goal}g</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function RestaurantModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = MIAMI_RESTAURANTS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl p-5 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-midnight text-lg">Miami Restaurants</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
            placeholder="Search Versailles, Zuma, Coyo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto flex flex-col gap-2 flex-1">
          {filtered.map(r => (
            <button
              key={r.name}
              onClick={() => setSelected(selected === r.name ? null : r.name)}
              className={`text-left rounded-2xl p-3 border-2 transition-all ${
                selected === r.name ? 'border-coral bg-coral/5' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-midnight text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.cuisine} · {r.distance}</p>
                </div>
                {selected === r.name && <Check size={16} className="text-coral" />}
              </div>
              {selected === r.name && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.popular.map(item => (
                    <span key={item} className="text-xs bg-coral/10 text-coral font-medium px-2 py-0.5 rounded-full">{item}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
        {selected && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-miami-gradient text-white font-semibold py-3 rounded-2xl shadow-coral"
          >
            Add from {selected}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Nutrition() {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(1)
  const [showRestaurants, setShowRestaurants] = useState(false)
  const [activeTab, setActiveTab] = useState<'log' | 'plates'>('log')
  const [addedPlate, setAddedPlate] = useState<string | null>(null)

  const totalCal = MEALS.flatMap(m => m.items).reduce((s, i) => s + i.cal, 0)

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="bg-ocean-gradient px-5 pt-14 pb-6 rounded-b-[2rem]">
        <h2 className="text-white font-display font-bold text-2xl mb-1">Nutrition</h2>
        <p className="text-white/75 text-sm">Monday, June 30</p>

        {/* Calorie summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Eaten', val: totalCal, unit: 'kcal', color: 'text-white' },
            { label: 'Burned', val: 285, unit: 'kcal', color: 'text-white' },
            { label: 'Net', val: totalCal - 285, unit: 'kcal', color: 'text-white' },
          ].map(s => (
            <div key={s.label} className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-white font-bold text-lg">{s.val}</p>
              <p className="text-white/80 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-4">
        {/* Macro bars */}
        <div className="bg-white rounded-3xl p-4 shadow-card flex flex-col gap-3">
          <span className="font-semibold text-midnight text-sm">Macros Today</span>
          <MacroBar label="Protein" value={TODAY.protein} goal={USER.proteinGoal} color="#06D6A0" />
          <MacroBar label="Carbs"   value={TODAY.carbs}   goal={USER.carbGoal}    color="#00B4D8" />
          <MacroBar label="Fat"     value={TODAY.fat}     goal={USER.fatGoal}     color="#FFD166" />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 bg-gray-200 rounded-2xl p-1">
          {(['log', 'plates'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-white text-midnight shadow-card' : 'text-gray-500'
              }`}
            >
              {t === 'log' ? '🍽️ Today\'s Log' : '🌴 Miami Plates'}
            </button>
          ))}
        </div>

        {activeTab === 'log' ? (
          <>
            {/* Meal accordion */}
            {MEALS.map(meal => {
              const mealCal = meal.items.reduce((s, i) => s + i.cal, 0)
              const open = expandedMeal === meal.id
              return (
                <div key={meal.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4"
                    onClick={() => setExpandedMeal(open ? null : meal.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center text-sm font-bold text-coral">
                        {meal.time.split(':')[0]}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-midnight text-sm">{meal.label}</p>
                        <p className="text-xs text-gray-400">{meal.time} · {meal.items.length} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-coral text-sm">{mealCal} kcal</span>
                      {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>
                  {open && (
                    <div className="border-t border-gray-100">
                      {meal.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-sm text-midnight">{item.icon} {item.name}</span>
                          <span className="text-sm font-medium text-gray-500">{item.cal} kcal</span>
                        </div>
                      ))}
                      <div className="px-4 pb-3 pt-1">
                        <button className="text-xs text-coral font-semibold flex items-center gap-1">
                          <Plus size={12} /> Add item
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add meal button */}
            <button
              onClick={() => setShowRestaurants(true)}
              className="w-full bg-miami-gradient text-white font-semibold py-3 rounded-2xl shadow-coral flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Search Miami Restaurants
            </button>
          </>
        ) : (
          /* Miami plates */
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500 font-medium px-1">Quick-add curated Miami cuisine templates</p>
            {MIAMI_PLATES.map(plate => (
              <div key={plate.name} className="bg-white rounded-3xl p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{plate.icon}</span>
                    <div>
                      <p className="font-bold text-midnight text-sm">{plate.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{plate.items}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddedPlate(plate.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      addedPlate === plate.name
                        ? 'bg-palm/10 text-palm'
                        : 'bg-coral/10 text-coral'
                    }`}
                  >
                    {addedPlate === plate.name ? '✓ Added' : '+ Add'}
                  </button>
                </div>
                <div className="mt-3 flex gap-3">
                  {[
                    { l: 'Cal', v: plate.cal },
                    { l: 'Protein', v: `${plate.protein}g` },
                    { l: 'Carbs', v: `${plate.carb}g` },
                    { l: 'Fat', v: `${plate.fat}g` },
                  ].map(s => (
                    <div key={s.l} className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                      <p className="font-bold text-midnight text-sm">{s.v}</p>
                      <p className="text-[10px] text-gray-400">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRestaurants && <RestaurantModal onClose={() => setShowRestaurants(false)} />}
    </div>
  )
}

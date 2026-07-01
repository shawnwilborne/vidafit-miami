export const USER = {
  name: 'Alex',
  neighborhood: 'Brickell',
  calorieGoal: 2100,
  proteinGoal: 155,
  carbGoal: 210,
  fatGoal: 65,
  waterGoal: 10,
  stepGoal: 10000,
  streak: 12,
}

export const TODAY = {
  calories: 1480,
  protein: 98,
  carbs: 162,
  fat: 42,
  water: 7,
  steps: 7240,
  activeMinutes: 34,
  sleep: 7.2,
  mood: null as string | null,
  energy: null as number | null,
}

export const MEALS = [
  {
    id: 1,
    time: '7:30 AM',
    label: 'Breakfast',
    items: [
      { name: 'Café con Leche', cal: 95, icon: '☕' },
      { name: 'Pan Tostado con Mantequilla', cal: 210, icon: '🍞' },
      { name: 'Guava Pastelito', cal: 330, icon: '🥐' },
    ],
  },
  {
    id: 2,
    time: '12:15 PM',
    label: 'Lunch',
    items: [
      { name: 'Ropa Vieja Bowl', cal: 520, icon: '🥩' },
      { name: 'Maduros', cal: 145, icon: '🍌' },
      { name: 'Sparkling Water', cal: 0, icon: '💧' },
    ],
  },
  {
    id: 3,
    time: '3:45 PM',
    label: 'Snack',
    items: [
      { name: 'Mango + Chamoy', cal: 90, icon: '🥭' },
      { name: 'Colada de café', cal: 80, icon: '☕' },
    ],
  },
  {
    id: 4,
    time: '7:00 PM',
    label: 'Dinner',
    items: [],
  },
]

export const MIAMI_RESTAURANTS = [
  { name: 'Versailles', cuisine: 'Cuban', distance: '2.1 mi', popular: ['Ropa Vieja', 'Croquetas', 'Cuban Sandwich'] },
  { name: 'Zuma Miami', cuisine: 'Japanese', distance: '0.4 mi', popular: ['Edamame', 'Salmon Sashimi', 'Miso Black Cod'] },
  { name: 'Caja China Brickell', cuisine: 'Latin Fusion', distance: '0.8 mi', popular: ['Roast Pork Bowl', 'Yuca Fries', 'Plantain Chips'] },
  { name: 'Coyo Taco', cuisine: 'Mexican', distance: '1.2 mi', popular: ['Carnitas Taco', 'Guac', 'Agua Fresca'] },
  { name: 'KYU Miami', cuisine: 'Asian BBQ', distance: '1.9 mi', popular: ['Cauliflower', 'Duck Bao', 'Glazed Salmon'] },
  { name: 'Mandolin Aegean Bistro', cuisine: 'Greek / Mediterranean', distance: '3.4 mi', popular: ['Greek Salad', 'Grilled Fish', 'Hummus'] },
]

export const MIAMI_PLATES = [
  { name: 'Cuban Plate', icon: '🇨🇺', items: 'Ropa vieja, rice, black beans, maduros', cal: 780, protein: 42, carb: 95, fat: 22 },
  { name: 'Caribbean Bowl', icon: '🌴', items: 'Grilled fish, rice, avocado, pickled onion', cal: 540, protein: 48, carb: 52, fat: 14 },
  { name: 'Miami Salad', icon: '🥗', items: 'Mango, hearts of palm, grilled shrimp, citrus', cal: 380, protein: 32, carb: 28, fat: 12 },
  { name: 'Ceviche & Tostones', icon: '🍋', items: 'Shrimp ceviche, crispy tostones, ají amarillo', cal: 420, protein: 36, carb: 44, fat: 10 },
]

export const WORKOUTS = [
  {
    id: 1,
    name: 'Brickell Power Circuit',
    duration: 10,
    calories: 95,
    difficulty: 'Medium',
    tag: 'HIIT',
    location: '🏙️ Home / Office',
    exercises: ['10 Squat Jumps', '10 Push-ups', '20 Mountain Climbers', '30s Plank', '10 Burpees'],
    color: 'coral',
  },
  {
    id: 2,
    name: 'Bayfront Park Sprint',
    duration: 15,
    calories: 145,
    difficulty: 'Hard',
    tag: 'Cardio',
    location: '🌊 Bayfront Park',
    exercises: ['400m Warm-up jog', '4× 100m sprints', 'Bleacher steps ×3', 'Cool-down stretch'],
    color: 'teal',
  },
  {
    id: 3,
    name: 'South Pointe Strength',
    duration: 20,
    calories: 175,
    difficulty: 'Medium',
    tag: 'Strength',
    location: '🏖️ South Pointe Park',
    exercises: ['Dips on bench ×15', 'Step-up lunges ×12', 'Pull-up bars ×8', 'Calf raises ×20', 'Core circuit 2 min'],
    color: 'palm',
  },
  {
    id: 4,
    name: 'Desk Break Refresh',
    duration: 5,
    calories: 40,
    difficulty: 'Easy',
    tag: 'Mobility',
    location: '🏢 Anywhere',
    exercises: ['Neck rolls', 'Shoulder stretch 30s', 'Hip flexor stretch', 'Wrist circles', '5 deep breaths'],
    color: 'sand',
  },
  {
    id: 5,
    name: 'Brickell Key Loop',
    duration: 20,
    calories: 190,
    difficulty: 'Medium',
    tag: 'Run',
    location: '🌉 Brickell Key',
    exercises: ['1.2 mi waterfront loop', 'Pace: 10 min/mi', 'Scenic bay views', '3 stop points for stretches'],
    color: 'purple',
  },
  {
    id: 6,
    name: 'Beach Body Prep',
    duration: 15,
    calories: 130,
    difficulty: 'Medium',
    tag: 'Sculpt',
    location: '🏄 South Beach',
    exercises: ['Lateral band walks ×20', 'Glute bridges ×15', 'Romanian deadlifts', 'Lateral raises ×12', 'Ab circuit'],
    color: 'pink',
  },
  {
    id: 7,
    name: 'Quick Core Blast',
    duration: 5,
    calories: 45,
    difficulty: 'Medium',
    tag: 'Core',
    location: '🏙️ Home / Office',
    exercises: ['30s Plank', '20 Bicycle Crunches', '15 Leg Raises', '30s Side Plank (each)', '10 V-Ups'],
    color: 'purple',
  },
  {
    id: 8,
    name: 'Wynwood Walk & Tone',
    duration: 20,
    calories: 155,
    difficulty: 'Easy',
    tag: 'Active',
    location: '🎨 Wynwood',
    exercises: ['20 min brisk art district walk', 'Lunge at each block corner', 'Calf raises at crosswalks', 'Finish at Wynwood Walls'],
    color: 'orange',
  },
]

export const NEIGHBORHOODS = [
  { name: 'Bayfront Park', emoji: '🌊', vibe: 'Waterfront runs & sprints', distance: '0.3 mi', temp: '89°F / Humid' },
  { name: 'Brickell Key', emoji: '🌉', vibe: 'Scenic 1.2mi loop, flat', distance: '0.6 mi', temp: '88°F / Breezy' },
  { name: 'South Pointe Park', emoji: '🏖️', vibe: 'Calisthenics, open lawn', distance: '4.2 mi', temp: '87°F / Ocean breeze' },
  { name: 'Wynwood', emoji: '🎨', vibe: 'Art walk + stair training', distance: '2.8 mi', temp: '90°F / Hot' },
]

export const WEEKLY_DATA = [
  { day: 'M', calories: 2050, steps: 8200, workout: true },
  { day: 'T', calories: 1920, steps: 11500, workout: true },
  { day: 'W', calories: 2180, steps: 6800, workout: false },
  { day: 'T', calories: 1750, steps: 9100, workout: true },
  { day: 'F', calories: 2300, steps: 7400, workout: true },
  { day: 'S', calories: 2450, steps: 5200, workout: false },
  { day: 'S', calories: 1480, steps: 7240, workout: false },
]

export const SCHEDULE_WINDOWS = [
  { time: '8:00 AM', duration: 10, type: 'Before standup', suggested: 'Desk Break Refresh' },
  { time: '12:30 PM', duration: 20, type: 'Lunch gap', suggested: 'Brickell Key Loop' },
  { time: '2:00 PM', duration: 10, type: 'Before 2pm call', suggested: 'Quick Core Blast' },
  { time: '6:00 PM', duration: 20, type: 'Post-work', suggested: 'South Pointe Strength' },
]

export const AI_INSIGHTS = [
  "You hit your protein goal every day you logged a morning workout. Try moving your gym day from Wednesday.",
  "Your best calorie days are Tuesday and Thursday — you tend to prep meals those evenings.",
  "You've walked 20% more steps on days with outdoor workouts. Consider the Brickell Key loop today.",
  "Sleep under 7hrs correlates with 400+ extra calories consumed the next day. Last night was 7.2hrs — great.",
]

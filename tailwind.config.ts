import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral:   { DEFAULT: '#FF4757', light: '#FF6B78', dark: '#E63946' },
        ocean:   { DEFAULT: '#00B4D8', light: '#48CAE4', dark: '#0096C7' },
        palm:    { DEFAULT: '#06D6A0', light: '#38EFC0', dark: '#05B384' },
        sand:    { DEFAULT: '#FFD166', light: '#FFE2A0', dark: '#F5B800' },
        midnight:{ DEFAULT: '#1A1A2E', light: '#2D2D4E' },
        dusk:    { DEFAULT: '#16213E' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'miami-gradient': 'linear-gradient(135deg, #FF4757 0%, #FF8C00 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #00B4D8 0%, #06D6A0 100%)',
        'night-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        'gold-gradient':  'linear-gradient(135deg, #FFD166 0%, #FF8C00 100%)',
        'berry-gradient': 'linear-gradient(135deg, #8338ec 0%, #FF4757 100%)',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        'coral': '0 4px 20px rgba(255,71,87,0.35)',
        'ocean': '0 4px 20px rgba(0,180,216,0.35)',
        'palm':  '0 4px 20px rgba(6,214,160,0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  safelist: [
    'from-coral', 'to-orange-400', 'to-pink-400',
    'from-ocean', 'to-cyan-400',
    'from-palm', 'to-emerald-400',
    'from-sand', 'to-yellow-400',
    'from-purple-500',
    'from-orange-400',
    'bg-gradient-to-r',
  ],
  plugins: [],
}

export default config

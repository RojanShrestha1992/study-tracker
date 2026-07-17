/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#FFF1D6',
        },
        secondary: '#C2410C',
        accent: '#65A30D',
        cream: '#FFF8F0',
        surface: '#FFFCF7',
        sidebar: '#FBF3E4',
        sand: '#E7DCCF',
        espresso: '#3B2F2F',
        warmgray: '#7C6A5D',
        status: {
          completed: '#84CC16',
          progress: '#F59E0B',
          missed: '#DC2626',
          xp: '#FACC15',
          locked: '#A8A29E',
        },
        game: {
          xp: '#FACC15',
          coins: '#EAB308',
          fire: '#F97316',
          diamond: '#60A5FA',
        },
      },
      boxShadow: {
        warm: '0 8px 25px rgba(140, 90, 40, 0.08)',
        'warm-lg': '0 12px 35px rgba(140, 90, 40, 0.12)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FFF8F0 0%, #FFE7C7 45%, #FFD89B 100%)',
        'gradient-xp': 'linear-gradient(to right, #F59E0B, #FACC15)',
        'gradient-levelup': 'linear-gradient(to right, #65A30D, #A3E635)',
        'gradient-badge': 'linear-gradient(135deg, #D97706, #FACC15)',
      },
    },
  },
  plugins: [],
}


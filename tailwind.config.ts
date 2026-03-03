import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#334155',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#A5B4FC',
          dark: '#818CF8',
        },
        accent: {
          DEFAULT: '#A5B4FC',
        },
        success: '#22C55E',
        error: '#EF4444',
        title: {
          DEFAULT: '#334155',
          dark: '#F1F5F9',
        },
        text: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
        textSecondary: {
          DEFAULT: '#94A3B8',
          dark: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-magic': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-aurora-light': 'linear-gradient(135deg, #A5B4FC 0%, #67E8F9 100%)',
        'gradient-aurora-dark': 'linear-gradient(135deg, #A5B4FC 0%, #67E8F9 100%)',
      },
      boxShadow: {
        'glow': '0 20px 25px -5px rgba(99, 102, 241, 0.15)',
        'glow-dark': '0 20px 25px -5px rgba(129, 140, 248, 0.15)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'card-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;

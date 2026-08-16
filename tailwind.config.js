export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0F',
        paper: '#F5F1E8',
        spark: '#FF5C28',
        signal: '#6B7FFF',
        ash: '#1A1A22',
        smoke: '#2A2A35',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        editorial: ['"Newsreader"', 'serif'],
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,92,40,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,92,40,0.6)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};

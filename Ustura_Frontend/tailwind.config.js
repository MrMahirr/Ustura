const nativewind = require('nativewind/preset');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './contexts/**/*.{js,jsx,ts,tsx}', './hooks/**/*.{js,jsx,ts,tsx}', './utils/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [nativewind],
  theme: {
    extend: {
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        xl: '20px',
      },
      boxShadow: {
        ambient: '0 20px 50px rgba(0, 0, 0, 0.18)',
        'ambient-strong': '0 20px 50px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        body: ['Manrope-Regular'],
        headline: ['NotoSerif-Bold'],
        label: ['Manrope-Medium'],
      },
      letterSpacing: {
        tighterest: '-1.2px',
        badge: '0.5px',
        ui: '1.2px',
        wide: '1.6px',
        wider: '2px',
        widest: '2.2px',
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{vue,js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#3b82f6',
//         secondary: '#64748b',
//         success: '#10b981',
//         danger: '#ef4444',
//         warning: '#f59e0b',
//         info: '#3b82f6',
//       },
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//         arabic: ['Cairo', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [
//     require('daisyui'),
//   ],
//   daisyui: {
//     themes: [
//       {
//         light: {
//           ...require("daisyui/src/theming/themes")["light"],
//           primary: "#3b82f6",
//           secondary: "#64748b",
//         },
//         dark: {
//           ...require("daisyui/src/theming/themes")["dark"],
//           primary: "#3b82f6",
//           secondary: "#64748b",
//         },
//       },
//     ],
//   },
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    defaultTheme: 'light',
  }
}
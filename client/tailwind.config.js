/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JSX/JS files for class usage — keeps the bundle small (tree-shaken)
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  // darkMode: 'class' won't interfere — we keep ThemeContext's data-theme="dark"
  // approach for the existing CSS. New Tailwind components can use dark: variant
  // IF needed, but for now we just expose the CSS var tokens via the theme so
  // Tailwind utilities like bg-acc, text-t2, border-b2 etc. work seamlessly.
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Surface layers
        bg:  'var(--bg)',
        s1:  'var(--s1)',
        s2:  'var(--s2)',
        // Borders
        b1:  'var(--b1)',
        b2:  'var(--b2)',
        b3:  'var(--b3)',
        // Text
        t1:  'var(--t1)',
        t2:  'var(--t2)',
        t3:  'var(--t3)',
        // Brand / semantic
        acc: 'var(--acc)',
        grn: 'var(--grn)',
        red: 'var(--red)',
        amb: 'var(--amb)',
        pur: 'var(--pur)',
      },
      boxShadow: {
        card:       'var(--shadow)',
        'card-hover': 'var(--shadow-hover)',
      },
      backgroundImage: {
        'acc-g': 'var(--acc-g)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
    },
  },

  plugins: [],
};

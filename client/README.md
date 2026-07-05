# AK Computer Solutions — Frontend (React)

This is the React/Vite frontend for the AK Computer Solutions storefront, converted
from the original single-file HTML mockup. The UI, layout, colors, fonts, animations,
and light/dark theme are all preserved exactly — only the underlying structure changed,
so the project is ready to plug into a real Express + MongoDB backend later (the "M"
and "E"/"N" of MERN).

## Run it

```bash
npm install
npm run dev      # starts the dev server, usually at http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## What's in here

- **Light/dark mode** — `src/context/ThemeContext.jsx`. Same toggle button and
  CSS-variable theme tokens as the original file, with the theme now remembered
  between visits (localStorage).
- **Real logo** — your uploaded logo file is in `src/assets/logo.png` and is used in
  the navbar and footer (replacing the hand-drawn SVG text approximation from the
  mockup).
- **Categories** — `src/data/categories.js` holds the 11 categories pulled from your
  notes (laptops, refurb laptops, custom builds, processors & motherboards, graphic
  cards, RAM & storage, cabinets & cooling, monitors, keyboards/mice/headphones,
  printers & cartridges, cables & accessories). They populate the left sidebar and
  each has its own page at `/category/:slug`.
- **Static product data** — `src/data/products.js`. This is the "assets folder" of
  static data you asked for — it stands in for a future `GET /api/products` call.
  The 4 original "Featured Collections" cards on the home page are untouched
  (same images, prices, names). New products added for the other categories use
  placeholder photos (Lorem Picsum) since no real product photography was provided
  yet — swap the `image` field for real photos any time.
- **Routing** — `react-router-dom`. `/` is the home page (hero slider + trust bar +
  Featured Collections, identical to the original). `/category/:slug` is a new page
  that reuses the same product-grid styling to list that category's products.

## Wiring up the backend later

Each data file has a comment at the top explaining the shape an API response should
match. When the Express API is ready, replace the static imports in `pages/Home.jsx`
and `pages/CategoryPage.jsx` with `fetch()`/`axios` calls — the components themselves
don't need to change.

## Folder structure

```
src/
  assets/         logo.png
  components/     Navbar, Sidebar, HeroSlider, TrustBar, ProductCard, ProductGrid,
                  Footer, CartDrawer, ConfiguratorDrawer, Overlay, Layout
  context/        ThemeContext, DrawerContext
  data/           categories.js, products.js  (static data — future API)
  pages/          Home.jsx, CategoryPage.jsx
  App.jsx
  main.jsx
  index.css       (global styles + theme tokens, ported 1:1 from the original)
```

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


# AK Computer Solutions — API Server

Node/Express + MongoDB backend for the AK Computer Solutions inquiry website.
Customers browse products and submit inquiries (no checkout/payment); admins
manage products and respond to inquiries.

## Stack

- Express 4
- MongoDB + Mongoose
- JWT auth (separate token "roles" for customers vs admin)
- bcryptjs for password hashing
- express-validator for request validation

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ak-computer-solutions   # or your Atlas URI
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
ADMIN_SEED_USERNAME=admin
ADMIN_SEED_PASSWORD=admin password
CLIENT_ORIGIN=http://localhost:5173
```

Make sure MongoDB is running locally, or point `MONGO_URI` at an Atlas
cluster.

### Seed the database

Loads the existing 54 static products + 11 categories from the client app
into MongoDB, and creates the admin account from your `.env` credentials:

```bash
npm run seed
```

Safe to re-run — it wipes and re-inserts products/categories each time, but
won't duplicate the admin account if one already exists.

### Run the server

```bash
npm run dev      # nodemon, auto-restarts on file changes
npm start        # plain node, for production
```

Server boots on `http://localhost:5000`. Health check: `GET /api/health`.

## API Overview

### Customer auth (`/api/auth`)
- `POST /register` — name, email, phone, password, optional address → creates account, returns JWT
- `POST /login` — email, password → returns JWT
- `GET /me` — current customer profile (requires `Authorization: Bearer <token>`)

### Admin auth (`/api/admin/auth`)
- `POST /login` — username, password → returns JWT (role: admin)

### Users (`/api/users`) — customer-protected unless noted
- `PUT /me` — update name/phone
- `PUT /me/password` — change password
- `GET /me/addresses` / `POST /me/addresses` / `PUT /me/addresses/:id` / `DELETE /me/addresses/:id`
- `GET /me/inquiries` — the logged-in customer's own inquiry history
- `GET /` — **admin-protected**: list all registered customers with inquiry counts

### Products (`/api/products`) — public reads, admin writes
- `GET /` — list, filterable by `?category=`, `?brand=`, `?q=`, `?featured=true`
- `GET /:slug`
- `POST /`, `PUT /:id`, `DELETE /:id` — **admin-protected** (delete is a soft-delete)

### Categories (`/api/categories`)
- `GET /` — public list

### Inquiries (`/api/inquiries`)
- `POST /` — **customer-protected**. Customer must be logged in to submit an inquiry.
  Body: `{ phone, email?, message?, items: [{ product, name, qty }], address? }`
- `GET /` — **admin-protected**, all inquiries, filterable by `?status=`
- `PATCH /:id/status` — **admin-protected**. Status must be one of:
  `new`, `contacted`, `in-progress`, `closed`, `cancelled`
- `DELETE /:id` — **admin-protected**

## Auth model

Two separate JWT "roles" share the same secret but are checked independently:
- Customer tokens (`role: 'customer'`) only pass `protectCustomer` middleware
- Admin tokens (`role: 'admin'`) only pass `protectAdmin` middleware

A customer token can never access admin routes and vice versa, even though
both are just JWTs signed with the same secret.

## Notes

- Inquiries always belong to a registered `User` — there is no guest inquiry
  path by design, since the storefront requires login before inquiring.
- Product deletes are soft (`isDeleted: true`) so historical inquiries still
  resolve their linked product.

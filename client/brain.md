# brain.md — Architecture & Data Flow Reference
Updated to reflect the full MERN backend and real customer auth.

## Monorepo Layout
```
/
  client/   React + Vite frontend
  server/   Node/Express + MongoDB backend (see server/README.md)
```

## Backend Endpoints (server/ — Express + MongoDB + JWT)
```
GET  /api/health
POST /api/auth/register           -> { token, user }
POST /api/auth/login              -> { token, user }
GET  /api/auth/me                 -> { user }        [customer JWT]
POST /api/admin/auth/login        -> { token, admin }
GET  /api/products                [public]
GET  /api/products/:slug          [public]
POST/PUT/DELETE /api/products/:id [admin JWT]
GET  /api/categories              [public]
POST /api/inquiries               [customer JWT — gated]
GET  /api/inquiries               [admin JWT]
PATCH /api/inquiries/:id/status   [admin JWT]
DELETE /api/inquiries/:id         [admin JWT]
GET  /api/users/me                [customer JWT]
PUT  /api/users/me                [customer JWT]
PUT  /api/users/me/password       [customer JWT]
GET/POST/PUT/DELETE /api/users/me/addresses/:id [customer JWT]
GET  /api/users/me/inquiries      [customer JWT]
GET  /api/users                   [admin JWT — lists all customers]
```

## Auth Model
Two separate JWT roles:
- `role: 'customer'` → `protectCustomer` middleware → customer routes
- `role: 'admin'`    → `protectAdmin` middleware → admin routes

Tokens stored in `localStorage`:
- `ak-customer-token` (set by AuthContext on customer login/register)
- `ak-admin-token`    (set by AuthContext on adminLogin)
- `ak-admin-profile`  (JSON: { id, username, name } for admin topbar)

## Frontend Provider Order (App.jsx, outer → inner)
```
ThemeProvider
  ToastProvider
    AuthProvider
      ProductStoreProvider
        BuildOptionsStoreProvider
          CartProvider
            WishlistProvider
              InquiryProvider
                DrawerProvider
                  <Routes>
```
Note: CompareProvider removed (compare feature removed per scope decision).

## AuthContext (src/context/AuthContext.jsx)
Backed by real API calls (see src/utils/api.js):
- `user`            — logged-in customer profile (null if not logged in)
- `isAuthenticated` — true when customer JWT is valid
- `loadingUser`     — true during initial JWT hydration on mount
- `register()`      — POST /api/auth/register
- `login()`         — POST /api/auth/login
- `logout()`        — clears token + user state
- `updateProfile()` — PUT /api/users/me
- `refreshUser()`   — re-fetches /api/auth/me
- `admin`           — logged-in admin profile (null if not admin)
- `isAdmin`         — true when admin JWT is valid
- `adminLogin()`    — POST /api/admin/auth/login
- `adminLogout()`   — clears admin token + admin state

## InquiryContext (src/context/InquiryContext.jsx)
Now API-backed, no localStorage persistence:
- `inquiries`          — ALL inquiries (admin view, loaded via loadAdminInquiries())
- `myInquiries`        — current customer's own inquiries (loaded via loadMyInquiries())
- `submitInquiry()`    — POST /api/inquiries [customer JWT, throws if not auth'd]
- `updateStatus()`     — PATCH /api/inquiries/:id/status [admin JWT]
- `removeInquiry()`    — DELETE /api/inquiries/:id [admin JWT]
- `loadAdminInquiries()` — called on admin panel mount
- `loadMyInquiries()`    — called on DashboardInquiries mount
- `newCount`           — count of status === 'new' in admin list (for badge)

## Routing Map

### Storefront (wrapped in Layout)
```
/                    Home
/category/:slug      CategoryPage
/product/:id         ProductDetailsPage
/cart                CartPage
/login               LoginPage             (redirects to /account if already auth'd)
/register            RegisterPage          (redirects to /account if already auth'd)
/inquiry             InquiryFormPage       ← LOGIN GATED → /login?redirect=/inquiry
/inquiry-sent/:id    InquirySentPage
/wishlist            WishlistPage
/search              SearchResultsPage
/brand/:slug /deals /accessories /build-pc /contact /about /services /faq
/privacy-policy /terms /return-policy /shipping-policy
/account/*           DashboardLayout (LOGIN GATED → /login?redirect=/account)
  index              DashboardProfile
  addresses          DashboardAddresses
  inquiries          DashboardInquiries    ← customer's own inquiry history
  password           DashboardPassword
```

### Admin (standalone, own topbar/sidebar)
```
/admin/login         AdminLoginPage        (public)
/admin               RequireAdmin guard (checks isAdmin from AuthContext)
  → AdminLayout
      index           AdminDashboardPage
      products        AdminProductsPage
      products/new    AdminProductFormPage
      products/:id/edit AdminProductFormPage
      inquiries       AdminInquiriesPage   ← real API + 5-status dropdown
      customers       AdminCustomersPage   ← real registered users
      build-pc        AdminBuildOptionsPage
```

## What's Real vs Mocked
- ✅ Customer auth: real (register/login → JWT → MongoDB User)
- ✅ Admin auth: real (login → JWT → MongoDB Admin)
- ✅ Inquiries: real (submit → MongoDB, admin reads from DB)
- ✅ Customer profile/addresses: real (MongoDB User embedded addresses)
- ✅ Admin customers page: real registered users from MongoDB
- ⚠️  Products: storefront still reads from static `data/products.js` (the admin
     ProductStoreContext localStorage layer also still works for admin-only edits).
     When the seed script runs, MongoDB gets the same 54 products. Full API-wired
     storefront reads (`GET /api/products`) are the next backend milestone.
- ⚠️  Build PC page: still uses BuildOptionsStoreContext (localStorage) — also
     still working as before.

## Key Files Added / Changed
```
client/src/utils/api.js           API client utility (apiFetch, token helpers)
client/src/context/AuthContext.jsx  Rewritten — real API, dual customer/admin
client/src/context/InquiryContext.jsx  Rewritten — real API, no localStorage
client/src/pages/LoginPage.jsx    NEW — customer login
client/src/pages/RegisterPage.jsx NEW — customer registration (with address)
client/src/pages/InquiryFormPage.jsx  LOGIN GATED, auto-fills from user profile
client/src/pages/InquirySentPage.jsx  Updated — short AKI-XXXXXXXX ref format
client/src/pages/dashboard/DashboardLayout.jsx   Login gate, new tabs
client/src/pages/dashboard/DashboardProfile.jsx  Real API update
client/src/pages/dashboard/DashboardAddresses.jsx Real address CRUD
client/src/pages/dashboard/DashboardInquiries.jsx NEW — customer's own inquiries
client/src/pages/dashboard/DashboardPassword.jsx  Real API password change
client/src/pages/admin/AdminLoginPage.jsx  Uses adminLogin() not login()
client/src/pages/admin/AdminLayout.jsx     Uses adminLogout(), shows admin.name
client/src/pages/admin/AdminInquiriesPage.jsx  Real API + 5-status + address display
client/src/pages/admin/AdminCustomersPage.jsx  Real registered users from API
client/src/components/Navbar.jsx  Shows Sign In/Out based on real auth state
client/.env.example               VITE_API_URL=http://localhost:5000/api

server/                           NEW Express + MongoDB backend
server/src/models/User.js         Customer model (embedded addresses)
server/src/models/Admin.js        Admin model
server/src/models/Product.js      Product model
server/src/models/Category.js     Category model
server/src/models/Inquiry.js      Inquiry model (linked to User)
server/src/routes/authRoutes.js   /api/auth/*
server/src/routes/adminAuthRoutes.js /api/admin/auth/*
server/src/routes/userRoutes.js   /api/users/*
server/src/routes/productRoutes.js /api/products/*
server/src/routes/categoryRoutes.js /api/categories
server/src/routes/inquiryRoutes.js /api/inquiries/*
server/src/utils/seed.js          Seeds DB from client static data
server/README.md                  Setup + run instructions
```

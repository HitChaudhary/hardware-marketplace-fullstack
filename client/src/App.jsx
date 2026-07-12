import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DrawerProvider } from './context/DrawerContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductStoreProvider } from './context/ProductStoreContext';
import { CompareProvider } from './context/CompareContext';

import Layout from './components/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import RequireAdmin from './pages/admin/RequireAdmin';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';

import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ComparePage from './pages/ComparePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BrandPage from './pages/BrandPage';
import DealsPage from './pages/DealsPage';
import AccessoriesPage from './pages/AccessoriesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';

import PolicyPage from './components/PolicyPage';
import { privacyPolicy, termsAndConditions, returnPolicy, shippingPolicy } from './data/policies';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductStoreProvider>
            <CompareProvider>
              <DrawerProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:idOrSlug" element={<ProductDetailsPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/brand/:slug" element={<BrandPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/accessories" element={<AccessoriesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/privacy-policy" element={<PolicyPage {...privacyPolicy} />} />
                    <Route path="/terms" element={<PolicyPage {...termsAndConditions} />} />
                    <Route path="/return-policy" element={<PolicyPage {...returnPolicy} />} />
                    <Route path="/shipping-policy" element={<PolicyPage {...shippingPolicy} />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<RequireAdmin />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="products/new" element={<AdminProductFormPage />} />
                      <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                    </Route>
                  </Route>
                </Routes>
              </DrawerProvider>
            </CompareProvider>
          </ProductStoreProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

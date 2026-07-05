import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DrawerProvider } from './context/DrawerContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { InquiryProvider } from './context/InquiryContext';
import { AuthProvider } from './context/AuthContext';
import { ProductStoreProvider } from './context/ProductStoreContext';
import { BuildOptionsStoreProvider } from './context/BuildOptionsStoreContext';
import { CompareProvider } from './context/CompareContext';

import Layout from './components/Layout';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import AdminLayout from './pages/admin/AdminLayout';
import RequireAdmin from './pages/admin/RequireAdmin';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminBuildOptionsPage from './pages/admin/AdminBuildOptionsPage';

import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InquiryFormPage from './pages/InquiryFormPage';
import InquirySentPage from './pages/InquirySentPage';
import WishlistPage from './pages/WishlistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BrandPage from './pages/BrandPage';
import DealsPage from './pages/DealsPage';
import AccessoriesPage from './pages/AccessoriesPage';
import BuildPCPage from './pages/BuildPCPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';

import PolicyPage from './components/PolicyPage';
import { privacyPolicy, termsAndConditions, returnPolicy, shippingPolicy } from './data/policies';

import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardAddresses from './pages/dashboard/DashboardAddresses';
import DashboardInquiries from './pages/dashboard/DashboardInquiries';
import DashboardPassword from './pages/dashboard/DashboardPassword';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductStoreProvider>
            <BuildOptionsStoreProvider>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <InquiryProvider>
                      <DrawerProvider>
                        <Routes>
                          <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/category/:slug" element={<CategoryPage />} />
                            <Route path="/product/:idOrSlug" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/inquiry" element={<InquiryFormPage />} />
                            <Route path="/inquiry-sent/:inquiryId" element={<InquirySentPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/search" element={<SearchResultsPage />} />
                            <Route path="/brand/:slug" element={<BrandPage />} />
                            <Route path="/deals" element={<DealsPage />} />
                            <Route path="/accessories" element={<AccessoriesPage />} />
                            <Route path="/build-pc" element={<BuildPCPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/privacy-policy" element={<PolicyPage {...privacyPolicy} />} />
                            <Route path="/terms" element={<PolicyPage {...termsAndConditions} />} />
                            <Route path="/return-policy" element={<PolicyPage {...returnPolicy} />} />
                            <Route path="/shipping-policy" element={<PolicyPage {...shippingPolicy} />} />

                            <Route path="/account" element={<DashboardLayout />}>
                              <Route index element={<DashboardProfile />} />
                              <Route path="addresses" element={<DashboardAddresses />} />
                              <Route path="inquiries" element={<DashboardInquiries />} />
                              <Route path="password" element={<DashboardPassword />} />
                            </Route>

                            <Route path="*" element={<NotFoundPage />} />
                          </Route>

                          <Route path="/admin/login" element={<AdminLoginPage />} />
                          <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="products" element={<AdminProductsPage />} />
                            <Route path="products/new" element={<AdminProductFormPage />} />
                            <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                            <Route path="inquiries" element={<AdminInquiriesPage />} />
                            <Route path="customers" element={<AdminCustomersPage />} />
                            <Route path="build-pc" element={<AdminBuildOptionsPage />} />
                          </Route>
                        </Routes>
                      </DrawerProvider>
                    </InquiryProvider>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </BuildOptionsStoreProvider>
          </ProductStoreProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

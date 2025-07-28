// Importing pages

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from "./pages/AddProductPage";
import RegisterPage from "./pages/RegisterPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import OrdersPage from "./pages/OrdersPage";
import SupportPage from "./pages/SupportPage";
import AddressesPage from "./pages/AddressesPage";
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Page Usage
function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} /> 
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
  );
}

export default App;

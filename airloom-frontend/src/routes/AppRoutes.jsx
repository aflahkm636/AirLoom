import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors';
import { ROLE_ROUTES } from '../utils/constants';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';
import StaffDashboard from '../pages/StaffDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import {
  BillingPage,
  ServiceTasksPage,
  SettingsPage,
  CustomersPage,
  SubscriptionsPage,
  InventoryPage as InventoryPlaceholder,
} from '../pages/PlaceholderPages';
import CustomersList from '../pages/admin/customers/CustomersList';
import CustomerDetail from '../pages/admin/customers/CustomerDetail';
import InventoryPage from '../pages/admin/inventory/InventoryPage';

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Determine default route based on authentication and role
  const getDefaultRoute = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    return ROLE_ROUTES[userRole] || '/login';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<CustomersList />} />
        <Route path="/admin/customers/:id" element={<CustomerDetail />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/billing" element={<BillingPage />} />
        <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/admin/service-tasks" element={<ServiceTasksPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/customers" element={<CustomersPage />} />
        <Route path="/staff/inventory" element={<InventoryPlaceholder />} />
        <Route path="/staff/billing" element={<BillingPage />} />
        <Route path="/staff/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/staff/service-tasks" element={<ServiceTasksPage />} />
        <Route path="/staff/settings" element={<SettingsPage />} />

        {/* Technician Routes */}
        <Route path="/technician" element={<TechnicianDashboard />} />
        <Route path="/technician/customers" element={<CustomersPage />} />
        <Route path="/technician/inventory" element={<InventoryPlaceholder />} />
        <Route path="/technician/billing" element={<BillingPage />} />
        <Route path="/technician/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/technician/service-tasks" element={<ServiceTasksPage />} />
        <Route path="/technician/settings" element={<SettingsPage />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/settings" element={<SettingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      
      {/* Catch all - redirect to default */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

export default AppRoutes;

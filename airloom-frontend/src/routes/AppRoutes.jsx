import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors';
import { ROLE_ROUTES } from '../utils/constants';
import ProtectedRoute from '../components/ProtectedRoute';
import PermissionGate from '../components/PermissionGate';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboard from '../pages/AdminDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';
import StaffDashboard from '../pages/StaffDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import {
  BillingPage,
  ServiceTasksPage as ServiceTasksPlaceholder,
  SettingsPage,
  CustomersPage,
  SubscriptionsPage,
  InventoryPage as InventoryPlaceholder,
} from '../pages/PlaceholderPages';
import CustomersList from '../pages/admin/customers/CustomersList';
import CustomerDetail from '../pages/admin/customers/CustomerDetail';
import EmployeesList from '../pages/admin/employees/EmployeesList';
import EmployeeDetail from '../pages/admin/employees/EmployeeDetail';
import InventoryPage from '../pages/admin/inventory/InventoryPage';
import SubscriptionManagement from '../pages/admin/subscriptions/SubscriptionManagement';
import SubscriptionPlansList from '../pages/admin/subscription-plans/SubscriptionPlansList';
import ServiceTasksPage from '../pages/admin/service-tasks/ServiceTasksPage';
import TechniciansList from '../pages/admin/technicians/TechniciansList';
import TechnicianDetail from '../pages/admin/technicians/TechnicianDetail';
import UsersList from '../pages/admin/users/UsersList';
import PendingBillsList from '../pages/admin/billing/PendingBillsList';
import MyBillsList from '../pages/customer/MyBillsList';

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Profile Route - Accessible to all authenticated users */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes - No permission gates needed, admin has all access */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/customers" element={<CustomersList />} />
        <Route path="/admin/customers/:id" element={<CustomerDetail />} />
        <Route path="/admin/employees" element={<EmployeesList />} />
        <Route path="/admin/employees/:id" element={<EmployeeDetail />} />
        <Route path="/admin/technicians" element={<TechniciansList />} />
        <Route path="/admin/technicians/:id" element={<TechnicianDetail />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/billing" element={<PendingBillsList />} />
        <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
        <Route path="/admin/subscription-plans" element={<SubscriptionPlansList />} />
        <Route path="/admin/service-tasks" element={<ServiceTasksPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        {/* Staff Routes - Protected by PermissionGate */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/customers" element={
          <PermissionGate requiredPermission="CUSTOMER_VIEW" moduleName="Customers">
            <CustomersList />
          </PermissionGate>
        } />
        <Route path="/staff/customers/:id" element={
          <PermissionGate requiredPermission="CUSTOMER_VIEW" moduleName="Customer Details">
            <CustomerDetail />
          </PermissionGate>
        } />
        <Route path="/staff/employees" element={
          <PermissionGate requiredPermission="EMPLOYEE_VIEW" moduleName="Employees">
            <EmployeesList />
          </PermissionGate>
        } />
        <Route path="/staff/employees/:id" element={
          <PermissionGate requiredPermission="EMPLOYEE_VIEW" moduleName="Employee Details">
            <EmployeeDetail />
          </PermissionGate>
        } />
        <Route path="/staff/technicians" element={
          <PermissionGate requiredPermission="TECHNICIAN_VIEW" moduleName="Technicians">
            <TechniciansList />
          </PermissionGate>
        } />
        <Route path="/staff/technicians/:id" element={
          <PermissionGate requiredPermission="TECHNICIAN_VIEW" moduleName="Technician Details">
            <TechnicianDetail />
          </PermissionGate>
        } />
        <Route path="/staff/inventory" element={
          <PermissionGate requiredPermission="INVENTORY_VIEW" moduleName="Inventory">
            <InventoryPage />
          </PermissionGate>
        } />
        <Route path="/staff/billing" element={
          <PermissionGate requiredPermission="BILLING_VIEW" moduleName="Billing">
            <PendingBillsList />
          </PermissionGate>
        } />
        <Route path="/staff/subscriptions" element={
          <PermissionGate requiredPermission="SUBSCRIPTION_VIEW" moduleName="Subscriptions">
            <SubscriptionManagement />
          </PermissionGate>
        } />
        <Route path="/staff/subscription-plans" element={
          <PermissionGate requiredPermission="SUBSCRIPTION_PLAN_VIEW" moduleName="Subscription Plans">
            <SubscriptionPlansList />
          </PermissionGate>
        } />
        <Route path="/staff/service-tasks" element={
          <PermissionGate requiredPermission="TASK_VIEW" moduleName="Service Tasks">
            <ServiceTasksPage />
          </PermissionGate>
        } />
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
        <Route path="/customer/my-bills" element={<MyBillsList />} />
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


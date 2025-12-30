import { Card, Typography, Empty } from 'antd';

const { Title, Text } = Typography;

// Reusable placeholder component for pages under construction
const PlaceholderPage = ({ title, icon, description }) => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card">
        <Empty
          image={
            <span className="material-symbols-rounded placeholder-icon">
              {icon}
            </span>
          }
          description={null}
        />
        <Title level={3} className="placeholder-title">
          {title}
        </Title>
        <Text className="placeholder-description">
          {description || 'This page is under construction. Check back soon!'}
        </Text>
      </Card>
    </div>
  );
};

// Customers Page
export const CustomersPage = () => (
  <PlaceholderPage
    title="Customers"
    icon="groups"
    description="Manage your customer database, view customer details, and track customer interactions."
  />
);

// Inventory Page
export const InventoryPage = () => (
  <PlaceholderPage
    title="Inventory"
    icon="inventory_2"
    description="Track inventory levels, manage stock, and monitor material usage."
  />
);

// Billing Page
export const BillingPage = () => (
  <PlaceholderPage
    title="Billing"
    icon="receipt_long"
    description="Generate invoices, track payments, and manage billing records."
  />
);

// Service Tasks Page
export const ServiceTasksPage = () => (
  <PlaceholderPage
    title="Service Tasks"
    icon="calendar_month"
    description="View and manage all service tasks, assignments, and schedules."
  />
);

// Settings Page
export const SettingsPage = () => (
  <PlaceholderPage
    title="Settings"
    icon="settings"
    description="Configure application settings, user preferences, and system options."
  />
);

// Subscriptions Page
export const SubscriptionsPage = () => (
  <PlaceholderPage
    title="Subscriptions"
    icon="card_membership"
    description="Manage customer subscriptions, plans, and renewal schedules."
  />
);

export default PlaceholderPage;

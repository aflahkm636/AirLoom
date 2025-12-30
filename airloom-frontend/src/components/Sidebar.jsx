import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

// Navigation items configuration
const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '' },
  { key: 'customers', label: 'Customers', icon: 'groups', path: '/customers' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory_2', path: '/inventory' },
  { key: 'billing', label: 'Billing', icon: 'receipt_long', path: '/billing' },
  { key: 'subscriptions', label: 'Subscriptions', icon: 'card_membership', path: '/subscriptions' },
  { key: 'service-tasks', label: 'Service Tasks', icon: 'calendar_month', path: '/service-tasks' },
  { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];

const Sidebar = ({ userRole, isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get base path for the current role (e.g., /admin, /staff, /technician)
  const basePath = `/${userRole?.toLowerCase() || 'admin'}`;

  // Determine active menu item based on current path
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    
    // Check if we're on a sub-route
    for (const item of navigationItems) {
      if (item.path && currentPath.includes(item.path)) {
        return item.key;
      }
    }
    
    // Default to dashboard if on base path
    if (currentPath === basePath || currentPath === `${basePath}/`) {
      return 'dashboard';
    }
    
    return 'dashboard';
  };

  const handleMenuClick = ({ key }) => {
    const item = navigationItems.find(nav => nav.key === key);
    if (item) {
      navigate(`${basePath}${item.path}`);
      // Close sidebar on mobile after navigation
      if (onClose) {
        onClose();
      }
    }
  };

  // Build menu items with Material Symbols icons
  const menuItems = navigationItems.map(item => ({
    key: item.key,
    icon: (
      <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
        {item.icon}
      </span>
    ),
    label: item.label,
  }));

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span className="material-symbols-rounded">
            ac_unit
          </span>
        </div>
        <span className="sidebar-logo-text">
          AirLoom
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={menuItems}
          className="sidebar-menu"
          style={{
            background: 'transparent',
            border: 'none',
          }}
        />
      </nav>

      {/* Footer / Version Info */}
      <div className="sidebar-footer">
        <p>AirLoom v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

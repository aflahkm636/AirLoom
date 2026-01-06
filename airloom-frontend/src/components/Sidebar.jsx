import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, notification } from 'antd';
import { useSelector } from 'react-redux';
import { selectUserPermissions } from '../features/auth/authSelectors';

// Navigation items with required permissions
const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '', permission: null },
  { key: 'customers', label: 'Customers', icon: 'groups', path: '/customers', permission: 'CUSTOMER_VIEW' },
  { key: 'employees', label: 'Employees', icon: 'badge', path: '/employees', permission: 'EMPLOYEE_VIEW' },
  { key: 'technicians', label: 'Technicians', icon: 'engineering', path: '/technicians', permission: 'TECHNICIAN_VIEW' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory_2', path: '/inventory', permission: 'INVENTORY_VIEW' },
  { key: 'billing', label: 'Billing', icon: 'receipt_long', path: '/billing', permission: 'BILLING_VIEW' },
  { key: 'subscriptions', label: 'Subscriptions', icon: 'card_membership', path: '/subscriptions', permission: 'SUBSCRIPTION_VIEW' },
  { key: 'subscription-plans', label: 'Plans', icon: 'format_list_bulleted', path: '/subscription-plans', permission: 'SUBSCRIPTION_PLAN_VIEW' },
  { key: 'service-tasks', label: 'Service Tasks', icon: 'calendar_month', path: '/service-tasks', permission: 'TASK_VIEW' },
  { key: 'complaints', label: 'Complaints', icon: 'report_problem', path: '/complaints', permission: 'COMPLAINT_VIEW' },
  { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings', permission: null },
];

const Sidebar = ({ userRole, isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = useSelector(selectUserPermissions);

  const basePath = `/${userRole?.toLowerCase() || 'admin'}`;
  const isAdmin = userRole?.toLowerCase() === 'admin';

  // Check if user has permission for an item
  const hasPermission = (permission) => {
    if (!permission) return true; // No permission required
    if (isAdmin) return true; // Admin has all permissions
    return permissions.includes(permission);
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    
    for (const item of navigationItems) {
      if (item.path && currentPath.includes(item.path)) {
        return item.key;
      }
    }
    
    if (currentPath === basePath || currentPath === `${basePath}/`) {
      return 'dashboard';
    }
    
    return 'dashboard';
  };

  const handleMenuClick = ({ key }) => {
    const item = navigationItems.find(nav => nav.key === key);
    if (!item) return;

    // Check permission before navigating
    if (!hasPermission(item.permission)) {
      notification.warning({
        message: 'Access Restricted',
        description: `You don't have permission to access ${item.label}.`,
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    navigate(`${basePath}${item.path}`);
    if (onClose) {
      onClose();
    }
  };

  // Build menu items with lock indicators for Staff
  const menuItems = navigationItems.map(item => {
    const locked = !hasPermission(item.permission);
    
    return {
      key: item.key,
      icon: (
        <span className="material-symbols-rounded" style={{ 
          fontSize: '20px',
          opacity: locked ? 0.4 : 1,
        }}>
          {item.icon}
        </span>
      ),
      label: (
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          opacity: locked ? 0.4 : 1,
        }}>
          {item.label}
          {locked && (
            <span className="material-symbols-rounded" style={{ 
              fontSize: '14px', 
              marginLeft: 8,
              color: '#6b7280',
            }}>
              lock
            </span>
          )}
        </span>
      ),
      disabled: false, // Keep clickable for toast feedback
    };
  });

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


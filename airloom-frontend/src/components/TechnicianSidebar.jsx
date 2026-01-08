import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

const technicianNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '' },
  { key: 'my-tasks', label: 'My Tasks', icon: 'assignment', path: '/my-tasks' },
  { key: 'my-complaints', label: 'My Complaints', icon: 'report_problem', path: '/my-complaints' },
];

const TechnicianSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = '/technician';

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    
    for (const item of technicianNavItems) {
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
    const item = technicianNavItems.find(nav => nav.key === key);
    if (!item) return;

    navigate(`${basePath}${item.path}`);
    if (onClose) {
      onClose();
    }
  };

  const menuItems = technicianNavItems.map(item => ({
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

export default TechnicianSidebar;

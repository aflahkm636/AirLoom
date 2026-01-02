import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { logout, fetchUserProfileAsync } from '../features/auth/authSlice';
import { selectUser } from '../features/auth/authSelectors';
import { API_BASE_URL } from '../utils/constants';

// Map routes to page titles
const pageTitles = {
  'dashboard': 'Dashboard',
  'customers': 'Customers',
  'inventory': 'Inventory',
  'billing': 'Billing',
  'service-tasks': 'Service Tasks',
  'settings': 'Settings',
};

const Header = ({ userName = 'John Doe', userRole = 'Admin', onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.id && !user.profileImage) {
      dispatch(fetchUserProfileAsync(user.id));
    }
  }, [dispatch, user?.id, user?.profileImage]);

  const profileImageUrl = user?.profileImage 
    ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE_URL}/${user.profileImage}`)
    : null;

  // Derive page title from current route
  const getPageTitle = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    // If only role in path (e.g., /admin), show Dashboard
    if (pathParts.length <= 1) {
      return 'Dashboard';
    }
    
    // Get the last meaningful segment
    const lastSegment = pathParts[pathParts.length - 1];
    return pageTitles[lastSegment] || 'Dashboard';
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7f13ec',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#182430',
      color: '#fff',
    });

    if (result.isConfirmed) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'settings') {
      const basePath = `/${userRole?.toLowerCase() || 'admin'}`;
      navigate(`${basePath}/settings`);
    }
  };

  // User dropdown menu items
  const userMenuItems = {
    items: [
      {
        key: 'profile',
        label: 'Profile',
        icon: <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>person</span>,
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>settings</span>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>logout</span>,
        danger: true,
      },
    ],
    onClick: handleMenuClick,
  };

  return (
    <header className="header">
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={onMenuToggle}>
          <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>
            menu
          </span>
        </button>

        {/* Page Title */}
        <div className="header-title">
          <h1>{getPageTitle()}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Notification Bell */}
        <button className="header-notification-btn">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <span className="material-symbols-rounded">
              notifications
            </span>
          </Badge>
        </button>

        {/* User Dropdown */}
        <Dropdown menu={userMenuItems} trigger={['click']} placement="bottomRight">
          <button className="header-user-btn">
            <Avatar
              size={32}
              src={profileImageUrl}
              icon={!profileImageUrl && <UserOutlined />}
              style={{
                background: profileImageUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
              }}
            >
              {!profileImageUrl && userName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="header-user-info">
              <p className="header-user-name">{userName}</p>
              <p className="header-user-role">{userRole}</p>
            </div>
            <span className="material-symbols-rounded">
              expand_more
            </span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUserName } from '../features/auth/authSelectors';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const userRole = useSelector(selectUserRole);
  const userName = useSelector(selectUserName);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Fixed Sidebar */}
      <Sidebar 
        userRole={userRole} 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area - offset by sidebar width */}
      <div className="dashboard-main">
        {/* Sticky Header */}
        <Header 
          userName={userName} 
          userRole={userRole}
          onMenuToggle={toggleSidebar}
        />

        {/* Scrollable Content Area */}
        <main className="dashboard-content">
          <div className="dashboard-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

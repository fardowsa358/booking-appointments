import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: 'fas fa-chart-pie',
      exact: true
    },
    {
      title: 'Appointments',
      path: '/admin/appointments',
      icon: 'fas fa-calendar-alt'
    },
    {
      title: 'Doctors',
      path: '/admin/doctors',
      icon: 'fas fa-user-md'
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: 'fas fa-users'
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      icon: 'fas fa-chart-bar'
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: 'fas fa-cog'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-hospital"></i>
            <h3>MediCare Admin</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
    </>
  );
};

export default AdminSidebar;

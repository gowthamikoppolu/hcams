import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const getLinks = () => {
    switch(role) {
      case 'PATIENT':
        return [
          { to: '/patient/dashboard', icon: '🏠', label: 'Dashboard' },
          { to: '/patient/book-appointment', icon: '📅', label: 'Book Appointment' },
          { to: '/patient/appointments', icon: '📋', label: 'My Appointments' },
          { to: '/patient/medical-records', icon: '📊', label: 'Medical Records' },
        ];
      case 'DOCTOR':
        return [
          { to: '/doctor/dashboard', icon: '🏠', label: 'Dashboard' },
          { to: '/doctor/appointments', icon: '📋', label: 'Appointments' },
          { to: '/doctor/medical-records', icon: '📊', label: 'Medical Records' },
        ];
      case 'RECEPTIONIST':
        return [
          { to: '/receptionist/dashboard', icon: '🏠', label: 'Dashboard' },
        ];
      default: return [];
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <nav className="sidebar-nav">
        {getLinks().map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
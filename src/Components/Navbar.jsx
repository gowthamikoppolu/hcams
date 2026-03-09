import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const userRole = AuthService.getCurrentRole();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch(userRole) {
      case 'PATIENT': return '/patient/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'RECEPTIONIST': return '/receptionist/dashboard';
      default: return '/login';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={getDashboardLink()}>HCAMS</Link>
      </div>
      <div className="navbar-menu">
        {currentUser && (
          <>
            <span className="navbar-user">
              Welcome, {currentUser.fullName} ({userRole})
            </span>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
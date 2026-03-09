import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import AppointmentService from '../services/AppointmentService';
import '../App.css';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await AppointmentService.getPatientAppointments(currentUser.id);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar role="PATIENT" />
        <div className="dashboard-content">
          <h1>Welcome, {currentUser?.fullName}</h1>
          
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/patient/book-appointment" className="action-btn">
                Book Appointment
              </Link>
              <Link to="/patient/medical-records" className="action-btn">
                View Medical Records
              </Link>
            </div>
          </div>

          <h2>Your Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments found</p>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className="appointment-card">
                <p>Dr. {apt.doctorName} - {new Date(apt.appointmentTime).toLocaleString()}</p>
                <p>Status: {apt.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import httpService from '../services/HttpService';
import '../App.css';

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await httpService.get('/receptionist/appointments');
      setAppointments(response.data);
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
        <Sidebar role="RECEPTIONIST" />
        <div className="dashboard-content">
          <h1>Welcome, {currentUser?.fullName}</h1>
          
          <h2>All Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments found</p>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className="appointment-card">
                <p>Patient: {apt.patientName}</p>
                <p>Doctor: Dr. {apt.doctorName}</p>
                <p>Time: {new Date(apt.appointmentTime).toLocaleString()}</p>
                <p>Status: {apt.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
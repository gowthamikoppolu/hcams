import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import AppointmentService from '../services/AppointmentService';
import '../App.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await AppointmentService.getDoctorAppointments(currentUser.id);
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
        <Sidebar role="DOCTOR" />
        <div className="dashboard-content">
          <h1>Welcome, Dr. {currentUser?.fullName}</h1>
          
          <h2>Today's Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments found</p>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className="appointment-card">
                <p>Patient: {apt.patientName}</p>
                <p>Time: {new Date(apt.appointmentTime).toLocaleString()}</p>
                <p>Status: {apt.status}</p>
                <Link to={`/doctor/medical-record/add?patientId=${apt.patientId}`}>
                  Add Medical Record
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
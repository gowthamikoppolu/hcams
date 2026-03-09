import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import httpService from '../services/HttpService';
import '../App.css';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await httpService.get('/patient/doctors');
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to load doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentDateTime = `${appointmentDate} ${appointmentTime}:00`;
      await httpService.post(
        `/patient/appointment?patientId=${currentUser.id}&doctorId=${selectedDoctor}`,
        { appointmentTime: appointmentDateTime }
      );
      navigate('/patient/dashboard');
    } catch (err) {
      setError('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar role="PATIENT" />
        <div className="dashboard-content">
          <h1>Book Appointment</h1>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Doctor</label>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.fullName} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import AppointmentService from '../services/AppointmentService';
import '../App.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, UPCOMING, PAST, CANCELLED
  
  const currentUser = AuthService.getCurrentUser();
  const userRole = AuthService.getCurrentRole();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data;
      if (userRole === 'PATIENT') {
        data = await AppointmentService.getPatientAppointments(currentUser.id);
      } else if (userRole === 'DOCTOR') {
        data = await AppointmentService.getDoctorAppointments(currentUser.id);
      } else if (userRole === 'RECEPTIONIST') {
        data = await AppointmentService.getAllAppointments();
      }
      
      // Sort appointments by date (most recent first)
      data.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    
    switch(filter) {
      case 'UPCOMING':
        return appointments.filter(apt => 
          apt.status === 'SCHEDULED' && new Date(apt.appointmentTime) > now
        );
      case 'PAST':
        return appointments.filter(apt => 
          apt.status === 'COMPLETED' || new Date(apt.appointmentTime) < now
        );
      case 'CANCELLED':
        return appointments.filter(apt => apt.status === 'CANCELLED');
      default:
        return appointments;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await AppointmentService.updateAppointmentStatus(appointmentId, 'CANCELLED');
        fetchAppointments(); // Refresh the list
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = filterAppointments();

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar role={userRole} />
          <div className="dashboard-content">
            <div className="loading">Loading appointments...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar role={userRole} />
        <div className="dashboard-content">
          <div className="page-header">
            <h1>My Appointments</h1>
            {userRole === 'PATIENT' && (
              <Link to="/patient/book-appointment" className="btn-primary" style={{ width: 'auto' }}>
                Book New Appointment
              </Link>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Filter Buttons */}
          <div className="filter-buttons" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: filter === 'ALL' ? '#667eea' : 'white',
                color: filter === 'ALL' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'UPCOMING' ? 'active' : ''}`}
              onClick={() => setFilter('UPCOMING')}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: filter === 'UPCOMING' ? '#667eea' : 'white',
                color: filter === 'UPCOMING' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Upcoming
            </button>
            <button 
              className={`filter-btn ${filter === 'PAST' ? 'active' : ''}`}
              onClick={() => setFilter('PAST')}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: filter === 'PAST' ? '#667eea' : 'white',
                color: filter === 'PAST' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Past
            </button>
            <button 
              className={`filter-btn ${filter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setFilter('CANCELLED')}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: filter === 'CANCELLED' ? '#667eea' : 'white',
                color: filter === 'CANCELLED' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Cancelled
            </button>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>No appointments found</p>
              {userRole === 'PATIENT' && (
                <Link to="/patient/book-appointment" className="btn-primary" style={{ width: 'auto', marginTop: '20px' }}>
                  Book Your First Appointment
                </Link>
              )}
            </div>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card" style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  border: appointment.status === 'CANCELLED' ? '2px solid #dc3545' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        {userRole === 'PATIENT' ? `Dr. ${appointment.doctorName}` : appointment.patientName}
                      </h3>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Date:</strong> {new Date(appointment.appointmentTime).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Time:</strong> {new Date(appointment.appointmentTime).toLocaleTimeString()}
                      </p>
                      {userRole === 'DOCTOR' && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          <strong>Patient:</strong> {appointment.patientName}
                        </p>
                      )}
                      {userRole === 'RECEPTIONIST' && (
                        <>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <strong>Patient:</strong> {appointment.patientName}
                          </p>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <strong>Doctor:</strong> Dr. {appointment.doctorName}
                          </p>
                        </>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`} style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        background: appointment.status === 'SCHEDULED' ? '#cce5ff' : 
                                  appointment.status === 'COMPLETED' ? '#d4edda' : '#f8d7da',
                        color: appointment.status === 'SCHEDULED' ? '#004085' :
                               appointment.status === 'COMPLETED' ? '#155724' : '#721c24'
                      }}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    {appointment.status === 'SCHEDULED' && userRole === 'PATIENT' && (
                      <>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="btn-danger"
                          style={{
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel Appointment
                        </button>
                        <button 
                          className="btn-secondary"
                          style={{
                            padding: '8px 16px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Reschedule
                        </button>
                      </>
                    )}

                    {appointment.status === 'SCHEDULED' && userRole === 'DOCTOR' && (
                      <Link 
                        to={`/doctor/medical-record/add?patientId=${appointment.patientId}&appointmentId=${appointment.id}`}
                        className="btn-primary"
                        style={{
                          padding: '8px 16px',
                          background: '#28a745',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '5px',
                          display: 'inline-block'
                        }}
                      >
                        Add Medical Record
                      </Link>
                    )}

                    {userRole === 'RECEPTIONIST' && appointment.status === 'SCHEDULED' && (
                      <>
                        <button 
                          className="btn-secondary"
                          style={{
                            padding: '8px 16px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="btn-danger"
                          style={{
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === 'COMPLETED' && userRole === 'PATIENT' && (
                      <Link 
                        to={`/patient/medical-records`}
                        className="btn-primary"
                        style={{
                          padding: '8px 16px',
                          background: '#007bff',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '5px',
                          display: 'inline-block'
                        }}
                      >
                        View Medical Record
                      </Link>
                    )}
                  </div>

                  {/* Additional Info for Completed Appointments */}
                  {appointment.status === 'COMPLETED' && appointment.medicalRecord && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Medical Record</h4>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Diagnosis:</strong> {appointment.medicalRecord.diagnosis}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Prescription:</strong> {appointment.medicalRecord.prescription}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary Section */}
          {appointments.length > 0 && (
            <div className="appointment-summary" style={{
              marginTop: '30px',
              padding: '20px',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                    {appointments.filter(a => a.status === 'SCHEDULED').length}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Upcoming</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {appointments.filter(a => a.status === 'COMPLETED').length}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                    {appointments.filter(a => a.status === 'CANCELLED').length}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Cancelled</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>
                    {appointments.length}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;
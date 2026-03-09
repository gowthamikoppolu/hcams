import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import BookAppointment from './pages/BookAppointment';
import ViewAppointments from './pages/ViewAppointments';
import MedicalRecords from './pages/MedicalRecords';
import AddMedicalRecord from './pages/AddMedicalRecord';
import AuthService from './services/AuthService';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getCurrentRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/book-appointment" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <BookAppointment />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <ViewAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient/medical-records" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MedicalRecords />
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <ViewAppointments />
            </ProtectedRoute>
          } />
          <Route path="/doctor/medical-records" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <MedicalRecords />
            </ProtectedRoute>
          } />
          <Route path="/doctor/medical-record/add" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <AddMedicalRecord />
            </ProtectedRoute>
          } />

          {/* Receptionist Routes */}
          <Route path="/receptionist/dashboard" element={
            <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
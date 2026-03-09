import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../App.css';

const RegisterPage = () => {
  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', fullName: '',
    dateOfBirth: '', bloodGroup: '', allergies: '',
    specialty: '', experience: '', qualification: '',
    department: '', shift: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let registrationData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName
      };

      if (role === 'PATIENT') {
        registrationData = {
          ...registrationData,
          dateOfBirth: formData.dateOfBirth,
          bloodGroup: formData.bloodGroup,
          allergies: formData.allergies
        };
      } else if (role === 'DOCTOR') {
        registrationData = {
          ...registrationData,
          specialty: formData.specialty,
          experience: parseInt(formData.experience),
          qualification: formData.qualification
        };
      } else if (role === 'RECEPTIONIST') {
        registrationData = {
          ...registrationData,
          department: formData.department,
          shift: formData.shift
        };
      }

      await AuthService.register(registrationData, role);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Healthcare Management System</h2>
        <h3>Register</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Register as:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          <div className="form-group">
            <label>Username*</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Full Name*</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          {role === 'PATIENT' && (
            <>
              <div className="form-group">
                <label>Date of Birth*</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2" />
              </div>
            </>
          )}

          {role === 'DOCTOR' && (
            <>
              <div className="form-group">
                <label>Specialty*</label>
                <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Experience (years)*</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Qualification*</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
              </div>
            </>
          )}

          {role === 'RECEPTIONIST' && (
            <>
              <div className="form-group">
                <label>Department*</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Shift*</label>
                <select name="shift" value={formData.shift} onChange={handleChange} required>
                  <option value="">Select Shift</option>
                  <option value="MORNING">Morning</option>
                  <option value="AFTERNOON">Afternoon</option>
                  <option value="NIGHT">Night</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
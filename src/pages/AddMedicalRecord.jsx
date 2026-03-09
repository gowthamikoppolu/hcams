import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import httpService from '../services/HttpService';
import '../App.css';

const AddMedicalRecord = () => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    prescription: '',
    notes: '',
    followUpDate: '',
    followUpRequired: false
  });
  
  const [patientDetails, setPatientDetails] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();
  
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  const appointmentId = queryParams.get('appointmentId');

  useEffect(() => {
    if (!patientId) {
      setError('No patient selected');
      setFetchingData(false);
      return;
    }
    fetchPatientAndAppointmentDetails();
  }, [patientId, appointmentId]);

  const fetchPatientAndAppointmentDetails = async () => {
    setFetchingData(true);
    try {
      // Fetch patient details
      const patientResponse = await httpService.get(`/patient/${patientId}`);
      setPatientDetails(patientResponse.data);

      // Fetch appointment details if appointmentId exists
      if (appointmentId) {
        const appointmentResponse = await httpService.get(`/appointment/${appointmentId}`);
        setAppointmentDetails(appointmentResponse.data);
      }
    } catch (err) {
      setError('Failed to load patient details');
      console.error('Error fetching details:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'Diagnosis is required';
    } else if (formData.diagnosis.length < 5) {
      errors.diagnosis = 'Diagnosis must be at least 5 characters';
    }
    
    if (!formData.prescription.trim()) {
      errors.prescription = 'Prescription is required';
    } else if (formData.prescription.length < 10) {
      errors.prescription = 'Prescription must be at least 10 characters';
    }
    
    if (formData.followUpRequired && !formData.followUpDate) {
      errors.followUpDate = 'Follow-up date is required when follow-up is needed';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create medical record
      const recordData = {
        diagnosis: formData.diagnosis,
        prescription: formData.prescription,
        notes: formData.notes,
        date: new Date().toISOString(),
        patientId: parseInt(patientId),
        doctorId: currentUser.id,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate || null
      };

      const response = await httpService.post(
        `/doctor/medical-record?patientId=${patientId}&doctorId=${currentUser.id}`,
        recordData
      );

      // If appointmentId is provided, mark appointment as completed
      if (appointmentId) {
        await httpService.put(`/appointment/${appointmentId}/status`, { 
          status: 'COMPLETED' 
        });
      }

      setSuccess('Medical record added successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medical record');
      console.error('Error adding medical record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved data will be lost.')) {
      navigate('/doctor/dashboard');
    }
  };

  if (fetchingData) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar role="DOCTOR" />
          <div className="dashboard-content">
            <div className="loading">Loading patient details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar role="DOCTOR" />
        <div className="dashboard-content">
          <div className="page-header" style={{ marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Add Medical Record</h1>
            <p style={{ color: '#666', margin: 0 }}>Create a new medical record for patient</p>
          </div>

          {/* Patient Information Card */}
          {patientDetails && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '25px',
              borderRadius: '10px',
              marginBottom: '30px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', opacity: 0.9 }}>Patient Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Patient Name</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>{patientDetails.fullName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Date of Birth</div>
                  <div style={{ fontSize: '16px' }}>{new Date(patientDetails.dateOfBirth).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Blood Group</div>
                  <div style={{ fontSize: '16px' }}>{patientDetails.bloodGroup || 'Not specified'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Patient ID</div>
                  <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{patientDetails.id}</div>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Information (if available) */}
          {appointmentDetails && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px' }}>Appointment Details</h3>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Date: </span>
                  <span style={{ color: '#333', fontWeight: '500' }}>
                    {new Date(appointmentDetails.appointmentTime).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Time: </span>
                  <span style={{ color: '#333', fontWeight: '500' }}>
                    {new Date(appointmentDetails.appointmentTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="error-message" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message" style={{ marginBottom: '20px' }}>
              {success}
            </div>
          )}

          {/* Medical Record Form */}
          <form onSubmit={handleSubmit} style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Diagnosis Field */}
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333', 
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Diagnosis <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter primary diagnosis (e.g., Acute Bronchitis, Hypertension)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: validationErrors.diagnosis ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '15px',
                  transition: 'border-color 0.3s'
                }}
              />
              {validationErrors.diagnosis && (
                <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                  {validationErrors.diagnosis}
                </p>
              )}
            </div>

            {/* Prescription Field */}
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333', 
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Prescription <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                placeholder="Enter prescription details (medications, dosage, duration)"
                rows="5"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: validationErrors.prescription ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '15px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {validationErrors.prescription && (
                <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                  {validationErrors.prescription}
                </p>
              )}
              <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                Include medication names, dosage, frequency, and duration
              </p>
            </div>

            {/* Additional Notes Field */}
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333', 
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes, observations, or recommendations"
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '15px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Follow-up Section */}
            <div style={{ 
              marginBottom: '30px', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '8px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <input
                  type="checkbox"
                  name="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={handleChange}
                  id="followUpRequired"
                  style={{ width: '18px', height: '18px', marginRight: '10px', cursor: 'pointer' }}
                />
                <label htmlFor="followUpRequired" style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                  Follow-up Required
                </label>
              </div>

              {formData.followUpRequired && (
                <div style={{ marginLeft: '28px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: '#555', 
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: '10px',
                      border: validationErrors.followUpDate ? '2px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      width: '200px'
                    }}
                  />
                  {validationErrors.followUpDate && (
                    <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                      {validationErrors.followUpDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'flex-end',
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                style={{
                  padding: '12px 25px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#5a6268'}
                onMouseLeave={(e) => e.target.style.background = '#6c757d'}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '12px 25px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Medical Record'}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#e8f4fd',
            borderRadius: '8px',
            borderLeft: '4px solid #007bff'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0056b3', fontSize: '15px' }}>
              📝 Tips for creating a good medical record:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#0056b3', fontSize: '14px' }}>
              <li>Be specific and detailed in diagnosis</li>
              <li>Include complete prescription with dosage and duration</li>
              <li>Note any allergies or adverse reactions</li>
              <li>Mention follow-up requirements if needed</li>
              <li>Document any important patient observations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;

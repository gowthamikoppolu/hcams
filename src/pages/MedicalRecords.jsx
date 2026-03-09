import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthService from '../services/AuthService';
import httpService from '../services/HttpService';
import '../App.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('ALL');
  
  const currentUser = AuthService.getCurrentUser();
  const userRole = AuthService.getCurrentRole();

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (userRole === 'PATIENT') {
        response = await httpService.get(`/patient/medical-records?patientId=${currentUser.id}`);
      } else if (userRole === 'DOCTOR') {
        response = await httpService.get(`/doctor/medical-records?doctorId=${currentUser.id}`);
      }
      
      // Sort records by date (most recent first)
      const sortedRecords = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(sortedRecords);
    } catch (err) {
      setError('Failed to load medical records');
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (filterDate !== 'ALL') {
      const now = new Date();
      const filterDateObj = new Date();
      
      switch(filterDate) {
        case 'LAST_30_DAYS':
          filterDateObj.setDate(now.getDate() - 30);
          filtered = filtered.filter(record => new Date(record.date) >= filterDateObj);
          break;
        case 'LAST_3_MONTHS':
          filterDateObj.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(record => new Date(record.date) >= filterDateObj);
          break;
        case 'LAST_6_MONTHS':
          filterDateObj.setMonth(now.getMonth() - 6);
          filtered = filtered.filter(record => new Date(record.date) >= filterDateObj);
          break;
        case 'LAST_YEAR':
          filterDateObj.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(record => new Date(record.date) >= filterDateObj);
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getConditionColor = (diagnosis) => {
    // Simple color coding based on keywords
    const lowerDiagnosis = diagnosis.toLowerCase();
    if (lowerDiagnosis.includes('flu') || lowerDiagnosis.includes('cold')) return '#ffc107';
    if (lowerDiagnosis.includes('diabetes')) return '#17a2b8';
    if (lowerDiagnosis.includes('hypertension') || lowerDiagnosis.includes('blood pressure')) return '#dc3545';
    if (lowerDiagnosis.includes('fracture') || lowerDiagnosis.includes('broken')) return '#fd7e14';
    return '#28a745';
  };

  const filteredRecords = filterRecords();

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar role={userRole} />
          <div className="dashboard-content">
            <div className="loading">Loading medical records...</div>
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
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>Medical Records</h1>
              <p style={{ color: '#666', margin: 0 }}>
                {userRole === 'PATIENT' ? 'Your complete medical history' : 'Medical records you have created'}
              </p>
            </div>
            {userRole === 'PATIENT' && (
              <div style={{ fontSize: '14px', color: '#666' }}>
                Total Records: <strong>{records.length}</strong>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Search and Filter Section */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '30px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Search Records
                </label>
                <input
                  type="text"
                  placeholder="Search by diagnosis, doctor, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                  Time Period
                </label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                >
                  <option value="ALL">All Time</option>
                  <option value="LAST_30_DAYS">Last 30 Days</option>
                  <option value="LAST_3_MONTHS">Last 3 Months</option>
                  <option value="LAST_6_MONTHS">Last 6 Months</option>
                  <option value="LAST_YEAR">Last Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Records List */}
          {filteredRecords.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              background: 'white', 
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', opacity: '0.5' }}>📋</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>No Medical Records Found</h3>
              <p style={{ color: '#666' }}>
                {userRole === 'PATIENT' 
                  ? "You don't have any medical records yet. They will appear here after your doctor visits."
                  : "You haven't created any medical records yet."}
              </p>
              {userRole === 'DOCTOR' && (
                <Link 
                  to="/doctor/appointments" 
                  className="btn-primary" 
                  style={{ width: 'auto', marginTop: '20px', display: 'inline-block' }}
                >
                  View Appointments
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '30px' 
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{filteredRecords.length}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Showing Records</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {new Set(filteredRecords.map(r => r.doctorName)).size}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Doctors Consulted</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {new Date().getFullYear() - new Date(filteredRecords[filteredRecords.length - 1]?.date).getFullYear()}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Years of History</div>
                </div>
              </div>

              {/* Records Timeline */}
              <div className="medical-records-list">
                {filteredRecords.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="medical-record-card"
                    style={{
                      background: 'white',
                      borderRadius: '10px',
                      marginBottom: '20px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '15px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ 
                          background: 'rgba(255,255,255,0.2)',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          Record #{records.length - index}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {formatDate(record.date)}
                        </span>
                      </div>
                      {userRole === 'PATIENT' ? (
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                          Dr. {record.doctorName}
                        </span>
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                          Patient: {record.patientName}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px' }}>
                      {/* Diagnosis with Color Tag */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: getConditionColor(record.diagnosis)
                          }}></span>
                          <h4 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Diagnosis</h4>
                        </div>
                        <p style={{ 
                          margin: '0 0 0 22px', 
                          color: '#555',
                          lineHeight: '1.6',
                          fontSize: '15px'
                        }}>
                          {record.diagnosis}
                        </p>
                      </div>

                      {/* Prescription */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 22px', color: '#333', fontSize: '16px' }}>Prescription</h4>
                        <p style={{ 
                          margin: '0 0 0 22px', 
                          color: '#555',
                          lineHeight: '1.6',
                          fontSize: '15px',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {record.prescription}
                        </p>
                      </div>

                      {/* Notes (if any) */}
                      {record.notes && (
                        <div style={{ 
                          marginTop: '15px',
                          padding: '15px',
                          background: '#f8f9fa',
                          borderRadius: '5px',
                          borderLeft: '4px solid #ffc107'
                        }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '15px' }}>Additional Notes</h4>
                          <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                            {record.notes}
                          </p>
                        </div>
                      )}

                      {/* Tags/Categories */}
                      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {record.diagnosis.split(' ').slice(0, 3).map((word, i) => (
                          <span key={i} style={{
                            padding: '3px 8px',
                            background: '#e9ecef',
                            borderRadius: '15px',
                            fontSize: '11px',
                            color: '#495057'
                          }}>
                            #{word.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: '15px 20px',
                      background: '#f8f9fa',
                      borderTop: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      <span>Record ID: {record.id}</span>
                      {userRole === 'PATIENT' && (
                        <button
                          onClick={() => window.print()}
                          style={{
                            padding: '5px 15px',
                            background: 'transparent',
                            border: '1px solid #007bff',
                            color: '#007bff',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#007bff';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#007bff';
                          }}
                        >
                          Print Record
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline View (for patients) */}
              {userRole === 'PATIENT' && records.length > 5 && (
                <div style={{
                  marginTop: '40px',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Medical Timeline</h3>
                  <div style={{ position: 'relative', paddingLeft: '30px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '7px',
                      top: '0',
                      bottom: '0',
                      width: '2px',
                      background: '#e0e0e0'
                    }}></div>
                    
                    {records.slice(0, 5).map((record, index) => (
                      <div key={record.id} style={{ position: 'relative', marginBottom: '20px' }}>
                        <div style={{
                          position: 'absolute',
                          left: '-30px',
                          top: '0',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: getConditionColor(record.diagnosis),
                          border: '3px solid white',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}></div>
                        <div style={{
                          background: '#f8f9fa',
                          padding: '15px',
                          borderRadius: '8px'
                        }}>
                          <span style={{ fontSize: '12px', color: '#007bff', fontWeight: '600' }}>
                            {formatDate(record.date)}
                          </span>
                          <h4 style={{ margin: '5px 0', color: '#333' }}>{record.diagnosis}</h4>
                          <p style={{ margin: 0, color: '#666' }}>Dr. {record.doctorName}</p>
                        </div>
                      </div>
                    ))}
                    
                    {records.length > 5 && (
                      <div style={{
                        textAlign: 'center',
                        padding: '10px',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        color: '#666'
                      }}>
                        +{records.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
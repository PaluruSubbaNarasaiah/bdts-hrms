import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import './styles.css';

const AdminTimings = () => {
  const [punchTimings, setPunchTimings] = useState([]);
  const [loginTimings, setLoginTimings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllTimings();
  }, []);

  const fetchAllTimings = async () => {
    setLoading(true);
    try {
      const [punchResponse, loginResponse] = await Promise.all([
        apiCall({ action: 'getAllTimings' }),
        apiCall({ action: 'getAllLoginTimings' })
      ]);
      console.log('Punch Response:', punchResponse);
      console.log('Login Response:', loginResponse);
      setPunchTimings(punchResponse.timings || []);
      setLoginTimings(loginResponse.timings || []);
    } catch (error) {
      console.error('Failed to fetch timings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-timings">
      <div className="section-title">Today's Employee Timings</div>
      <button onClick={fetchAllTimings} style={{marginBottom: '15px', width: 'auto', padding: '8px 16px'}}>Refresh</button>
      
      {loading ? (
        <div className="loading">Loading timings...</div>
      ) : (
        <div className="timings-grid">
          <div className="timing-section">
            <h4>1. Login Timings</h4>
            <div className="timings-list">
              {loginTimings.length === 0 ? (
                <div className="no-data">No login data available</div>
              ) : (
                loginTimings.map((timing, index) => (
                  <div key={index} className="timing-card">
                    <div className="employee-name">{timing.name} ({timing.empId})</div>
                    <div className="timing-details">
                      <span>Login: {timing.loginTime || 'N/A'}</span>
                      <span>Logout: {timing.logoutTime || 'N/A'}</span>
                      <span>Total: {timing.totalTime || '0h'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="timing-section">
            <h4>2. Punch Timings</h4>
            <div className="timings-list">
              {punchTimings.length === 0 ? (
                <div className="no-data">No punch data available</div>
              ) : (
                punchTimings.map((timing, index) => (
                  <div key={index} className="timing-card">
                    <div className="employee-name">{timing.name} ({timing.empId})</div>
                    <div className="timing-details">
                      <span>In: {timing.punchIn || 'N/A'}</span>
                      <span>Out: {timing.punchOut || 'N/A'}</span>
                      <span>Total: {timing.totalHours || '0h'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimings;
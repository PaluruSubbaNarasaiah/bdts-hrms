import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const data = await apiCall({ action: 'analytics' });
        setStats(data);
      } catch (error) {
        setError('Failed to load analytics data');
      }
    };

    fetchAnalytics();
  }, [navigate]);

  return (
    <div className="analytics">
      <div className="card">
        <h2>Admin Analytics</h2>
        <button onClick={() => navigate('/admin')}>Back to Admin</button>
        
        {error && <p className="error">{error}</p>}
        
        {stats && (
          <div className="stats">
            <div className="stat-item">
              <h3>Employees</h3>
              <p>{stats.employees}</p>
            </div>
            <div className="stat-item">
              <h3>Total Attendance</h3>
              <p>{stats.attendance}</p>
            </div>
            <div className="stat-item">
              <h3>Pending Leaves</h3>
              <p>{stats.pendingLeaves}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
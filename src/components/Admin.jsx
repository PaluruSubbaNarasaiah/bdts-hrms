import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import AdminTimings from './AdminTimings';
import Navbar from './Navbar';

const Admin = () => {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/');
    }
    fetchAllLeaves();
  }, [navigate]);

  const fetchAllLeaves = async () => {
    try {
      const response = await apiCall({ action: 'getAllLeaves' });
      setLeaves(response.leaves || []);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
  };

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await apiCall({
        action: 'updateLeaveStatus',
        leaveId,
        status
      });
      setMessage(`Leave ${status.toLowerCase()} successfully`);
      fetchAllLeaves();
    } catch (error) {
      setMessage('Failed to update leave status');
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!empId || !name || !email || !password) {
      setMessage('Please fill all fields');
      return;
    }

    if (!email.includes('@')) {
      setMessage('Please enter a valid email');
      return;
    }

    try {
      await apiCall({
        action: 'addEmployee',
        empId,
        name,
        email,
        password
      });
      setMessage('Employee added successfully');
      setEmpId('');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage('Failed to add employee');
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="admin" style={{ paddingTop: '80px' }}>
      <Navbar />
      <div className="card">
        <h2>Admin Dashboard</h2>
        <h3>Basel Dynamic Tech Solutions Pvt Ltd.</h3>
        
        <AdminTimings />
        
        <div className="admin-layout">
          <div className="admin-main-card">
            <div className="section-title">Add Employee</div>
            <form onSubmit={addEmployee}>
              <input
                type="text"
                placeholder="Employee ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Add Employee</button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>

          <div className="admin-side-panel">
            <div className="section-title">Leave Applications</div>
            <div className="leave-management">
              {leaves.length > 0 ? leaves.map((leave, index) => (
                <div key={index} className="admin-leave-item">
                  <div className="leave-info">
                    <strong>{leave.name}</strong> ({leave.empId})
                    <div>{leave.from} to {leave.to}</div>
                    <div className="leave-reason">{leave.reason}</div>
                    <div className={`leave-status ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </div>
                  </div>
                  {leave.status === 'Pending' && (
                    <div className="leave-actions">
                      <button
                        className="approve-btn"
                        onClick={() => updateLeaveStatus(index, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => updateLeaveStatus(index, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )) : (
                <p>No leave applications found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
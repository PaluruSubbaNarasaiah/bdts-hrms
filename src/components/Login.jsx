import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithTiming } from '../utils/api';
import Loading from './Loading';
import './Login.css';

const Login = () => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!empId || !password) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginWithTiming(empId, password);

      console.log('API Response:', data);

      if (data && data.status === 'success') {
        sessionStorage.setItem('empId', empId);
        sessionStorage.setItem('name', data.name || 'User');
        sessionStorage.setItem('role', data.role || 'employee');
        navigate(data.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setMessage('Invalid Credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="form-header">
          <div className="logo-container">
            <img src="/assets/BDTS-modified.png" alt="BDTS Logo" className="logo" />
          </div>
          <h2>Basel Dynamic Tech Solutions</h2>
          <p>Employee HRMS Portal</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
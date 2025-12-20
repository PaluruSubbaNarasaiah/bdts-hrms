import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithTiming } from '../utils/api';
import Loading from './Loading';
import './Login.css';

const Login = () => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setMessage('');

    try {
      const data = await loginWithTiming(empId, password);

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
            <img
              src="/assets/BDTS-modified.png"
              alt="BDTS Logo"
              className="logo"
            />
          </div>
          <h2>Basel Dynamic Tech Solutions</h2>
          <p>Employee HRMS Portal</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Employee ID */}
          <div className="input-group">
            <input
              type="text"
              id="empId"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="empId">Employee ID</label>
          </div>

          {/* Password */}
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import Analytics from './components/Analytics';
import FaceAttendance from './components/FaceAttendance';
import NetworkError from './components/NetworkError';
import { setNetworkErrorCallback } from './utils/api';
import './App.css';

function App() {
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    setNetworkErrorCallback(setNetworkError);
  }, []);

  const handleRetry = () => {
    setNetworkError(null);
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/face-attendance" element={<FaceAttendance />} />
        </Routes>
        
        <NetworkError 
          error={networkError} 
          onRetry={handleRetry}
        />
      </div>
    </Router>
  );
}

export default App
import { useState, useEffect } from 'react';
import './styles.css';

const TimeTracking = () => {
  const [loginTime, setLoginTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalTime, setTotalTime] = useState('');

  useEffect(() => {
    const storedLoginTime = sessionStorage.getItem('loginTime');
    if (storedLoginTime) {
      setLoginTime(new Date(storedLoginTime).toLocaleTimeString());
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (storedLoginTime) {
        const loginDate = new Date(storedLoginTime);
        const diff = now - loginDate;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTotalTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="time-tracking">
      <h3>Real-Time Tracking</h3>
      <div className="time-info">
        <div className="time-item">
          <span>Login: {loginTime || 'Not logged in'}</span>
        </div>
        <div className="time-item current-time">
          <span>Current: {formatTime(currentTime)}</span>
        </div>
        <div className="time-item">
          <span>Duration: {totalTime || '00:00:00'}</span>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
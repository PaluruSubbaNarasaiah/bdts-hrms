import { useState, useEffect } from 'react';
import { punchIn, punchOut, breakStart, breakEnd, getTimings } from '../utils/api';
import './styles.css';

const PunchTimings = () => {
  const [timings, setTimings] = useState({
    punchIn: null,
    punchOut: null,
    breakStart: null,
    breakEnd: null,
    totalHours: null
  });
  const [message, setMessage] = useState('');
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    fetchTimings();
  }, []);

  const fetchTimings = async () => {
    try {
      const data = await getTimings();
      console.log('Fetched timings:', data);
      setTimings(data || {});
      setOnBreak(data?.breakStart && !data?.breakEnd);
    } catch (error) {
      console.error('Failed to fetch timings:', error);
      setTimings({});
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePunchIn = async () => {
    try {
      const response = await punchIn();
      console.log('Punch in response:', response);
      const time = response.time || getCurrentTime();
      setMessage(`Punched In at ${time}`);
      
      // Update local state immediately
      setTimings(prev => ({ ...prev, punchIn: time }));
      
    } catch (error) {
      console.error('Punch in error:', error);
      setMessage('Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      const response = await punchOut();
      console.log('Punch out response:', response);
      const time = response.time || getCurrentTime();
      setMessage(`Punched Out at ${time}`);
      
      // Update local state immediately
      setTimings(prev => ({ ...prev, punchOut: time }));
      
    } catch (error) {
      console.error('Punch out error:', error);
      setMessage('Failed to punch out');
    }
  };

  const handleBreakStart = async () => {
    try {
      const response = await breakStart();
      const time = response.time || getCurrentTime();
      setMessage(`Break Started at ${time}`);
      setOnBreak(true);
      
      // Update local state immediately
      setTimings(prev => ({ ...prev, breakStart: time }));
      
    } catch (error) {
      setMessage('Failed to start break');
    }
  };

  const handleBreakEnd = async () => {
    try {
      const response = await breakEnd();
      const time = response.time || getCurrentTime();
      setMessage(`Break Ended at ${time}`);
      setOnBreak(false);
      
      // Update local state immediately
      setTimings(prev => ({ ...prev, breakEnd: time }));
      
    } catch (error) {
      setMessage('Failed to end break');
    }
  };

  return (
    <div className="punch-timings">
      <div className="section-title">Today's Timings</div>
      
      <div className="timing-display">
        <div className="timing-item">
          <span>Punch In: {timings?.punchIn || 'Not punched in'}</span>
        </div>
        <div className="timing-item">
          <span>Punch Out: {timings?.punchOut || 'Not punched out'}</span>
        </div>
        <div className="timing-item">
          <span>Break Start: {timings?.breakStart || 'No break taken'}</span>
        </div>
        <div className="timing-item">
          <span>Break End: {timings?.breakEnd || 'Break not ended'}</span>
        </div>
        <div className="timing-item">
          <span>Total Hours: {timings?.totalHours || '0h'}</span>
        </div>
      </div>

      <div className="punch-buttons">
        <button onClick={handlePunchIn} disabled={timings.punchIn && !timings.punchOut}>
          Punch In
        </button>
        <button onClick={handlePunchOut} disabled={!timings.punchIn || timings.punchOut}>
          Punch Out
        </button>
        <button onClick={handleBreakStart} disabled={!timings.punchIn || timings.punchOut || onBreak}>
          Start Break
        </button>
        <button onClick={handleBreakEnd} disabled={!onBreak}>
          End Break
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PunchTimings;
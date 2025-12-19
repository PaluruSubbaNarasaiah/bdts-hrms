import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, logoutWithTiming, getLeaves, punchIn, punchOut, breakStart, breakEnd, getTimings } from '../utils/api';
import TimeTracking from './TimeTracking';
import AttendanceCalendar from './AttendanceCalendar';
import PunchTimings from './PunchTimings';
import Navbar from './Navbar';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [leaveMessage, setLeaveMessage] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [timings, setTimings] = useState({});
  const [punchMessage, setPunchMessage] = useState('');
  const [onBreak, setOnBreak] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = sessionStorage.getItem('name');
    if (!userName) {
      navigate('/');
      return;
    }
    setName(userName);
    fetchLeaves();
    fetchTimings();
  }, [navigate]);

  const fetchLeaves = async () => {
    try {
      const empId = sessionStorage.getItem('empId');
      console.log('Fetching leaves for empId:', empId);
      const response = await getLeaves();
      console.log('Leaves response:', response);
      setLeaves(response.leaves || []);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
  };

  const fetchTimings = async () => {
    try {
      const empId = sessionStorage.getItem('empId');
      console.log('Fetching timings for empId:', empId);
      const data = await getTimings();
      console.log('Timings response:', data);
      setTimings(data || {});
      setOnBreak(data?.breakStart && !data?.breakEnd);
    } catch (error) {
      console.error('Failed to fetch timings:', error);
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
      const time = response.time || getCurrentTime();
      setPunchMessage(`Punched In at ${time}`);
      setTimings(prev => ({ ...prev, punchIn: time }));
    } catch (error) {
      setPunchMessage('Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      const response = await punchOut();
      const time = response.time || getCurrentTime();
      setPunchMessage(`Punched Out at ${time}`);
      setTimings(prev => ({ ...prev, punchOut: time }));
    } catch (error) {
      setPunchMessage('Failed to punch out');
    }
  };

  const handleBreakStart = async () => {
    try {
      const response = await breakStart();
      const time = response.time || getCurrentTime();
      setPunchMessage(`Break Started at ${time}`);
      setOnBreak(true);
      setTimings(prev => ({ ...prev, breakStart: time }));
    } catch (error) {
      setPunchMessage('Failed to start break');
    }
  };

  const handleBreakEnd = async () => {
    try {
      const response = await breakEnd();
      const time = response.time || getCurrentTime();
      setPunchMessage(`Break Ended at ${time}`);
      setOnBreak(false);
      setTimings(prev => ({ ...prev, breakEnd: time }));
    } catch (error) {
      setPunchMessage('Failed to end break');
    }
  };

  const markAttendance = async () => {
    try {
      await apiCall({
        action: 'attendance',
        empId: sessionStorage.getItem('empId'),
        name: sessionStorage.getItem('name')
      });
      setAttendanceMessage('Attendance marked successfully');
    } catch (error) {
      setAttendanceMessage('Failed to mark attendance');
    }
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    if (!from || !to || !reason) {
      setLeaveMessage('Please fill all leave fields');
      return;
    }

    try {
      await apiCall({
        action: 'leave',
        empId: sessionStorage.getItem('empId'),
        name: sessionStorage.getItem('name'),
        from,
        to,
        reason
      });
      setLeaveMessage('Leave applied successfully');
      setFrom('');
      setTo('');
      setReason('');
      fetchLeaves();
    } catch (error) {
      setLeaveMessage('Failed to apply leave');
    }
  };

  const logout = async () => {
    await logoutWithTiming();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <div className="card main-card">
          <h2>Employee Dashboard</h2>
          <h3>Welcome {name}</h3>
          
          <TimeTracking />
          
          <div className="punch-timings">
            <div className="section-title">Today's Timings</div>
            <button onClick={fetchTimings} style={{marginBottom: '10px', width: 'auto', padding: '8px 16px'}}>Refresh Timings</button>
            
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

            {punchMessage && <p className="message">{punchMessage}</p>}
          </div>
          
          <button onClick={markAttendance}>Mark Attendance</button>
          
          {attendanceMessage && <p className="message">{attendanceMessage}</p>}
        </div>
        
        <div className="side-panel">
          <div className="card">
            <AttendanceCalendar />
          </div>
          
          <div className="card">
            <h3>Apply Leave</h3>
            <form onSubmit={applyLeave}>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
              <textarea
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <button type="submit">Submit Leave</button>
              {leaveMessage && <p className="message">{leaveMessage}</p>}
            </form>
          </div>
          
          <div className="card">
            <h3>My Leave Applications</h3>
            <button onClick={fetchLeaves} style={{marginBottom: '10px', width: 'auto', padding: '8px 16px'}}>Refresh</button>
            <div className="leave-list">
              {leaves.length > 0 ? leaves.map((leave, index) => (
                <div key={index} className="leave-item">
                  <div className="leave-dates">{leave.from} to {leave.to}</div>
                  <div className="leave-reason">{leave.reason}</div>
                  <div className={`leave-status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </div>
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

export default Dashboard;
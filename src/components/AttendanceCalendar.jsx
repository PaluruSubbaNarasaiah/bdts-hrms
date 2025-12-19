import { useState, useEffect } from 'react';
import { apiCall, getAttendance } from '../utils/api';
import './styles.css';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [currentDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const empId = sessionStorage.getItem('empId');
      const response = await getAttendance(
        empId,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      setAttendanceData(response.attendance || []);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      await apiCall({
        action: 'attendance',
        empId: sessionStorage.getItem('empId'),
        name: sessionStorage.getItem('name'),
        method: 'manual'
      });
      setMessage('Attendance marked successfully');
      fetchAttendance();
    } catch (error) {
      setMessage('Failed to mark attendance');
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isAttendanceMarked = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData.some(record => record.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isPresent = isAttendanceMarked(day);
      const isToday = day === new Date().getDate() && 
                     currentDate.getMonth() === new Date().getMonth() && 
                     currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isPresent ? 'present' : ''} ${isToday ? 'today' : ''}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>←</button>
        <h3>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => navigateMonth(1)}>→</button>
      </div>

      <div className="calendar-actions">
        <button onClick={markAttendance} className="mark-attendance-btn">
          Mark Today's Attendance
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color present"></div>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Today</span>
        </div>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AttendanceCalendar;
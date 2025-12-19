import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { faceAttendance } from '../utils/api';

const FaceAttendance = () => {
  const [message, setMessage] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const empId = sessionStorage.getItem('empId');
    if (!empId) {
      navigate('/');
      return;
    }

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        setMessage('Camera access denied or not available');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate, stream]);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const markAttendance = async () => {
    try {
      if (!videoRef.current) {
        setMessage('Camera not ready');
        return;
      }
      
      const imageData = captureImage();
      const response = await faceAttendance(imageData);
      setMessage('Face attendance marked successfully');
    } catch (error) {
      setMessage('Failed to mark attendance');
    }
  };

  return (
    <div className="face-attendance">
      <div className="card">
        <h2>Face Attendance</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px' }} />
        <button onClick={markAttendance}>Mark Attendance</button>
        
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default FaceAttendance;
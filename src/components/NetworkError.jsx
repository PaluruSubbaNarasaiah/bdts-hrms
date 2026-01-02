import { useState, useEffect } from 'react';
import './NetworkError.css';

const NetworkError = ({ error, onRetry }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!error && isOnline) return null;

  return (
    <div className="network-error-overlay">
      <div className="network-error-container">
        <div className="error-animation">
          <div className="wifi-icon">
            <div className="wifi-bar"></div>
            <div className="wifi-bar"></div>
            <div className="wifi-bar"></div>
          </div>
        </div>
        
        <h3>{!isOnline ? 'No Internet Connection' : 'Network Error'}</h3>
        <p>
          {!isOnline 
            ? 'Please check your internet connection and try again.'
            : error || 'Something went wrong. Please try again.'
          }
        </p>
        
        <button onClick={onRetry} className="retry-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Retry
        </button>
      </div>
    </div>
  );
};

export default NetworkError;
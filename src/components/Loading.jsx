import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-logo-container">
        <img src="src/assets/BDTS-modified.png" alt="Loading..." className="loading-logo" />
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
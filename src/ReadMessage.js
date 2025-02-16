import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function ReadMessage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [musicUrl]);

  const decrypt = (encryptedMessage, password) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encryptedData = localStorage.getItem(password);
    if (encryptedData) {
      try {
        const decryptedData = decrypt(encryptedData, password);
        const { message, music, image, expirationTime } = JSON.parse(decryptedData);
        
        if (Date.now() > expirationTime) {
          setError('This message has expired and been deleted.');
          localStorage.removeItem(password);
          return;
        }
        
        setMessage(message);
        setMusicUrl(music);
        setImageUrl(image);
        setError('');
      } catch (err) {
        setError('Invalid password or corrupted message');
        setMessage('');
        setMusicUrl('');
        setImageUrl('');
      }
    } else {
      setError('Invalid password or message not found');
      setMessage('');
      setMusicUrl('');
      setImageUrl('');
    }
  };

  const handleMarkAsRead = () => {
    localStorage.removeItem(password);
    setMessage('');
    setPassword('');
    setMusicUrl('');
    setImageUrl('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    alert('Message marked as read and deleted.');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #3498db, #e74c3c)',
    backgroundSize: '400% 400%',
    animation: 'gradientAnimation 15s ease infinite',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    padding: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '10px 0',
  };

  const messageContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '5px',
    marginTop: '20px',
    width: '100%',
    maxWidth: '500px',
    position: 'relative', // Required for absolute positioning
  };

  const imageStyle = {
    maxWidth: '100%',
    opacity: 0.4,
    display: 'block',
  };

  const textOverlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '1.5em',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    textAlign: 'center',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '2em', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Read a Secret Message</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter message password"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Read Message</button>
      </form>
      {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
      {message && (
        <div style={messageContainerStyle}>
          {imageUrl && <img src={imageUrl} alt="Attached" style={imageStyle} />}
          <div style={textOverlayStyle}>
            <p>{message}</p>
          </div>
          {musicUrl && (
            <audio ref={audioRef} style={{display: 'none'}}>
              <source src={musicUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <button onClick={handleMarkAsRead} style={buttonStyle}>Mark as Read</button>
        </div>
      )}
      <button onClick={() => navigate('/')} style={buttonStyle}>Back to Home</button>
    </div>
  );
}

export default ReadMessage;

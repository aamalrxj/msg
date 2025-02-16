import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function SendMessage() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [music, setMusic] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const musicInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const generatePassword = () => {
    return String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  };

  const encrypt = (message, password) => {
    return CryptoJS.AES.encrypt(message, password).toString();
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPassword = generatePassword();
    const expirationTime = Date.now() + 600000;

    try {
      const musicData = music ? await readFileAsDataURL(music) : null;
      const imageData = image ? await readFileAsDataURL(image) : null;

      const dataToEncrypt = JSON.stringify({
        message: message,
        music: musicData,
        image: imageData,
        timestamp: Date.now(),
        expirationTime: expirationTime
      });

      const encryptedData = encrypt(dataToEncrypt, newPassword);

      try {
        localStorage.setItem(newPassword, encryptedData);
        setPassword(newPassword);
        alert(`Message sent successfully. Your password is: ${newPassword}`);
        
        // Clear all inputs
        setMessage('');
        setMusic(null);
        setImage(null);
        if (musicInputRef.current) musicInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          alert('Storage is full. Please delete some old messages before sending a new one.');
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
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

  const textareaStyle = {
    width: '100%',
    height: '150px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    marginBottom: '20px',
    resize: 'vertical',
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

  const fileInputContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '20px',
  };

  const fileInputStyle = {
    display: 'none',
  };

  const fileInputLabelStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    width: '45%',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '2em', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Send a Secret Message</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          style={textareaStyle}
        />
        <div style={fileInputContainerStyle}>
          <label htmlFor="music-upload" style={fileInputLabelStyle}>
            {music ? 'Music Added' : 'Add Music'}
          </label>
          <input
            id="music-upload"
            type="file"
            accept="audio/*"
            onChange={(e) => setMusic(e.target.files[0])}
            ref={musicInputRef}
            style={fileInputStyle}
          />
          <label htmlFor="image-upload" style={fileInputLabelStyle}>
            {image ? 'Image Added' : 'Add Image'}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            ref={imageInputRef}
            style={fileInputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>
      <button onClick={() => navigate('/')} style={buttonStyle}>Back to Home</button>
    </div>
  );
}

export default SendMessage;

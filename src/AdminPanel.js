import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function AdminPanel({ onLogout }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const updateMessages = () => {
      const currentTime = Date.now();
      const updatedMessages = Object.keys(localStorage).map(key => {
        const encryptedData = localStorage.getItem(key);
        let expirationTime;
        try {
          const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
          const parsedData = JSON.parse(decryptedData);
          expirationTime = parsedData.expirationTime;
        } catch (error) {
          console.error('Error decrypting message:', error);
          expirationTime = currentTime; // Set to current time to remove invalid messages
        }

        const timeLeft = Math.max(0, expirationTime - currentTime);
        
        if (timeLeft === 0) {
          localStorage.removeItem(key);
        }

        return {
          key,
          timeLeft
        };
      }).filter(message => message.timeLeft > 0);

      setMessages(updatedMessages);
    };

    updateMessages();
    const interval = setInterval(updateMessages, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all messages?')) {
      localStorage.clear();
      setMessages([]);
      alert('All messages have been deleted');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={handleDeleteAll}>Delete All Messages</button>
      <button onClick={handleLogout}>Logout</button>
      <h3>All Messages (Encrypted):</h3>
      <ul>
        {messages.map(({ key, timeLeft }) => (
          <li key={key}>
            Password: {key}, Time Left: {Math.floor(timeLeft / 60000)}:{((timeLeft % 60000) / 1000).toFixed(0).padStart(2, '0')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;

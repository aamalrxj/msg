import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
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
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px',
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const adminButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  };

  const headingStyle = {
    fontSize: '3em',
    fontWeight: 'bold',
    marginBottom: '30px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Georgia, serif',
    letterSpacing: '1px',
  };

  return (
    <div style={containerStyle}>
      <Link to="/admin" style={adminButtonStyle}>
        Admin Login
      </Link>
      <h1 style={headingStyle}>Welcome to Secret Message App</h1>
      <div style={buttonContainerStyle}>
        <Link to="/send" style={buttonStyle}>
          Send a Message
        </Link>
        <Link to="/read" style={buttonStyle}>
          Read a Message
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

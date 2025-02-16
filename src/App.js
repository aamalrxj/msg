import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import SendMessage from './SendMessage';
import ReadMessage from './ReadMessage';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {isAdminLoggedIn && <Link to="/admin">Admin Panel</Link>}
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/send" element={<SendMessage />} />
          <Route path="/read" element={<ReadMessage />} />
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? (
                <AdminPanel onLogout={handleLogout} />
              ) : (
                <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './login'; // Ensure this matches the case of the filename

function App() {
    const [user, setUser] = useState({ isLoggedIn: false, role: '' });

    return (
        <Router>
            <div className="App">
                {/* Navigation Bar */}
                <nav className="App-nav">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/messages">Messages</Link>
                    <Link to="/view-patients">View Patients</Link>
                </nav>

                {/* Define Routes */}
                <Routes>
                    <Route path="/login" element={<Login onLogin={(userData) => setUser(userData)} />} />
                    <Route path="/messages" element={<h2>Messages Page</h2>} />
                    <Route path="/view-patients" element={<h2>View Patients Page</h2>} />
                    <Route path="/" element={<h1>Welcome to the Patient Journal System</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;



// src/App.js
import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './login'; // Ensure this matches the case of the filename
import Messages from './messages'; // Import the Messages component
import ViewPatients from './viewPatients'; // Import the ViewPatients component
import PatientJournal from './PatientJournal';
import ViewEmployees from "./viewEmployees";
import SendMessagePage from "./SendMessagePage";
//import PatientAppointments from './PatientAppointments';
//import PatientConditions from './PatientConditions';

function App() {
    const [user, setUser] = useState({ isLoggedIn: false, role: '' });

    const handleLogin = (userData) => {
        setUser({ isLoggedIn: true, ...userData });
    };

    const handleLogout = () => {
        setUser({ isLoggedIn: false, role: '' });
    };

    return (
            <div className="App">
                {/* Navigation Bar */}
                <nav className="App-nav">
                    <Link to="/">Home</Link>
                    {user.isLoggedIn ? (
                        <>
                            <Link to="/messages">Messages</Link>
                            <Link to="/view-patients">View Patients</Link>
                            <Link to="/view-employees">View Employees</Link>
                            <button onClick={handleLogout} className="logout-button">Logga ut</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}

                </nav>

                {/* Define Routes */}
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/messages" element={<Messages />} /> {/* Route to Messages component */}

                    <Route path="/view-patients" element={<ViewPatients />} />
                    <Route path="/patients/:id/journal" element={<PatientJournal />} />
                    <Route path="/view-employees" element={<ViewEmployees/>}/>
                    <Route path="/send-message/:employeeId" element={<SendMessagePage />} /> {/* The dynamic route */}
                    <Route path="/" element={<h1>Welcome to the Patient Journal System</h1>} />
                </Routes>
            </div>
    );
}

export default App;



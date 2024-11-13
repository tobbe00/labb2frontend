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
import ChatRoom from "./chatRoom";
import MakeNotePage from "./makeNotePage";
//import PatientAppointments from './PatientAppointments';
//import PatientConditions from './PatientConditions';

function App() {
    const [user, setUser] = useState(() => {
        // Hämta användarinformation från sessionStorage vid start om den finns
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false, role: '' };
    });

    const handleLogin = (userData) => {
        const { role, patientId, ...restUserInfo } = userData;
        const userInfo = { isLoggedIn: true, ...restUserInfo, role };

        if (role === "Patient" && patientId) {
            userInfo.patientId = patientId;
        }

        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo)); // Spara i sessionStorage
    };


    const handleLogout = () => {
        setUser({ isLoggedIn: false, role: '' });
        sessionStorage.removeItem("user"); // Ta bort från sessionStorage
    };

    return (
        <div className="App">
            {/* Navigation Bar */}
            <nav className="App-nav">
                <Link to="/">Home</Link>
                {user.isLoggedIn ? (
                    <>
                        <Link to="/messages">Messages</Link>

                        {/* Visa "View Patients" och "View Employees" endast om användaren inte är patient */}
                        {/* Visa "View Patients" och "View Employees" endast om användaren inte är patient */}
                        {user.role !== "Patient" ? (
                            <>
                                <Link to="/view-patients">View Patients</Link>
                            </>
                        ) : (
                            <Link to="/view-employees">View Employees</Link> // This will display in the "else" case (when user is a Patient)
                        )}

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
                    <Route path="/chatRoom/:conversationId" element={<ChatRoom/>}/>
                    <Route path="/patients/:patientId/makeNotePage" element={<MakeNotePage />} /> {/* New route for MakeNotePage */}
                    <Route path="/" element={<h1>Welcome to the Patient Journal System</h1>} />
                </Routes>
            </div>
    );
}

export default App;



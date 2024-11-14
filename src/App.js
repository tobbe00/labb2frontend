import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Messages from './messages';
import ViewPatients from './viewPatients';
import PatientJournal from './PatientJournal';
import ViewEmployees from './viewEmployees';
import SendMessagePage from './SendMessagePage';
import ChatRoom from './chatRoom';
import MakeNotePage from './makeNotePage';
import DiagnosePage from './diagnosePage';

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false, role: '' };
    });

    const navigate = useNavigate();  // Initialize the navigate function

    const handleLogin = (userData) => {
        const { role, patientId, ...restUserInfo } = userData;
        const userInfo = { isLoggedIn: true, ...restUserInfo, role };

        if (role === "Patient" && patientId) {
            userInfo.patientId = patientId;
        }

        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo)); // Save in sessionStorage
    };

    const handleLogout = () => {
        setUser({ isLoggedIn: false, role: '' });
        sessionStorage.removeItem("user"); // Remove from sessionStorage
        navigate("/");  // Redirect to the Home page after logout
    };

    return (
        <div className="App">
            <nav className="App-nav">
                <Link to="/">Home</Link>
                {user.isLoggedIn ? (
                    <>
                        <Link to="/messages">Messages</Link>
                        {user.role !== "Patient" ? (
                            <Link to="/view-patients">View Patients</Link>
                        ) : (
                            <Link to="/view-employees">View Employees</Link>
                        )}
                        {user.isLoggedIn && user.role === "Patient" && user.patientId && (
                            <Link to={`/patients/${user.patientId}/journal`}> My Journal</Link>
                        )}

                        <button onClick={handleLogout} className="logout-button">Logga ut</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>

            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/view-patients" element={<ViewPatients />} />
                <Route path="/patients/:patientId/journal" element={<PatientJournal />} />
                <Route path="/view-employees" element={<ViewEmployees />} />
                <Route path="/send-message/:employeeId" element={<SendMessagePage />} />
                <Route path="/chatRoom/:conversationId" element={<ChatRoom />} />
                <Route path="/patients/:patientId/makeNotePage" element={<MakeNotePage />} />
                <Route path="/patients/:patientId/diagnosePage" element={<DiagnosePage />} />
                <Route path="/" element={<h1>Welcome {user.role} {user.name}</h1>} />
            </Routes>
        </div>
    );
}

export default App;

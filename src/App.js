import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
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
import Pictures from './pictures';
import EditPictures from './editPictures';

const keycloak = new Keycloak({
    url: 'https://keycloak-for-lab3.app.cloud.cbh.kth.se',
    realm: 'fullstack_labb3',
     // Ensure this matches your Keycloak client ID exactly
});

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false, role: '' };
    });

    const [searchPatientInput, setSearchPatientInput] = useState('');
    const [searchDoctorInput, setSearchDoctorInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // We will no longer initialize Keycloak in useEffect. Instead, we will do it when the user clicks the login button.
    }, []);

    const handleLogin = () => {
        // Initialize Keycloak and trigger login
        keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((authenticated) => {
            if (authenticated) {
                const userData = {
                    isLoggedIn: true,
                    name: keycloak.tokenParsed.name,
                    role: keycloak.tokenParsed.realm_access.roles[0],
                };
                setUser(userData);
                sessionStorage.setItem('user', JSON.stringify(userData));
            }
        }).catch((err) => {
            console.error('Error during Keycloak initialization:', err);
        });
    };

    const handleLogout = () => {
        // Logout from Keycloak and remove the user data from session storage
        keycloak.logout().then(() => {
            setUser({ isLoggedIn: false, role: '' });
            sessionStorage.removeItem('user');
            navigate('/');
        });
    };

    const handleSearchPatients = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchPatientInput) {
            params.append('query', searchPatientInput); // Send search text as 'query'
        }

        try {
            const response = await fetch(`https://labb2search.app.cloud.cbh.kth.se/search/patients?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            const data = await response.json();
            console.log('Search Results:', data);
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching patients:', error);
        }
    };

    const handleSearchDoctors = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://labb2search.app.cloud.cbh.kth.se/search/doctor/patients?doctorName=${searchDoctorInput}`);
            if (!response.ok) {
                throw new Error('Failed to fetch doctor\'s patients');
            }
            const data = await response.json();
            console.log('Doctor Search Results:', data);
            setSearchResults(data); // Store the results as structured JSON
        } catch (error) {
            console.error('Error searching doctors:', error);
        }
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
                        {user.isLoggedIn && user.role === "Patient" && (
                            <Link to={`/patients/${user.patientId}/journal`}>My Journal</Link>
                        )}
                        {user.role !== "Patient" && (
                            <Link to="/pictures">Pictures</Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <button onClick={handleLogin}>Login with Keycloak</button>
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
                <Route path="/edit" element={<EditPictures />} />
                <Route path="/pictures" element={<Pictures />} />
                <Route path="/" element={
                    <div>
                        <h1>Welcome {user.role} {user.name}</h1>
                        {user.isLoggedIn && (user.role === "Doctor" || user.role === "Worker") && (
                            <div>
                                <h2>Search Patients</h2>
                                <form onSubmit={handleSearchPatients}>
                                    <input
                                        type="text"
                                        placeholder="Search Patients (name, condition, age, etc.)"
                                        value={searchPatientInput}
                                        onChange={(e) => setSearchPatientInput(e.target.value)}
                                    />
                                    <button type="submit">Search</button>
                                </form>
                                <h2>Search Doctors</h2>
                                <form onSubmit={handleSearchDoctors}>
                                    <input
                                        type="text"
                                        placeholder="Search Doctors by Name"
                                        value={searchDoctorInput}
                                        onChange={(e) => setSearchDoctorInput(e.target.value)}
                                    />
                                    <button type="submit">Search</button>
                                </form>
                            </div>
                        )}
                    </div>
                } />
            </Routes>
        </div>
    );
}

export default App;

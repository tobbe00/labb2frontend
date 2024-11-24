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
import Pictures from "./pictures";
import EditPictures from "./editPictures";

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false, role: '' };
    });

    const [searchPatientInput, setSearchPatientInput] = useState('');
    const [searchDoctorInput, setSearchDoctorInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleLogin = (userData) => {
        const { role, patientId, ...restUserInfo } = userData;
        const userInfo = { isLoggedIn: true, ...restUserInfo, role };

        if (role === "Patient" && patientId) {
            userInfo.patientId = patientId;
        }

        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
    };

    const handleLogout = () => {
        setUser({ isLoggedIn: false, role: '' });
        sessionStorage.removeItem("user");
        navigate("/");
    };

    const handleSearchPatients = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchPatientInput) {
            params.append('query', searchPatientInput); // Skicka söktexten som 'query'
        }

        try {
            const response = await fetch(`http://localhost:8080/search/patients?${params.toString()}`);
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
            const response = await fetch(`http://localhost:8080/search/doctor/patients?doctorName=${searchDoctorInput}`);
            if (!response.ok) {
                throw new Error('Failed to fetch doctor\'s patients');
            }
            const data = await response.json();
            console.log('Doctor Search Results:', data);
            setSearchResults(data); // Här sparas resultatet som en strukturerad JSON
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
                        {user.isLoggedIn && user.role === "Patient" && user.patientId && (
                            <Link to={`/patients/${user.patientId}/journal`}> My Journal</Link>
                        )}
                        {user.role !== "Patient"&&(
                            <Link to="/pictures">Pictures</Link>
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
                <Route path="/edit" element={<EditPictures />} />
                <Route path="/pictures" element={<Pictures/>}/>
                <Route path="/" element={
                    <div>
                        <h1>Welcome {user.role} {user.name}</h1>
                        <div>
                            {/* Patient search */}
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

                            {/* Doctor search */}
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
                        <div>
                            <h3>Search Results</h3>
                            {/* Om searchResults är en array (Patient Search) */}
                            {Array.isArray(searchResults) ? (
                                <ul>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((patient, index) => (
                                            <li key={index}>
                                                {patient.name} - {patient.gender || "N/A"} - {patient.age || "N/A"} years
                                                old
                                            </li>
                                        ))
                                    ) : (
                                        <p>No results found</p>
                                    )}
                                </ul>
                            ) : (
                                /* Om searchResults är ett objekt (Doctor Search) */
                                Object.keys(searchResults).length > 0 ? (
                                    Object.entries(searchResults).map(([patientName, observations], index) => (
                                        <div key={index}>
                                            <h4>{patientName}</h4>
                                            <ul>
                                                {Array.isArray(observations) && observations.length > 0 ? (
                                                    observations.map((obs, idx) => (
                                                        <li key={idx}>
                                                            Date: {obs.date} - Description: {obs.description}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No observations available</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p>No results found</p>
                                )
                            )}
                        </div>

                    </div>
                }/>
            </Routes>
        </div>
    );
}

export default App;

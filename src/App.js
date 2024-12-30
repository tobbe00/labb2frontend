import React, { useState, useEffect } from 'react';
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
import Pictures from './pictures';
import EditPictures from './editPictures';

function handleLogout() {

}

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user_details");
        console.log("eyo just nu är vi inne i app där vi sätter user och user_details är"+sessionStorage.getItem("user_details")+" user"+ sessionStorage.getItem("user"));
        return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false, role: '' };
    });

    const [searchPatientInput, setSearchPatientInput] = useState('');
    const [searchDoctorInput, setSearchDoctorInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleLogin = (loggedInUser) => {
        // Update user state and session storage upon successful login
        setUser({ ...loggedInUser, isLoggedIn: true });
        sessionStorage.setItem("user", JSON.stringify({ ...loggedInUser, isLoggedIn: true }));
        navigate("/"); // Redirect to home after login
    };

    const handleLogout = () => {
        // Clear user state and session storage upon logout
        setUser({ isLoggedIn: false, role: '' });
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        navigate("/login"); // Redirect to login after logout
    };

    const handleSearchPatients = async (e) => {
        e.preventDefault();

        // Retrieve the token from session storage
        const token = sessionStorage.getItem("access_token");

        // Create URLSearchParams for query parameters
        const params = new URLSearchParams();
        if (searchPatientInput) {
            params.append("query", searchPatientInput); // Send search text as 'query'
        }

        try {
            const response = await fetch(
                `https://labb2search.app.cloud.cbh.kth.se/search/patients?${params.toString()}`,
                {
                    method: "GET", // HTTP method
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
                        "Content-Type": "application/json", // Optional, specify the content type
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch patients");
            }

            const data = await response.json();
            console.log("Search Results:", data);
            setSearchResults(data); // Store the results as structured JSON
        } catch (error) {
            console.error("Error searching patients:", error);
        }
    };


    const handleSearchDoctors = async (e) => {
        e.preventDefault();

        // Retrieve the token from session storage
        const token = sessionStorage.getItem("access_token");

        try {
            const response = await fetch(
                `https://labb2search.app.cloud.cbh.kth.se/search/doctor/patients?doctorName=${encodeURIComponent(searchDoctorInput)}`,
                {
                    method: "GET", // HTTP method
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
                        "Content-Type": "application/json", // Optional, specify the content type
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch doctor's patients");
            }

            const data = await response.json();
            console.log("Doctor Search Results:", data);
            setSearchResults(data); // Store the results as structured JSON
        } catch (error) {
            console.error("Error searching doctors:", error);
        }
    };


    return (
        <div className="App">
            <nav className="App-nav">
                <Link to="/">Home</Link>
                {user.isLoggedIn ? (
                    <>
                        <Link to="/messages">Messages</Link>
                        {user.role !== "patient" ? (
                            <Link to="/view-patients">View Patients</Link>
                        ) : (
                            <Link to="/view-employees">View Employees</Link>
                        )}
                        {user.isLoggedIn && user.role === "patient" && (
                            <Link to={`/patients/${/*user.patientId*/sessionStorage.getItem("userId")}/journal`}>My Journal</Link>
                        )}
                        {user.role !== "patient" && (
                            <Link to="/pictures">Pictures</Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="login-button">Login</Link>
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
                        )}
                    </div>
                }/>
            </Routes>
        </div>
    );
}

export default App;

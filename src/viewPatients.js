// src/ViewPatients.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewPatients() {
    // State to hold patient data
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulating a fetch request to a backend
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Simulated response (you can replace this with a real API call)
                const simulatedResponse = [
                    { id: 1, name: 'Alice Johnson', age: 30, gender: 'Female' },
                    { id: 2, name: 'Bob Smith', age: 45, gender: 'Male' },
                    { id: 3, name: 'Charlie Brown', age: 25, gender: 'Male' },
                ];

                // Simulate a network delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Update state with simulated data
                setPatients(simulatedResponse);
            } catch (error) {
                setError('Failed to fetch patients.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Render loading state, error state, or patient list
    return (
        <div className="view-patients-container">
            <h2>Patients List</h2>
            {loading && <p>Loading patients...</p>}
            {error && <p className="error-message">{error}</p>}
            {patients.length > 0 ? (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.id}>
                            <div>
                                <strong>{patient.name}</strong> (Age: {patient.age}, Gender: {patient.gender})
                            </div>
                            <div>
                                <Link to={`/patients/${patient.id}/journal`}>
                                    <button>View Journal</button>
                                </Link>
                                <Link to={`/patients/${patient.id}/appointments`}>
                                    <button>View Appointments</button>
                                </Link>
                                <Link to={`/patients/${patient.id}/conditions`}>
                                    <button>View Conditions</button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No patients found.</p>
            )}
        </div>
    );
}

export default ViewPatients;

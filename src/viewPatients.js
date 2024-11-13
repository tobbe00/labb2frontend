import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Replace this URL with the actual endpoint URL that returns the PatientDTO list
                const response = await fetch("http://localhost:8080/api/patients"); // Use the correct backend API endpoint
                if (!response.ok) {
                    throw new Error(`Error fetching patients: ${response.statusText}`);
                }

                const data = await response.json();
                setPatients(data);
            } catch (error) {
                setError(error.message || 'Failed to fetch patients.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="view-patients-container">
            <h2>Patients List</h2>
            {loading && <p>Loading patients...</p>}
            {error && <p className="error-message">{error}</p>}
            {patients.length > 0 ? (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.userId}>  {/* Add key prop here */}
                            <div>
                                <strong>{patient.name}</strong> (Age: {patient.age}, Gender: {patient.gender})
                            </div>
                            <div>
                                <Link to={`/patients/${patient.patientId}/journal`}>
                                    <button>View Journal</button>
                                </Link>
                                <Link to={`/patients/${patient.patientId}/appointments`}>
                                    <button>View Appointments</button>
                                </Link>
                                <Link to={`/patients/${patient.patientId}/conditions`}>
                                    <button>View Conditions</button>
                                </Link>
                                <Link to={`/patients/${patient.userId}/diagnosePage`}>
                                    <button>Diagnose</button>
                                </Link>
                                <Link to={`/patients/${patient.userId}/makeNotePage`}>
                                    <button>Make a note</button>
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

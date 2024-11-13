import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState('patient'); // Assuming the role is fetched or set somewhere

    // Simulated fetch request to get patients
    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); // Assume you store the role in localStorage
        if (userRole) {
            setRole(userRole); // Set the role from storage or API
        }
        const fetchPatients = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/patients');
                const data = await response.json();

                // Set fetched patients data
                setPatients(data);
            } catch (error) {
                setError('Failed to fetch patients.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="view-patients-container">
            <h2>{role === 'doctor' ? 'Patients List' : 'Your Details'}</h2>
            {loading && <p>Loading patients...</p>}
            {error && <p className="error-message">{error}</p>}
            {patients.length > 0 ? (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.patientId}>
                            <div>
                                <strong>{patient.name}</strong>
                            </div>
                            {role === 'doctor' ? (
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
                                </div>
                            ) : (
                                <div>
                                    <Link to={`/patients/${patient.patientId}/journal`}>
                                        <button>View Your Journal</button>
                                    </Link>
                                    <Link to={`/patients/${patient.patientId}/appointments`}>
                                        <button>View Your Appointments</button>
                                    </Link>
                                    <Link to={`/patients/${patient.patientId}/conditions`}>
                                        <button>View Your Conditions</button>
                                    </Link>
                                </div>
                            )}
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

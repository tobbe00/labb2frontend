import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './viewPatients.module.css';  // Importera din CSS-modul

function ViewPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = sessionStorage.getItem('access_token'); // Retrieve the token from session storage
                if (!token) {
                    throw new Error('Unauthorized access. Please log in.');
                }

                const response = await fetch("https://labb2journal.app.cloud.cbh.kth.se/api/patients", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching patients: ${response.statusText}`);
                }

                const data = await response.json();
                setPatients(data); // Update state with the patient data
            }catch (error) {
                setError(error.message || 'Failed to fetch patients.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className={styles.viewPatientsContainer}>
            <h2>Patients List</h2>
            {loading && <p>Loading patients...</p>}
            {error && <p className="error-message">{error}</p>}
            {patients.length > 0 ? (
                <ul className={styles.patientList}>
                    {patients.map((patient) => (
                        <li key={patient.userId} className={styles.patientItem}>
                            <div>
                                <strong>{patient.name}</strong> (Age: {patient.age}, Gender: {patient.gender})
                            </div>
                            <div className={styles.buttonContainer}>  {/* Lägg till container för knappar */}
                                <Link to={`/patients/${patient.patientId}/journal`}>
                                    <button className={styles.button}>View Journal</button>
                                </Link>
                                <Link to={`/patients/${patient.userId}/diagnosePage`}>
                                    <button className={styles.button}>Diagnose</button>
                                </Link>
                                <Link to={`/patients/${patient.userId}/makeNotePage`}>
                                    <button className={styles.button}>Make a note</button>
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

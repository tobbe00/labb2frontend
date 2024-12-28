import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PatientJournal.module.css';
//import patientJournal from "./PatientJournal"; // Importera CSS-modulen

function PatientJournal() {
    const { patientId } = useParams(); // Hämta patientens id från URL
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientJournal = async () => {
            const token = sessionStorage.getItem('access_token'); // Retrieve token from session storage
            if (!token) {
                setError('Unauthorized access. Please log in.');
                return;
            }
            try {
                // Hämta journalen för den valda patienten
                const response = await fetch(`https://labb2journal.app.cloud.cbh.kth.se/api/patients/${patientId}/journal/doc`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`, // Include token in header
                            'Content-Type': 'application/json',
                        },
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch journal');
                }
                const data = await response.json();
                setJournal(data); // Sätt journaldata
            } catch (error) {
                setError(error.message || 'Failed to fetch patient journal.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientJournal(); // Anropa funktionen för att hämta data
    }, [patientId]); // Kör varje gång `id` ändras (när man klickar på en ny patient)

    return (
        <div className={styles.patientJournalContainer}>
            <h2>Patient Journal</h2>
            {loading && <p>Loading journal...</p>}
            {error && <p className="error-message">{error}</p>}
            {journal && (
                <>
                    {/* Patient Information */}
                    <div className={styles.patientInfoContainer}>
                        <div className={styles.patientInfo}>
                            <h3>Patient Information</h3>
                            <p><strong>Name:</strong> {journal.name}</p>
                            <p><strong>Age:</strong> {journal.age}</p>
                            <p><strong>Gender:</strong> {journal.gender}</p>
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className={styles.conditionsContainer}>
                        <h3>Conditions</h3>
                        {journal.conditions && journal.conditions.length > 0 ? (
                            <ul>
                                {journal.conditions.map((condition, index) => (
                                    <li key={index}>
                                        <strong>{condition.conditionName}:</strong> {condition.conditionDescription}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No conditions available.</p>
                        )}
                    </div>

                    {/* Observations */}
                    <div className={styles.observationsContainer}>
                        <h3>Observations</h3>
                        {journal.observations && journal.observations.length > 0 ? (
                            <ul>
                                {journal.observations.map((observation, index) => (
                                    <li key={index}>
                                        <strong>{observation.description}</strong> (Date: {observation.date})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No observations available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientJournal;

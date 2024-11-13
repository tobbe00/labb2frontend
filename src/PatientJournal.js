import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PatientJournal() {
    const { id } = useParams();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchJournal = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/patients/${id}/journal`);
                    const data = await response.json();
                    setJournal(data);
                } catch (error) {
                    setError('Failed to fetch patient journal.');
                } finally {
                    setLoading(false);
                }
            };

        fetchJournal();
    }, [id]);

    return (
        <div>
            <h2>Patient Journal</h2>
            {loading && <p>Loading journal...</p>}
            {error && <p className="error-message">{error}</p>}
            {journal && (
                <div>
                    <p>Name: {journal.name}</p>
                    <p>Age: {journal.age}</p>
                    <p>Gender: {journal.gender}</p>
                </div>
            )}
        </div>
    );
}

export default PatientJournal;

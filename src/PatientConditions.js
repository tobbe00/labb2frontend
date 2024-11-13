/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PatientConditions() {
    const { id } = useParams();
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const response = await fetch(`/api/patients/${id}/conditions`);
                const data = await response.json();
                setConditions(data);
            } catch (error) {
                setError('Failed to fetch conditions.');
            } finally {
                setLoading(false);
            }
        };

        fetchConditions();
    }, [id]);

    return (
        <div>
            <h2>Conditions for Patient ID: {id}</h2>
            {loading && <p>Loading conditions...</p>}
            {error && <p className="error-message">{error}</p>}
            {conditions.length > 0 ? (
                <ul>
                    {conditions.map((condition, index) => (
                        <li key={index}>
                            <strong>{condition.name}</strong>: {condition.description}
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No conditions found.</p>
            )}
        </div>
    );
}

export default PatientConditions;*/

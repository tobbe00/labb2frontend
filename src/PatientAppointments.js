/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PatientAppointments() {
    const { id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`/api/patients/${id}/appointments`);
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                setError('Failed to fetch appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [id]);

    return (
        <div>
            <h2>Appointments for Patient ID: {id}</h2>
            {loading && <p>Loading appointments...</p>}
            {error && <p className="error-message">{error}</p>}
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment, index) => (
                        <li key={index}>
                            <strong>{appointment.date}</strong> - {appointment.reason}
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No appointments found.</p>
            )}
        </div>
    );
}

export default PatientAppointments;
*/
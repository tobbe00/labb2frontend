import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DiagnosePage() {
    // Get the dynamic patient ID from the URL
    const { patientId } = useParams();

    // State to handle condition details, status, and userId (doctor or authorized user)
    const [conditionName, setConditionName] = useState('');
    const [conditionDescription, setConditionDescription] = useState('');
    const [status, setStatus] = useState('');
    const [userId, setUserId] = useState(null);

    // Retrieve userId from sessionStorage when component loads
    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));  // Convert to integer
        } else {
            setStatus('User ID is missing. Please log in.');
        }
    }, []);

    // Handle input changes
    const handleConditionNameChange = (event) => {
        setConditionName(event.target.value);
    };

    const handleConditionDescriptionChange = (event) => {
        setConditionDescription(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Ensure patientId and userId are valid numbers
        const patientIdNum = parseInt(patientId, 10);
        if (isNaN(patientIdNum) || isNaN(userId)) {
            setStatus('Invalid Patient ID or User ID');
            return;
        }

        // Construct the request body
        const requestBody = {
            patientId: patientIdNum,
            conditionName,
            conditionDescription,
            doctorId: userId,
        };

        // Make the POST request to save the condition
        try {
            const token = sessionStorage.getItem('access_token'); // Retrieve the token from session storage
            if (!token) {
                setStatus('Unauthorized access. Please log in.');
                return;
            }

            const response = await fetch('https://labb2journal.app.cloud.cbh.kth.se/api/patients/makeDiagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                },
                body: JSON.stringify(requestBody), // Send the request body
            });

            if (response.ok) {
                setStatus('Condition saved successfully!');
                setConditionName(''); // Clear the input fields after submission
                setConditionDescription('');
            } else {
                setStatus('Failed to save condition. Please try again.');
            }
        } catch (error) {
            setStatus('Error: Could not save condition. Please check your connection.');
        }
    };

    return (
        <div>
            <h1>Diagnose Patient {patientId}</h1>
            <form onSubmit={handleSubmit}>
                <br />
                <textarea
                    type="text"
                    value={conditionName}
                    onChange={handleConditionNameChange}
                    placeholder="Enter condition name..."
                    rows="1"
                    cols="40"
                />
                <br />
                <textarea
                    value={conditionDescription}
                    onChange={handleConditionDescriptionChange}
                    placeholder="Enter condition description here..."
                    rows="5"
                    cols="40"
                />
                <br />
                <button type="submit">Save Condition</button>
            </form>

            {status && <p>{status}</p>}  {/* Display feedback message */}
        </div>
    );
}

export default DiagnosePage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MakeNotePage() {
    // Get the dynamic patient ID from the URL
    const { patientId } = useParams();

    // State to handle the note title, body, status, and userId
    const [description, setDescription] = useState('');
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



    // Handle note body input change
    const handleNoteBodyChange = (event) => {
        setDescription(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();



        // Ensure patientId and userId are numbers
        const patientIdNum = parseInt(patientId, 10);
        if (isNaN(patientIdNum) || isNaN(userId)) {
            setStatus('Invalid Patient ID or User ID');
            return;
        }

        // Construct the request body
        const requestBody = {
            patientId: patientIdNum,
            description,
            doctorId: userId,
        };

        // Make the POST request to save the note
        try {
            const response = await fetch('https://labb2journal.app.cloud.cbh.kth.se/api/patients/makeNote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setStatus('Note saved successfully!');
                setDescription('');   // Clear the note input field
            } else {
                setStatus('Failed to save note. Please try again.');
            }
        } catch (error) {
            setStatus('Error: Could not save note. Please check your connection.');
        }
    };

    return (
        <div>
            <h1>Add a Note for Patient {patientId}</h1>
            <form onSubmit={handleSubmit}>
                <br />
                <textarea
                    value={description}
                    onChange={handleNoteBodyChange}
                    placeholder="Write your note here..."
                    rows="5"
                    cols="40"
                />
                <br />
                <button type="submit">Save Note</button>
            </form>

            {status && <p>{status}</p>}  {/* Show feedback message */}
        </div>
    );
}

export default MakeNotePage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SendMessagePage.css';  // Importera CSS-filen

function SendMessagePage() {
    const { employeeId } = useParams();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));
        } else {
            setStatus('User ID is missing. Please log in.');
        }
    }, []);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleMessageTitleChange = (event) => {
        setMessageTitle(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!message.trim() || !messageTitle.trim()) {
            setStatus('Message or title cannot be empty');
            return;
        }

        const employeeIdNum = parseInt(employeeId, 10);
        if (isNaN(employeeIdNum)) {
            setStatus('Invalid Employee ID');
            return;
        }

        if (isNaN(userId)) {
            setStatus('Invalid User ID');
            return;
        }

        const requestBody = {
            employeeId,
            message,
            messageTitle,
            userId,
        };

        try {
            const token = sessionStorage.getItem('access_token'); // Retrieve the token from session storage
            if (!token) {
                throw new Error('Unauthorized access. Please log in.');
            }

            const response = await fetch('https://labb2messages.app.cloud.cbh.kth.se/api/messages/sendFirstMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setMessage('');         // Clear the message input field
                setMessageTitle('');    // Clear the message title input field
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error.message || error);
            setStatus(error.message || 'Failed to send message. Please try again.');
        }

    };

    return (
        <div className="send-message-container">
            <h1>Send a Message to Employee {employeeId}</h1>
            <form className="send-message-form" onSubmit={handleSubmit}>
                <textarea
                    value={messageTitle}
                    onChange={handleMessageTitleChange}
                    placeholder="Title"
                    rows="1"
                    cols="40"
                />
                <textarea
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Write your message here..."
                    rows="5"
                    cols="40"
                />
                <button type="submit">Send Message</button>
            </form>

            {status && <p className={status.includes('success') ? 'success' : 'error'}>{status}</p>}
        </div>
    );
}

export default SendMessagePage;

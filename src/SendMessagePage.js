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
            const response = await fetch('http://localhost:8080/api/messages/sendFirstMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setMessage('');
                setMessageTitle('');
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            setStatus('Error: Could not send message. Please check your connection.');
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

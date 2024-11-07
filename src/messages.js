import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



function Messages() {
    // State to hold the array of messages
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch messages from the API
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/messages/received/2'); // Replace with your actual API endpoint

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                // Parse and set the data
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                setError('Failed to load messages.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="messages-container">
            <h2>Messages</h2>
            {loading && <p>Loading messages...</p>}
            {error && <p className="error-message">{error}</p>}
            {messages.length > 0 ? (
                <ul>
                    {messages.map((message) => (
                        <li key={message.messageId} className="message-item">
                            <hr/>
                            <span><strong>From:</strong> {message.sender.userName}</span>
                            <span><strong> Message Text:</strong> {message.text}</span>
                            <span><strong> Delivered:</strong>{message.time}</span>
                            <span className="status-indicator">
                                    {message.read ? '✔️' : <span className="unread-dot"></span>}
                                </span>

                            <hr/>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No messages found.</p>
            )}
        </div>
    );
}

export default Messages;





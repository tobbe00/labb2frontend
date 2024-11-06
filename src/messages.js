import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Messages() {
    // State to hold conversations
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulating a fetch request to a backend
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                // Replace this URL with your backend endpoint
                const response = await fetch('http://localhost:8080/api/messages/received/1'); // Replace with actual API URL

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }

                // Parse the JSON response
                const data = await response.json();
                console.log(data);
                // Update state with actual data from the backend
                setConversations(data);
            } catch (error) {
                setError('Failed to fetch conversations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Render loading state, error state, or conversations
    return (
        <div className="messages-container">
            <h2>Conversations</h2>
            {loading && <p>Loading messages...</p>}
            {error && <p className="error-message">{error}</p>}
            {conversations.length > 0 ? (
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id}>
                            <Link to={`/conversation/${conversation.id}`}>
                                <strong>{conversation.username}</strong>
                                <br />
                            </Link>
                            <span>
                                {conversation.latestMessage}
                                {conversation.sender === 'doctor' ? ' (You)' : ' (Other)'}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No conversations found.</p>
            )}
        </div>
    );
}

export default Messages;




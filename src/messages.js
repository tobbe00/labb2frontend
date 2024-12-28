import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import './messages.css';

function Conversations() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Retrieve userId from sessionStorage when component loads
    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));  // Convert to integer
        } else {
            setError('User ID is missing. Please log in.');
        }
    }, []);

    // Fetch conversations from the API when userId is set
    useEffect(() => {
        const fetchConversations = async () => {
            if (!userId) return; // Prevent the fetch if userId is null

            try {
                const token = sessionStorage.getItem('access_token'); // Retrieve the token from session storage
                if (!token) {
                    throw new Error('Unauthorized access. Please log in.');
                }

                const response = await fetch(`https://labb2messages.app.cloud.cbh.kth.se/api/conversations/yourConversations/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }

                const data = await response.json();
                setConversations(data); // Update state with the conversation data
            } catch (error) {
                setError('Failed to load conversations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]); // Dependency on userId

    return (
        <div className="conversations-container">
            <h2>Conversations</h2>
            {loading && <p>Loading conversations...</p>}
            {error && <p className="error-message">{error}</p>}
            {conversations.length > 0 ? (

                <ul className="messages-list">
                    {conversations.map((convo) => (
                        <li key={convo.conversationId} className="conversation-item">
                            <hr/>
                            <span><strong>With:</strong> {convo.withUserName} (ID: {convo.withUserId})</span>
                            <span><strong>Latest Message:</strong> {convo.latestMessage}</span>
                            <span><strong>Time:</strong> {new Date(convo.time).toLocaleString()}</span>
                            {/* Display button with action */}
                            <Link to={`/chatRoom/${convo.conversationId}`}>
                                <button className="conversation-button">
                                    View Conversation
                                </button>
                            </Link>
                            <hr/>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No conversations found.</p>
            )}
        </div>
    );
}

export default Conversations;

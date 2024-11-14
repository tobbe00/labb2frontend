import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './chatRoom.module.css';  // Importera CSS-modulen för ChatRoom

function ChatRoom({ userId }) {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);

    // Fetch all existing messages for the conversation
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/messages/getConvoMessages/${conversationId}`);
                if (!response.ok) throw new Error('Failed to fetch messages');

                const data = await response.json();
                setMessages(data);  // Set messages to state
            } catch (error) {
                setError('Failed to load messages.');
            }
        };

        fetchMessages();
    }, [conversationId]);

    // Handle sending a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;  // Prevent sending empty messages

        try {
            const response = await fetch(`http://localhost:8080/api/messages/sendMessageInConvo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: newMessage,
                    conversationId,
                    senderId: Number(sessionStorage.getItem("userId"))
                }),
            });
            if (!response.ok) throw new Error('Failed to send message');

            const savedMessage = await response.json();
            // Add the new message to the existing messages array
            setMessages((prevMessages) => [...prevMessages, savedMessage]);
            setNewMessage(''); // Clear the input box after sending
        } catch (error) {
            setError('Failed to send message.');
        }
    };

    return (
        <div className={styles.chatroomContainer}>
            <h2>Chat Room</h2>
            {error && <p className="error-message">{error}</p>}

            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div key={index} className={styles.messageItem}>
                        <strong className={message.senderId === Number(sessionStorage.getItem("userId")) ? styles.sent : styles.received}>
                            {message.senderId === Number(sessionStorage.getItem("userId")) ? 'You' : 'Them'}:
                        </strong>
                        <span>{message.text}</span>
                        <span className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

            <div className={styles.messageInputContainer}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={styles.messageInput}
                />
                <button onClick={sendMessage} className={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatRoom;

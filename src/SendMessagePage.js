import { useParams } from 'react-router-dom';
import { useState } from 'react';

function SendMessagePage() {
    // Get the dynamic employee ID from the URL
    const { employeeId } = useParams();
    // State to handle the message and feedback
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [messageTitle, setMessageTitle]=useState('');

    // Handle message input change
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleMessageTitleChange=(event)=>{
        setMessageTitle(event.target.value);
    }

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent default form submission

        // Check if message is empty
        if (!message.trim()||!messageTitle.trim()) {
            setStatus('Message or title cannot be empty');
            return;
        }

        // Construct the request body
        const requestBody = {
            employeeId,
            message,
            messageTitle,
        };

        // Make the POST request to send the message
        try {
            const response = await fetch('/api/messages/sendFirstMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setMessage('');  // Clear the message input field
                setMessageTitle('')
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            setStatus('Error: Could not send message. Please check your connection.');
        }
    };

    return (
        <div>
            <h1>Send a Message to Employee {employeeId}</h1>
            <form onSubmit={handleSubmit}>
                <textarea value={messageTitle} onChange={handleMessageTitleChange} placeholder={"title"} rows={"1"} cols={"40"}/><br/>
                <textarea
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Write your message here..."
                    rows="5"
                    cols="40"
                />
                <br />
                <button type="submit">Send Message</button>
            </form>

            {status && <p>{status}</p>}  {/* Show feedback message */}
        </div>
    );
}

export default SendMessagePage;


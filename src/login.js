// src/Login.js
import React, { useState } from 'react';
import './login.css'; // Optional: create this file for styling

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Simulated login check (replace this with a real API call)
        if (email === 'doctor@example.com' && password === 'password123') {
            onLogin({ role: 'doctor', isLoggedIn: true });
        } else if (email === 'nurse@example.com' && password === 'password123') {
            onLogin({ role: 'nurse', isLoggedIn: true });
        } else {
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

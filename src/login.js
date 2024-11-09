// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(res => res.json().then(data => {
            if (res.ok) {
                return { success: true, authUser: data.user };
            } else {
                return { success: false, error: data.message || 'Misslyckades att logga in' };
            }
        }))
        .catch(error => {
            console.error('Inloggningsfel:', error);
            return { success: false, error: 'Ett fel inträffade vid inloggning' };
        });
}


async function registerUser({email, password, name }) {
    return fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password, name })
    }).then(response => {
        if (response.ok) return { success: true };
        throw response;
    }).catch(_ => {
        return { success: false, error: 'Misslyckades att registrera användare' };
    });
}


function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await loginUser({ email, password });
        console.log(result);
        if (result.success) {
            onLogin(result.authUser);
            setErrorMessage('');
            navigate("/");
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const result = await registerUser({ email, password, name});
        if (result.success) {
            setShowRegister(false);
            setErrorMessage('');
            setEmail(''); // Nollställ fälten efter registrering
            setPassword('');
            navigate("/login"); // Navigera användaren till inloggningssidan
        } else {
            setErrorMessage(result.error);
        }
    };

    return (
        <div className="login-container">
            <h2>{showRegister ? 'Registrera' : 'Logga in'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={showRegister ? handleRegister : handleLogin}>
                {showRegister && (
                    <>
                        <div>
                            <label>Namn:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
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
                    <label>Lösenord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{showRegister ? 'Registrera' : 'Logga in'}</button>
            </form>
            <button onClick={() => setShowRegister(!showRegister)}>
                {showRegister ? 'Tillbaka till inloggning' : 'Skapa ett konto'}
            </button>
        </div>
    );
}

export default Login;

// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Keycloak from "keycloak-js"; // Import Keycloak instance

// Initialize Keycloak
const keycloak = new Keycloak({
    url: "https://keycloak-for-lab3.app.cloud.cbh.kth.se/",
    realm: "fullstack_labb3",
    clientId: "labb2frontend",
});

// In your handleLogin
const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    keycloak.login(); // Redirects to Keycloak login page
};



async function loginUser(credentials) {
    const keycloakUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/realms/fullstack_labb3/protocol/openid-connect/token";
    const clientId = "labb2frontend";

    // Encode the body as application/x-www-form-urlencoded
    const body = new URLSearchParams({
        grant_type: "password",
        client_id: "frontend-app",
        username: credentials.email, // Pass email as username
        password: credentials.password, // Password field
        scope: "openid",
    });

    try {
        const response = await fetch(keycloakUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct Content-Type
            },
            body: body.toString(), // Serialize the body
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login successful:", data);

            // Save tokens to session storage
            const { access_token, refresh_token } = data;

            sessionStorage.setItem("access_token", access_token);
            sessionStorage.setItem("refresh_token", refresh_token);

            // Decode user info from the JWT token
            const userInfo = JSON.parse(atob(access_token.split(".")[1]));
            sessionStorage.setItem("user", JSON.stringify(userInfo));

            return { success: true, authUser: userInfo };
        } else {
            console.error("Login failed:", data);
            return { success: false, error: data.error_description || "Login failed" };
        }
    } catch (error) {
        console.error("Network error during login:", error);
        return { success: false, error: "Network error" };
    }
}


async function registerUser({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle }) {
    return fetch('https://labb2login.app.cloud.cbh.kth.se/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle })
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
    const [gender, setGender] = useState('MALE'); // Standardvärde för kön
    const [role, setRole] = useState('Patient'); // Standardroll
    const [extraFields, setExtraFields] = useState({ age: '', address: '', organizationName: '', speciality: '', roleTitle: '' });
    const [showRegister, setShowRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await loginUser({ email, password });
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

        // Filtrera ut tomma fält från extraFields
        const filteredExtraFields = Object.fromEntries(
            Object.entries(extraFields).filter(([_, value]) => value !== "")
        );

        const data = {
            name,
            gender,
            email,
            password,
            role,
            ...filteredExtraFields // Använd de filtrerade extra fälten
        };

        console.log("Registreringsdata:", data); // Kontrollera vad som skickas efter filtrering

        const result = await registerUser(data);
        if (result.success) {
            setShowRegister(false);
            setErrorMessage('');
            setEmail('');
            setPassword('');
            navigate("/login");
        } else {
            setErrorMessage(result.error);
        }
    };


    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setExtraFields({ age: '', address: '', organizationName: '', speciality: '', roleTitle: '' });
    };

    const handleExtraFieldChange = (e) => {
        const { name, value } = e.target;
        setExtraFields({
            ...extraFields,
            [name]: value,
        });
    };


    return (
        <div className="login-container">
            <h2>{showRegister ? 'Registrera' : 'Logga in'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={showRegister ? handleRegister : handleLogin}>
                {showRegister && (
                    <>
                        <div>
                            <label>Välj roll:</label>
                            <select value={role} onChange={handleRoleChange}>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Worker">Worker</option>
                            </select>
                        </div>

                        {/* Dynamiska fält beroende på vald roll */}
                        {role === 'Patient' && (
                            <div>
                                <label>Ålder:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={extraFields.age}
                                    onChange={handleExtraFieldChange}
                                    required
                                />
                            </div>
                        )}
                        {role === 'Doctor' && (
                            <>
                                <div>
                                    <label>Adress:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={extraFields.address}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Organisationsnamn:</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={extraFields.organizationName}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Specialitet:</label>
                                    <input
                                        type="text"
                                        name="speciality"
                                        value={extraFields.speciality}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {role === 'Worker' && (
                            <>
                                <div>
                                    <label>Adress:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={extraFields.address}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Organisationsnamn:</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={extraFields.organizationName}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Roll:</label>
                                    <input
                                        type="text"
                                        name="roleTitle"
                                        value={extraFields.roleTitle}
                                        onChange={handleExtraFieldChange}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label>Kön:</label>
                            <select className="full-width" value={gender} onChange={(e) => setGender(e.target.value)}
                                    required>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Others</option>
                            </select>
                        </div>

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
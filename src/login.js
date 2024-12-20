import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

// Admin credentials for Keycloak
const adminKeycloakUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/realms/master/protocol/openid-connect/token";
const keycloakAdminClientId = "admin-cli";
const keycloakAdminUsername = "admin";
const keycloakAdminPassword = "admin-password"; // Replace with real credentials

const clientKeycloakUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/realms/fullstack_labb3/protocol/openid-connect/token";
const clientId = "labb2frontend"; // Your frontend client ID

// Fetch admin token for Keycloak
async function getAdminAccessToken() {
    const body = new URLSearchParams({
        grant_type: "password",
        client_id: keycloakAdminClientId,
        username: keycloakAdminUsername,
        password: keycloakAdminPassword,
    });

    try {
        const response = await fetch(adminKeycloakUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        const data = await response.json();
        if (response.ok) {
            return data.access_token;
        } else {
            console.error("Failed to fetch admin token:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching admin token:", error);
        return null;
    }
}

// Register user in Keycloak
async function registerUserInKeycloak(adminToken, { email, password, role }) {
    const registrationUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/admin/realms/fullstack_labb3/users";

    const body = {
        username: email,
        email,
        enabled: true,
        credentials: [
            {
                type: "password",
                value: password,
                temporary: false,
            },
        ],
        attributes: {
            role, // Assign the role as a custom attribute
        },
    };

    try {
        const response = await fetch(registrationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log("User registered in Keycloak successfully.");
            return { success: true };
        } else {
            const data = await response.json();
            console.error("Keycloak registration failed:", data);
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error("Error during Keycloak registration:", error);
        return { success: false, error: "Network error during Keycloak registration" };
    }
}

// Register user in your backend
async function registerUserInBackend({ name, email, gender, role, age, address, organizationName, speciality, roleTitle }) {
    try {
        const response = await fetch('https://labb2login.app.cloud.cbh.kth.se/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, gender, role, age, address, organizationName, speciality, roleTitle }),
        });

        if (response.ok) {
            console.log("User registered in backend successfully.");
            return { success: true };
        } else {
            console.error("Backend registration failed:", await response.json());
            return { success: false, error: 'Failed to register user in backend' };
        }
    } catch (error) {
        console.error("Error during backend registration:", error);
        return { success: false, error: "Network error during backend registration" };
    }
}

// Login user
async function loginUser({ email, password }) {
    const body = new URLSearchParams({
        grant_type: "password",
        client_id: clientId,
        username: email,
        password: password,
        scope: "openid",
    });

    try {
        const response = await fetch(clientKeycloakUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        const data = await response.json();

        if (response.ok) {
            const { access_token, refresh_token } = data;

            // Save tokens to session storage
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

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('MALE');
    const [role, setRole] = useState('Patient');
    const [extraFields, setExtraFields] = useState({ age: '', address: '', organizationName: '', speciality: '', roleTitle: '' });
    const [showRegister, setShowRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginResult = await loginUser({ email, password });

        if (loginResult.success) {
            setErrorMessage('');
            onLogin(loginResult.authUser); // Notify parent component about successful login
            navigate('/dashboard'); // Redirect to the dashboard or home page
        } else {
            setErrorMessage(loginResult.error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const adminToken = await getAdminAccessToken();
        if (!adminToken) {
            setErrorMessage("Failed to fetch admin token.");
            return;
        }

        const keycloakResult = await registerUserInKeycloak(adminToken, {
            email,
            password,
            role,
        });

        if (!keycloakResult.success) {
            setErrorMessage(keycloakResult.error || "Keycloak registration failed.");
            return;
        }

        const filteredExtraFields = Object.fromEntries(
            Object.entries(extraFields).filter(([_, value]) => value !== "")
        );

        const backendResult = await registerUserInBackend({
            name,
            gender,
            email,
            role,
            ...filteredExtraFields,
        });

        if (backendResult.success) {
            setShowRegister(false);
            setErrorMessage('');
            setEmail('');
            setPassword('');
            navigate("/login");
        } else {
            setErrorMessage(backendResult.error);
        }
    };

    return (
        <div className="login-container">
            <h2>{showRegister ? 'Register' : 'Login'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={showRegister ? handleRegister : handleLogin}>
                {showRegister && (
                    <>
                        <div>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Role:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Worker">Worker</option>
                            </select>
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
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{showRegister ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setShowRegister(!showRegister)}>
                {showRegister ? 'Back to Login' : 'Create an Account'}
            </button>
        </div>
    );
}

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const clientKeycloakUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/realms/fullstack_labb3/protocol/openid-connect/token";
const clientId = "frontend-app"; // Your frontend client ID

async function registerUser({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle }) {
    try {
        const response = await fetch('https://labb2login.app.cloud.cbh.kth.se/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle })
        });
        if (response.ok) {
            return { success: true };
        }
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Misslyckades att registrera användare' };
    } catch {
        return { success: false, error: 'Misslyckades att registrera användare' };
    }
}

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
            sessionStorage.setItem("access_token", access_token);
            sessionStorage.setItem("refresh_token", refresh_token);

            const userInfo = JSON.parse(atob(access_token.split(".")[1]));
            sessionStorage.setItem("user", JSON.stringify(userInfo));

            return { success: true, authUser: userInfo };
        } else {
            return { success: false, error: data.error_description || "Login failed" };
        }
    } catch {
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
            onLogin(loginResult.authUser);
            navigate('/dashboard');
        } else {
            setErrorMessage(loginResult.error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const filteredExtraFields = Object.fromEntries(
            Object.entries(extraFields).filter(([_, value]) => value !== "")
        );

        const data = { name, gender, email, password, role, ...filteredExtraFields };

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
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Others</option>
                            </select>
                        </div>
                        <div>
                            <label>Namn:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    </>
                )}
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Lösenord:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

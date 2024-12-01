// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

async function loginUser(credentials) {
    return fetch('https://fullstacklab.app.cloud.cbh.kth.se/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(res => res.json().then(data => {
            if (res.ok) {
                console.log("här är datas som fås tbx"+data);
                sessionStorage.setItem("userId", data.id); // Uppdaterad för att matcha LoginResponseDTO
                sessionStorage.setItem("role", data.role); // Lagra rollen för användning i appen
                return { success: true, authUser: data }; // Returnera hela `LoginResponseDTO`

            } else {
                return { success: false, error: data.message || 'Misslyckades att logga in' };
            }
        }))
        .catch(error => {
            console.error('Inloggningsfel:', error);
            return { success: false, error: 'Ett fel inträffade vid inloggning' };
        });
}


async function registerUser({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle }) {
    return fetch('https://fullstacklab.app.cloud.cbh.kth.se/api/users/register', {
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
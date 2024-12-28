import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const clientKeycloakUrl = "https://keycloak-for-lab3.app.cloud.cbh.kth.se/realms/fullstack_labb3/protocol/openid-connect/token";
const clientId = "frontend-app"; // Your frontend client ID

async function registerUser({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle }) {
    const body2 = new URLSearchParams({
        grant_type: "password",
        client_id: clientId,
        username: email,
        password: password,
        scope: "openid",
    });

    try {
        // Step 1: Attempt to login to Keycloak
        const response2 = await fetch(clientKeycloakUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body2.toString(),
        });

        if (!response2.ok) {
            // If Keycloak login fails, return an error
            const errorData = await response2.json();
            return { success: false, error: errorData.error_description || 'Failed to login to Keycloak' };
        }
        const accessToken =sessionStorage.getItem("access_token");
        // Step 2: If Keycloak login succeeds, proceed with backend registration
        const response = await fetch('https://labb2login.app.cloud.cbh.kth.se/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Send the token in the Authorization header
            },
            body: JSON.stringify({ name, email, password, gender, role, age, address, organizationName, speciality, roleTitle }),
        });

        if (response.ok) {
            return { success: true };
        }

        // Handle backend registration error
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to register user' };

    } catch (error) {
        // Handle network or unexpected errors
        console.error("Error in registerUser:", error);
        return { success: false, error: 'Network error or unexpected issue occurred' };
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

            // Decode the JWT token to extract user info
            const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
            const { email } = decodedToken;
            const roles = decodedToken.realm_access?.roles || [];
            const role = roles.find(r => r === "patient" || r === "doctor" || r === "worker") || "unknown"; // Default to 'unknown' if no relevant role is found

            console.log("Extracted Role:", role);


            // Save basic user info in session storage
            sessionStorage.setItem("user", JSON.stringify(decodedToken));
            console.log("yoyooy rn the acesstoken is "+ access_token)
            // Fetch full user details from the backend
            const userResponse = await fetch(`https://labb2journal.app.cloud.cbh.kth.se/api/patients/patientByEmail?email=${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user details");
            }

            const userData = await userResponse.json();
            // Add the role to the userData object
            userData.role = role;
            // Save full user details in session storage
            sessionStorage.setItem("userId", userData.userId); // Save only userId as a string
            sessionStorage.setItem("user_details", JSON.stringify(userData));
            sessionStorage.setItem("patentId",userData.patientId)

            sessionStorage.setItem("role",role);

            return { success: true, authUser: userData }; // Return the full user data
        } else {
            return { success: false, error: data.error_description || "Login failed" };
        }
    } catch (error) {
        console.error("Error during login:", error);
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
            onLogin(loginResult.authUser); // Notify parent component with full user details
            navigate('/'); // Redirect to dashboard or home page
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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './viewEmployees.css';  // Importera CSS-filen för ViewEmployeesPage

function ViewEmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees data from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = sessionStorage.getItem('access_token'); // Retrieve the token from session storage
                if (!token) {
                    throw new Error('Unauthorized access. Please log in.');
                }

                const response = await fetch('https://labb2journal.app.cloud.cbh.kth.se/api/employees/getAllEmployees', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                setEmployees(data); // Set the employees data to state
            }catch (error) {
                setError('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className="employees-container">
            <h2>Employees List</h2>
            {loading && <p>Loading employees...</p>}
            {error && <p className="error-message">{error}</p>}

            {employees.length > 0 ? (
                <ul className="employee-list">
                    {employees.map((employee) => (
                        <li key={employee.userId} className="employee-item">
                            <div className="employee-info">
                                <strong>{employee.name}</strong>
                                <span>{employee.status}</span>
                            </div>

                            {/* Buttons for each employee */}
                            <div className="button-container">
                                <Link to={`/send-message/${employee.userId}`}>
                                    <button className="button">Message</button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No employees found.</p>
            )}
        </div>
    );
}

export default ViewEmployeesPage;

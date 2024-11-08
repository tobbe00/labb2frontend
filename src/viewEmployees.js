import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ViewEmployeesPage() {
    // State to hold the list of employees
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees data from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/employees/getAllEmployees'); // Replace with your actual API endpoint

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                setError('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className="employees-container">
            <h2>Employees</h2>
            {loading && <p>Loading employees...</p>}
            {error && <p className="error-message">{error}</p>}

            {employees.length > 0 ? (
                <ul>
                    {employees.map((employee) => (
                        <li key={employee.userId} className="employee-item">
                            <hr />
                            <span><strong>Name:</strong> {employee.name}</span>
                            <span><strong>Status:</strong> {employee.status}</span>

                            {/* Display button with action */}
                            <Link to={`/send-message/${employee.userId}`}>
                                <button className="message-button">
                                    Message
                                </button>
                            </Link>
                            <hr />
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

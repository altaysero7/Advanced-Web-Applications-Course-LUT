import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const registrationData = { email, password };

        fetch("/api/user/account/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return response.text();
        })
        .then(() => {
            navigate('/login');
        })
        .catch(error => {
            setError(error.message || "An error occurred while registering. Please try again.");
        });
    };

    return (
        <div className="container">
            <div className="register">
                <h2>Registration Page</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email"><strong>Email: </strong></label>
                    <input type="email" name="email" placeholder="Enter Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password"><strong>Password: </strong></label>
                    <input type="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <input type="submit" value="Register" />
                </form>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </div>
            <button onClick={() => navigate('/')}>Go back Home</button>
        </div>
    );
}

export default RegistrationPage;

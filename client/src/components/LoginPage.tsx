import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const loginData = { email, password };

        fetch("/api/user/account/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem("auth_token", data.token);
                    navigate(`/user/${email}`);
                }
            })
            .catch(error => {
                setError(error.message || "An error occurred while logging in. Please try again.");
            });
    };

    return (
        <div className="container">
            <div className="login">
                <h2>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email"><strong>Email: </strong></label>
                    <input type="email" name="email" placeholder="Enter Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password"><strong>Password: </strong></label>
                    <input type="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <input type="submit" value="Login" />
                </form>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </div>
            <button onClick={() => navigate('/')}>Go back Home</button>
        </div>
    );
}

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
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
                    onLoginSuccess();
                    navigate(`/user/${email}`);
                }
            })
            .catch(error => {
                setError(error.message || "An error occurred while logging in. Please try again.");
            });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <Card.Body>
                    <h2 className="text-center mb-4">Login Page</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
                <div className="text-center mt-2">
                    <Button variant="link" onClick={() => navigate('/')}>Go back Home</Button>
                </div>
            </Card>
        </Container>
    );
};

export default LoginPage;

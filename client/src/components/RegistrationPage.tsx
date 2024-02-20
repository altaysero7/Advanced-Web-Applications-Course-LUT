import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';


const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (registrationSuccess) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [registrationSuccess, navigate]);

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
                return response.text();
            })
            .then((responseText) => {
                if (responseText === 'User successfully registered') {
                    setRegistrationSuccess(true);
                } else {
                    setError(responseText);
                }
            })
            .catch(error => {
                setError(error.message || "An error occurred while registering. Please try again.");
            });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <Card.Body>
                    {registrationSuccess ? (
                        <Alert variant="success">
                            Registration successful! Redirecting to login page...
                        </Alert>
                    ) : (
                        <>
                            <h2 className="text-center mb-4">Registration Page</h2>
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
                                        Register
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Card.Body>
                <div className="text-center mt-2">
                    <Button variant="link" onClick={() => navigate('/')}>Go back Home</Button>
                </div>
            </Card>
        </Container>
    );
};

export default RegistrationPage;

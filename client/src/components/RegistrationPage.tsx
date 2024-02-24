// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: https://getbootstrap.com/docs/4.0/components

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Redirecting to the login page after successful registration
    useEffect(() => {
        if (registrationSuccess) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirecting after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [registrationSuccess, navigate]);

    // Registering the user
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const registrationData: { email: string; password: string } = { email, password };

        // Sending the registration request
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
                    setError(t(responseText));
                }
            })
            .catch(error => {
                setError(t(error.message, { defaultValue: "An error occurred while registering. Please try again." }));
            });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <Card.Body>
                    {registrationSuccess ? (
                        <Alert variant="success">
                            {t('Registration successful! Redirecting to login page...')}
                        </Alert>
                    ) : (
                        <>
                            <h2 className="text-center mb-4">{t('Registration Page')}</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>{t('Email address')}</Form.Label>
                                    <Form.Control type="email" placeholder={t('Enter email')} required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>{t('Password')}</Form.Label>
                                    <Form.Control type="password" placeholder={t('Enter password')} required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit">
                                    {t('Register')}
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Card.Body>
                <div className="text-center mt-2">
                    <Button variant="link" onClick={() => navigate('/')}>{t('Go back Home')}</Button>
                </div>
            </Card>
        </Container>
    );
};

export default RegistrationPage;

// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: https://getbootstrap.com/docs/4.0/components/alerts/

import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBirthdayCake, faPizzaSlice, faPalette, faFilm, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import UnauthorizedErrorPage from './UnAuthorizedErrorPage';
import { useTranslation } from 'react-i18next';

interface FormData {
    name: string;
    surname: string;
    age: string;
    favoriteFood: string;
    favoriteColor: string;
    favoriteMovieGenre: string;
    email: string | undefined;
}

interface UpdateUserInfoProps {
    userEmail?: string;
    onUserInfoUpdated: (updatedName: string) => void;
}

const UpdateUserInfo: React.FC<UpdateUserInfoProps> = ({ userEmail, onUserInfoUpdated }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        age: '',
        favoriteFood: '',
        favoriteColor: '',
        favoriteMovieGenre: '',
        email: userEmail
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const { t } = useTranslation();

    // Fetching user information
    useEffect(() => {
        fetchUserInfo(userEmail);
    }, [userEmail]);

    const fetchUserInfo = async (email: string | undefined) => {
        fetchWithAuth(`/api/user/info/${email}`)
            .then(response => {
                if (!response) throw new Error('FETCH_ERROR');
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data) {
                    setFormData({
                        name: data.name || '',
                        surname: data.surname || '',
                        age: data.age.toString() || '',
                        favoriteFood: data.favoriteFood || '',
                        favoriteColor: data.favoriteColor || '',
                        favoriteMovieGenre: data.favoriteMovieGenre || '',
                        email: data.email
                    });
                }
            })
            .catch(error => {
                setIsSuccess(false);
                setShowToast(true);
                const errorMessage = error?.message ?? '';
                if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                    setIsAuthenticated(false);
                } else {
                    setToastMessage(t('Error fetching user info:') + " " + t(error));
                }
            });
    };

    // Handling form input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handling form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = {
            name: formData.name,
            surname: formData.surname,
            age: Number(formData.age),
            favoriteFood: formData.favoriteFood,
            favoriteColor: formData.favoriteColor,
            favoriteMovieGenre: formData.favoriteMovieGenre,
            email: formData.email
        };

        // Sending the updated user information to the server
        fetchWithAuth(`/api/user/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response) throw new Error('FETCH_ERROR');
                if (response.ok) {
                    setToastMessage(t('Your information has been updated successfully.'));
                    setIsSuccess(true);
                    setShowToast(true);
                    onUserInfoUpdated(data.name);
                } else {
                    throw new Error('Failed to update information');
                }
            })
            .catch(error => {
                setIsSuccess(false);
                setShowToast(true);
                const errorMessage = error?.message ?? '';
                if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                    setIsAuthenticated(false);
                } else {
                    setToastMessage(t('Error updating user info:') + " " + t(error));
                }
            });
    };

    // Creating input fields for the form using the given parameters
    const createInputField = (name: keyof FormData, label: string, type: 'text' | 'number' | 'email', icon: IconDefinition) => (
        <Form.Group as={Col} md="6" className="mb-3" controlId={`form${name}`}>
            <Form.Label><FontAwesomeIcon icon={icon} /> {t(label)}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required={name !== 'email'}
                disabled={name === 'email'}
                placeholder={t(`Enter ${label}`)}
                style={name === 'email' ? { cursor: 'not-allowed' } : {}}
            />
        </Form.Group>
    );

    if (!isAuthenticated) {
        return <UnauthorizedErrorPage />;
    }

    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">{t('Update User Information')}</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {createInputField('name', 'Name', 'text', faUser)}
                            {createInputField('surname', 'Surname', 'text', faUser)}
                            {createInputField('age', 'Age', 'number', faBirthdayCake)}
                            {createInputField('favoriteFood', 'Favorite Food', 'text', faPizzaSlice)}
                            {createInputField('favoriteColor', 'Favorite Color', 'text', faPalette)}
                            {createInputField('favoriteMovieGenre', 'Favorite Movie Genre', 'text', faFilm)}
                            {createInputField('email', 'Email', 'email', faEnvelope)}
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3 w-100">{t('Update Information')}</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{ position: 'fixed', bottom: '20px', right: '20px', color: 'black', backgroundColor: isSuccess ? 'green' : 'red' }}>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Container>
    );
}

export default UpdateUserInfo;

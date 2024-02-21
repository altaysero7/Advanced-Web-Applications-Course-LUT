// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: https://getbootstrap.com/docs/4.0/components/alerts/

import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBirthdayCake, faPizzaSlice, faPalette, faFilm, IconDefinition } from '@fortawesome/free-solid-svg-icons';

const authToken = localStorage.getItem('auth_token');

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

    // Fetching user information
    useEffect(() => {
        fetchUserInfo(userEmail);
    }, [userEmail]);

    const fetchUserInfo = async (email: string | undefined) => {
        fetch(`/api/user/info/${email}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => {
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
                setToastMessage(`Error fetching user info:  ${error}`);
                setIsSuccess(false);
                setShowToast(true);
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
        fetch(`/api/user/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    setToastMessage('Your information has been updated successfully.');
                    setIsSuccess(true);
                    setShowToast(true);
                    onUserInfoUpdated(data.name);
                } else {
                    throw new Error('Failed to update information');
                }
            })
            .catch(error => {
                setToastMessage(`Error updating user info: ${error}`);
                setIsSuccess(false);
                setShowToast(true);
            });
    };

    // Creating input fields for the form using the given parameters
    const createInputField = (name: keyof FormData, label: string, type: 'text' | 'number' | 'email', icon: IconDefinition) => (
        <Form.Group as={Col} md="6" className="mb-3" controlId={`form${name}`}>
            <Form.Label><FontAwesomeIcon icon={icon} /> {label}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required={name !== 'email'}
                disabled={name === 'email'}
                placeholder={`Enter ${label}`}
                style={name === 'email' ? { cursor: 'not-allowed' } : {}}
            />
        </Form.Group>
    );

    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Update User Information</Card.Title>
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
                        <Button variant="primary" type="submit" className="mt-3 w-100">Update Information</Button>
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
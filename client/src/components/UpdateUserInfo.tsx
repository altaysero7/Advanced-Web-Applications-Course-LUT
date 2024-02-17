// Referencing: https://getbootstrap.com/docs/4.0/components/alerts/

import { useEffect, useState } from 'react';
import '../styles/updateUserInfo.css';
const authToken = localStorage.getItem('auth_token');

function UpdateUserInfo({ userEmail }: { userEmail: string | undefined }) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        age: '',
        favoriteFood: '',
        favoriteColor: '',
        favoriteMovieGenre: '',
        email: userEmail
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        fetchUserInfo(userEmail);
    }, []);

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
                setError('Error fetching user info' + error);
            });
    };

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event: any) => {
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

        fetch(`/api/user/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        })
        .then(async response => {
            if (response.ok) {
                return setSuccess(await response.text());
            }
        })
        .catch(error => {
            setError('Error updating user info: ' + error);
        });
    };

    const createInputField = (name: string, label: string, type = 'text') => (
        <div className="mb-2">
            <label htmlFor={`${name}Input`} className="form-label">{label}</label>
            <input
                type={type}
                className={`form-control ${name === 'email' ? 'read-only-input' : ''}`}
                id={`${name}Input`}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required
                disabled={name === 'email'}
            />
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
                        <h3 className="text-center mb-3">Update User Information</h3>
                        {createInputField('name', 'Name')}
                        {createInputField('surname', 'Surname')}
                        {createInputField('age', 'Age', 'number')}
                        {createInputField('favoriteFood', 'Favorite Food')}
                        {createInputField('favoriteColor', 'Favorite Color')}
                        {createInputField('favoriteMovieGenre', 'Favorite Movie Genre')}
                        {createInputField('email', 'Email', 'email')}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary mt-2">Update Information</button>
                        </div>
                    </form>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {success && <div className="alert alert-success" role="alert">{success}</div>}
                </div>
            </div>
        </div>
    );
}

export default UpdateUserInfo;

import React, { useState } from 'react';

function AddBook() {
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: e.target.name.value,
            author: e.target.author.value,
            pages: e.target.pages.value
        };

        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setMessage('Book successfully added!');
                window.location.replace('/book/' + formData.name);
            } else if (response.status === 403) {
                const responseBody = await response.text();
                setMessage(responseBody);
            } else {
                setMessage('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Error happened while fetching data:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input id="name" type="text" name="name" />
                <br />
                <label htmlFor="author">Author: </label>
                <input id="author" type="text" name="author" />
                <br />
                <label htmlFor="number">Pages: </label>
                <input id="pages" type="number" name="pages" />
                <br />
                <input id="submit" type="submit" value="Submit" />
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default AddBook

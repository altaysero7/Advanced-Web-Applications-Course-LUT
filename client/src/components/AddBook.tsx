import { useState, FormEvent } from 'react';

function AddBook() {
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            name: { value: string };
            author: { value: string };
            pages: { value: number };
        };

        const formData = {
            name: target.name.value,
            author: target.author.value,
            pages: target.pages.value
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
        } catch (error: any) {
            console.error('Error happened while fetching data:', error);
            setMessage('Error occurred. Please try again later.');
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
                <label htmlFor="pages">Pages: </label>
                <input id="pages" type="number" name="pages" />
                <br />
                <input id="submit" type="submit" value="Submit" />
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default AddBook;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface IBook {
    name: string;
    author: string;
    pages: number;
}

function BookDetails() {
    const [book, setBook] = useState<IBook | null>(null);
    const { bookName } = useParams<{ bookName: string }>();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`/api/book/${bookName}`);
                if (response.ok) {
                    const data: IBook = await response.json();
                    setBook(data);
                }
            } catch (error: any) {
                console.error('Error while fetching book details:', error);
            }
        };

        fetchBook();
    }, [bookName]);

    if (!book) {
        return (
            <div>
                <p>Book not found</p>
            </div>
        );
    } else {
        return (
            <div>
                <p>Name: {book.name}</p>
                <p>Author: {book.author}</p>
                <p>Pages: {book.pages}</p>
            </div>
        );
    }
}

export default BookDetails;

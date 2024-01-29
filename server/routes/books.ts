import express, { Request, Response, NextFunction } from 'express';
import { Book } from '../mongodb/models/Books';
const router = express.Router();

interface IBook {
    author: string;
    name: string;
    pages: number;
    save: () => Promise<IBook>;
}

/* POST book. */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    Book.findOne({ name: req.body.name })
        .then((book: IBook | null) => {
            if (book) {
                res.status(403).send("Book already in the database");
                return;
            } else {
                const newBook = new Book({
                    author: req.body.author,
                    name: req.body.name,
                    pages: req.body.pages
                }) as IBook;
                return newBook.save();
            }
        })
        .then((savedBook: IBook | undefined) => {
            if (savedBook) {
                res.status(200).send("ok");
            }
        })
        .catch((err: any) => {
            next(err);
        });
});

/* GET book. */
router.get('/:bookName', (req: Request, res: Response, next: NextFunction) => {
    Book.findOne({ name: req.params.bookName })
        .then((book: IBook | null) => {
            if (book) {
                res.status(200).json(book)
            } else {
                res.status(404).send("Book not found");
                return;
            }
        })
        .catch((err: any) => {
            next(err);
        });
});

export default router;

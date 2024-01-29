const express = require('express');
const { Book } = require('../mongodb/models/Books');
const router = express.Router();


/* POST book. */
router.post('/', (req, res, next) => {
    Book.findOne({ name: req.body.name })
        .then(book => {
            if (book) {
                res.status(403).send("Book already in the database");
                return;
            } else {
                const newBook = new Book({
                    author: req.body.author,
                    name: req.body.name,
                    pages: req.body.pages
                });
                return newBook.save();
            }
        })
        .then(savedBook => {
            if (savedBook) {
                res.status(200).send("ok");
            }
        })
        .catch(err => {
            next(err);
        });
});

/* GET book. */
router.get('/:bookName', (req, res, next) => {
    Book.findOne({ name: req.params.bookName })
        .then(book => {
            if (book) {
                return res.status(200).json(book)
            } else {
                res.status(404).send("Book not found");
                return;
            }
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;

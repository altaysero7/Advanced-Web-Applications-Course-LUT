const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    author: String,
    name: String,
    pages: Number,
});

module.exports = {
    Book: mongoose.model('Book', bookSchema)
}

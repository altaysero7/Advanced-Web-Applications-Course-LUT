var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const cors = require('cors');

const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/book', booksRouter);

app.use('/api/*', (req, res) => {
    res.status(404).send('API endpoint not found');
});

if (process.env.NODE_ENV === 'production') { //NODE_ENV=production npm start
    app.use(express.static(path.resolve('..', 'client', 'build')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
    );
} else if (process.env.NODE_ENV === 'development') { //NODE_ENV=development npm start
    var corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}

module.exports = app;

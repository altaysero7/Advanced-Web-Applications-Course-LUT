import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import { Request, Response } from 'express';
import booksRouter from './routes/books';

const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/book', booksRouter);

app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).send('API endpoint not found');
});

if (process.env.NODE_ENV === 'production') { //NODE_ENV=production npm start
    app.use(express.static(path.resolve('..', 'client', 'build')));
    app.get('*', (req: Request, res: Response) =>
        res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
    );
} else if (process.env.NODE_ENV === 'development') { //NODE_ENV=development npm start
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}

export default app;

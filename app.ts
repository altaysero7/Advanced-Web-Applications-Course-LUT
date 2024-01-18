// Referencing week 8-9 source code

import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

import usersRouter from './routes/users';
import privateRouter from './routes/private';
import todosRouter from './routes/todos';

import { setupAuthentication } from './passport-config';

const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(express.static('public'));

setupAuthentication(passport);
app.use(passport.initialize());

app.get('/', (req: Request, res: Response) => {
    res.redirect('/index.html');
});

app.use('/api/user', usersRouter);
app.use('/api/private', privateRouter);
app.use('/api/todos', todosRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

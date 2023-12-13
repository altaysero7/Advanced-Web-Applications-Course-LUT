// Referencing week 7 source code

import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';

import usersRouter, { getUserbyName, getUserbyId } from './routes/users';
import secretRouter from './routes/secret';
import todosRouter from './routes/todos';
const setupAuthentication  = require('./passport-config');

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.use(session({
    secret: 'veryverysecretkey',
    resave: false,
    saveUninitialized: false
}));

setupAuthentication(passport, getUserbyName, getUserbyId);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/user', usersRouter);
app.use('/api/secret', secretRouter);
app.use('/api/todos', todosRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
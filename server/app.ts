import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { Request, Response } from 'express';

import userAccountRouter from './routes/userAccount';
import userInfoRouter from './routes/userInfo';
import allProfilesRouter from './routes/allProfiles';
import userInteractions from './routes/userInteractions';

import { setupAuthentication } from './passport-config';

const mongoDB = "mongodb+srv://allUsers:cwTeItQS6d5l1fdu@cluster0.wrwdzn2.mongodb.net/";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

setupAuthentication(passport);
app.use(passport.initialize());

app.use('/api/user/account', userAccountRouter);
app.use('/api/user/info', userInfoRouter);
app.use('/api/allProfiles', allProfilesRouter);
app.use('/api/user/interactions', userInteractions);

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

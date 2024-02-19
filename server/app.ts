import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { Request, Response } from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { ChatMessage } from './mongodb/models/Chat';

import userAccountRouter from './routes/userAccount';
import userInfoRouter from './routes/userInfo';
import allProfilesRouter from './routes/allProfiles';
import userInteractionsRouter from './routes/userInteractions';
import userChatRouter from './routes/userChat';

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
app.use('/api/user/interactions', userInteractionsRouter);
app.use('/api/chat', userChatRouter);

app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).send('API endpoint not found');
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected!", socket.id);

    socket.on("chat message", ({from, to, data}) => {
        const newMessage = new ChatMessage({ // Saving the message to the database
            from,
            to,
            data,
        });
        newMessage.save()
            .then(() => {
                console.log("Message saved to database");
                io.emit("chat message", { from, to, data });
            })
            .catch(err => console.error("Error saving message:", err));
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(4000, () => {
    console.log("listening on port 4000");
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

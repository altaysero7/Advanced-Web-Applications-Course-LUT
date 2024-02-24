// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

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

interface ChatMessagePayload {
    from: string;
    to: string;
    data: string;
}

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

// Creating a server to enable chat functionality between users
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("chat message", (payload: ChatMessagePayload) => {
        const newMessage = new ChatMessage(payload); // Saving the message to the database
        newMessage.save()
            .then(() => {
                console.log("Message saved to database");
                io.emit("chat message", payload);
            })
            .catch(err => console.error("Error saving message:", err));
    });
    socket.on("disconnect", () => {});
});

server.listen(4000, () => {
    console.log("chat server is created");
});

// Serving static assets if in production and else enable CORS
if (process.env.NODE_ENV === 'production') { //NODE_ENV=production npm start (first "npm run build" to create the build folder in the client folder if any changes have been made to the client side code)
    app.use(express.static(path.resolve('..', 'client', 'build')));
    app.get('*', (req: Request, res: Response) =>
        res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
    );
    console.log("server is running in production mode at http://localhost:3131");
} else if (process.env.NODE_ENV === 'development') { //NODE_ENV=development npm start (or npm start)
    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}

export default app;

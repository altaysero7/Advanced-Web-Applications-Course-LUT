// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

import express, { Request, Response } from 'express';
import passport from 'passport';
import { ChatMessage } from '../mongodb/models/Chat';

const router = express.Router();
router.use(express.urlencoded({ extended: true }));


/* GET user chat history. */
router.get('/history/:user1/:user2', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await ChatMessage.find({
            $or: [
                { from: user1, to: user2 },
                { from: user2, to: user1 },
            ]
        }).sort({ timestamp: 1 }); // Sorting by timestamp to get messages in order

        res.json(messages);
    } catch (err) {
        res.status(500).send("Error fetching chat history");
    }
});

export default router;

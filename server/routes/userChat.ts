// Referencing https://express-validator.github.io/docs/6.6.0/

import express from 'express';
import { userAccount, UserInfo } from '../mongodb/models/User';
// import passport from 'passport';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
import { ChatMessage } from '../mongodb/models/Chat';


/* GET user chat history. */
router.get('/history/:user1/:user2', async (req, res) => {
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

//TODO: , passport.authenticate('jwt', { session: false }),
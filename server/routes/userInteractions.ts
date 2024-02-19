// Referencing https://express-validator.github.io/docs/6.6.0/

import express, { Request, Response, NextFunction } from 'express';
import { userAccount, UserInfo, UserInteractions } from '../mongodb/models/User';
// import passport from 'passport';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

/* POST user interaction. */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userAccount.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const likedUsers = Array.isArray(req.body.liked) ? req.body.liked : req.body.liked ? [req.body.liked] : [];
        const dislikedUsers = Array.isArray(req.body.disliked) ? req.body.disliked : req.body.disliked ? [req.body.disliked] : [];


        // Updating the liked and disliked lists
        await UserInteractions.findOneAndUpdate(
            { userId: user._id },
            { $addToSet: { liked: { $each: likedUsers }, disliked: { $each: dislikedUsers } } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Removing users from liked or disliked lists to avoid duplicates
        if (dislikedUsers.length > 0) {
            await UserInteractions.updateOne(
                { userId: user._id },
                { $pull: { liked: { $in: dislikedUsers } } }
            );
        }
        if (likedUsers.length > 0) {
            await UserInteractions.updateOne(
                { userId: user._id },
                { $pull: { disliked: { $in: likedUsers } } }
            );
        }

        // Add to matched if mutual like exists, and remove from matched if disliked
        for (const likedUserId of likedUsers) {
            const likedUserInteraction = await UserInteractions.findOne({ userId: likedUserId, liked: user._id });
            if (likedUserInteraction) {
                // Mutual like found, add to matched list
                await UserInteractions.updateOne({ userId: user._id }, { $addToSet: { matched: likedUserId } });
                await UserInteractions.updateOne({ userId: likedUserId }, { $addToSet: { matched: user._id } });
            }
        }

        // Removing from matched list if user is now disliked
        for (const dislikedUserId of dislikedUsers) {
            await UserInteractions.updateOne({ userId: user._id }, { $pull: { matched: dislikedUserId } });
            await UserInteractions.updateOne({ userId: dislikedUserId }, { $pull: { matched: user._id } });
        }

        res.status(200).send("User interactions successfully updated");
    } catch (err: any) {
        next(err);
    }
});

/* GET user interactions. */
router.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userAccount.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const interactions = await UserInteractions.findOne({ userId: user._id });
        if (!interactions) {
            return res.status(404).send("Interactions not found");
        }

        res.status(200).json({
            liked: interactions.liked,
            disliked: interactions.disliked,
            matched: interactions.matched,
        });
    } catch (err) {
        next(err);
    }
});

export default router;

//TODO: , passport.authenticate('jwt', { session: false }),
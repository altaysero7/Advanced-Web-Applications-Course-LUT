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

        // Avoiding duplication
        await UserInteractions.findOneAndUpdate(
            { user: user._id },
            { $pull: { liked: { $in: dislikedUsers }, disliked: { $in: likedUsers } } },
            { new: true }
        );

        await UserInteractions.findOneAndUpdate(
            { user: user._id },
            { $addToSet: { liked: { $each: likedUsers }, disliked: { $each: dislikedUsers } } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Checking for mutual likes
        for (const likedUserId of likedUsers) {
            const matchedInteraction = await UserInteractions.findOne({ user: likedUserId, liked: user._id });
            if (matchedInteraction) {
                await Promise.all([
                    UserInteractions.findOneAndUpdate({ user: user._id }, { $addToSet: { matched: likedUserId } }, { new: true }),
                    UserInteractions.findOneAndUpdate({ user: likedUserId }, { $addToSet: { matched: user._id } }, { new: true })
                ]);
            }
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

        const interactions = await UserInteractions.findOne({ user: user._id });
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
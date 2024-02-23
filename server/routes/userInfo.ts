// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

import express, { Request, Response, NextFunction } from 'express';
import { userAccount, UserInfo } from '../mongodb/models/User';
import passport from 'passport';
import { checkUserEmail } from '../middlewares/checkUserEmail';

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface UserRequestBody {
    email: string;
    name: string;
    surname: string;
    age: number;
    favoriteFood: string;
    favoriteColor: string;
    favoriteMovieGenre: string;
}

/* POST user information. */
router.post('/', passport.authenticate('jwt', { session: false }), checkUserEmail('body'), function (req: Request, res: Response, next: NextFunction) {
    const body: UserRequestBody = req.body;

    userAccount.findOne({ email: body.email })
        .then((user) => {
            if (!user) {
                res.status(404).send("User not found");
                return;
            }
            const query = { userId: user._id };
            const update = { $set: { ...body, userId: user._id } }; // everything in the body will be inserted
            const options = { upsert: true, new: true, setDefaultsOnInsert: true }; // upsert: create if not found, new: return updated document when true, setDefaultsOnInsert: set default values if not found

            return UserInfo.findOneAndUpdate(query, update, options);
        })
        .then(updatedOrNewDocument => {
            if (updatedOrNewDocument) {
                res.status(200).send("User info successfully updated");
                return;
            }
        })
        .catch(err => {
            next(err);
        });
});

/* GET user information. */
router.get('/:email', passport.authenticate('jwt', { session: false }), checkUserEmail(), function (req: Request, res: Response, next: NextFunction) {
    UserInfo.findOne({ email: req.params.email })
        .then((userInfo) => {
            if (userInfo) {
                res.status(200).json(userInfo);
            } else {
                res.status(404).send("User info not found");
                return;
            }
        })
        .catch((err: any) => {
            next(err);
        });
});

/* GET user information by id. */
router.get('/id/:id', passport.authenticate('jwt', { session: false }), function (req: Request, res: Response, next: NextFunction) {
    UserInfo.findOne({ userId: req.params.id })
        .then((userInfo) => {
            if (userInfo) {
                res.status(200).json(userInfo);
            } else {
                res.status(404).send("User info not found");
                return;
            }
        })
        .catch((err: any) => {
            next(err);
        });
});

export default router;

// Referencing https://express-validator.github.io/docs/6.6.0/

import express from 'express';
import { userAccount, UserInfo } from '../mongodb/models/User';
// import passport from 'passport';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

/* POST user information. */
router.post('/', function (req: any, res: any, next: any) {
    userAccount.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }
            const query = { userId: user._id };
            const update = {
                $set: {
                    userId: user._id,
                    email: req.body.email,
                    name: req.body.name,
                    surname: req.body.surname,
                    age: req.body.age,
                    favoriteFood: req.body.favoriteFood,
                    favoriteColor: req.body.favoriteColor,
                    favoriteMovieGenre: req.body.favoriteMovieGenre
                }
            };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true }; // upsert: create if not found, new: return updated document when true, setDefaultsOnInsert: set default values if not found

            return UserInfo.findOneAndUpdate(query, update, options);
        })
        .then(updatedOrNewDocument => {
            if (updatedOrNewDocument) {
                res.status(200).send("User info successfully updated");
            }
        })
        .catch(err => {
            next(err);
        });
});

/* GET user information. */
router.get('/:email', function (req: any, res: any, next: any) {
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
router.get('/id/:id', function (req: any, res: any, next: any) {
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

//TODO: , passport.authenticate('jwt', { session: false }),
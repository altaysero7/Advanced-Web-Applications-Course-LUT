// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

import express, { Request, Response, NextFunction } from 'express';
import { UserInfo } from '../mongodb/models/User';
// import passport from 'passport';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

/* GET all profiles. */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    UserInfo.find({})
        .then((profiles) => {
            if (profiles) {
                res.status(200).json(profiles);
            } else {
                res.status(404).send("No profiles found");
                return;
            }
        })
        .catch((err: any) => {
            next(err);
        });
});

export default router;

//TODO: , passport.authenticate('jwt', { session: false }),
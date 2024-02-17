// Referencing https://express-validator.github.io/docs/6.6.0/

import express from 'express';
import { UserInfo } from '../mongodb/models/User';
// import passport from 'passport';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

/* GET all profiles. */
router.get('/', async (req: any, res: any, next: any) => {
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
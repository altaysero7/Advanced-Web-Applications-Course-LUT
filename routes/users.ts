// Referencing week 8-9 source code
// Referencing https://express-validator.github.io/docs/6.6.0/

import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
const router = express.Router();

interface userType {
    email: string;
    password: string;
}

const registrationValidation = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_+={}[\]|\\:;"'<>,./?]).*$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

/* POST register user. */
router.post('/register', registrationValidation, function (req: any, res: any, next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({ email: req.body.email })
        .then(async user => {
            if (user) {
                res.status(403).send("Email already in use.");
                return;
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    email: req.body.email,
                    password: hashedPassword
                });
                return newUser.save();
            }
        })
        .then(savedUser => {
            if (savedUser) {
                res.status(200).send("ok");
            }
        })
        .catch(err => {
            next(err);
        });
});

/* POST login user. */
router.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(403).send("Email not found.");
                return;
            } else {
                if (user.password == null) {
                    res.status(403).send("Password not found.");
                    return;
                }
                bcrypt.compare(req.body.password, user.password as string, (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    if (result) {
                        const jwtPayload = {
                            id: user._id,
                            email: user.email
                        };
                        jwt.sign(
                            jwtPayload,
                            process.env.JWT_SECRET || "veryVeryVerySecretKey",
                            { expiresIn: 120 },
                            (err, token) => {
                                if (err) {
                                    return next(err);
                                }
                                res.json({ success: true, token: token });
                            }
                        );
                    } else {
                        res.status(403).send("Incorrect password.");
                    }
                });
            }
        })
        .catch(err => {
            next(err);
        })
});

export default router;
export { userType as User };

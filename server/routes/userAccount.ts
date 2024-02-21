// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing https://express-validator.github.io/docs/6.6.0/

import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { userAccount } from '../mongodb/models/User';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface validationError {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
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
router.post('/register', registrationValidation, function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req); // Validating for registration so the email and password are in the correct format
    if (!errors.isEmpty()) {
        const customErrors = errors.array() as validationError[];
        const hasPasswordError = customErrors.some(error => error.path === 'password');
        if (hasPasswordError) {
            return res.status(403).send("Password is not strong enough");
        } else {
            return res.status(403).send("Invalid email structure");
        }
    }
    userAccount.findOne({ email: req.body.email })
        .then(async user => {
            if (user) {
                res.status(403).send("Email already in use");
                return;
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new userAccount({
                    email: req.body.email,
                    password: hashedPassword
                });
                const savedUser = await newUser.save();
                if (savedUser) {
                    res.status(200).send("User successfully registered");
                    return;
                }
            }
        })
        .catch(err => {
            next(err);
        });
});

/* POST login user. */
router.post('/login', function (req: Request, res: Response, next: NextFunction) {
    userAccount.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(403).send("Invalid credentials");
                return;
            } else {
                if (user.password == null) {
                    res.status(403).send("Invalid credentials");
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
                            { expiresIn: 1200 },
                            (err, token) => {
                                if (err) {
                                    return next(err);
                                }
                                res.json({ success: true, token: token });
                                return;
                            }
                        );
                    } else {
                        res.status(403).send("Invalid credentials");
                        return;
                    }
                });
            }
        })
        .catch(err => {
            next(err);
        })
});

/* GET user id */
router.get('/:email', function (req: Request, res: Response, next: NextFunction) {
    userAccount.findOne({ email: req.params.email })
        .then(user => {
            if (user) {
                res.json({ id: user._id });
            } else {
                res.status(404).send("User not found");
            }
        })
        .catch(err => {
            next(err);
        });
});

export default router;

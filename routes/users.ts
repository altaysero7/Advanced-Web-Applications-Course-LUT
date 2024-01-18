// Referencing week 8-9 source code
// Referencing https://express-validator.github.io/docs/6.6.0/

import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

interface userType {
    email: string;
    password: string;
}

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
router.post('/register', registrationValidation, function (req: any, res: any, next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customErrors = errors.array() as validationError[];
        const hasPasswordError = customErrors.some(error => error.path === 'password');
        if (hasPasswordError) {
            return res.status(403).send("Password is not strong enough");
        } else {
            return res.status(403).send("Invalid email structure");
        }
    }
    User.findOne({ email: req.body.email })
        .then(async user => {
            if (user) {
                res.status(403).send("Email already in use");
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
                res.redirect('/login.html');
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
                            { expiresIn: 120 },
                            (err, token) => {
                                if (err) {
                                    return next(err);
                                }
                                res.json({ success: true, token: token });
                            }
                        );
                    } else {
                        res.status(403).send("Invalid credentials");
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

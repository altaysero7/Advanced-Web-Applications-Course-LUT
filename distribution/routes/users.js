"use strict";
// Referencing week 8-9 source code
// Referencing https://express-validator.github.io/docs/6.6.0/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.use(express_1.default.urlencoded({ extended: true }));
const registrationValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_+={}[\]|\\:;"'<>,./?]).*$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];
/* POST register user. */
router.post('/register', registrationValidation, function (req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const customErrors = errors.array();
        const hasPasswordError = customErrors.some(error => error.path === 'password');
        if (hasPasswordError) {
            return res.status(403).send("Password is not strong enough");
        }
        else {
            return res.status(403).send("Invalid email structure");
        }
    }
    User_1.User.findOne({ email: req.body.email })
        .then((user) => __awaiter(this, void 0, void 0, function* () {
        if (user) {
            res.status(403).send("Email already in use");
            return;
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
            const newUser = new User_1.User({
                email: req.body.email,
                password: hashedPassword
            });
            return newUser.save();
        }
    }))
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
    User_1.User.findOne({ email: req.body.email })
        .then(user => {
        if (!user) {
            res.status(403).send("Invalid credentials");
            return;
        }
        else {
            if (user.password == null) {
                res.status(403).send("Invalid credentials");
                return;
            }
            bcrypt_1.default.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (result) {
                    const jwtPayload = {
                        id: user._id,
                        email: user.email
                    };
                    jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET || "veryVeryVerySecretKey", { expiresIn: 120 }, (err, token) => {
                        if (err) {
                            return next(err);
                        }
                        res.json({ success: true, token: token });
                    });
                }
                else {
                    res.status(403).send("Invalid credentials");
                }
            });
        }
    })
        .catch(err => {
        next(err);
    });
});
exports.default = router;

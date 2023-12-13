// Referencing week 7 source code

import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import passport from 'passport';

interface User {
    id: number;
    username: string;
    password: string;
}

let users: User[] = [];

function getUserbyName(username: string): User | undefined {
    return users.find(user => user.username === username);
}

function getUserbyId(id: number): User | undefined {
    return users.find(user => user.id === id);
}

function checkAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return res.redirect('/api/user');
    }
    return next();
}

/* POST register user. */
router.post('/register', checkAuthenticated, async function (req, res, next) {
    try {
        const newUser: User = req.body;
        if (getUserbyName(newUser.username)) {
            return res.status(400).send("Username already exists!");
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        newUser.id = users.length + 1;
        users.push(newUser);
        res.send(newUser);
    } catch (error) {
        next(error);
    }
});

/* POST login user. */
router.post('/login', checkAuthenticated, function (req, res, next) {
    passport.authenticate('local', (err: any, user: User, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        req.logIn(user, (err: any) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send("User logged in");
        });
    })(req, res, next);
});

/* GET all users. */
router.get('/list', function (req, res) {
    res.send(users);
});

/* GET main user page. */
router.get('/', function (req, res) {
    res.send("you already logged in bro...");
});

export default router;
export { User, getUserbyName, getUserbyId };

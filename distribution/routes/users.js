"use strict";
// Referencing week 7 source code
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
exports.getUserbyId = exports.getUserbyName = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
let users = [];
function getUserbyName(username) {
    return users.find(user => user.username === username);
}
exports.getUserbyName = getUserbyName;
function getUserbyId(id) {
    return users.find(user => user.id === id);
}
exports.getUserbyId = getUserbyId;
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/api/user');
    }
    return next();
}
/* POST register user. */
router.post('/register', checkAuthenticated, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = req.body;
            if (getUserbyName(newUser.username)) {
                return res.status(400).send("Username already exists!");
            }
            const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            newUser.id = users.length + 1;
            users.push(newUser);
            res.send(newUser);
        }
        catch (error) {
            next(error);
        }
    });
});
/* POST login user. */
router.post('/login', checkAuthenticated, function (req, res, next) {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        req.logIn(user, (err) => {
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
exports.default = router;

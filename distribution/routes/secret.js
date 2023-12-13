"use strict";
// Referencing week 7 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET main secret page. */
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.status(200).send('This is a secret place!');
    }
    else {
        res.status(401).send('Not authenticated!');
    }
});
exports.default = router;

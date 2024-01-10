"use strict";
// Referencing week 8-9 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
/* GET main private page. */
router.get('/', passport_1.default.authenticate('jwt', { session: false }), function (req, res) {
    const user = req.user;
    res.json({ email: user === null || user === void 0 ? void 0 : user.email });
});
exports.default = router;

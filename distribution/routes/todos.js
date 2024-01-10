"use strict";
// Referencing week 8-9 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Todo_1 = require("../models/Todo");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
/* POST todo. */
router.post('/', passport_1.default.authenticate('jwt', { session: false }), function (req, res, next) {
    const newTodos = req.body.items;
    const user = req.user;
    Todo_1.Todo.findOne({ user: user._id })
        .then(todo => {
        if (todo === null || todo === void 0 ? void 0 : todo.items) {
            // Existing todo
            todo.items = todo.items.concat(newTodos.map(String));
            return todo.save();
        }
        else {
            // New todo
            const newTodo = new Todo_1.Todo({
                user: user._id,
                items: newTodos
            });
            return newTodo.save();
        }
    })
        .then(savedTodo => {
        if (savedTodo) {
            res.status(200).send("ok");
        }
    })
        .catch(err => {
        next(err);
    });
});
exports.default = router;

"use strict";
// Referencing week 7 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
let todos = [];
function getUserTodos(id) {
    return todos.find(user => user.id === id);
}
/* POST todo. */
router.post('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const newTodo = req.body.todo;
            const user = req.user;
            const userTodos = getUserTodos(user.id);
            if (userTodos) {
                userTodos.todos.push(newTodo);
                return res.send(userTodos);
            }
            else {
                const newUser = {
                    id: user.id,
                    todos: [newTodo]
                };
                todos.push(newUser);
                return res.send(newUser);
            }
        }
        catch (error) {
            next(error);
        }
    }
    else {
        res.status(401).send('Not authenticated!');
    }
});
/* GET all todos. */
router.get('/list', function (req, res) {
    res.send(todos);
});
exports.default = router;

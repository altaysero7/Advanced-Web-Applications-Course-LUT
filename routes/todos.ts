// Referencing week 7 source code

import express from 'express';
import { User } from './users';
const router = express.Router();

interface userTodos {
    id: number;
    todos: string[];
}

let todos: userTodos[] = [];

function getUserTodos(id: number): userTodos | undefined {
    return todos.find(user => user.id === id);
}

/* POST todo. */
router.post('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const newTodo: string = req.body.todo;
            const user = req.user as User;
            const userTodos = getUserTodos(user.id);
            if (userTodos) {
                userTodos.todos.push(newTodo);
                return res.send(userTodos);
            } else {
                const newUser: userTodos = {
                    id: user.id,
                    todos: [newTodo]
                }
                todos.push(newUser);
                return res.send(newUser);
            }
        } catch (error) {
            next(error);
        }

    } else {
        res.status(401).send('Not authenticated!');
    }
});

/* GET all todos. */
router.get('/list', function (req, res) {
    res.send(todos);
});

export default router;

// Referencing week 8-9 source code

import express from 'express';
import { Todo } from '../models/Todo';
import { ObjectId } from 'bson';
import passport from 'passport';
const router = express.Router();

/* POST todo. */
router.post('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const newTodos: [String] = req.body.items;
    const user = req.user as {
        _id?: ObjectId,
    };
    Todo.findOne({ user: user._id })
        .then(todo => {
            if (todo?.items) {
                // Existing todo(s)
                todo.items = todo.items.concat(newTodos.map(String));
                return todo.save();
            } else {
                // New todo
                const newTodo = new Todo({
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

/* GET all todos. */
router.get('/list', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    const user = req.user as {
        _id?: ObjectId,
    };
    Todo.findOne({ user: user._id })
        .then(todo => {
            if (todo?.items) {
                res.json(todo.items);
                return;
            } else {
                res.json("EMPTY LIST");
            }
        })
        .catch(err => {
            next(err);
        });
});

export default router;

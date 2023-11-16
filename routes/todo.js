const express = require('express');
const router = express.Router();
const fs = require('fs');

/* POST todos. */
router.post('/', function(req, res) {
    fs.readFile('./public/data/todos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const todos = data ? JSON.parse(data) : [];
        let nameExists = false;

        todos.forEach(todo => {
            if (todo.name === req.body.name) {
                nameExists = true;
                if (Array.isArray(todo.todos)) {
                    todo.todos.push(req.body.todos);
                } else {
                    todo.todos = [todo.todos, req.body.todos];
                }
            }
        });

        if (!nameExists) {
            todos.push({ name: req.body.name, todos: [req.body.todos] });
        }

        fs.writeFile('./public/data/todos.json', JSON.stringify(todos), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        res.send(nameExists ? "Todo added" : "User added");
    });
});

module.exports = router;

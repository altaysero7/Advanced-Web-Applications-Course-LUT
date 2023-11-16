const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET user todos. */
router.get('/:id', function (req, res, next) {
  fs.readFile('./public/data/todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const todos = data ? JSON.parse(data) : [];
    const user = todos.find(todo => todo.name === req.params.id);

    if (user) {
      res.send(user);
    } else {
      res.json({ message: "User not found" });
    }
  });
});

/* DELETE user. */
router.delete('/:id', function (req, res) {
  fs.readFile('./public/data/todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const todos = data ? JSON.parse(data) : [];
    const user = todos.find(todo => todo.name === req.params.id);

    if (user) {
      todos.splice(todos.indexOf(user), 1);
      fs.writeFile('./public/data/todos.json', JSON.stringify(todos), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      res.json({ message: "User deleted" });
    } else {
      res.json({ message: "User not found" });
    }
  });
});

/* PUT user todo. */
router.put('/', function (req, res) {
  fs.readFile('./public/data/todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const todos = data ? JSON.parse(data) : [];
    const userIndex = todos.findIndex(todo => todo.name === req.body.name);

    if (userIndex !== -1) {
      const user = todos[userIndex];
      user.todos.splice(user.todos.indexOf(req.body.targetedTodo), 1);
      todos[userIndex] = user;

      fs.writeFile('./public/data/todos.json', JSON.stringify(todos), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        res.json({ message: "Task deleted" });
      });

    } else {
      res.json({ message: 'User not found' });
    }
  });
});

module.exports = router;
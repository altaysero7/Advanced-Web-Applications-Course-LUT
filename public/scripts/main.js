// Referencing week 8-9 source code

const authToken = localStorage.getItem('auth_token');
const addItemInput = document.getElementById("add-item");
const todoList = document.getElementById('todos-list');

window.addEventListener('DOMContentLoaded', (event) => {
    if (authToken) {
        document.querySelector('.logged-in').style.display = 'block';
        document.querySelector('.logged-out').style.display = 'none';
        getEmail().then(userEmail => {
            document.getElementById('displayEmail').textContent = userEmail;
        });
        fetchTodos();
        const button = document.createElement('button');
        button.id = 'logout';
        button.textContent = 'Logout';
        button.addEventListener('click', function () {
            localStorage.removeItem('auth_token');
            window.location.reload();
        });
        document.querySelector('.logged-in').appendChild(button);
    } else {
        document.querySelector('.logged-out').style.display = 'block';
        document.querySelector('.logged-in').style.display = 'none';
    }
    addItemInput.addEventListener("keypress", onEnterTodo);
});

function onEnterTodo(event) {
    if (event.key === 'Enter') {
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ items: [addItemInput.value] })
        })
            .then(response => response.text())
            .then(data => {
                addItemInput.value = '';
                fetchTodos();
            });
    }
}

function fetchTodos() {
    fetch('/api/todos/list', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = '';
            if (typeof todos === 'string') {
                let p = document.createElement('p');
                p.textContent = todos;
                todoList.appendChild(p);
            } else {
                todos.forEach(todo => {
                    let li = document.createElement('li');
                    li.textContent = todo;
                    todoList.appendChild(li);
                });
            }
        });
}

function getEmail() {
    return fetch('/api/private', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    })
        .then(response => response.json())
        .then(data => data.email);
}

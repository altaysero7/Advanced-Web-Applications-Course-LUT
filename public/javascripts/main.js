const submitButton = document.getElementById('submit-data');
const searchButton = document.getElementById('search');

function clearContent() {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => p.remove());

    const deleteButtons = document.querySelectorAll('#delete-user');
    deleteButtons.forEach(btn => btn.remove());

    const deleteTodoButtons = document.querySelectorAll('.delete-task');
    deleteTodoButtons.forEach(btn => btn.remove());

    const dynamicDivs = document.querySelectorAll('div');
    dynamicDivs.forEach(div => {
        div.remove();
    });
}

function createParagraph(text) {
    const p = document.createElement('p');
    p.innerText = text;
    document.body.appendChild(p);
}

function createContent(json) {
    const div = document.createElement('div');
    const jsonName = json.name;
    const jsonTodos = json.todos;

    const startText = document.createTextNode(`name:"${jsonName}", todos:[`);
    div.appendChild(startText);

    if (jsonTodos) {
        jsonTodos.forEach((todo, index) => {
            const todoSpan = document.createElement('span');
            todoSpan.innerText = `"${todo}" `;

            const deleteTodoButton = document.createElement('button');
            deleteTodoButton.innerText = 'Delete todo';
            deleteTodoButton.setAttribute('class', 'delete-task');
            deleteTodoButton.addEventListener('click', () => {
                clearContent();
                fetch(`/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: jsonName, targetedTodo: todo })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(json => {
                    clearContent();
                    createParagraph(json.message);
                })
                .catch(error => {
                    console.error(error);
                });
            });
            todoSpan.appendChild(deleteTodoButton);
            div.appendChild(todoSpan);
            if (index < jsonTodos.length - 1) {
                div.appendChild(document.createTextNode(', '));
            }
        });
    }

    const endText = document.createTextNode("] ");
    div.appendChild(endText);
    document.body.appendChild(div);
    return div;
}

submitButton.addEventListener('click', () => {
    clearContent();
    const inputName = document.getElementById('input-name');
    const inputTask = document.getElementById('input-task');

    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: inputName.value, todos: inputTask.value })
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
        })
        .then(text => createParagraph(text))
        .catch(error => {
            console.error(error);
        });
});

searchButton.addEventListener('click', () => {
    clearContent();
    const searchedName = document.getElementById('search-name');

    fetch(`/user/${searchedName.value}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(json => {
            if (json && json.message === 'User not found') {
                createParagraph(json.message);
                return;
            }
            if (json && json.message !== 'User not found') {
                const contentDiv = createContent(json);
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete user';
                deleteButton.setAttribute('id', 'delete-user');
                deleteButton.addEventListener('click', () => {
                    fetch(`/user/${searchedName.value}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                        })
                        .then(json => {
                            clearContent();
                            createParagraph(json.message ? json.message : JSON.stringify(json))
                        })
                        .catch(error => {
                            console.error(error);
                        });
                });
                contentDiv.appendChild(deleteButton);
            }
        })
        .catch(error => {
            console.error(error);
        });
});

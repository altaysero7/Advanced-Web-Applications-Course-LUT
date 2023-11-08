const button = document.getElementById('submit-data');

button.addEventListener('click', () => {
    const inputArea = document.getElementById('input-text');

    fetch('/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: inputArea.value})
    })
});
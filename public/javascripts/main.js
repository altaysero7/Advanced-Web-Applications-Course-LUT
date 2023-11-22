// Referencing week 2-4 source codes

document.addEventListener('DOMContentLoaded', () => {
    fetch('/recipe/kebab')
        .then(response => response.json())
        .then(({ name, ingredients, instructions }) => {
            document.getElementById('recipe-name').textContent = name;

            const ingredientsList = document.getElementById('recipe-ingredients');
            ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });

            const instructionsList = document.getElementById('recipe-instructions');
            instructions.forEach(instruction => {
                const li = document.createElement('li');
                li.textContent = instruction;
                instructionsList.appendChild(li);
            });
        })
        .catch(err => console.error('Error fetching recipe:', err));

    const addIngredientButton = document.getElementById('add-ingredient');
    const addInstructionButton = document.getElementById('add-instruction');
    const submitButton = document.getElementById('submit');

    const ingredients = [];
    const instructions = [];

    addIngredientButton.addEventListener('click', () => {
        const inputIngredient = document.getElementById('ingredients-text');
        ingredients.push(inputIngredient.value);
        inputIngredient.value = '';
    });

    addInstructionButton.addEventListener('click', () => {
        const inputInstruction = document.getElementById('instructions-text');
        instructions.push(inputInstruction.value);
        inputInstruction.value = '';
    });

    submitButton.addEventListener('click', () => {
        const inputName = document.getElementById('name-text');
        const inputImage = document.getElementById('image-input');
        const formData = new FormData();

        [...inputImage.files].forEach(file => formData.append('images', file));

        fetch('/recipe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: inputName.value, ingredients: ingredients, instructions: instructions })
        });

        fetch('/images', {
            method: 'POST',
            body: formData
        });
    });
});

// Referencing week 2-5 source codes

document.addEventListener('DOMContentLoaded', () => {
    const addIngredientButton = document.getElementById('add-ingredient');
    const addInstructionButton = document.getElementById('add-instruction');
    const submitButton = document.getElementById('submit');
    const searchField = document.querySelector('input[type="search"]');

    const ingredients = [];
    const instructions = [];
    const specialDiets = [];

    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            if (categories) {
                const categoriesDiv = document.getElementById('categories-section');
                categories.forEach(category => {
                    const categoryContainer = document.createElement('div');
                    categoryContainer.classList.add('category-container');

                    const categoryText = document.createElement('span');
                    categoryText.id = 'category-text-' + category.name;
                    categoryText.textContent = category.name;
                    categoryText.classList.add('category-item');

                    const tickMark = document.createElement('span');
                    tickMark.id = 'tick-' + category.name;
                    tickMark.innerHTML = '&#10003;';
                    tickMark.classList.add('tick-mark', 'hidden');

                    categoryContainer.addEventListener('click', function () {
                        categoryText.classList.toggle('active-category');
                        tickMark.classList.toggle('hidden');

                        if (categoryText.classList.contains('active-category')) {
                            if (!specialDiets.includes(category._id)) {
                                specialDiets.push(category._id);
                            }
                        } else {
                            const index = specialDiets.indexOf(category._id);
                            if (index > -1) {
                                specialDiets.splice(index, 1);
                            }
                        }
                    });

                    categoryContainer.appendChild(tickMark);
                    categoryContainer.appendChild(categoryText);
                    categoriesDiv.appendChild(categoryContainer);
                });
            } else {
                console.log("Categories not found!");
            }
        })
        .catch(err => {
            console.error(err);
        });

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

        if (inputImage.files.length) {
            [...inputImage.files].forEach(file => formData.append('images', file));
        }

        fetch('/images/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const imageIds = data;

                fetch('/recipe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: inputName.value,
                        ingredients: ingredients,
                        instructions: instructions,
                        categories: specialDiets,
                        images: imageIds
                    })
                });
            });
    });

    searchField.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            fetch(`/recipe/${searchField.value}`)
                .then(response => {
                    if (response.status === 404) {
                        document.getElementById('recipe-name').textContent = "Recipe not found";
                        document.getElementById('recipe-ingredients').innerHTML = '';
                        document.getElementById('recipe-instructions').innerHTML = '';
                        document.getElementById('images').innerHTML = '';
                        return;
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data) return;
                    const { name, ingredients, instructions, images } = data;
                    document.getElementById('recipe-name').textContent = name;

                    const ingredientsList = document.getElementById('recipe-ingredients');
                    ingredientsList.innerHTML = '';
                    ingredients.forEach(ingredient => {
                        const li = document.createElement('li');
                        li.textContent = ingredient;
                        ingredientsList.appendChild(li);
                    });

                    const instructionsList = document.getElementById('recipe-instructions');
                    instructionsList.innerHTML = '';
                    instructions.forEach(instruction => {
                        const li = document.createElement('li');
                        li.textContent = instruction;
                        instructionsList.appendChild(li);
                    });

                    const imagesDiv = document.getElementById('images');
                    imagesDiv.innerHTML = '';
                    if (images.length !== 0) {
                        images.forEach(imageId => {
                            const img = document.createElement('img');
                            img.src = `/images/${imageId}`;
                            imagesDiv.appendChild(img);
                        });
                    }
                })
                .catch(err => console.error('Error fetching recipe:', err));
        }
    });
});

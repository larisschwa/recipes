// Initialize variables and arrays
let recipeForm = document.getElementById('recipe-form');
let recipeName = document.getElementById('recipe-name');
let ingredients = document.getElementById('recipe-ingredients');
let steps = document.getElementById('recipe-steps');
let recipeImage = document.getElementById('recipeImage');
let displayArea = document.getElementById('recipe-list');
let recipes = [];

// Function to fetch recipes from the API and display them
function fetchAndDisplayRecipes() {
    fetch('http://localhost:8000/recipes')
        .then(response => response.json())
        .then(data => {
            recipes = data;
            displayRecipes();
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

// Load recipes from the API when the page loads
window.onload = function() {
    fetchAndDisplayRecipes();
};

// Create a Display Function
function displayRecipe(recipe) {
    let recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-card');

    // Create elements to display the recipe details
    let recipeNameElement = document.createElement('h3');
    recipeNameElement.textContent = recipe.name;

    let ingredientsElement = document.createElement('p');
    ingredientsElement.textContent = "Ingredients: " + recipe.ingredients;

    let stepsElement = document.createElement('p');
    stepsElement.textContent = "Steps: " + recipe.steps;

    // Check if an image URL is provided
    if (recipe.image) {
        let imageElement = document.createElement('img');
        imageElement.src = recipe.image;
        recipeDiv.appendChild(imageElement); // Display the image
    }

    // Create an edit button
    let editButton = document.createElement('button');
    editButton.textContent = "Edit";

    // Add an event handler to the edit button
    editButton.onclick = function() {
        editRecipe(recipe);
    };

    // Create a delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";

    // Add an event handler to the delete button
    deleteButton.onclick = function() {
        deleteRecipe(recipe.id);
    };

    // Append the elements to the recipeDiv
    recipeDiv.appendChild(recipeNameElement);
    recipeDiv.appendChild(ingredientsElement);
    recipeDiv.appendChild(stepsElement);
    recipeDiv.appendChild(editButton); // Add the edit button
    recipeDiv.appendChild(deleteButton); // Add the delete button

    // Add the new recipe div to the display area
    displayArea.appendChild(recipeDiv);
}

// Display all recipes
function displayRecipes() {
    displayArea.innerHTML = '';
    recipes.forEach(recipe => {
        displayRecipe(recipe);
    });
}

// Add Event Listener for Form Submission
recipeForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior (page refresh)

    // Capture Input Values
    let enteredRecipeName = recipeName.value;
    let enteredIngredients = ingredients.value;
    let enteredSteps = steps.value;
    let enteredRecipeImage = recipeImage.value; // Capture the image URL

    // Store the Recipe, including the image URL
    let newRecipe = {
        name: enteredRecipeName,
        ingredients: enteredIngredients,
        steps: enteredSteps,
        image: enteredRecipeImage // Store the image URL
    };

    // Send a POST request to the API to add the new recipe
    fetch('http://localhost:8000/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add recipe');
        }
        return response.json();
    })
    .then(data => {
        recipes.push(data);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        recipeName.value = '';
        ingredients.value = '';
        steps.value = '';
        recipeImage.value = '';
        displayRecipe(data);
    })
    .catch(error => {
        console.error('Error adding recipe:', error);
    });
});

// Function to edit a recipe
function editRecipe(recipe) {
    // Create a form for editing
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <label for="edit-recipe-name">Recipe Name</label>
        <input type="text" id="edit-recipe-name" name="edit-recipe-name" value="${recipe.name}" required>

        <label for="edit-recipe-ingredients">Ingredients</label>
        <textarea id="edit-recipe-ingredients" name="edit-recipe-ingredients" required>${recipe.ingredients}</textarea>

        <label for="edit-recipe-steps">Steps for Preparation</label>
        <textarea id="edit-recipe-steps" name="edit-recipe-steps" required>${recipe.steps}</textarea>

        <label for="edit-recipe-image">Recipe Image URL:</label>
        <input type="url" id="edit-recipe-image" name="edit-recipe-image" value="${recipe.image || ''}">

        <button type="submit">Save</button>
    `;

    // Handle form submission to save the edited recipe
    editForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Capture and update the edited recipe details
        const editedRecipe = {
            name: document.getElementById('edit-recipe-name').value,
            ingredients: document.getElementById('edit-recipe-ingredients').value,
            steps: document.getElementById('edit-recipe-steps').value,
            image: document.getElementById('edit-recipe-image').value,
        };

        // Send a PUT request to the API to update the recipe
        fetch(`http://localhost:8000/recipes/${recipe.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedRecipe),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update recipe');
            }
            return response.json();
        })
        .then(data => {
            const updatedRecipeIndex = recipes.findIndex(r => r.id === recipe.id);
            if (updatedRecipeIndex !== -1) {
                recipes[updatedRecipeIndex] = data;
                displayRecipes();
            }
        })
        .catch(error => {
            console.error('Error updating recipe:', error);
        });
    });

    // Clear the display area and add the edit form
    displayArea.innerHTML = '';
    displayArea.appendChild(editForm);
}

// Function to delete a recipe by its ID
function deleteRecipe(recipeId) {
    // Send a DELETE request to the API to delete the recipe
    fetch(`http://localhost:8000/recipes/${recipeId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }
        return response.json();
    })
    .then(data => {
        // Recipe deleted successfully, remove it from the UI
        const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
        if (recipeIndex !== -1) {
            recipes.splice(recipeIndex, 1);
            displayRecipes(); // Refresh the displayed recipes
        }
    })
    .catch(error => {
        console.error('Error deleting recipe:', error);
    });
}

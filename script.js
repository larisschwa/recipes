// Initialize variables and arrays
let recipeForm = document.getElementById('recipe-form');
let recipeName = document.getElementById('recipe-name');
let ingredients = document.getElementById('recipe-ingredients');
let steps = document.getElementById('recipe-steps');
let recipeImage = document.getElementById('recipeImage'); // Add this line for the image input
let displayArea = document.getElementById('recipe-list');
let recipes = [];

// Load recipes from local storage when the page loads
window.onload = function() {
    // Check if recipes exist in local storage
    if (localStorage.getItem('recipes')) {
        // Retrieve and parse the recipes from local storage
        recipes = JSON.parse(localStorage.getItem('recipes'));

        // Display the loaded recipes on the page (you can use a loop and the displayRecipe function)
        for (let i = 0; i < recipes.length; i++) {
            displayRecipe(recipes[i], i);
        }
    }
};

// Create a Display Function
function displayRecipe(recipe, index) {
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

    // Create a delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";

    // Add an event handler to the delete button
    deleteButton.onclick = function() {
        deleteRecipe(index);
    };

    // Append the elements to the recipeDiv
    recipeDiv.appendChild(recipeNameElement);
    recipeDiv.appendChild(ingredientsElement);
    recipeDiv.appendChild(stepsElement);
    recipeDiv.appendChild(deleteButton); // Add the delete button

    // Add the new recipe div to the display area
    displayArea.appendChild(recipeDiv);
};

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

    // Add the new recipe to the recipes array
    recipes.push(newRecipe);

    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Clear the Input Fields
    recipeName.value = '';
    ingredients.value = '';
    steps.value = '';

    // Display the added recipe
    displayRecipe(newRecipe);

    console.log('Recipe added:', newRecipe);
});

// Implement the deleteRecipe function
function deleteRecipe(index) {
    // Remove the recipe from the array
    recipes.splice(index, 1);

    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Refresh the Display
    // Clear the display area
    displayArea.innerHTML = '';

    // Re-display all recipes using a loop and displayRecipe function
    for (let i = 0; i < recipes.length; i++) {
        displayRecipe(recipes[i], i);
    }
};




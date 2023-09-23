"""
API for Recipe Keeper Application.

This module provides endpoints for CRUD operations on recipes.
It uses a JSON file for storage, and FastAPI for the web server.
"""

import os.path
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RECIPES_FILE = "recipes.json"


def load_recipes():
    try:
        with open(RECIPES_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []


def save_recipes(recipes):
    with open(RECIPES_FILE, "w") as file:
        json.dump(recipes, file)


class Recipe(BaseModel):
    id: Optional[int]
    name: str
    ingredients: list[str]


@app.get("/recipes", response_model=list[Recipe])
def read_recipes():
    try:
        return load_recipes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Define a route for the root path ("/")
@app.get("/")
async def root():
    return {"message": "Welcome to the Recipe Keeper"}

# Define a route to handle requests for the favicon.ico


@app.get("/favicon.ico")
async def favicon():
    return {}


@app.post("/recipes", response_model=Recipe)
def create_recipe(recipe: Recipe):
    try:
        recipes = load_recipes()
        recipe_id = max((r.id for r in recipes), default=0) + 1
        recipe.id = recipe_id
        recipes.append(recipe.dict())
        save_recipes(recipes)
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/recipes/{recipe_id}", response_model=Recipe)
def read_recipe(recipe_id: int):
    try:
        recipes = load_recipes()
        recipe = next((r for r in recipes if r.id == recipe_id), None)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/recipes/{recipe_id}", response_model=Recipe)
def update_recipe(recipe_id: int, updated_recipe: Recipe):
    try:
        recipes = load_recipes()
        recipe_index = next((index for index, r in enumerate(
            recipes) if r.id == recipe_id), None)

        if recipe_index is None:
            raise HTTPException(status_code=404, detail="Recipe not found")

        updated_recipe.id = recipe_id
        recipes[recipe_index] = updated_recipe.dict()
        save_recipes(recipes)
        return updated_recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/recipes/{recipe_id}", response_model=dict)
def delete_recipe(recipe_id: int):
    try:
        recipes = load_recipes()
        recipe_index = next((index for index, r in enumerate(
            recipes) if r.id == recipe_id), None)

        if recipe_index is None:
            raise HTTPException(status_code=404, detail="Recipe not found")

        del recipes[recipe_index]
        save_recipes(recipes)
        return {"status": "success", "message": "Recipe deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

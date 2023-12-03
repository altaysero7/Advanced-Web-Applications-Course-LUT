// Referencing week 2-5 source codes

const express = require('express');
const router = express.Router();
const { Recipes } = require("../models/Recipes.js");

/* GET recipe. */
router.get('/:food', function (req, res) {
    Recipes.findOne({ name: req.params.food })
        .then(recipe => {
            if (recipe) {
                res.json(recipe);
            } else {
                res.status(404).send("Recipe not found!");
            }
        })
        .catch(err => {
            return next(err);
        });
});

/* POST recipe. */
router.post('/', function (req, res, next) {
    Recipes.findOne({ name: req.body.name })
        .then(recipe => {
            if (recipe) {
                res.status(400).send("Recipe already exists!");
            } else {
                const newRecipe = new Recipes({
                    name: req.body.name,
                    ingredients: req.body.ingredients,
                    instructions: req.body.instructions,
                    categories: req.body.categories,
                    images: req.body.images
                });
                return newRecipe.save();
            }
        })
        .then(savedRecipe => {
            if (savedRecipe) {
                res.json(savedRecipe);
            }
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;

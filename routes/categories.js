// Referencing week 2-5 source codes

const express = require('express');
const router = express.Router();
const { Category } = require("../models/Recipes.js");

/* GET categories. */
router.get('/', function (req, res, next) {
    Category.find({})
        .then(categories => {
            if (categories) {
                res.json(categories);
            } else {
                res.status(404).send("Categories not found!");
            }
        })
        .catch(err => {
            return next(err);
        });
});

/* POST category. */
router.post('/', function (req, res, next) {
    Category.findOne({ name: req.body.name })
    .then(foundCategory => {
        if (foundCategory) {
            res.status(400).send("Category already exists!");
        } else {
            const newCategory = new Category({
                name: req.body.name,
            });
            return newCategory.save();
        }
    }).then(savedCategory => {
        if (savedCategory) {
            res.json(savedCategory);
        }
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;
// Referencing week 2-5 source codes

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: String,
    ingredients: [String],
    instructions: [String],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

const categorySchema = new Schema({
    name: String,
});

const imageSchema = new Schema({
    buffer: Buffer,
    mimetype: String,
    name: String,
    encoding: String
});

module.exports = {
    Recipes: mongoose.model("Recipes", recipeSchema),
    Category: mongoose.model("Category", categorySchema),
    Image: mongoose.model("Image", imageSchema)
};
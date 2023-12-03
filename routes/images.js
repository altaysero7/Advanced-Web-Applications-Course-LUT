// Referencing week 2-5 source codes

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Image } = require("../models/Recipes.js");
const upload = multer({ storage: multer.memoryStorage() });


/* GET images. */
router.get('/:imageId', function (req, res, next) {
    const imageId = req.params.imageId;
    Image.findById(imageId)
        .then(image => {
            if (image) {
                res.setHeader('Content-Type', image.mimetype);
                res.setHeader('Content-Disposition', 'inline');
                res.send(image.buffer);
            } else {
                res.status(404).send("Image not found!");
            }
        })
        .catch(err => {
            return next(err);
        });
});

/* POST images. */
router.post('/', upload.array('images', 10), function (req, res, next) {
    const imagePromises = req.files.map(file => {
        return Image.findOne({ name: file.originalname })
            .then(foundImage => {
                if (foundImage) {
                    res.status(400).send("Image already exists!");
                } else {
                    const newImage = new Image({
                        buffer: file.buffer,
                        mimetype: file.mimetype,
                        name: file.originalname,
                        encoding: file.encoding
                    });
                    return newImage.save();
                }
            });
    });

    Promise.all(imagePromises)
        .then(savedImages => {
            const imageIds = savedImages.map(image => image._id);
            res.json(imageIds);
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;

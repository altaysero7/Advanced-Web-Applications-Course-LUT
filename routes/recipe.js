// Referencing week 2-4 source codes

const express = require('express');
const router = express.Router();

/* GET recipe. */
router.get('/:food', function (req, res) {
    res.json({
        name: req.params.food,
        ingredients: [
            "A",
            "B",
            "C"
        ],
        instructions: [
            "1",
            "2",
            "3",
            "let's go!"
        ]
    });
});

/* POST recipe. */
router.post('/', function (req, res) {
    res.send(req.body);
});

module.exports = router;

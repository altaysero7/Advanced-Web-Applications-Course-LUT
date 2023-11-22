// Referencing week 2-4 source codes

const express = require('express');
const router = express.Router();

/* POST images. */
router.post('/', function (req, res) {
    res.send("Images received!");
});

module.exports = router;

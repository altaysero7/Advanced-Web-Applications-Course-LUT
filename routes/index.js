// Referencing week 2-4 source codes

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;

// Referencing week 6 source code

import express from 'express';
const router = express.Router();

/* GET hello. */
router.get('/', function (req, res) {
    res.send('Hello World');
});

export default router;

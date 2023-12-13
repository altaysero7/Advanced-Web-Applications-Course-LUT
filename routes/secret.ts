// Referencing week 7 source code

import express from 'express';
const router = express.Router();

/* GET main secret page. */
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.status(200).send('This is a secret place!');
    } else {
        res.status(401).send('Not authenticated!');
    }
});

export default router;

// Referencing week 8-9 source code

import express from 'express';
import passport from 'passport';
const router = express.Router();

/* GET main private page. */
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res) {
    const user = req.user as {
        email?: string
    };
    res.json({ email: user?.email });
});

export default router;

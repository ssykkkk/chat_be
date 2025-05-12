const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login } = require('../controllers/userController');
require('../strategies/googleStrategy');

router.post('/register', register);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    res.json({ message: 'Google Authentication Successful', user: req.user });
});

module.exports = router;

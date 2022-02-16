const mongoose = require('mongoose')
const router = require('express').Router()
const User = require('../models/user');
const passport = require('passport')
const issueJWT = require('../utils/JWTUtils').issueJWT
const passwordUtils = require('../utils/passwordUtils')

router.get('/', (req, res) => {
    res.send('Hello world')
})

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username }).then((user) => {
        if (!user) {
            res.status(400).json({ msg: 'no such user' })
        }

        const isValid = passwordUtils.validPassword(req.body.password, user.hash, user.salt);

        if (isValid) {
            const tokenObject = issueJWT(user);

            res.status(200).json({ success: true, user: user, token: tokenObject.token, expires: tokenObject.expires })
        } else {
            res.status(401).json({ success: false, msg: 'invalid password' })
        }
    }).catch(err => next(err))
})

router.post('/register', (req, res) => {
    const saltHash = passwordUtils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newUser.save().then((user) => {
        const jwt = issueJWT(user)
        res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
    })
})

module.exports = router
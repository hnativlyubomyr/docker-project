const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const authRouter = express.Router();

authRouter.post('/auth/register', (req, res, next) => {
    const user = new User(req.body);

    user.save(function(err, data) {
        if (err) {
            next(err);
        } else {
            res.send(`Created account with id=${data._id}`);
        }
    })
});

authRouter.post('/auth/login', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).send('Incorrect username or password!');
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({ isAuth: true, user });
        });

    })(req, res, next);
});

authRouter.get('/auth/authorization', (req, res) => {
    const user = req.isAuthenticated() ? req.user: null;
    const obj = {
        isAuth: req.isAuthenticated(),
        user,
    }

    res.send(obj);
})

authRouter.get('/auth/logout', function(req, res, next){
    req.session.destroy(function (err) {
        if (err) {
            return next(err);
        }

        return res.send('logout user');
    });
});

module.exports = authRouter;

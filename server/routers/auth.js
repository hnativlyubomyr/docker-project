const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({ extended: true }));

function sendErrorStatus(err, res) {
    let status = 500;
    let message = 'Internal Sever Error!';

    if (err.code && err.code === 11000) {
        status = 403;
        message = 'User with that name already exists!'
    }

    if (err.errors) {
        status = 403;
        message = err.message;
    }

    res.status(status).send(message);
}

authRouter.post('/auth/register', (req, res) => {
    const user = new User(req.body);
    console.log(user);

    user.save(function(err, data) {
        if (err) {
            sendErrorStatus(err, res);
        } else {
            res.send(`Created account with id=${data._id}`);
        }
    })
});

module.exports = authRouter;

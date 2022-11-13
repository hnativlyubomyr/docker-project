const express = require('express');
const bodyParser = require('body-parser');
const Post = require('../models/post');

const postsRouter = express.Router();

postsRouter.use(bodyParser.json());
postsRouter.use(bodyParser.urlencoded({ extended: true }));

function sendErrorStatus(err, res) {
    let status = 500;
    let message = 'Internal Sever Error!';

    if (err.code && err.code === 11000) {
        status = 403;
        message = 'Post with that name already exists!'
    }

    if (err.errors) {
        status = 403;
        message = err.message;
    }

    res.status(status).send(message);
}

postsRouter.get('/posts', (req, res) => {
    const { _limit, _page } = req.query;

    Post.find().skip(_limit * (_page - 1)).limit(_limit).exec(function(err, data) {
        if (err) {
            sendErrorStatus(err, res);
        } else {
            Post.count().exec(function(error, count) {
                if (error) {
                    sendErrorStatus(error, res);
                } else {
                    res.set({ 'x-total-count': count });
                    res.send(data);
                }
            })
        }
    })
})

postsRouter.post('/posts/add', (req, res) => {
    const post = new Post(req.body);

    post.save(function(err, data) {
        if (err) {
           sendErrorStatus(err, res);
        } else {
            res.send(data);
        }
    })
})

postsRouter.put('/posts/update/:id', (req, res) => {
    const _id = req.params['id'];

    Post.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }, function(err, data) {
        if (err) {
            sendErrorStatus(err, res);
        } else {
            console.log(data);
            res.send(data);
        }
    })
})

postsRouter.delete('/posts/delete/:id', (req, res) => {
    const _id = req.params['id'];

    Post.findByIdAndDelete(_id, function(err) {
        if (err) {
            sendErrorStatus(err, res);
        } else {
            res.send(`Removed post with id=${_id}`);
        }
    })
})

module.exports = postsRouter;

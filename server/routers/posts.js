const express = require('express');
const Post = require('../models/post');

const postsRouter = express.Router();

postsRouter.get('/posts', (req, res, next) => {
    const { _limit, _page } = req.query;

    Post.find().skip(_limit * (_page - 1)).limit(_limit).exec(function(err, data) {
        if (err) {
            next(err);
        } else {
            Post.count().exec(function(error, count) {
                if (error) {
                    next(err);
                } else {
                    res.set({ 'x-total-count': count });
                    res.send(data);
                }
            })
        }
    })
})

postsRouter.post('/posts/add', (req, res, next) => {
    const post = new Post(req.body);

    post.save(function(err, data) {
        if (err) {
          next(err)
        } else {
            res.send(data);
        }
    })
})

postsRouter.put('/posts/update/:id', (req, res, next) => {
    const _id = req.params['id'];

    Post.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }, function(err, data) {
        if (err) {
            next(err);
        } else {
            res.send(data);
        }
    })
})

postsRouter.delete('/posts/delete/:id', (req, res, next) => {
    const _id = req.params['id'];

    Post.findByIdAndDelete(_id, function(err) {
        if (err) {
            next(err);
        } else {
            res.send(`Removed post with id=${_id}`);
        }
    })
})

module.exports = postsRouter;

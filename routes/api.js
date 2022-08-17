const express = require('express');
const { isObjectIdOrHexString } = require('mongoose');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

//GET posts JSON

router.get('/posts/', (req, res, next) => {
    Post
        .find()
        .exec((err, result) => {
            if (err) return next(err);
            res.json({ posts: result })
        })
})

//Get a specific post

router.get('/posts/:postid', (req, res, next) => {
    Post
        .findById(req.params.postid)
        .exec((err, result) => {
            if (err) return next(err);
            res.json({ post: result })
        })
})

//Get all comments from the specified post

router.get('/posts/:postid/comments/', (req, res, next) => {
    Post
        .findById(req.params.postid)
        .populate('comments')
        .exec((err, result) => {
            if (err) return next(err);
            res.json({ comments: result })
        })
})

module.exports = router
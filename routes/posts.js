const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { body, validationResult } = require('express-validator')

/* GET posts listing. */
router.get('/', function (req, res, next) {
    Post.find().populate('user').exec(
        (err, results) => {
            console.log(res.locals.currentUser)
            res.render('posts', { posts: results, user: res.locals.currentUser })
        })
});
//POST request to create new post
router.post('/', [
    body('title').trim().isLength({ min: 5, max: 50 }),
    body('newpost').trim().isLength({ min: 5, max: 280 }),
    (req, res, next) => {
        const errors = validationResult(req)
        const post = new Post({
            title: req.body.title,
            content: req.body.newpost,
            user: res.locals.currentUser._id,
            comments: [],
        })
        if (!errors.isEmpty()) {
            //There are one or more errors. Get all posts from db and render posts page again.
            Post.find(populate('user').exec(
                (err, results) => {
                    return res.render('posts', { posts: results })
                }
            ))
        }
        post.save((err, newpost) => {
            if (err) return next(err)
            res.redirect('/posts')
        })
    }
])

//POST request to delete an existing post
router.post('/:id/delete', (req, res, next) => {
    Post.findByIdAndDelete(req.body.postid, (err, result) => {
        if (err) return next(err)
        res.json({ message: 'Post deletion successful' })
    })
})


module.exports = router;

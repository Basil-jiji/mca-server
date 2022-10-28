const express = require('express');
const bodyParser = require('body-parser');
const Posts = require('../models/posts');

const postRouter = express.Router();

postRouter.use(bodyParser.json());


postRouter.route('/')
.get((req, res, next) => {
    Posts.find({})
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(posts);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Posts.create(req.body)
    .then((post) => {
        console.log('Post Created', post);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts');
})

.delete((req, res, next) => {
    Posts.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

postRouter.route('/:postId')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        console.log('Post Created', post);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId);
})

.put((req, res, next) => {
    Posts.findByIdAndUpdate(req.params.postId, {
        $set: req.body
    }, {new :true}) //return updated post
    .then((post) => {
        console.log('Post Created', post);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req, res, next) =>{
    Posts.findByIdAndRemove(req.params.postId)
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = postRouter;
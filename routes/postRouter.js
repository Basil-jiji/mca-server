const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Posts = require('../models/posts');
const authenticate = require('../authenticate');
const cors = require('./cors');

const postRouter = express.Router();

postRouter.use(bodyParser.json());


postRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
    Posts.find({})
    .populate('author')
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(posts);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Posts.find({})
    if(req.body != null){
        req.body.author = req.user._id  //valid user that is logged in
        Posts.create(req.body)
        .then((post) => {
            Posts.findById(post._id)
            .populate('author')
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Post not found in request body');
        err.status = 404;
        return next(err);
    }
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts');
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Posts.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

postRouter.route('/:postId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Posts.findById(req.params.postId)
    // .populate('author')
    .then((post) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post);  //Find and return the specified comment
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null) {
            if(!post.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this post!');
                err.status = 403;
                return next(err);  
            }
            req.body.author = req.user._id;
            Posts.findByIdAndUpdate(req.params.postId, {
                $set: req.body
            }, { new: true })
            .then((post) => {
                Posts.findById(post._id)
                .populate('author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(post);  
                })
            },(err) => next(err));
        }
        else {
            err = new Error('Post '+ req.params.postId + 'not found');
            err.status = 404;
            return next(err);  
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) =>{
    Posts.findById(req.params.postId)
    .then((post)=> {
        if(post != null) {
            if(!post.author.equals(req.user._id)){
                var err = new Error('You are not authorized to delete this post!');
                err.status = 403;
                return next(err); 
            }
            Posts.findByIdAndRemove(req.params.postId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId +' not found');
            err.status = 404;
            return next(err);  
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = postRouter;
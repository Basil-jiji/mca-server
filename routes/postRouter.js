const express = require('express');
const bodyParser = require('body-parser');
const Posts = require('../models/posts');
const authenticate = require('../authenticate');
const cors = require('./cors');

const postRouter = express.Router();

postRouter.use(bodyParser.json());


postRouter.route('/')
.get((req, res, next) => {
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
    Posts.create(req.body)
    .then((post)=>{
        if(post != null){
            req.body.author = req.user_id
            post.save()
        .then((post) => {
            console.log('Post Created', post);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post);
    }, (err) => next(err))
    
}
else{
    err = new Error ('Post '+req.params.postId+' not found')
    err.status = 404;
    return next(err)
}
}, (err) => next(err))
.catch((err) => next(err));
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
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    .populate('post.author')
    .then((post) => {
        console.log('Post Created', post);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId);
})

.put(authenticate.verifyUser, (req, res, next) => {
    Posts.findByIdAndUpdate(req.params.postId, {
        $set: req.body
    }, {new :true}) //return updated post
    .then((post) => {
        if(post != null && post.id(req.params.postId) != null && post.id(req.params.id).author.equals(req.user._id)){
        post.save()
        .then((post) => {
            Posts.findById(post._id)
            .populate('post.author')

        .then((post) => {
            console.log('Post Created', post);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post);
        })
        }, (err) => next(err))
    } else if (post == null){
        err = new Error ('Post '+req.params.postId+' not found')
        err.status = 404;
        return next(err);
    }
    else if(post.id(req.params.postId) == null){
        err = new Error ('Post' + req.params.postId + 'Found');
        err.status = 404;
        return next(err)
    }
    else{
        err = new Error ('You are not authorized to delete this post');
        err.status = 403;
        return next(err)
    }
        },(err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) =>{
    Posts.findByIdAndRemove(req.params.postId)
    .then((post) => {
        if(post != null && post.id(req.params.postId) != null && post.id(req.params.id).author.equals(req.user._id)){
            post.id(req.params.postId).remove();
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                .populate('author')
    
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(post);
            })
            })
        }
        else if(post == null){
            err = new Error ('Post Not Found');
            err.status = 404;
            return next(err)
        }
        else if(post.id(req.params.postId) == null){
            err = new Error ('Post' + req.params.postId + 'Found');
            err.status = 404;
            return next(err)
        }
        else{
            err = new Error ('You are not authorized to delete this post');
            err.status = 403;
            return next(err)
        }

    },(err) => next(err))
    .catch((err) => next(err));
})


module.exports = postRouter;
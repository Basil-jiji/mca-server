const express = require('express');
const bodyParser = require('body-parser');
const Announcements = require('../models/announcements');
const authenticate = require('../authenticate');

const announceRouter = express.Router();

announceRouter.use(bodyParser.json());

announceRouter.route('/')
.get((req, res, next) => {
    Announcements.find({})
    .then((announcements) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(announcements);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Announcements.create(req.body)
    .then((announcement) => {
        console.log('Post Created', announcement);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(announcement);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /announcements');
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Announcements.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

announceRouter.route('/:announceId')
.get((req, res, next) => {
    Announcements.findById(req.params.announceId)
    .then((announcement) => {
        console.log('Announcement Created', announcement);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(announcement);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /announcements/'+ req.params.announceId);
})

.put(authenticate.verifyUser, (req, res, next) => {
    Announcements.findByIdAndUpdate(req.params.announceId, {
        $set: req.body
    }, {new :true}) //return updated announcement
    .then((announcement) => {
        console.log('Announcement Created', announcement);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(announcement);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) =>{
    Announcements.findByIdAndRemove(req.params.announceId)
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})



module.exports = announceRouter;
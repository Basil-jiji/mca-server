const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Announcements = require('../models/announcements');

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

.post((req, res, next) => {
    Announcements.create(req.body)
    .then((announcement) => {
        console.log('Post Created', announcement);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(announcement);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /announcements');
})

.delete((req, res, next) => {
    Announcements.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = announceRouter;
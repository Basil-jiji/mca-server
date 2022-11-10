const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Toppers = require('../models/toppers');

const topperRouter = express.Router();

topperRouter.use(bodyParser.json());


topperRouter.route('/')
.get((req, res, next) => {
    Toppers.find({})
    .then((topper) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(topper);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
    Toppers.create(req.body)
    .then((topper) => {
        console.log('Topper Created', topper);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(topper);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /toppers');
})

.delete(cors.corsWithOptions,authenticate.verifyAdmin, (req, res, next) => {
    Toppers.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
})

module.exports = topperRouter;
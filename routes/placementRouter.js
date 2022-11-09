const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Placements = require('../models/placements');

const placementRouter = express.Router();

placementRouter.use(bodyParser.json());


placementRouter.route('/')
.get((req, res, next) => {
    Placements.find({})
    .then((placement) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(placement);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Placements.create(req.body)
    .then((placement) => {
        console.log('Placement Created', placement);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(placement);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /placements');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Placements.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
})

module.exports = placementRouter;
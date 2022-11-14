const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Pizada = require('../models/pizada');
const authenticate = require('../authenticate');
const cors = require('./cors');

const pizadaRouter = express.Router();

pizadaRouter.use(bodyParser.json());


pizadaRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Pizada.find({})
    .populate('author')
    .then((pizada) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(pizada);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Pizada.find({})
    if(req.body != null){
        req.body.author = req.user._id  //valid user that is logged in
        Pizada.create(req.body)
        .then((pizada) => {
            Pizada.findById(pizada._id)
            .populate('author')
            .then((pizada) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(pizada);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Pizada not found in request body');
        err.status = 404;
        return next(err);
    }
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /pizada');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Pizada.remove({})
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

pizadaRouter.route('/:pizadaId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Pizada.findById(req.params.pizadaId)
    // .populate('author')
    .then((pizada) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(pizada);  //Find and return the specified comment
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /pizada/'+ req.params.pizadaId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Pizada.findById(req.params.pizadaId)
    .then((pizada) => {
        if(pizada != null) {
            if(!pizada.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this pizada file!');
                err.status = 403;
                return next(err);  
            }
            req.body.author = req.user._id;
            Pizada.findByIdAndUpdate(req.params.pizadaId, {
                $set: req.body
            }, { new: true })
            .then((pizada) => {
                Pizada.findById(pizada._id)
                .populate('author')
                .then((pizada) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(pizada);  
                })
            },(err) => next(err));
        }
        else {
            err = new Error('Pizada file '+ req.params.pizadaId + 'not found');
            err.status = 404;
            return next(err);  
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Pizada.findById(req.params.pizadaId)
    .then((pizada)=> {
        if(pizada != null) {
            if(!pizada.author.equals(req.user._id)){
                var err = new Error('You are not authorized to delete this pizada operation!');
                err.status = 403;
                return next(err); 
            }
            Pizada.findByIdAndRemove(req.params.pizadaId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Pizada file ' + req.params.pizadaId +' not found');
            err.status = 404;
            return next(err);  
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = pizadaRouter;
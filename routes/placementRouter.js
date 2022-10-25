const express = require('express');
const bodyParser = require('body-parser');

const placementRouter = express.Router();

placementRouter.use(bodyParser.json());


placementRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain')
    next();
})

.get((req, res, next) => {
    res.end('Will send all the placements to you!!');
})

.post((req, res, next) => {
    res.end('Will add the placement: ' +req.body.name+' with details: ' +req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /placements');
})

.delete((req, res, next) => {
    res.end('Deleting all the placements!');
})

module.exports = placementRouter;
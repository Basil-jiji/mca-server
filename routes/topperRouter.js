const express = require('express');
const bodyParser = require('body-parser');

const topperRouter = express.Router();

topperRouter.use(bodyParser.json());


topperRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain')
    next();
})

.get((req, res, next) => {
    res.end('Will send all the toppers to you!!');
})

.post((req, res, next) => {
    res.end('Will add the topper: ' +req.body.name+' with details: ' +req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /toppers');
})

.delete((req, res, next) => {
    res.end('Deleting all the toppers!');
})

module.exports = topperRouter;
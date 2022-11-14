const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3002', 'https://localhost:3443', 'http://DESKTOP-4OORCPV:3001','http://localhost:3001', 'http://desktop-4oorcpv:3001'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
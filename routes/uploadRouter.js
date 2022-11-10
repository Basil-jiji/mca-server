const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const fs = require('fs');
const multer = require('multer');
const cors = require('./cors');
const Toppers = require('../models/toppers');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },       //cb = callback
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error ('You can upload only image files!'), false)
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter:imageFileFilter })

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());


uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin
   ,upload.single('imageFile'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };
    Toppers.create(final_img, function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file); //file path included in the file object
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})

module.exports = uploadRouter;
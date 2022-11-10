const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    title:{
        type:String,
        required: true,
        unique: true,
    },
    message:{
        type:String,
        required: true
    },
    },{
        timestamps: true
});

var Images = mongoose.model('Image', imagesSchema);

module.exports = Images;

// {
//     "fieldname": "imageFile",
//     "originalname": "WhatsApp Image 2022-09-11 at 10.13.22 PM.jpeg",
//     "encoding": "7bit",
//     "mimetype": "application/json",
//     "destination": "public/images",
//     "filename": "WhatsApp Image 2022-09-11 at 10.13.22 PM.jpeg",
//     "path": "public\\images\\WhatsApp Image 2022-09-11 at 10.13.22 PM.jpeg",
//     "size": 117962
// }
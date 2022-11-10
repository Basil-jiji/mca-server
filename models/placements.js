const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placementSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    company:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default:''
    }
})

var Placements = mongoose.model('Placement', placementSchema);

module.exports = Placements;
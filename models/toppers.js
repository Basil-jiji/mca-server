const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topperSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    score:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: ''
    }
})

var Toppers = mongoose.model('Topper', topperSchema);

module.exports = Toppers;
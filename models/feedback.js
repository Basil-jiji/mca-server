const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    Name:{
        type:String,
        required: true
    },
    telnum:{
        type: String,
        default: ''
    },
    email:{
        type: String,
        default: ''
    },
    message:{
        type: String,
        default: ''
    },
    },{
        timestamps: true
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;
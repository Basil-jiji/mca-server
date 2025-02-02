const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    description:{
        type:String,
        required: true
    },
    image:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        default: ''
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    },{
        timestamps: true
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;
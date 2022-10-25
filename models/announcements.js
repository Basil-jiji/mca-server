const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announceSchema = new Schema({
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

var Announcements = mongoose.model('Announcement', announceSchema);

module.exports = Announcements;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
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

var Notifications = mongoose.model('Notification', notificationsSchema);

module.exports = Notifications;
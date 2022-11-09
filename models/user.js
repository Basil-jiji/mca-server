var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username:{
        type: String,
        require:true
    },
    accountType: {
        type: String,
        default:'student',
    },
    accountStatus:{
        type: String,
        default:'',
    },
    firstName:{
        type: String,
        default:'',
    },
    lastName:{
        type: String,
        default:'',
    },
    regNumber:{
        type: String,
        default:'',
    },
    batch:{
        type: String,
        default:'',
    },
    email:{
        type: String,
        default:'',
    },
    phoneNumber:{
        type: String,
        default:'',
    },
    admin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', User);
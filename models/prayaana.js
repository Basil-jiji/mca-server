const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prayaanaSchema = new Schema({
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

var Prayaanas = mongoose.model('Prayaana', prayaanaSchema);

module.exports = Prayaanas;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pizadaSchema = new Schema({
    topic:{
        type:String,
        required: true,
        unique: true,
    },
    article:{
        type:String,
        required: true
    },
    },{
        timestamps: true
});

var Pizadas = mongoose.model('Pizada', pizadaSchema);

module.exports = Pizadas;
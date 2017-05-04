const mongoose = require('mongoose');

var NuevoSchema = new mongoose.Schema({
    name:{
        type: String
    },
    img:{
        type: String
    },
    url:{
        type: String
    },
    precio:{
        type: String
    }
});


var Nuevo = mongoose.model('Nuevo', NuevoSchema);

module.exports={Nuevo}

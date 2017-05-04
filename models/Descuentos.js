const mongoose = require('mongoose');

var DescuentoSchema = new mongoose.Schema({
    name:{
        type: String
    },
    img:{
        type: String
    },
    url:{
        type: String
    },
    precioAnterior:{
        type: String
    },
    precioNuevo:{
        type: String
    }
});


var Descuento = mongoose.model('Descuento', DescuentoSchema);

module.exports={Descuento}

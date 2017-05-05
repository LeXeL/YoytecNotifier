const mongoose = require('mongoose');

var DescuentoSchema = new mongoose.Schema({
  name: {
    type: String
  },
  img: {
    type: String
  },
  url: {
    type: String
  },
  precioAnterior: {
    type: String
  },
  precioNuevo: {
    type: String
  }
});

DescuentoSchema.statics.checkifnew = function(descuento) {
  var Descuento = this;
  return Descuento.findOne({name: descuento.name}).then((doc) => {
    if (!doc) {
      return Promise.resolve(descuento);
    }else{
      return Promise.reject();
    }
  });
}
var Descuento = mongoose.model('Descuento', DescuentoSchema);

module.exports = {Descuento}

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

NuevoSchema.statics.checkifnew = function (nuevo) {
  var Nuevo = this;
  return Nuevo.findOne({name:nuevo.name}).then((doc)=>{
    if (!doc){
      return Promise.resolve(nuevo);
    }else{
      return Promise.reject();
    }
  });
}
var Nuevo = mongoose.model('Nuevo', NuevoSchema);

module.exports={Nuevo}

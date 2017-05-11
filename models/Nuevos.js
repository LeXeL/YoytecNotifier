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
    },
    enviado:{
      type: Boolean,
      default: false
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

NuevoSchema.statics.getNotSend = function () {
  var Nuevo = this;
  return Nuevo.find({enviado:false}).then((doc)=>{
    if (doc){
      return Promise.resolve(doc);
    }else{
      return Promise.reject();
    }
  })
}

var Nuevo = mongoose.model('Nuevo', NuevoSchema);

module.exports={Nuevo}

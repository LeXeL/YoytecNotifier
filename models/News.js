const mongoose = require('mongoose')

var NewSchema = new mongoose.Schema({
    name:{
        type: String
    },
    img:{
        type: String
    },
    url:{
        type: String
    },
    price:{
        type: String
    },
    send:{
      type: Boolean,
      default: false
    }
})

NewSchema.statics.checkifnew = function (newItem) {
  var New = this
  return New.findOne({name:newItem.name}).then((doc)=>{
    if (!doc){
      return Promise.resolve(newItem)
    }else{
      return Promise.reject()
    }
  })
}

NewSchema.statics.getNotSend = function () {
  var New = this
  return New.find({enviado:false}).then((doc)=>{
    if (doc){
      return Promise.resolve(doc)
    }else{
      return Promise.reject()
    }
  })
}

var NewItems = mongoose.model('New', NewSchema)

module.exports={NewItems}

const mongoose = require('mongoose')

var DiscountsSchema = new mongoose.Schema({
  name: {
    type: String
  },
  img: {
    type: String
  },
  url: {
    type: String
  },
  priceBefore: {
    type: String
  },
  priceAfter: {
    type: String
  },
  send:{
    type: Boolean,
    default: false
  }
})

DiscountsSchema.statics.checkifnew = function(discount) {
  var Discount = this
  return Discount.findOne({name: discount.name}).then((doc) => {
    if (!doc) {
      return Promise.resolve(discount)
    }else{
      return Promise.reject()
    }
  })
}
DiscountsSchema.statics.getNotSend = function () {
  var Discount = this
  return Discount.find({enviado:false}).then((doc)=>{
    if (doc){
      return Promise.resolve(doc)
    }else{
      return Promise.reject()
    }
  })
}
var Discount = mongoose.model('Discount', DiscountsSchema)

module.exports = {Discount}

const mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
    email:{
        type: String
    }
});

UsersSchema.statics.count = function() {
    var User = this;
    User.find({}).then((doc)=>{
        return doc.length;
    })
}

UsersSchema.statics.createUser = function(newUser){
  var User = this;
  return User.findOne({email:newUser.email}).then((doc)=>{
    if(doc){
      return Promise.reject();
    }else{
      newUser.save();
      return Promise.resolve(newUser);
    }
  });
}
var User = mongoose.model('User', UsersSchema);

module.exports={User}

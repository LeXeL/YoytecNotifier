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
var User = mongoose.model('User', UsersSchema);

module.exports={User}

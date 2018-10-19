var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    username: { type: String},
    age: { type: String},
    email:{ type: String, unique: true, index: true, required: true },
    login:{ type: String, required: true },
    password: { type: String, select: false,required: true },
    gender:{ type: String},
});


userSchema.methods.encryptPass = function(password){
    var pass = crypto.createHash('md5').update(password).digest('hex');
    return this.password = pass;
};


var User = mongoose.model('User',userSchema);

module.exports = User;
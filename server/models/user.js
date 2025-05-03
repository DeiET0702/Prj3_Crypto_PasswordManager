const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({

}); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
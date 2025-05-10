const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    user_id: {type: String, required: true, unique: true, default: () => require('crypto').randomBytes(16).toString('hex'),},
    username: {type: String, required: true, unique: true},
    master_key_salt: {type: String, required: true}
}); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
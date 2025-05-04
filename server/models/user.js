const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        description: "Tên đăng nhập, phải duy nhất"
      },
      master_key_salt: {
        type: Buffer,  
        required: true,
        description: "Salt để derive master key từ password"
      }
}); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
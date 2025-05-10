const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    item_id: { type: String, required: true, unique: true, default: () => require('crypto').randomBytes(16).toString('hex'), },
    owner_id: { type: String, required: true, ref: "User" }, // identify the owner of the password manager
    domain_name: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true}
}); 

const ItemModel = mongoose.model('Item', itemSchema);
module.exports = ItemModel;

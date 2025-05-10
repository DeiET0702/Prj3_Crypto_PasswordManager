const mongoose = require("mongoose");
const { Schema } = mongoose;

const sharedPasswordsSchema = new Schema({
  share_id: { type: String, required: true, unique: true, default: () => require('crypto').randomBytes(16).toString('hex'), },
  
  item_id: { type: String, required: true, ref: "Item" },
  sender_id: { type: String, required: true, ref: "User" },
  receiver_id: { type: String, required: true, ref: "User" },

  domain_name: { type: String, require: true},
  encrypted_password: { type: String, required: true },

  iv: {type: String, required: true},
  tag: { type: String, required: true},
  expiredsAt: {
    type: Date,
    require: true,
    index: { expires: '0'},
  } 
}, { timestamps: true});

const SharedPasswords = mongoose.model('SharedPasswords', sharedPasswordsSchema);

module.exports = SharedPasswords;

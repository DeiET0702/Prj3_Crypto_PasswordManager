const mongoose = require("mongoose");
const { Schema } = mongoose;

const sharedPasswordsSchema = new Schema({
  share_id: { type: String, required: true, unique: true },
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  encrypted_password: { type: String, required: true }, // Store the wrapped key and encrypted password
}, { timestamps: true });

const SharedPasswords = mongoose.model('SharedPasswords', sharedPasswordsSchema);

module.exports = SharedPasswords;

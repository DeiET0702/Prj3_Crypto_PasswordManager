const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const itemSchema = new Schema({
  owner_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    description: "Người tạo item"
  },
  domain_tag: {
    type: Buffer,
    required: true,
    description: "HMAC(domain)"
  },
  ciphertext: {
    type: Buffer,
    required: true,
    description: "Password được mã hóa"
  },
  iv: {
    type: Buffer,
    required: true,
    description: "IV dùng cho AES-GCM"
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    description: "Thời điểm tạo"
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
    description: "Thời điểm cập nhật cuối"
  }
});

const ItemModel = mongoose.model('Item', itemSchema);
module.exports = ItemModel;

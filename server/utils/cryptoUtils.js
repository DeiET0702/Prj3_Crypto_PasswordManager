const crypto = require("crypto");
const SharedPasswords = require("../models/shared_passwords");
const User = require("../models/user");
const Items = require("../models/items");

// Simulated master key retrieval (replace with real DB-based key management)
// Decrypt the master key user from user_id(by using PBKDF2)
const decryptMasterKey = async (userId, masterPassword) => {
  const user = await User.findOne({user_id: userId});
  if (!user) throw new Error("User not found");

  const salt = Buffer.from(user.master_key_salt, "hex");
  return crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256"); // 256-bit key
};

// AES-GCM decryption for shared encrypted passwords
const decryptPassword = (encryptedPassword, iv, tag, key) => {
  
  const iv = Buffer.from(iv, "hex");
  const ciphertext = Buffer.from(encryptedPassword, "hex");
  const tag = Buffer.from(tag, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

// AES-GCM encryption (used to wrap site key with recipient's master key)
const wrapKey = (siteKey, masterKey) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(siteKey, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${encrypted.toString("hex")}:${tag.toString("hex")}`;
};

module.exports = {
  decryptMasterKey,
  decryptPassword,
  wrapKey,
};

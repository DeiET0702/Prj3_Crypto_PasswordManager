const crypto = require("crypto");

// Simulated master key retrieval (replace with real DB-based key management)
const decryptMasterKey = async (userId) => {
  const password = userId + "_password"; // Simulated password
  const salt = Buffer.from(userId); // Normally stored in DB
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256"); // 256-bit key
};

// AES-GCM decryption for shared encrypted passwords
const decryptPassword = (encryptedPassword, key) => {
  const [nonceHex, ciphertextHex, tagHex] = encryptedPassword.split(":");

  const iv = Buffer.from(nonceHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

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

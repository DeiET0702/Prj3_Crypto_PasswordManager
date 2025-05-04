const crypto = require('crypto');
const safeBuffer = require('safe-buffer');

// Hằng số
const PBKDF2_ITERATIONS = 210000; // Theo khuyến nghị OWASP
const KEY_LENGTH = 64; // 32 cho HMAC, 32 cho AES

// Sinh khóa an toàn
function deriveMasterKey(password, salt) {
  const passBuffer = safeBuffer.Buffer.from(password);
  const key = crypto.pbkdf2Sync(
    passBuffer,
    salt,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    'sha256'
  );
  passBuffer.fill(0); // Xóa password khỏi bộ nhớ
  return key;
}

function splitMasterKey(masterKey) {
  return {
    hmacKey: masterKey.slice(0, 32),
    encKey: masterKey.slice(32)
  };
}

// Sinh khóa domain an toàn
function deriveDomainKey(hmacKey, domain, info = '') {
  // Kiểu HKDF
  const prk = crypto.createHmac('sha256', hmacKey)
    .update(domain)
    .digest();
  
  const infoBuffer = Buffer.from(info);
  const key = crypto.createHmac('sha256', prk)
    .update(infoBuffer)
    .digest();
  
  return key.slice(0, 32); // Trả về khóa 256-bit
}

// Mã hóa có xác thực với additional data
function aesGcmEncrypt(plaintext, key, aad = '') {
  const iv = crypto.randomBytes(12); // IV 96-bit cho GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  if (aad) {
    cipher.setAAD(Buffer.from(aad), {
      plaintextLength: Buffer.from(plaintext).length
    });
  }
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  
  return {
    iv,
    tag,
    ciphertext: encrypted
  };
}

function aesGcmDecrypt(ciphertext, key, iv, tag, aad = '') {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    if (aad) {
      decipher.setAAD(Buffer.from(aad), {
        plaintextLength: ciphertext.length
      });
    }
    
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
  } catch (err) {
    console.error('Giải mã thất bại:', err.message);
    throw new Error('Xác thực thất bại - dữ liệu có thể bị can thiệp');
  }
}

module.exports = {
  deriveMasterKey,
  splitMasterKey,
  deriveDomainKey,
  aesGcmEncrypt,
  aesGcmDecrypt
};
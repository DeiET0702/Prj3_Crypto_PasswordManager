const Item = require('../models/item');
const User = require('../models/user');
const cryptoService = require('../services/cryptoService');

async function createItem(req, res) {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { username, master_password, domain, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Thêm rate limiting ở đây hoặc trong route
        if (user.failedAttempts > 5) {
        return res.status(429).json({ error: 'Too many attempts' });
        }

        const masterKey = cryptoService.deriveMasterKey(master_password, user.master_key_salt);
        const { hmacKey, encKey } = cryptoService.splitMasterKey(masterKey);

        const domain_tag = cryptoService.hmacDomain(domain, hmacKey);
        const { ciphertext, iv, tag } = cryptoService.aesGcmEncrypt(
        Buffer.from(password), 
        encKey,
        domain // Thêm domain làm additional data
        );

        const now = new Date();
        const item = new Item({
        owner_id: user._id,
        domain_tag,
        ciphertext,
        iv,
        tag, // Lưu tag riêng
        created_at: now,
        updated_at: now
        });

        await item.save();
        res.status(201).json({ message: 'Item saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save item' });
    }
}

async function getItem(req, res) {
  try {
    const { username, master_password, domain } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const masterKey = cryptoService.deriveMasterKey(master_password, user.master_key_salt);
    const { hmacKey, encKey } = cryptoService.splitMasterKey(masterKey);

    const domain_tag = cryptoService.hmacDomain(domain, hmacKey);

    const item = await Item.findOne({ owner_id: user._id, domain_tag });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const plaintext = cryptoService.aesGcmDecrypt(item.ciphertext, encKey, item.iv);

    res.status(200).json({ domain, password: plaintext.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get item' });
  }
}

async function updateItem(req, res) {
  try {
    const { username, master_password, domain, new_password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const masterKey = cryptoService.deriveMasterKey(master_password, user.master_key_salt);
    const { hmacKey, encKey } = cryptoService.splitMasterKey(masterKey);

    const domain_tag = cryptoService.hmacDomain(domain, hmacKey);
    const { ciphertext, iv } = cryptoService.aesGcmEncrypt(Buffer.from(new_password), encKey);

    const item = await Item.findOneAndUpdate(
      { owner_id: user._id, domain_tag },
      { ciphertext, iv, updated_at: new Date() },
      { new: true }
    );

    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

async function deleteItem(req, res) {
  try {
    const { username, master_password, domain } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const masterKey = cryptoService.deriveMasterKey(master_password, user.master_key_salt);
    const { hmacKey } = cryptoService.splitMasterKey(masterKey);

    const domain_tag = cryptoService.hmacDomain(domain, hmacKey);

    const result = await Item.findOneAndDelete({ owner_id: user._id, domain_tag });
    if (!result) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

module.exports = {
  createItem,
  getItem,
  updateItem,
  deleteItem
};

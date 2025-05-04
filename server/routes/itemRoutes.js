const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middlewares/authMiddleware');

// Giới hạn 5 request mỗi phút
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5
});

// Middleware xác thực
router.use(authMiddleware);

// Validate input
const validateItem = [
  check('username').isString().notEmpty(),
  check('master_password').isLength({ min: 8 }),
  check('domain').isURL(), // Hoặc kiểm tra domain hợp lệ
  check('password').isLength({ min: 6 })
];

router.post('/items', limiter, validateItem, itemController.createItem);
router.get('/items', limiter, itemController.getItem);
router.put('/items', limiter, validateItem, itemController.updateItem);
router.delete('/items', limiter, itemController.deleteItem);

module.exports = router;
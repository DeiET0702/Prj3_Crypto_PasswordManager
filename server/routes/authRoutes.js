const express = require('express');
const router = express.Router();
const cors = require('cors');
const { sharePassword } = require('../controllers/authControllers');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

router.post('/share', sharePassword);

module.exports = router;
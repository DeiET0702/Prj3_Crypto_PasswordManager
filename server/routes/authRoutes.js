const express = require('express');
const router = express.Router();
const cors = require('cors');
const { sharePassword, viewSharedPassword, deleteSharedPassword } = require('../controllers/authControllers');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

router.get('/share', viewSharedPassword).post('/share', deleteSharedPassword);
router.post('/', sharePassword);

module.exports = router;
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Cho phép xử lý JSON trong request body

// Kết nối database
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database not connected:", err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));   // Xử lý đăng ký / đăng nhập
app.use('/api/items', require('./routes/itemRoutes'));  // Xử lý CRUD với mật khẩu đã mã hoá

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// middleware
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());

//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database Connected"))
.catch((err) => console.log("Database not connected", err))

app.use('/', require('./routes/authRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
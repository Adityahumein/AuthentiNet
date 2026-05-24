const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db')
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "active", message: "AuthentiNet Server is live" });
});

app.listen(PORT, () => {
  console.log(`[Server Ready] Running seamlessly on port ${PORT}`);
});
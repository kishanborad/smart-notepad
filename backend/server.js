const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Notepad backend!');
});

// Start Server
const PORT = process.env.PORT || 1020;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

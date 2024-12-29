require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 1020;

// Middleware
app.use(express.json()); // To parse JSON requests
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

// Routes
app.use('/api/notes', noteRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

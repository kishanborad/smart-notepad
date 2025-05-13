const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');

// Initialize express app
const app = express();

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable Helmet temporarily for development
// app.use(helmet());

// Configure CORS
app.use(cors());

// Basic rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use('/api/', limiter);

// Connect to MongoDB
mongoose.connect(config.db.uri, config.db.options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = config.server.port || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
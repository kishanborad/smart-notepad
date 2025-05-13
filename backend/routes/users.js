const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword
} = require('../controllers/userController');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.patch('/profile', auth, updateProfile);

// Change password
router.post('/change-password', auth, changePassword);

// Request password reset
router.post('/request-reset', requestPasswordReset);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router; 
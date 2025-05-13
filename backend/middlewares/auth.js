const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader); // Debug log

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No authorization header'
            });
        }

        // Check if token exists and is in correct format
        const token = authHeader.replace('Bearer ', '');
        console.log('Token:', token); // Debug log

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);
        console.log('Decoded token:', decoded); // Debug log

        // Convert string _id to ObjectId
        const userId = new mongoose.Types.ObjectId(decoded._id);
        console.log('Looking for user with ID:', userId); // Debug log

        // Find user using ObjectId
        const user = await User.findById(userId);
        console.log('Found user:', user); // Debug log

        if (!user) {
            console.log('No user found with ID:', userId); // Debug log
            // Let's try to find the user by email as a fallback
            const userByEmail = await User.findOne({ email: decoded.email });
            console.log('User found by email:', userByEmail); // Debug log
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add user to request
        req.user = user;
        req.token = token;
        console.log('User added to request:', req.user); // Debug log
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Please authenticate',
            error: error.message
        });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin privileges required.'
                });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Please authenticate.'
        });
    }
};

module.exports = {
    auth,
    adminAuth
}; 
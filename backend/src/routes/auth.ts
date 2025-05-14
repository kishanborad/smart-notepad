import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

router.get('/profile', auth, getProfile);

export default router; 
import express from 'express';
import {body} from 'express-validator';
import {login, register} from '../controllers/authController.js';
import {handleValidationErrors} from '../middleware/validation.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    handleValidationErrors
  ],
  login
);

// POST /api/auth/register
router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name required'),
    handleValidationErrors
  ],
  register
);

export default router;


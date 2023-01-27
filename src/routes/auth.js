import { Router } from 'express';
import { body } from 'express-validator';
import auth from '../controllers/authController';

const router = Router();

// @route    POST api/auth/register
// @desc     Register new user and get jwt
// @access   Public
router.post(
  '/register',
  body('username').not().isEmpty(),
  body('email').isEmail(),
  body('password').isLength({
    min: 6,
  }),
  auth.registerUser
);

// @route    POST api/auth/login
// @desc     Login user and get jwt
// @access   Public
router.post(
  '/login',
  body('username').not().isEmpty(),
  body('password').isLength({
    min: 6,
  }),
  auth.loginUser
);

// @route    Get api/auth/logout
// @desc     Logout user and delete jwt cookie
// @access   Public
router.get('/logout', auth.logoutUser);

// @route    Get api/auth/refresh
// @desc     Send back new access token
// @access   Public
router.get('/refresh', auth.refreshToken);

export default router;

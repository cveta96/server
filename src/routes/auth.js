import { Router } from 'express';
import { check } from 'express-validator';
import auth from '../controllers/authController';

const router = Router();

// @route    POST api/auth/register
// @desc     Register new user and get jwt
// @access   Public
router.post(
  '/register',
  check('username', 'Username is required.').notEmpty(),
  check('email', 'Email is required.').isEmail(),
  check('password', 'Password is required.').isLength({
    min: 6,
  }),
  auth.registerUser
);

// @route    POST api/auth/login
// @desc     Login user and get jwt
// @access   Public
router.post(
  '/login',
  check('username', 'Username is required.').notEmpty(),
  check('password', 'Password is required.').isLength({
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

// @route    Get api/auth/check
// @desc     Send back new access token and username if jwt cookie is verified
// @access   Public
router.get('/check', auth.checkCookieToken);

export default router;

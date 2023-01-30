import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();

//Register new user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;

  try {
    let userEmail = await User.findOne({ email });
    let userUsername = await User.findOne({ username });

    if (userEmail) return res.status(400).json({ msg: 'Email already in use' });
    if (userUsername)
      return res.status(400).json({ msg: 'Username already exists' });

    let user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const payload = {
      user: {
        id: user.id,
      },
    };

    const accessJWT = process.env.JWT_ATS;
    const refreshJWT = process.env.JWT_RTS;

    const refreshToken = jwt.sign(payload, refreshJWT, {
      expiresIn: '1d',
    });
    user.refreshToken = refreshToken;
    await user.save();

    jwt.sign(payload, accessJWT, { expiresIn: '6h' }, (err, accessToken) => {
      if (err) throw err;
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Login user
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });

    if (!user) return res.status(404).json({ msg: 'Username not found.' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials.' });

    const payload = {
      user: {
        id: user.id,
      },
    };

    const accessJWT = process.env.JWT_ATS;
    const refreshJWT = process.env.JWT_RTS;

    const refreshToken = jwt.sign(payload, refreshJWT, {
      expiresIn: '1d',
    });
    user.refreshToken = refreshToken;
    await user.save();

    //Add sameSite: 'None' secure: true,
    jwt.sign(payload, accessJWT, { expiresIn: '10s' }, (err, accessToken) => {
      if (err) throw err;
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Logout user
const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(204);

  try {
    let user = await User.findOne({ refreshToken: cookies.jwt });

    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
      });
      return res.sendStatus(204);
    }

    user.refreshToken = '';
    await user.save();
    //Add sameSite: 'None' secure: true,
    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Get new access token
const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.status(401).json({ msg: 'Invalid cookie.' });

  try {
    let user = await User.findOne({ refreshToken: cookies.jwt });

    if (!user) return res.status(403).json({ msg: 'Forbidden.' });

    const accessJWT = process.env.JWT_ATS;
    const refreshJWT = process.env.JWT_RTS;

    jwt.verify(cookies.jwt, refreshJWT, (error, decoded) => {
      if (error || user.id !== decoded.user.id) {
        res.status(403).json({ msg: 'Forbidden.' });
      } else {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const accessToken = jwt.sign(payload, accessJWT, {
          expiresIn: '6h',
        });
        res.json({ accessToken });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

//Check jwt cookie and send back username
const checkCookieToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.status(401).json({ msg: 'Invalid cookie.' });

  try {
    let user = await User.findOne({ refreshToken: cookies.jwt });

    if (!user) return res.status(403).json({ msg: 'Forbidden.' });

    const accessJWT = process.env.JWT_ATS;
    const refreshJWT = process.env.JWT_RTS;

    jwt.verify(cookies.jwt, refreshJWT, (error, decoded) => {
      if (error || user.id !== decoded.user.id) {
        res.status(403).json({ msg: 'Forbidden.' });
      } else {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const accessToken = jwt.sign(payload, accessJWT, {
          expiresIn: '6h',
        });
        res.json({ accessToken, username: user.username });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error.' });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  checkCookieToken,
};

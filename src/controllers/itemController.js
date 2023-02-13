import { validationResult } from 'express-validator';
import Item from '../models/item';
import dotenv from 'dotenv';

dotenv.config();

//Create new item
const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { userId, name, description, price } = req.body;

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

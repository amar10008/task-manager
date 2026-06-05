const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ msg: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Email already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Wrong password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, name: user.name });
});

// Delete Account
router.delete('/delete', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    await require('../models/Task').deleteMany({ userId: decoded.id });
    await require('../models/User').findByIdAndDelete(decoded.id);
    res.json({ msg: 'Account deleted' });
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
});

module.exports = router;
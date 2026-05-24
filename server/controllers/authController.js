const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new human creator profile
// @route   POST /api/auth/signup
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation Checks
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please enter all registration fields' });
    }

    // 2. Check for pre-existing records to prevent collision
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'Username or Email identity already registered' });
    }

    // 3. Cryptographic Password Hashing (Blowfish cipher-based algorithm)
    const salt = await bcrypt.genSalt(10); // Generates 10 rounds of random salt padding
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Persistence execution
    const user = await User.create({
      username,
      email,
      passwordHash
    });

    // 5. Generate State Verification JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error(`[Signup System Failure]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Authenticate creator profile & sign tokens
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill out all credentials' });
    }

    // 1. Verify User existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid security credentials provided' });
    }

    // 2. Compare hashed string identities
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid security credentials provided' });
    }

    // 3. Re-issue secure operational web token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error(`[Login System Failure]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
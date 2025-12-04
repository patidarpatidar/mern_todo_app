const axios = require('axios');
const jwt = require('jsonwebtoken');

const DUMMYJSON_API = process.env.DUMMYJSON_API_URL;

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    console.log('DUMMYJSON_API_URL:', DUMMYJSON_API);
    console.log('Login attempt with username:', username);

    // Call DummyJSON API
    const response = await axios.post(`${DUMMYJSON_API}/auth/login`, {
      username,
      password,
    });

    const { id, firstName, lastName, email } = response.data;

    // Generate JWT token
    const token = jwt.sign(
      { id, username, firstName, lastName, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id, username, firstName, lastName, email },
    });
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Signup user (create new user)
const signup = async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Call DummyJSON API to add user
    const response = await axios.post(`${DUMMYJSON_API}/users/add`, {
      username,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      email,
    });

    const { id } = response.data;

    // Generate JWT token
    const token = jwt.sign(
      { id, username, firstName: firstName || '', lastName: lastName || '', email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id, username, firstName: firstName || '', lastName: lastName || '', email },
      message: 'Account created successfully (Demo: This account is temporary for this session)'
    });
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);

    if (error.response?.status === 400) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(500).json({ message: 'Failed to create account' });
  }
};

module.exports = { login, signup };

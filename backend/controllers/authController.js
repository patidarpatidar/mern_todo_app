const axios = require('axios');
const jwt = require('jsonwebtoken');
const DUMMYJSON_API = process.env.DUMMYJSON_API_URL;
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const response = await axios.post(`${DUMMYJSON_API}/auth/login`, {
      username,
      password,
    });

    const { id, firstName, lastName, email } = response.data;

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
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const signup = async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }
    const response = await axios.post(`${DUMMYJSON_API}/users/add`, {
      username,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      email,
    });

    const { id } = response.data;

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
    res.status(500).json({ message: 'Failed to create account' });
  }
};

module.exports = { login, signup };

// Test script to verify login and todo creation
const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function test() {
  try {
    console.log('1. Testing login...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'emilys',
      password: 'emilyspass'
    });
    
    const token = loginRes.data.token;
    console.log('✓ Login successful, token received');
    
    console.log('\n2. Testing add todo...');
    const todoRes = await axios.post(`${API_URL}/api/todos/add`, 
      { todo: 'Buy groceries' },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✓ Todo added:', todoRes.data);
    
    console.log('\n3. Testing get todos...');
    const getTodosRes = await axios.get(`${API_URL}/api/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✓ Todos fetched:', getTodosRes.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();

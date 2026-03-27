const axios = require('axios');
require('dotenv').config();

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/login', {
      email: 'user1@clinic.com',
      password: '123'
    });
    const token = loginRes.data.token;
    console.log('Login successful, token acquired.');

    const chatRes = await axios.get('http://localhost:5000/api/chat/chat-list', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Success:', chatRes.data);
  } catch (e) {
    console.log('Error stage:', e.config?.url);
    console.log('Error data:', e.response?.data || e.message);
  }
}

test();

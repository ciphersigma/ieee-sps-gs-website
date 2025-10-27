const fetch = require('node-fetch');

async function testLoginAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'prashantchettiyar@ieee.org',
        password: 'SuperAdmin123!'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.text();
    console.log('Response body:', data);

    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Login successful!');
      console.log('Token received:', !!jsonData.token);
      console.log('User data:', jsonData.user);
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testLoginAPI();
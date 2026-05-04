async function run() {
  try {
    const response = await fetch('http://localhost:3000/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    });
    
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}
run();

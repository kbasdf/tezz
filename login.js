document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log("Login response status:", response.status);

    const text = await response.text(); // ✅ read raw text first
    console.log("Raw response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      document.getElementById('loginMessage').innerText = "Invalid server response.";
      return;
    }

    console.log("Parsed result:", result);

    if (result.success) {
      localStorage.setItem('authToken', result.token);
      console.log("Token saved:", localStorage.getItem('authToken'));
      alert("Token saved: " + localStorage.getItem('authToken')); // ✅ debug check
      window.location.href = "home.html";
    } else {
      document.getElementById('loginMessage').innerText = "Invalid credentials!";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById('loginMessage').innerText = "Server error. Try again.";
  }
});
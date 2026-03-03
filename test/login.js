document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log("Login form submitted");
  // fetch call here
});

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log("Login response status:", response.status);

    const result = await response.json();
    console.log("Login result:", result);

    if (result.success) {
      localStorage.setItem('authToken', result.token);
      document.getElementById('loginMessage').innerText = "Login successful! Token saved.";
    } else {
      document.getElementById('loginMessage').innerText = "Invalid credentials!";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById('loginMessage').innerText = "Server error. Try again.";
  }
});
console.log("app.js loaded");
alert("app.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  // ✅ Login form logic
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: "include" // ✅ ensures cookie is stored
        });

        const result = await response.json();
        console.log("Parsed result:", result);

        if (result.success === true) {
          // ✅ No need to save token in localStorage
          window.location.href = "home.html";
        } else {
          document.getElementById('loginMessage').innerText = "Invalid credentials!";
        }
      } catch (error) {
        console.error("Login error:", error);
        document.getElementById('loginMessage').innerText = "Server error. Try again.";
      }
    });
  }

  // ✅ Customer search logic (for home.html)
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const searchTerm = document.getElementById('searchInput').value;

      try {
        const response = await fetch(`http://localhost:4000/api/customers/${searchTerm}`, {
          method: "GET",
          credentials: "include", // ✅ cookie automatically sent
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          console.error("Search failed:", response.status);
          alert("Search failed: " + response.status);
          return;
        }

        const customers = await response.json();
        console.log("Search results:", customers);

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = "";

        if (customers.length === 0) {
          resultsDiv.innerText = "No customers found.";
        } else {
          customers.forEach(c => {
            const div = document.createElement('div');
            div.innerText = `${c.name} (${c.email})`;
            resultsDiv.appendChild(div);
          });
        }
      } catch (error) {
        console.error("Error searching customers:", error);
      }
    });
  }
});
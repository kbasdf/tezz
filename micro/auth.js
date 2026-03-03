const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

// ✅ Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true // important for cookies
}));

app.use(bodyParser.json());
app.use(cookieParser()); // ✅ parse cookies

const users = [
  { email: "abc@test.com", password: "password" },
  { email: "john@test", password: "password" }
];

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    try {
      console.log("Fetching token from:", "http://localhost:6060/api/token");
      const response = await fetch("http://127.0.0.1:6060/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error("Token service error: " + response.status);
      }

      const data = await response.json();

      // ✅ Set HttpOnly cookie
      res.cookie("authToken", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 5 * 60 * 1000 // 5 minutes
      });

      // ✅ Return consistent response
      res.json({ success: true, message: "login success" });

    } catch (err) {
      console.error("Error contacting token service:", err);
      res.status(500).json({ success: false, message: "Token service unavailable" });
    }

  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(5000, () => {
  console.log("Auth service running on http://localhost:5000");
});
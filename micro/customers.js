const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();

// ✅ Enable CORS with credentials so cookies can be sent
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser()); // ✅ parse cookies


// 🔑 Middleware to protect routes
function authMiddleware(req, res, next) {
  const token = req.cookies.authToken; // ✅ read from HttpOnly cookie
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, "hula-shula-bula-kula");
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// ✅ Load customers from file
const customers = JSON.parse(fs.readFileSync('customers.json', 'utf8'));

// ✅ Route for all customers
app.get('/api/customers', authMiddleware, (req, res) => {
  res.json(customers);
});


// ✅ Protected route
app.get('/api/customers/:name', authMiddleware, (req, res) => {
  const name = req.params.name.toLowerCase();
  const results = customers.filter(c => c.name.toLowerCase().includes(name));
  res.json(results);
});

app.listen(4000, () => {
  console.log("Customer service running on http://localhost:4000");
});



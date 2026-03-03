const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(cors()); // allow requests from other origins

const customers = JSON.parse(fs.readFileSync('customers.json', 'utf8'));

app.get('/customers', (req, res) => {
  res.json(customers);
});

app.listen(PORT, () => {
  console.log(`Server1 running on http://localhost:${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const db = require('./db');
const fs = require('fs');
const path = require('path');


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
app.use(bodyParser.json());

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

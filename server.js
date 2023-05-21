const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Loome SQLite andmebaasi ühenduse
const db = new sqlite3.Database('markers.db');

// Loome tabeli, kui see ei eksisteeri
db.run(`CREATE TABLE IF NOT EXISTS markers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude REAL,
  longitude REAL
)`);

// API endpoint markerite saamiseks
app.get('/markers', (req, res) => {
  db.all('SELECT * FROM markers', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// API endpoint markeri lisamiseks
app.post('/markers', (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and longitude are required' });
  } else {
    db.run('INSERT INTO markers (latitude, longitude) VALUES (?, ?)', [latitude, longitude], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    });
  }
});

// Käivitame serveri
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
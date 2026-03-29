const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'guestbook.json');


if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET all entries
app.get('/entries', (req, res) => {
  try {
    const entries = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Could not read entries' });
  }
});

// POST a new entry
app.post('/entries', (req, res) => {
  const { name, message } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const entries = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    const newEntry = {
      name: name.trim(),
      message: message?.trim() || null,
      date: new Date().toISOString()
    };

    entries.unshift(newEntry); // newest first
    fs.writeFileSync(DB_FILE, JSON.stringify(entries, null, 2));
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Could not save entry' });
  }
});

app.listen(PORT, () => {
  console.log(`tee day bday guestbook running at http://localhost:${PORT}`);
});
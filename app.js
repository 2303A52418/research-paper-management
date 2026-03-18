const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const Paper = require('./models/Paper');

const app = express();
const PORT = 3000;

// ===== CONNECT MONGODB =====
mongoose.connect('mongodb://127.0.0.1:27017/researchDB')
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===== FILE UPLOAD =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ===== ROUTES =====

// Upload Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// Upload Paper
app.post('/upload', upload.single('paper'), async (req, res) => {
  const { title, author, year } = req.body;

  await Paper.create({
    title,
    author,
    year,
    file: req.file.filename
  });

  res.redirect('/papers');
});

// View Papers
app.get('/papers', async (req, res) => {
  const papers = await Paper.find();

  let html = "<h2>📄 Uploaded Papers</h2>";

  papers.forEach(p => {
    html += `
      <div style="border:1px solid black; padding:10px; margin:10px;">
        <h3>${p.title}</h3>
        <p>Author: ${p.author}</p>
        <p>Year: ${p.year}</p>
        <a href="/uploads/${p.file}" target="_blank">View PDF</a>
      </div>
    `;
  });

  html += '<br><a href="/">Upload More</a>';

  res.send(html);
});

// ===== SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
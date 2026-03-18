const express = require("express");
const router = express.Router();

const Paper = require("../models/Paper");
const upload = require("../middleware/upload");

// Upload Paper
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { title, author, category, abstract, year } = req.body;

    const paper = new Paper({
      title,
      author,
      category,
      abstract,
      year,
      file: req.file.filename
    });

    await paper.save();

    res.send("Paper uploaded successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get All Papers
router.get("/", async (req, res) => {
  try {
    const papers = await Paper.find();
    res.json(papers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;  // ✅ MUST BE THIS
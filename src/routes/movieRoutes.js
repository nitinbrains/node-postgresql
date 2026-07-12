const express = require('express');

const router = express.Router();

// Define your movie routes here
router.get('/', (req, res) => {
  res.json({ message: 'List of movies' });
});

module.exports = router;
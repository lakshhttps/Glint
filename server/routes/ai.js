// server/routes/ai.js
const express = require('express');
const { getSuggestion } = require('../controllers/aiController');

const router = express.Router();
router.post('/suggest', getSuggestion);

module.exports = router;
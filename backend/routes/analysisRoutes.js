const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  analyzeText,
  analyzeScreenshot,
  analyzeUrlEndpoint,
  getHistory
} = require('../controllers/analysisController');

// POST /api/analyze/text
router.post('/text', analyzeText);

// POST /api/analyze/screenshot
router.post('/screenshot', upload.single('screenshot'), analyzeScreenshot);

// POST /api/analyze/url
router.post('/url', analyzeUrlEndpoint);

// GET /api/history (also exposed via /api/history on server)
router.get('/history', getHistory);

module.exports = router;

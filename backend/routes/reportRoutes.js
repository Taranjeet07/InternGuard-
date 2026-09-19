const express = require('express');
const router = express.Router();
const { createReport, getCompanyReports } = require('../controllers/reportController');

// POST /api/reports
router.post('/', createReport);

// GET /api/reports/company/:name
router.get('/company/:name', getCompanyReports);

module.exports = router;

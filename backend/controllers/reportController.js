const Report = require('../models/Report');

// In-memory fallback storage for hackathon testing without DB connection
const memoryReports = [];

/**
 * POST /api/reports
 * Submit a community scam/recruitment report
 */
async function createReport(req, res, next) {
  try {
    const { company, recruiter, url, reason, evidence, userId } = req.body;

    if (!company || typeof company !== 'string' || company.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Company name is required for submitting a report.'
      });
    }

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reason for report is required.'
      });
    }

    let savedReport;
    try {
      const report = new Report({
        userId,
        company: company.trim(),
        recruiter,
        url,
        reason,
        evidence
      });
      savedReport = await report.save();
    } catch (dbErr) {
      console.warn('MongoDB report save fallback (in-memory):', dbErr.message);
      savedReport = {
        _id: 'mem_rep_' + Date.now(),
        company: company.trim(),
        recruiter,
        url,
        reason,
        evidence,
        createdAt: new Date()
      };
      memoryReports.unshift(savedReport);
    }

    return res.status(201).json({
      success: true,
      message: 'Community report submitted successfully.',
      data: savedReport
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/reports/company/:name
 * Fetch community reports for a specific company name
 */
async function getCompanyReports(req, res, next) {
  try {
    const companyName = req.params.name;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name parameter is required.'
      });
    }

    const regex = new RegExp(`^${companyName.trim()}$`, 'i');
    let reports = [];

    try {
      reports = await Report.find({ company: regex }).sort({ createdAt: -1 });
    } catch (dbErr) {
      reports = memoryReports.filter(r => r.company.toLowerCase() === companyName.trim().toLowerCase());
    }

    const reportCount = reports.length;
    let verificationWarning = "No community reports filed for this company name.";

    if (reportCount > 0) {
      verificationWarning = "Multiple user reports are available. Additional verification is recommended.";
    }

    return res.status(200).json({
      success: true,
      data: {
        company: companyName,
        reportCount,
        reports,
        verificationWarning
      }
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReport,
  getCompanyReports,
  memoryReports
};

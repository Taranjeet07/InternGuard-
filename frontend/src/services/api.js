/**
 * Central API Service for InternGuard Frontend
 * Connects directly to Express backend (http://localhost:5000/api)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Normalizes backend analysis JSON into a standardized format for the React Results view
 */
export function normalizeAnalysisResponse(backendData, inputType = 'text', inputText = '') {
  if (!backendData) return null;

  const riskScore = typeof backendData.riskScore === 'number' ? backendData.riskScore : 0;
  
  let riskLevel = backendData.riskLevel || 'LOW';
  if (riskScore >= 61) riskLevel = 'HIGH';
  else if (riskScore >= 26) riskLevel = 'NEEDS_VERIFICATION';

  const rawIndicators = backendData.indicators || [];
  const normalizedIndicators = rawIndicators.map(ind => ({
    type: ind.type || ind.name || 'Risk Indicator',
    severity: ind.severity || (ind.points >= 20 ? 'HIGH' : 'MEDIUM'),
    points: typeof ind.points === 'number' ? ind.points : (ind.score || 10),
    evidence: ind.evidence || ind.description || 'Suspicious recruitment pattern detected.'
  }));

  const defaultActions = [
    "Do not make any upfront payment, registration fee, or security deposit.",
    "Verify the opportunity through the organization's official corporate website.",
    "Do not share OTPs, passwords, or banking credentials with recruiters."
  ];

  return {
    riskScore,
    riskLevel,
    indicators: normalizedIndicators,
    explanation: backendData.explanation || 'Recruitment safety analysis complete.',
    recommendedActions: (backendData.recommendedActions && backendData.recommendedActions.length > 0)
      ? backendData.recommendedActions
      : defaultActions,
    aiAnalysisAvailable: !!backendData.aiAnalysisAvailable,
    verificationSignals: backendData.verificationSignals || [],
    analysisId: backendData._id || 'ig_' + Date.now(),
    createdAt: backendData.createdAt || new Date().toISOString(),
    inputType: backendData.inputType || inputType,
    inputText: backendData.inputText || inputText
  };
}

/**
 * POST /api/analyze/text
 */
export async function analyzeText(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Text analysis failed on server');
    }
    return normalizeAnalysisResponse(data.data, 'text', payload.text);
  } catch (err) {
    console.warn('Backend API connection notice (using fallback handler):', err.message);
    throw err;
  }
}

/**
 * POST /api/analyze/screenshot
 */
export async function analyzeScreenshot(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/screenshot`, {
      method: 'POST',
      body: formData // Browser sets multipart boundary automatically
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Screenshot analysis failed on server');
    }
    return normalizeAnalysisResponse(data.data, 'screenshot', data.data?.extractedText || '');
  } catch (err) {
    console.warn('Screenshot upload notice:', err.message);
    throw err;
  }
}

/**
 * POST /api/analyze/url
 */
export async function analyzeUrl(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'URL analysis failed on server');
    }
    const raw = data.data || {};
    return normalizeAnalysisResponse({
      riskScore: raw.riskScore || 0,
      riskLevel: raw.riskLevel || 'LOW',
      indicators: (raw.riskIndicators || []).map(i => ({
        type: i.type,
        severity: i.severity,
        points: 10,
        evidence: i.description
      })),
      explanation: raw.riskIndicators && raw.riskIndicators.length > 0 
        ? "URL structural risk indicators detected." 
        : "Domain structure appears standard."
    }, 'url', payload.url);
  } catch (err) {
    console.warn('URL analysis error:', err.message);
    throw err;
  }
}

/**
 * GET /api/history
 */
export async function getHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch history');
    }
    return data.data;
  } catch (err) {
    console.warn('History API notice:', err.message);
    const saved = localStorage.getItem('internguard_history');
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * POST /api/reports
 */
export async function submitReport(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Report submission failed');
    }
    return data.data;
  } catch (err) {
    console.warn('Report submission API notice:', err.message);
    const existing = JSON.parse(localStorage.getItem('internguard_reports') || '[]');
    const newReport = {
      _id: 'local_' + Date.now(),
      company: payload.company,
      recruiter: payload.recruiter,
      url: payload.url,
      reason: payload.reason,
      evidence: payload.evidence,
      createdAt: new Date().toISOString()
    };
    existing.unshift(newReport);
    localStorage.setItem('internguard_reports', JSON.stringify(existing));
    return newReport;
  }
}

/**
 * GET /api/reports/company/:name
 */
export async function getCompanyReports(companyName) {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/company/${encodeURIComponent(companyName)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch company reports');
    }
    return data.data;
  } catch (err) {
    console.warn('Company reports API notice:', err.message);
    const existing = JSON.parse(localStorage.getItem('internguard_reports') || '[]');
    const matches = existing.filter(r => r.company && r.company.toLowerCase() === companyName.toLowerCase());
    return {
      company: companyName,
      reportCount: matches.length,
      reports: matches,
      verificationWarning: matches.length > 0 
        ? "Multiple user reports are available. Additional verification is recommended." 
        : "No community reports filed for this company name."
    };
  }
}

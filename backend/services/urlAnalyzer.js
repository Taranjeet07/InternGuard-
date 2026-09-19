/**
 * URL Analyzer Service for InternGuard
 * Performs safe, non-invasive static checks on recruitment URLs.
 */

const { extractDomain } = require('../utils/helpers');

// Known suspicious TLDs and free hosting extensions often used in scam links
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz', '.work', '.rf.gd'];
const FREE_HOSTING_DOMAINS = ['blogspot.com', 'weebly.com', 'wixsite.com', 'site123.me', 'firebaseapp.com', 'forms.gle'];
const SUSPICIOUS_KEYWORDS = ['verify', 'login', 'payment', 'registration', 'career-update', 'hr-portal', 'job-apply', 'fee'];

/**
 * Analyzes a URL string for security and recruitment risk indicators.
 * @param {string} rawUrl - URL string
 * @param {string} [claimedCompany] - Optional company name claimed by recruiter
 * @returns {object} URL risk analysis result
 */
function analyzeUrl(rawUrl, claimedCompany = '') {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      url: rawUrl,
      isValid: false,
      riskIndicators: [{ type: "Invalid URL", severity: "HIGH", description: "URL is empty or invalid." }],
      riskScore: 50,
      riskLevel: "NEEDS_VERIFICATION"
    };
  }

  let formattedUrl = rawUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(formattedUrl);
  } catch (error) {
    return {
      url: rawUrl,
      isValid: false,
      riskIndicators: [{ type: "Invalid URL Format", severity: "HIGH", description: "The provided string is not a valid URL structure." }],
      riskScore: 50,
      riskLevel: "NEEDS_VERIFICATION"
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol;
  const riskIndicators = [];
  let addedPoints = 0;

  // 1. Check Protocol (HTTPS vs HTTP)
  if (protocol === 'http:') {
    addedPoints += 20;
    riskIndicators.push({
      type: "Insecure Protocol (HTTP)",
      severity: "MEDIUM",
      description: "URL uses unencrypted HTTP instead of secure HTTPS."
    });
  }

  // 2. Check if IP-address-based host (e.g. http://192.168.1.1 or http://45.33.22.11)
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(hostname)) {
    addedPoints += 35;
    riskIndicators.push({
      type: "IP Address Host",
      severity: "HIGH",
      description: "URL directly targets an IP address rather than a domain name."
    });
  }

  // 3. Excessive subdomains check (e.g. job.careers.verify.company.com.scam.ru)
  const domainParts = hostname.split('.');
  if (domainParts.length > 3 && !ipRegex.test(hostname)) {
    addedPoints += 15;
    riskIndicators.push({
      type: "Excessive Subdomains",
      severity: "MEDIUM",
      description: "The domain uses multiple subdomains, which can mask the true destination."
    });
  }

  // 4. Suspicious TLD check
  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      addedPoints += 20;
      riskIndicators.push({
        type: "Suspicious TLD",
        severity: "MEDIUM",
        description: `Domain uses top-level domain (${tld}) often associated with low-cost spam or scam sites.`
      });
      break;
    }
  }

  // 5. Free hosting / form builder check
  for (const freeDom of FREE_HOSTING_DOMAINS) {
    if (hostname.includes(freeDom)) {
      addedPoints += 15;
      riskIndicators.push({
        type: "Free Subdomain/Form Builder",
        severity: "MEDIUM",
        description: `URL is hosted on a generic free platform (${freeDom}) rather than an official corporate domain.`
      });
      break;
    }
  }

  // 6. Suspicious keywords in domain
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (hostname.includes(keyword)) {
      addedPoints += 10;
      riskIndicators.push({
        type: "Suspicious Keyword in Domain",
        severity: "LOW",
        description: `Domain contains keyword '${keyword}' frequently seen in phishing links.`
      });
      break;
    }
  }

  // 7. Domain Mismatch check if claimed company is provided
  if (claimedCompany && typeof claimedCompany === 'string' && claimedCompany.trim() !== '') {
    const companyClean = claimedCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hostnameClean = hostname.replace(/[^a-z0-9]/g, '');

    // If claimed company is e.g. "Google" or "Microsoft" but domain does not contain "google" or "microsoft"
    if (companyClean.length >= 4 && !hostnameClean.includes(companyClean)) {
      addedPoints += 20;
      riskIndicators.push({
        type: "Company-Domain Mismatch",
        severity: "MEDIUM",
        description: `Domain (${hostname}) does not appear to match claimed company name (${claimedCompany}).`
      });
    }
  }

  const riskScore = Math.min(addedPoints, 100);

  let riskLevel = "LOW";
  if (riskScore >= 61) {
    riskLevel = "HIGH";
  } else if (riskScore >= 26) {
    riskLevel = "NEEDS_VERIFICATION";
  }

  return {
    url: formattedUrl,
    isValid: true,
    riskIndicators,
    riskScore,
    riskLevel
  };
}

module.exports = {
  analyzeUrl
};

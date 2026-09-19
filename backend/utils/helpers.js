/**
 * Helper Utility Functions for InternGuard
 */

/**
 * Extracts URLs from raw text content using regular expression.
 * @param {string} text - Text to extract URLs from
 * @returns {string[]} Array of extracted URLs
 */
function extractUrlsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s<>"{}|\\^`]*)?)/gi;
  const matches = text.match(urlRegex) || [];
  
  // Filter out common false positives like email domains or file extensions without protocol
  return [...new Set(matches)].map(u => {
    if (!u.startsWith('http://') && !u.startsWith('https://')) {
      return `https://${u}`;
    }
    return u;
  });
}

/**
 * Extracts hostname / domain from a URL string cleanly.
 * @param {string} urlString - URL string
 * @returns {string|null} Extracted hostname or null
 */
function extractDomain(urlString) {
  if (!urlString) return null;
  try {
    const formatted = urlString.startsWith('http') ? urlString : `https://${urlString}`;
    const parsed = new URL(formatted);
    return parsed.hostname.toLowerCase();
  } catch (error) {
    return null;
  }
}

/**
 * Formats standard API responses
 */
function formatSuccessResponse(data, message = null) {
  const response = { success: true, data };
  if (message) response.message = message;
  return response;
}

function formatErrorResponse(message) {
  return { success: false, message };
}

module.exports = {
  extractUrlsFromText,
  extractDomain,
  formatSuccessResponse,
  formatErrorResponse
};

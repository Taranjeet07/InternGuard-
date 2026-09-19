/**
 * OCR Service for InternGuard
 * Modular OCR extraction service supporting Tesseract.js local engine with fallback.
 */

const { createWorker } = require('tesseract.js');

/**
 * Extracts raw text from an image buffer using OCR.
 * @param {Buffer} imageBuffer - Buffer of uploaded image file
 * @returns {Promise<string>} Extracted text string
 */
async function extractTextFromImage(imageBuffer) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error('Invalid image buffer provided for OCR processing.');
  }

  let worker = null;
  try {
    // Initialize Tesseract worker
    worker = await createWorker('eng');
    const ret = await worker.recognize(imageBuffer);
    await worker.terminate();

    return ret.data && ret.data.text ? ret.data.text.trim() : '';
  } catch (error) {
    if (worker) {
      try { await worker.terminate(); } catch (e) { /* ignore cleanup error */ }
    }
    console.error('OCR Service error:', error.message);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

module.exports = {
  extractTextFromImage
};

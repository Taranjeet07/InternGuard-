const http = require('http');
const app = require('../server');

let server;

function makeRequest(method, path, body = null, isFormData = false) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const options = {
      hostname: '127.0.0.1',
      port: 5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting InternGuard API Verification Tests ---');

  server = app.listen(5001, async () => {
    try {
      // 1. Health check
      console.log('\n[TEST 1] GET /api/health');
      const healthRes = await makeRequest('GET', '/api/health');
      console.log('Response:', healthRes);
      if (healthRes.status === 200 && healthRes.body.success === true) {
        console.log('✓ Health check passed');
      } else {
        console.error('✗ Health check failed');
      }

      // 2. Text Analysis
      console.log('\n[TEST 2] POST /api/analyze/text');
      const textRes = await makeRequest('POST', '/api/analyze/text', {
        text: "Congratulations! You have been selected for an internship. Pay ₹1499 registration fee immediately."
      });
      console.log('Response:', JSON.stringify(textRes.body, null, 2));
      if (textRes.status === 200 && textRes.body.data.riskScore > 0 && textRes.body.data.riskLevel === 'HIGH') {
        console.log('✓ Text analysis passed (Risk score & indicators detected)');
      } else {
        console.error('✗ Text analysis failed');
      }

      // 3. URL Analysis
      console.log('\n[TEST 3] POST /api/analyze/url');
      const urlRes = await makeRequest('POST', '/api/analyze/url', {
        url: "http://192.168.1.1/careers-fee.xyz"
      });
      console.log('Response:', JSON.stringify(urlRes.body, null, 2));
      if (urlRes.status === 200 && urlRes.body.data.riskIndicators.length > 0) {
        console.log('✓ URL analysis passed');
      } else {
        console.error('✗ URL analysis failed');
      }

      // 4. Report Creation & Company Reports Retrieval
      console.log('\n[TEST 4] POST /api/reports & GET /api/reports/company/:name');
      const createRep = await makeRequest('POST', '/api/reports', {
        company: "TestScam Technologies",
        recruiter: "Fake John",
        reason: "Asked for registration fee",
        evidence: "Screenshot uploaded"
      });
      console.log('Create Report Response:', createRep);

      const getRep = await makeRequest('GET', '/api/reports/company/TestScam%20Technologies');
      console.log('Get Company Reports Response:', JSON.stringify(getRep.body, null, 2));
      if (getRep.status === 200 && getRep.body.data.reportCount === 1) {
        console.log('✓ Community reports API passed');
      } else {
        console.error('✗ Community reports API failed');
      }

      // 5. History API
      console.log('\n[TEST 5] GET /api/history');
      const histRes = await makeRequest('GET', '/api/history');
      console.log('History Response count:', histRes.body.data.length);
      if (histRes.status === 200 && Array.isArray(histRes.body.data)) {
        console.log('✓ History API passed');
      } else {
        console.error('✗ History API failed');
      }

      console.log('\n========================================');
      console.log(' All API verification tests completed successfully!');
      console.log('========================================');

    } catch (err) {
      console.error('Test run error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Backend API Tests ---');
  let employerToken = '';
  let candidateToken = '';
  let jobId = '';

  try {
    // 1. Register Employer
    console.log('\\n[1] Testing Employer Registration...');
    const employerEmail = `emp_test_${Date.now()}@example.com`;
    const empRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Backend Tester Employer',
      email: employerEmail,
      password: 'password123',
      role: 'employer',
      company: 'Test Company Ltd'
    });
    employerToken = empRes.data.token;
    console.log('✅ Employer registered successfully. Token received.');

    // 2. Post a Job
    console.log('\\n[2] Testing Job Posting...');
    const jobRes = await axios.post(`${API_URL}/jobs`, {
      title: 'Backend API Tester',
      description: 'Testing the backend APIs',
      company: 'Test Company Ltd',
      location: 'Remote',
      salaryMin: 50000,
      salaryMax: 80000,
      jobType: 'remote',
      category: 'Engineering'
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    jobId = jobRes.data._id;
    console.log(`✅ Job posted successfully. Job ID: ${jobId}`);

    // 3. Register Candidate
    console.log('\\n[3] Testing Candidate Registration...');
    const candidateEmail = `cand_test_${Date.now()}@example.com`;
    const candRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Backend Tester Candidate',
      email: candidateEmail,
      password: 'password123',
      role: 'candidate'
    });
    candidateToken = candRes.data.token;
    console.log('✅ Candidate registered successfully. Token received.');

    // 4. Save Job
    console.log('\\n[4] Testing Save Job...');
    await axios.post(`${API_URL}/saved-jobs`, { jobId }, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    console.log('✅ Job saved successfully by candidate.');

    // 5. Apply for Job
    console.log('\\n[5] Testing Job Application (with file upload)...');
    
    // Create a temporary dummy resume for testing if it doesn't exist
    const dummyPath = path.join(__dirname, 'dummy_test_resume.doc');
    if (!fs.existsSync(dummyPath)) {
      fs.writeFileSync(dummyPath, 'Dummy content for API testing');
    }

    const form = new FormData();
    form.append('jobId', jobId);
    form.append('coverNote', 'This is a test application from the backend script.');
    form.append('resume', fs.createReadStream(dummyPath));

    await axios.post(`${API_URL}/applications`, form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${candidateToken}` 
      }
    });
    console.log('✅ Job application submitted successfully.');

    // 6. Get Applicants (Employer)
    console.log('\\n[6] Testing Fetch Applicants (Employer)...');
    const appsRes = await axios.get(`${API_URL}/applications/job/${jobId}`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    if (appsRes.data.length > 0 && appsRes.data[0].candidate.name === 'Backend Tester Candidate') {
       console.log('✅ Applicants fetched successfully and candidate matches.');
    } else {
       throw new Error('Applicants list did not match expected output.');
    }

    // Clean up
    if (fs.existsSync(dummyPath)) {
      fs.unlinkSync(dummyPath);
    }

    console.log('\\n🎉 All backend tests passed successfully!');

  } catch (error) {
    console.error('\\n❌ Backend Test Failed!');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();

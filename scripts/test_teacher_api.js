const https = require('https');

const BASE_URL = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com';

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

(async () => {
  console.log('=== TESTING TEACHER REGISTRATION ENDPOINTS ===\n');

  // 1. teaching-master-data
  console.log('1. Testing GET /dashboardapi/teaching-master-data ...');
  const masterRes = await request('/dashboardapi/teaching-master-data', 'GET');
  console.log('Response:', masterRes.status);
  console.log('Roles:', masterRes.data?.data?.roles?.length);
  console.log('Family Backgrounds:', masterRes.data?.data?.backgrounds?.length);
  console.log('Institutions:', masterRes.data?.data?.institutions?.length);
  console.log('Experience Levels:', masterRes.data?.data?.experience?.length);
  console.log('Qualifications:', masterRes.data?.data?.qualifications?.length);
  console.log('Denominations:', masterRes.data?.data?.denominations?.length);

  // 2. teacher-register
  console.log('\n2. Testing POST /dashboardapi/teacher-register ...');
  const regRes = await request('/dashboardapi/teacher-register', 'POST', {
    name: 'K. Samuel Prabhakar',
    mobile: '9848012345',
    email: 'samuel.teacher@example.com',
    gender: 'Male',
    designation: 'Senior Mathematics Lecturer',
    role_category: 'Teaching',
    qualification_category: 'PG',
    qualification_id: 9,
    total_experience_years: '8',
    experience_in: 'Mathematics & Statistics',
    caste: 'BC-C',
    subcaste: 'Christian',
    denomination_id: 1,
    faith_category: 'అసెంబ్లీ ఆఫ్ గాడ్-Assembly of God',
    family_background: 'First Generation Employee',
    pastor_phone: '9848999999',
    teacher_type: 'Private',
    working_in: 'Junior College',
    institute_name: 'St. John Junior College',
    inst_state_id: 1,
    inst_district_id: 21,
    res_state_id: 1,
    res_district_id: 21,
    description: 'Serving as mathematics faculty with 8 years of teaching experience.'
  });
  console.log('Response:', regRes.status, regRes.data);

  // 3. admin-teachers
  console.log('\n3. Testing GET /dashboardapi/admin-teachers ...');
  const listRes = await request('/dashboardapi/admin-teachers', 'GET');
  console.log('Response:', listRes.status, 'Total teachers:', listRes.data?.data?.length);

  console.log('\n=== TEACHER API TEST COMPLETE ===');
})();

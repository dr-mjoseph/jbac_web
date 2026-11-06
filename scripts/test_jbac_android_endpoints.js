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
  console.log('=== TESTING JBAC ANDROID REST APIS ===\n');

  // 1. usersync
  console.log('1. Testing POST /dashboardapi/usersync ...');
  const userRes = await request('/dashboardapi/usersync', 'POST', {
    uid: 'test_firebase_uid_101',
    email: 'android.tester@jbac.in',
    name: 'Android Tester',
    role: 'user',
    timestamp: Date.now()
  });
  console.log('Response:', userRes.status, userRes.data?.message || userRes.raw);

  // 2. postnews
  console.log('\n2. Testing POST /dashboardapi/postnews ...');
  const newsRes = await request('/dashboardapi/postnews', 'POST', {
    title: 'JBAC Android App Launch Announcement',
    content: 'Native Android app with dual-write to Firebase and AWS RDS MySQL is live!',
    imageUrl: 'https://jbac.in/assets/images/Banner01.png',
    timestamp: Date.now()
  });
  console.log('Response:', newsRes.status, newsRes.data?.message || newsRes.raw);

  // 3. getnews
  console.log('\n3. Testing GET /dashboardapi/getnews ...');
  const getNewsRes = await request('/dashboardapi/getnews', 'GET');
  console.log('Response:', getNewsRes.status, 'Items count:', getNewsRes.data?.data?.length);

  // 4. postevents
  console.log('\n4. Testing POST /dashboardapi/postevents ...');
  const eventRes = await request('/dashboardapi/postevents', 'POST', {
    title: 'JBAC State Youth Convention 2026',
    dateTime: '2026-12-15 10:00 AM',
    venueName: 'Gannavaram Convention Hall',
    venueQuery: 'Gannavaram, Krishna District, AP',
    timestamp: Date.now()
  });
  console.log('Response:', eventRes.status, eventRes.data?.message || eventRes.raw);

  // 5. events
  console.log('\n5. Testing GET /dashboardapi/events ...');
  const getEventsRes = await request('/dashboardapi/events', 'GET');
  console.log('Response:', getEventsRes.status, 'Items count:', getEventsRes.data?.data?.length);

  // 6. postbranches
  console.log('\n6. Testing POST /dashboardapi/postbranches ...');
  const branchRes = await request('/dashboardapi/postbranches', 'POST', {
    name: 'JBAC Vijayawada Central Branch',
    address: 'Near Old Bus Stand, Vijayawada, Andhra Pradesh',
    pastorName: 'Rev. Joseph M.',
    phone: '9848123456',
    latitude: 16.5062,
    longitude: 80.6480
  });
  console.log('Response:', branchRes.status, branchRes.data?.message || branchRes.raw);

  // 7. branches
  console.log('\n7. Testing GET /dashboardapi/branches ...');
  const getBranchesRes = await request('/dashboardapi/branches', 'GET');
  console.log('Response:', getBranchesRes.status, 'Items count:', getBranchesRes.data?.data?.length);

  // 8. postprayers
  console.log('\n8. Testing POST /dashboardapi/postprayers ...');
  const prayerRes = await request('/dashboardapi/postprayers', 'POST', {
    userId: 'test_firebase_uid_101',
    userName: 'Android Tester',
    request: 'Please pray for youth gospel mission and spiritual guidance.',
    timestamp: Date.now()
  });
  console.log('Response:', prayerRes.status, prayerRes.data?.message || prayerRes.raw);

  // 9. getprayers
  console.log('\n9. Testing GET /dashboardapi/getprayers ...');
  const getPrayersRes = await request('/dashboardapi/getprayers', 'GET');
  console.log('Response:', getPrayersRes.status, 'Items count:', getPrayersRes.data?.data?.length);

  // 10. postchats
  console.log('\n10. Testing POST /dashboardapi/postchats ...');
  const chatRes = await request('/dashboardapi/postchats', 'POST', {
    senderId: 'test_firebase_uid_101',
    receiverId: 'pastor_uid_202',
    message: 'Praise the Lord Pastor, thank you for your prayers!',
    timestamp: Date.now()
  });
  console.log('Response:', chatRes.status, chatRes.data?.message || chatRes.raw);

  // 11. chats
  console.log('\n11. Testing GET /dashboardapi/chats/test_firebase_uid_101/pastor_uid_202 ...');
  const getChatsRes = await request('/dashboardapi/chats/test_firebase_uid_101/pastor_uid_202', 'GET');
  console.log('Response:', getChatsRes.status, 'Messages count:', getChatsRes.data?.data?.length);

  console.log('\n=== ALL ENDPOINT CHECKS COMPLETED ===');
})();


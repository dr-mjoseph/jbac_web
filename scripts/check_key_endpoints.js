const endpoints = [
  'getaboutwebsite',
  'denomations',
  'leaderlevels',
  'educationalq',
  'getdistricts',
  'getservices',
  'getupdateevents',
  'getaddsdata',
  'getbelivers',
  'getchurch',
  'getpastor',
  'getrevival'
];

async function check() {
  const baseUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';
  for (const ep of endpoints) {
    try {
      const res = await fetch(baseUrl + ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      console.log(`[${res.status}] ${ep}:`, data.status, data.error ? 'ERR: ' + data.error : (data.data ? 'OK (' + (Array.isArray(data.data) ? data.data.length + ' items' : typeof data.data) + ')' : 'OK'));
    } catch (e) {
      console.log(`[FAIL] ${ep}:`, e.message);
    }
  }
}
check();

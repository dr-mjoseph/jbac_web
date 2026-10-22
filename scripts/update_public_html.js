const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../backend/public.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add #importStateAttributionSelect to import modal
if (!content.includes('id="importStateAttributionSelect"')) {
  const target = `<select id="importModeSelect" class="input-field" style="width:100%; font-size:0.9rem;">
            <option value="upsert" selected>⚡ Upsert: Update existing records by ID and insert new records (Recommended)</option>
            <option value="update">✏️ Update Only: Only update existing records that match by ID</option>
            <option value="insert">➕ Insert Only: Insert all rows as new records (generate new IDs)</option>
          </select>
        </div>`;
  const replacement = `<select id="importModeSelect" class="input-field" style="width:100%; font-size:0.9rem;">
            <option value="upsert" selected>⚡ Upsert: Update existing records by ID and insert new records (Recommended)</option>
            <option value="update">✏️ Update Only: Only update existing records that match by ID</option>
            <option value="insert">➕ Insert Only: Insert all rows as new records (generate new IDs)</option>
          </select>
        </div>

        <div class="form-group" style="margin-top:14px;">
          <label for="importStateAttributionSelect" style="font-weight:600; margin-bottom:6px; display:block;">3. State Attribution (for State-aware Tables):</label>
          <select id="importStateAttributionSelect" class="input-field" style="width:100%; font-size:0.9rem;">
            <option value="auto" selected>🌐 Auto: Retain existing state_id from imported data (fallback to AP if missing)</option>
            <option value="1">🏛️ Force AP: Tag all imported records as Andhra Pradesh (state_id = 1, state = 'Andhra Pradesh')</option>
            <option value="2">🏛️ Force TG: Tag all imported records as Telangana (state_id = 2, state = 'Telangana')</option>
          </select>
        </div>`;
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    content = content.replace('3. Data Preview & Validation', '4. Data Preview & Validation');
    console.log('1. Added importStateAttributionSelect to import modal');
  } else {
    console.error('Could not find importModeSelect in public.html');
  }
}

// 2. Update loadDashboardMetrics to accept stateId
const loadStatsOld = `    async function loadDashboardMetrics() {
      try {
        const res = await fetch(\`\${API_BASE}/dashboardapi/admin-dashboard-stats\`, {
          headers: getAuthHeaders()
        });`;

const loadStatsNew = `    async function loadDashboardMetrics(stateId = dashboardActiveState) {
      try {
        const url = \`\${API_BASE}/dashboardapi/admin-dashboard-stats\${stateId && stateId !== 'all' ? \`?state_id=\${stateId}\` : ''}\`;
        const res = await fetch(url, {
          headers: getAuthHeaders()
        });`;

if (content.includes(loadStatsOld)) {
  content = content.replace(loadStatsOld, loadStatsNew);
  console.log('2. Updated loadDashboardMetrics with stateId parameter');
}

// 3. Update exportCurrentTable with state filter and filename suffix
const exportOld = `        try {
          const res = await fetch(\`\${API_BASE}/dashboardapi/execute-query\`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ query: \`SELECT * FROM \\\`\${currentTable}\\\`;\` })
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              rows = json.data;
            }
          }
        } catch (e) {
          console.warn('Full table fetch fallback to loaded rows:', e);
        }`;

const exportNew = `        const stateSelect = document.getElementById('tableStateFilter');
        const stateVal = stateSelect ? stateSelect.value : 'all';
        try {
          let exportQuery = \`SELECT * FROM \\\`\${currentTable}\\\`\`;
          if (stateVal !== 'all') {
            exportQuery += \` WHERE \\\`state_id\\\` = \${stateVal}\`;
          }
          exportQuery += ';';
          const res = await fetch(\`\${API_BASE}/dashboardapi/execute-query\`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ query: exportQuery })
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              rows = json.data;
            } else if (json.error && json.error.includes("Unknown column 'state_id'")) {
              const fallbackRes = await fetch(\`\${API_BASE}/dashboardapi/execute-query\`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ query: \`SELECT * FROM \\\`\${currentTable}\\\`;\` })
              });
              if (fallbackRes.ok) {
                const fbJson = await fallbackRes.json();
                if (fbJson.success && Array.isArray(fbJson.data)) rows = fbJson.data;
              }
            }
          }
        } catch (e) {
          console.warn('Full table fetch fallback to loaded rows:', e);
        }`;

if (content.includes(exportOld)) {
  content = content.replace(exportOld, exportNew);
  content = content.replace(
    'downloadBlob(blob, `jbac_${currentTable}_export_${Date.now()}.json`);',
    'const sfx = (stateVal && stateVal !== "all") ? (stateVal === "1" ? "_ap" : "_tg") : ""; downloadBlob(blob, `jbac_${currentTable}${sfx}_export_${Date.now()}.json`);'
  );
  content = content.replace(
    'downloadBlob(blob, `jbac_${currentTable}_export_${Date.now()}.csv`);',
    'const sfx = (stateVal && stateVal !== "all") ? (stateVal === "1" ? "_ap" : "_tg") : ""; downloadBlob(blob, `jbac_${currentTable}${sfx}_export_${Date.now()}.csv`);'
  );
  console.log('3. Updated exportCurrentTable with state_id filter and file naming');
}

fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('All public.html updates applied cleanly!');

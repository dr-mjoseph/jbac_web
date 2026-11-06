const fs = require('fs');
const path = require('path');

function patchAdminHtml(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. TEACHING FIELD HERO BOX
  const teacherHeroBox = `
    <!-- TEACHING FIELD EMPLOYEES DIRECTORY HERO BOX -->
    <div id="teacherDirectoryHeroBox" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 47, 73, 0.95)); border: 1px solid rgba(14, 165, 233, 0.45); border-radius: 14px; padding: 18px 24px; margin-bottom: 22px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(14, 165, 233, 0.15); cursor: pointer; transition: all 0.25s ease;" onclick="openTeacherDirectoryModal()" onmouseover="this.style.borderColor='rgba(14, 165, 233, 0.9)'; this.style.boxShadow='0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)';" onmouseout="this.style.borderColor='rgba(14, 165, 233, 0.45)'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(14, 165, 233, 0.15)';">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, #0284c7, #0ea5e9); display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 4px 14px rgba(14,165,233,0.35); flex-shrink:0;">
            📚
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <h3 style="margin:0; font-size:1.22rem; font-weight:700; color:#fff; letter-spacing:-0.2px;">Teaching Field Employees Directory (బోధనా రంగ ఉద్యోగుల డాష్‌బోర్డ్)</h3>
              <span style="background:rgba(14,165,233,0.2); color:#7dd3fc; border:1px solid rgba(14,165,233,0.4); padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Education Network</span>
            </div>
            <p style="margin:5px 0 0; font-size:0.86rem; color:var(--text-muted);">
              Review Christian educators, lecturers, professors and administrative staff working across schools, colleges and universities in AP & TG.
            </p>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="background:rgba(14,165,233,0.1); border:1px solid rgba(14,165,233,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#7dd3fc; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Total Faculty</div>
            <div id="teachersSummaryCount" style="font-size:1.25rem; font-weight:700; color:#fff;">--</div>
          </div>
          <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#34d399; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Government</div>
            <div id="teachersGovtCount" style="font-size:1.15rem; font-weight:700; color:#34d399;">--</div>
          </div>
          <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Private</div>
            <div id="teachersPvtCount" style="font-size:1.15rem; font-weight:700; color:#fbbf24;">--</div>
          </div>

          <button class="btn btn-primary" style="padding:10px 18px; border-radius:10px; font-weight:700; display:flex; align-items:center; gap:8px; cursor:pointer; background:linear-gradient(135deg, #0284c7, #0284c7); border:none;" onclick="event.stopPropagation(); openTeacherDirectoryModal();">
            <span>View Faculty</span>
            <span style="font-size:1.1rem;">➔</span>
          </button>
        </div>
      </div>
    </div>
  `;

  if (!content.includes('id="teacherDirectoryHeroBox"')) {
    const targetAnchor = '<!-- STATE-WISE DISTRICT LEADERS (ALL) HERO MANAGEMENT BOX -->';
    if (content.includes(targetAnchor)) {
      content = content.replace(targetAnchor, `${teacherHeroBox}\n\n    ${targetAnchor}`);
      console.log(`Added teacherDirectoryHeroBox before ${targetAnchor} in ${filePath}`);
    } else {
      console.log(`Could not find targetAnchor in ${filePath}`);
    }
  }

  // 2. TEACHER DIRECTORY MODAL
  const teacherModalHtml = `
  <!-- Teaching Employees Directory Modal -->
  <div class="modal-backdrop" id="teacherDirectoryModal" style="display:none; align-items:center; justify-content:center; padding:20px; z-index:9999;">
    <div class="modal-card" style="max-width:1300px; width:100%; max-height:92vh; display:flex; flex-direction:column; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); overflow:hidden;">
      <!-- Modal Header -->
      <div style="padding:18px 24px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(14,165,233,0.1), rgba(2,132,199,0.05));">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, #0284c7, #0ea5e9); display:flex; align-items:center; justify-content:center; font-size:20px; color:#fff;">
            📚
          </div>
          <div>
            <h3 style="margin:0; font-size:1.25rem; font-weight:700; color:#fff;">Teaching Field Employees Console (బోధనా రంగ ఉద్యోగుల డాష్‌బోర్డ్)</h3>
            <p style="margin:2px 0 0; font-size:0.82rem; color:var(--text-muted);">
              Manage registered teachers, lecturers, professors and staff with institutional & residential mapping across AP & TG.
            </p>
          </div>
        </div>
        <button onclick="closeTeacherDirectoryModal()" style="background:none; border:none; color:var(--text-dim); font-size:24px; cursor:pointer; line-height:1; padding:4px 8px; border-radius:6px;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-dim)'">✕</button>
      </div>

      <!-- Controls Bar -->
      <div style="padding:14px 24px; background:rgba(255,255,255,0.015); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:0.9rem; font-weight:600; color:#7dd3fc;">Registered Faculty:</span>
          <span id="tdTotalBadge" style="background:rgba(14,165,233,0.2); color:#7dd3fc; padding:2px 10px; border-radius:12px; font-weight:700; font-size:0.82rem;">0</span>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <select id="tdFilterState" onchange="applyTeacherFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; cursor:pointer;">
            <option value="all">All States (అన్ని రాష్ట్రాలు)</option>
            <option value="1">Andhra Pradesh (AP)</option>
            <option value="2">Telangana (TG)</option>
          </select>

          <select id="tdFilterRole" onchange="applyTeacherFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; cursor:pointer;">
            <option value="all">All Roles (అన్ని పాత్రలు)</option>
            <option value="Teaching">Teaching</option>
            <option value="Administration">Administration</option>
            <option value="Administration and Teaching">Admin & Teaching</option>
          </select>

          <select id="tdFilterType" onchange="applyTeacherFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; cursor:pointer;">
            <option value="all">All Types (Govt & Pvt)</option>
            <option value="Government">Government (ప్రభుత్వ)</option>
            <option value="Private">Private (ప్రైవేట్)</option>
          </select>

          <input type="text" id="tdSearchInput" placeholder="🔍 Search by name, designation, institute, phone..." oninput="applyTeacherFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; width:250px;">

          <button onclick="fetchTeacherData(true)" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 14px; font-size:0.84rem; cursor:pointer; font-weight:600;" title="Reload Data">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Table Body -->
      <div style="flex:1; overflow-y:auto; padding:20px 24px;">
        <div id="tdSpinner" style="display:none; text-align:center; padding:50px 0;">
          <div style="display:inline-block; width:36px; height:36px; border:3px solid rgba(14,165,233,0.2); border-top-color:#0ea5e9; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
          <div style="margin-top:12px; color:var(--text-muted); font-size:0.88rem;">Loading Teaching Staff records...</div>
        </div>

        <div id="tdContainer">
          <table class="data-table" style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.85rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.03);">
                <th style="padding:10px 12px; text-align:center; width:45px;">#</th>
                <th style="padding:10px 14px; text-align:left;">Teacher Name & Contact</th>
                <th style="padding:10px 14px; text-align:left;">Designation & Role</th>
                <th style="padding:10px 14px; text-align:left;">Working In & Institute</th>
                <th style="padding:10px 14px; text-align:left;">Experience & Subject</th>
                <th style="padding:10px 14px; text-align:left;">Institute Address</th>
                <th style="padding:10px 14px; text-align:left;">Residential Address</th>
                <th style="padding:10px 12px; text-align:center;">Type</th>
                <th style="padding:10px 12px; text-align:center;">Status</th>
                <th style="padding:10px 12px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody id="tdTeachersTbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
          <div id="tdNoRecords" style="display:none; text-align:center; padding:40px; color:var(--text-dim);">
            No teaching staff records found matching your criteria.
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  if (!content.includes('id="teacherDirectoryModal"')) {
    const modalAnchor = '<!-- Entrepreneur & Investor Elaborative Management Modal -->';
    if (content.includes(modalAnchor)) {
      content = content.replace(modalAnchor, `${teacherModalHtml}\n\n  ${modalAnchor}`);
      console.log(`Added teacherDirectoryModal before ${modalAnchor} in ${filePath}`);
    }
  }

  // 3. JAVASCRIPT FUNCTIONS
  const teacherJsCode = `
  // ==========================================
  // TEACHING STAFF DIRECTORY MANAGEMENT
  // ==========================================
  let allTeachersData = [];

  async function fetchTeacherData(isRefresh = false, stateFilter = dashboardActiveState) {
    const spinner = document.getElementById('tdSpinner');
    const container = document.getElementById('tdContainer');

    if (isRefresh && spinner) spinner.style.display = 'block';
    if (isRefresh && container) container.style.opacity = '0.4';

    try {
      const authHdrs = getAuthHeaders();
      let res;
      try {
        const r1 = await fetch(\`\${API_BASE}/dashboardapi/admin-teachers\`, { headers: authHdrs });
        if (r1.ok) res = await r1.json();
      } catch (_) {}

      if (!res) {
        try {
          const r2 = await fetch(\`\${API_BASE}/api/admin-teachers\`, { headers: authHdrs });
          if (r2.ok) res = await r2.json();
        } catch (_) {}
      }

      allTeachersData = (res && res.data && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);

      updateTeacherHeroStats(stateFilter);
      applyTeacherFilters();
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      if (spinner) spinner.style.display = 'none';
      if (container) container.style.opacity = '1';
    }
  }

  function updateTeacherHeroStats(stateFilter = dashboardActiveState) {
    const sId = String(stateFilter || 'all');
    const list = sId === 'all'
      ? allTeachersData
      : allTeachersData.filter(t => String(t.inst_state_id) === sId || String(t.res_state_id) === sId);

    const govtCount = list.filter(t => (t.teacher_type || '').toLowerCase() === 'government').length;
    const pvtCount = list.filter(t => (t.teacher_type || '').toLowerCase() === 'private').length;

    const elTotal = document.getElementById('teachersSummaryCount');
    if (elTotal) elTotal.textContent = list.length.toLocaleString();

    const elGovt = document.getElementById('teachersGovtCount');
    if (elGovt) elGovt.textContent = govtCount.toLocaleString();

    const elPvt = document.getElementById('teachersPvtCount');
    if (elPvt) elPvt.textContent = pvtCount.toLocaleString();

    const elBadge = document.getElementById('tdTotalBadge');
    if (elBadge) elBadge.textContent = list.length;
  }

  function applyTeacherFilters() {
    const stateFilter = document.getElementById('tdFilterState')?.value || 'all';
    const roleFilter = document.getElementById('tdFilterRole')?.value || 'all';
    const typeFilter = document.getElementById('tdFilterType')?.value || 'all';
    const search = (document.getElementById('tdSearchInput')?.value || '').toLowerCase().trim();

    let filtered = allTeachersData.filter(t => {
      if (stateFilter !== 'all') {
        const sid = String(stateFilter);
        if (String(t.inst_state_id) !== sid && String(t.res_state_id) !== sid) return false;
      }
      if (roleFilter !== 'all' && (t.role_category || '').toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      if (typeFilter !== 'all' && (t.teacher_type || '').toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }
      if (search) {
        const text = [
          t.name_with_surname, t.mobile, t.exact_designation, t.working_in,
          t.institute_name, t.inst_district_name, t.res_district_name,
          t.experience_in, t.faith_category
        ].filter(Boolean).join(' ').toLowerCase();
        if (!text.includes(search)) return false;
      }
      return true;
    });

    renderTeacherTable(filtered);
  }

  function renderTeacherTable(items) {
    const tbody = document.getElementById('tdTeachersTbody');
    const noRec = document.getElementById('tdNoRecords');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!items || items.length === 0) {
      if (noRec) noRec.style.display = 'block';
      return;
    }
    if (noRec) noRec.style.display = 'none';

    items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';

      const typeBadge = item.teacher_type === 'Government'
        ? '<span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">Government</span>'
        : '<span style="background:rgba(245,158,11,0.2); color:#fbbf24; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">Private</span>';

      const statusBadge = item.status === 'Approved'
        ? '<span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">Approved</span>'
        : (item.status === 'Rejected'
          ? '<span style="background:rgba(239,68,68,0.2); color:#f87171; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">Rejected</span>'
          : '<span style="background:rgba(234,179,8,0.2); color:#facc15; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">Pending</span>');

      tr.innerHTML = \`
        <td style="padding:10px 12px; text-align:center; color:var(--text-dim);">\${index + 1}</td>
        <td style="padding:10px 14px;">
          <div style="font-weight:700; color:#fff;">\${item.name_with_surname || 'N/A'}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">📱 \${item.mobile || 'N/A'} \${item.email ? ' | ✉️ ' + item.email : ''}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">⛪ Pastor: \${item.pastor_phone || 'N/A'} | \${item.faith_category || 'N/A'}</div>
        </td>
        <td style="padding:10px 14px;">
          <div style="font-weight:600; color:#38bdf8;">\${item.exact_designation || 'N/A'}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">Role: \${item.role_category || 'N/A'}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">Qual: \${item.qualification_category || 'N/A'}</div>
        </td>
        <td style="padding:10px 14px;">
          <div style="font-weight:600; color:#fff;">\${item.institute_name || 'N/A'}</div>
          <div style="font-size:0.78rem; color:#a5b4fc;">🏛️ \${item.working_in || 'N/A'}</div>
        </td>
        <td style="padding:10px 14px;">
          <div style="font-weight:600; color:#fbbf24;">\${item.total_experience_years || 'N/A'}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">Subject: \${item.experience_in || 'N/A'}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">Family: \${item.family_background || 'N/A'}</div>
        </td>
        <td style="padding:10px 14px; max-width:180px; font-size:0.78rem; color:var(--text-muted);">
          \${item.inst_address_text || item.inst_address || [item.inst_district_name, item.inst_state_name].filter(Boolean).join(', ') || 'N/A'}
        </td>
        <td style="padding:10px 14px; max-width:180px; font-size:0.78rem; color:var(--text-muted);">
          \${item.res_address_text || item.res_address || [item.res_district_name, item.res_state_name].filter(Boolean).join(', ') || 'N/A'}
        </td>
        <td style="padding:10px 12px; text-align:center;">\${typeBadge}</td>
        <td style="padding:10px 12px; text-align:center;">\${statusBadge}</td>
        <td style="padding:10px 12px; text-align:center;">
          <div style="display:flex; gap:6px; justify-content:center;">
            <button onclick="handleAdminUpdateTeacher(\${item.id}, 'Approved')" title="Approve" style="background:#10b981; border:none; color:#fff; border-radius:6px; padding:4px 8px; cursor:pointer; font-size:0.75rem;">✓</button>
            <button onclick="handleAdminUpdateTeacher(\${item.id}, 'Rejected')" title="Reject" style="background:#ef4444; border:none; color:#fff; border-radius:6px; padding:4px 8px; cursor:pointer; font-size:0.75rem;">✕</button>
          </div>
        </td>
      \`;
      tbody.appendChild(tr);
    });
  }

  function openTeacherDirectoryModal() {
    const m = document.getElementById('teacherDirectoryModal');
    if (m) {
      m.style.display = 'flex';
      const stateSelect = document.getElementById('tdFilterState');
      if (stateSelect && dashboardActiveState) {
        stateSelect.value = dashboardActiveState;
      }
      fetchTeacherData(true);
    }
  }

  function closeTeacherDirectoryModal() {
    const m = document.getElementById('teacherDirectoryModal');
    if (m) m.style.display = 'none';
  }

  async function handleAdminUpdateTeacher(id, action) {
    try {
      const res = await fetch(\`\${API_BASE}/dashboardapi/admin-update-teacher\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        const item = allTeachersData.find(t => t.id === id);
        if (item) item.status = action;
        applyTeacherFilters();
      } else {
        alert('Action could not be saved: HTTP ' + res.status);
      }
    } catch (e) {
      alert('Error updating teacher record: ' + e.message);
    }
  }
  `;

  if (!content.includes('function fetchTeacherData(')) {
    const jsAnchor = '// ENTREPRENEUR & INVESTOR MANAGEMENT CONSOLE';
    if (content.includes(jsAnchor)) {
      content = content.replace(jsAnchor, `${teacherJsCode}\n\n  ${jsAnchor}`);
      console.log(`Added teacher JS code before ${jsAnchor} in ${filePath}`);
    }
  }

  // 4. HOOKS INTO INIT, REFRESH, FILTER
  if (!content.includes('fetchTeacherData(true);')) {
    content = content.replace('fetchBusinessMatchData(true);', 'fetchBusinessMatchData(true);\n      fetchTeacherData(true);');
    console.log(`Hooked fetchTeacherData(true) in ${filePath}`);
  }

  if (!content.includes('fetchTeacherData(false, stateId);')) {
    content = content.replace('fetchBusinessMatchData(false, stateId);', 'fetchBusinessMatchData(false, stateId);\n          fetchTeacherData(false, stateId);');
    console.log(`Hooked fetchTeacherData(false, stateId) in ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully patched ${filePath}`);
}

patchAdminHtml('public.html');
patchAdminHtml('backend/public.html');
patchAdminHtml('backend/admin_db.html');


import sys

def patch_public_html():
    with open('backend/public.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add District Leaders Hero Box
    anchor_box = '<div class="metrics-grid" id="metricsGrid">'
    hero_box = """    <!-- STATE-WISE DISTRICT LEADERS (ALL) HERO MANAGEMENT BOX -->
    <div id="districtLeadersHeroBox" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 18px 24px; margin-bottom: 22px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.1); cursor: pointer; transition: all 0.25s ease;" onclick="openDistrictLeadersModal()" onmouseover="this.style.borderColor='rgba(245, 158, 11, 0.8)'; this.style.boxShadow='0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.2)';" onmouseout="this.style.borderColor='rgba(245, 158, 11, 0.4)'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.1)';">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, #f59e0b, #ef4444); display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 4px 14px rgba(245,158,11,0.35); flex-shrink:0;">
            👑
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <h3 style="margin:0; font-size:1.22rem; font-weight:700; color:#fff; letter-spacing:-0.2px;">State-Wise District Leaders (All)</h3>
              <span style="background:rgba(245,158,11,0.18); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Executive Approval</span>
            </div>
            <p style="margin:5px 0 0; font-size:0.86rem; color:var(--text-muted);">
              Manage and grant leadership authorizations (<code style="color:#fbbf24;">d_in = 1</code>) for District Leaders across Pastors, Believers & Students for AP & TG. Click to expand full roster.
            </p>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-subtle); padding:8px 16px; border-radius:10px; text-align:center; min-width:85px;">
            <div style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Total</div>
            <div id="dlSummaryTotal" style="font-size:1.25rem; font-weight:700; color:var(--text-main);">--</div>
          </div>
          <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); padding:8px 16px; border-radius:10px; text-align:center; min-width:85px;">
            <div style="font-size:0.7rem; color:#10b981; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Approved</div>
            <div id="dlSummaryApproved" style="font-size:1.25rem; font-weight:700; color:#10b981;">--</div>
          </div>
          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); padding:8px 16px; border-radius:10px; text-align:center; min-width:85px;">
            <div style="font-size:0.7rem; color:#f59e0b; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Pending</div>
            <div id="dlSummaryPending" style="font-size:1.25rem; font-weight:700; color:#f59e0b;">--</div>
          </div>
          <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); padding:8px 16px; border-radius:10px; text-align:center; min-width:85px;">
            <div style="font-size:0.7rem; color:#ef4444; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Rejected</div>
            <div id="dlSummaryRejected" style="font-size:1.25rem; font-weight:700; color:#ef4444;">--</div>
          </div>
          <button class="btn btn-primary" style="padding:10px 18px; border-radius:10px; font-weight:700; display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="event.stopPropagation(); openDistrictLeadersModal();">
            <span>Review & Approve</span>
            <span style="font-size:1.1rem;">➔</span>
          </button>
        </div>
      </div>
    </div>

    """
    assert anchor_box in html, "anchor_box not found in public.html"
    html = html.replace(anchor_box, hero_box + anchor_box, 1)
    print("1. Added hero box to public.html")

    # 2. Add District Leaders Modal
    modal_anchor = '<div class="modal-backdrop" id="viewModal">'
    district_modal = """  <!-- District Leaders Elaborative Management Modal -->
  <div class="modal-backdrop" id="districtLeadersModal" style="display:none; align-items:center; justify-content:center; padding:20px; z-index:9999;">
    <div class="modal-card" style="max-width:1250px; width:100%; max-height:92vh; display:flex; flex-direction:column; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); overflow:hidden;">
      
      <!-- Modal Header -->
      <div class="modal-header" style="padding:18px 24px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:var(--bg-card);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #f59e0b, #ef4444); display:flex; align-items:center; justify-content:center; font-size:20px; color:#fff;">
            👑
          </div>
          <div>
            <h3 style="margin:0; font-size:1.25rem; font-weight:700; color:var(--text-main);">State-Wise District Leaders (All Roles)</h3>
            <p style="margin:2px 0 0; font-size:0.8rem; color:var(--text-muted);">
              Comprehensive leadership authorization roster for Pastors, Believers & Students across Andhra Pradesh and Telangana
            </p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="closeDistrictLeadersModal()" style="background:none; border:none; font-size:24px; color:var(--text-muted); cursor:pointer;">&times;</button>
      </div>

      <!-- Modal Filter Toolbar -->
      <div style="padding:14px 24px; background:var(--bg-dark); border-bottom:1px solid var(--border-subtle); display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1; min-width:300px;">
          <div style="position:relative; flex:1; min-width:220px;">
            <input type="text" id="dlFilterSearch" placeholder="🔍 Search name, phone, district, constituency..." oninput="renderDistrictLeadersTable()" style="width:100%; padding:8px 14px; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:8px; color:var(--text-main); font-size:0.88rem; outline:none;" />
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <!-- State Filter -->
          <div style="display:flex; gap:4px; background:var(--bg-card); padding:3px; border-radius:8px; border:1px solid var(--border-subtle);">
            <button class="btn btn-sm dl-state-btn active" data-state="all" onclick="setDlStateFilter('all', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">All States</button>
            <button class="btn btn-sm dl-state-btn" data-state="1" onclick="setDlStateFilter('1', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">AP</button>
            <button class="btn btn-sm dl-state-btn" data-state="2" onclick="setDlStateFilter('2', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">TG</button>
          </div>

          <!-- Category Filter -->
          <div style="display:flex; gap:4px; background:var(--bg-card); padding:3px; border-radius:8px; border:1px solid var(--border-subtle);">
            <button class="btn btn-sm dl-cat-btn active" data-cat="all" onclick="setDlCatFilter('all', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">All Roles</button>
            <button class="btn btn-sm dl-cat-btn" data-cat="pastor" onclick="setDlCatFilter('pastor', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">Pastors</button>
            <button class="btn btn-sm dl-cat-btn" data-cat="believer" onclick="setDlCatFilter('believer', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">Believers</button>
            <button class="btn btn-sm dl-cat-btn" data-cat="student" onclick="setDlCatFilter('student', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">Students</button>
          </div>

          <!-- Status Filter -->
          <div style="display:flex; gap:4px; background:var(--bg-card); padding:3px; border-radius:8px; border:1px solid var(--border-subtle);">
            <button class="btn btn-sm dl-status-btn active" data-status="all" onclick="setDlStatusFilter('all', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px;">All Status</button>
            <button class="btn btn-sm dl-status-btn" data-status="approved" onclick="setDlStatusFilter('approved', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px; color:#10b981;">Approved</button>
            <button class="btn btn-sm dl-status-btn" data-status="pending" onclick="setDlStatusFilter('pending', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px; color:#f59e0b;">Pending</button>
            <button class="btn btn-sm dl-status-btn" data-status="rejected" onclick="setDlStatusFilter('rejected', this)" style="padding:4px 10px; font-size:0.78rem; border-radius:6px; color:#ef4444;">Rejected</button>
          </div>

          <button class="btn btn-sm" onclick="fetchDistrictLeadersData(true)" title="Refresh Data" style="padding:6px 12px; font-size:0.82rem; background:var(--bg-card); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; cursor:pointer;">🔄 Refresh</button>
        </div>
      </div>

      <!-- Modal Body (Table of Leaders) -->
      <div class="modal-body" style="padding:0; flex:1; overflow-y:auto; background:var(--bg-dark);">
        <div id="dlLoadingSpinner" style="display:none; text-align:center; padding:50px;">
          <div style="font-size:1.8rem; margin-bottom:10px;">⏳</div>
          <div style="color:var(--text-muted); font-size:0.95rem;">Loading District Leaders...</div>
        </div>

        <table id="dlTable" style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:left;">
          <thead style="background:var(--bg-surface); position:sticky; top:0; z-index:10; border-bottom:1px solid var(--border-subtle);">
            <tr>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600; width:50px; text-align:center;">#</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600;">Leader Name & ID</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600;">Role / Category</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600;">State</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600;">District & Constituency</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600;">Phone</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600; text-align:center;">Status</th>
              <th style="padding:12px 14px; color:var(--text-muted); font-weight:600; text-align:center; min-width:200px;">Actions (Admin Control)</th>
            </tr>
          </thead>
          <tbody id="dlTableBody">
            <!-- Dynamic Leader Rows Rendered Here -->
          </tbody>
        </table>

        <div id="dlEmptyState" style="display:none; text-align:center; padding:60px 20px;">
          <div style="font-size:2.4rem; margin-bottom:10px;">🔍</div>
          <div style="font-size:1.05rem; font-weight:600; color:var(--text-main);">No District Leaders Found</div>
          <div style="color:var(--text-dim); font-size:0.85rem; margin-top:4px;">Try clearing or adjusting your search filters</div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer" style="padding:12px 24px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:var(--bg-card);">
        <div id="dlTableCount" style="font-size:0.84rem; color:var(--text-muted);">Showing 0 district leaders</div>
        <button class="btn btn-sm" onclick="closeDistrictLeadersModal()" style="padding:7px 18px; border-radius:8px; background:var(--bg-surface); border:1px solid var(--border-subtle); color:var(--text-main); font-weight:600; cursor:pointer;">Close</button>
      </div>

    </div>
  </div>

  """
    assert modal_anchor in html, "modal_anchor not found in public.html"
    html = html.replace(modal_anchor, district_modal + modal_anchor, 1)
    print("2. Added modal to public.html")

    # 3. Add District Leaders JS functions
    js_anchor = "async function loadDashboardMetrics(stateId = dashboardActiveState) {"
    dl_js = """  // --- STATE-WISE DISTRICT LEADERS MANAGEMENT ---
  let dlAllLeaders = [];
  let dlCurrentState = 'all';
  let dlCurrentCat = 'all';
  let dlCurrentStatus = 'all';

  async function fetchDistrictLeadersData(showSpinner = false) {
    const spinner = document.getElementById('dlLoadingSpinner');
    const table = document.getElementById('dlTable');
    const emptyState = document.getElementById('dlEmptyState');

    if (showSpinner && spinner) {
      spinner.style.display = 'block';
      if (table) table.style.display = 'none';
      if (emptyState) emptyState.style.display = 'none';
    }

    try {
      const res = await fetch(`${API_BASE}/dashboardapi/admin-district-leaders`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        dlAllLeaders = json.data || [];
        const summary = json.summary || {};

        // Update Top Box Summary Counters
        const elTot = document.getElementById('dlSummaryTotal');
        if (elTot) elTot.textContent = Number(summary.total || dlAllLeaders.length).toLocaleString();
        const elApp = document.getElementById('dlSummaryApproved');
        if (elApp) elApp.textContent = Number(summary.approved || 0).toLocaleString();
        const elPen = document.getElementById('dlSummaryPending');
        if (elPen) elPen.textContent = Number(summary.pending || 0).toLocaleString();
        const elRej = document.getElementById('dlSummaryRejected');
        if (elRej) elRej.textContent = Number(summary.rejected || 0).toLocaleString();

        renderDistrictLeadersTable();
      }
    } catch (e) {
      console.error('Error fetching district leaders:', e);
    } finally {
      if (spinner) spinner.style.display = 'none';
      if (table) table.style.display = 'table';
    }
  }

  function openDistrictLeadersModal() {
    const m = document.getElementById('districtLeadersModal');
    if (m) {
      m.style.display = 'flex';
      fetchDistrictLeadersData(true);
    }
  }

  function closeDistrictLeadersModal() {
    const m = document.getElementById('districtLeadersModal');
    if (m) m.style.display = 'none';
  }

  function setDlStateFilter(val, btn) {
    dlCurrentState = val;
    document.querySelectorAll('.dl-state-btn').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = 'var(--text-main)';
    });
    btn.classList.add('active');
    btn.style.background = 'var(--primary)';
    btn.style.color = '#fff';
    renderDistrictLeadersTable();
  }

  function setDlCatFilter(val, btn) {
    dlCurrentCat = val;
    document.querySelectorAll('.dl-cat-btn').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = 'var(--text-main)';
    });
    btn.classList.add('active');
    btn.style.background = 'var(--primary)';
    btn.style.color = '#fff';
    renderDistrictLeadersTable();
  }

  function setDlStatusFilter(val, btn) {
    dlCurrentStatus = val;
    document.querySelectorAll('.dl-status-btn').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.color = 'var(--text-main)';
    });
    btn.classList.add('active');
    btn.style.background = 'var(--primary)';
    btn.style.color = '#fff';
    renderDistrictLeadersTable();
  }

  function renderDistrictLeadersTable() {
    const searchVal = (document.getElementById('dlFilterSearch')?.value || '').toLowerCase().trim();
    const tbody = document.getElementById('dlTableBody');
    const emptyState = document.getElementById('dlEmptyState');
    const table = document.getElementById('dlTable');
    const countEl = document.getElementById('dlTableCount');

    if (!tbody) return;

    let filtered = dlAllLeaders.filter(item => {
      if (dlCurrentState === '1' && item.state_id !== 1) return false;
      if (dlCurrentState === '2' && item.state_id !== 2) return false;

      if (dlCurrentCat !== 'all' && item.category !== dlCurrentCat) return false;

      if (dlCurrentStatus === 'approved' && !item.is_approved) return false;
      if (dlCurrentStatus === 'pending' && !item.is_pending) return false;
      if (dlCurrentStatus === 'rejected' && !item.is_rejected) return false;

      if (searchVal) {
        const text = `${item.name || ''} ${item.mobile || ''} ${item.district_name || ''} ${item.constituency_name || ''} ${item.wing_name || ''} ${item.generaltype || ''}`.toLowerCase();
        if (!text.includes(searchVal)) return false;
      }
      return true;
    });

    if (countEl) countEl.textContent = `Showing ${filtered.length} of ${dlAllLeaders.length} district leaders`;

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (table) table.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (table) table.style.display = 'table';
    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map((item, idx) => {
      const catBadgeColor = item.category === 'pastor' ? 'rgba(168, 85, 247, 0.2)' : (item.category === 'student' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)');
      const catTextColor = item.category === 'pastor' ? '#c084fc' : (item.category === 'student' ? '#fbbf24' : '#60a5fa');
      const catIcon = item.category === 'pastor' ? '✝️ Pastor' : (item.category === 'student' ? '🎓 Student' : '👥 Believer');
      
      let statusBadge = '';
      if (item.is_approved) {
        statusBadge = `<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); padding:4px 10px; border-radius:20px; font-weight:700; font-size:0.78rem;">✓ Approved (d_in=1)</span>`;
      } else if (item.is_rejected) {
        statusBadge = `<span style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3); padding:4px 10px; border-radius:20px; font-weight:700; font-size:0.78rem;">✕ Rejected</span>`;
      } else {
        statusBadge = `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:4px 10px; border-radius:20px; font-weight:700; font-size:0.78rem;">⏳ Pending Review</span>`;
      }

      return `
        <tr style="border-bottom:1px solid var(--border-subtle); transition: background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)';" onmouseout="this.style.background='transparent';">
          <td style="padding:12px 14px; text-align:center; color:var(--text-dim); font-weight:600;">${idx + 1}</td>
          <td style="padding:12px 14px;">
            <div style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${item.name || '--'}</div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">ID: <code style="color:var(--text-muted);">${item.id}</code> &bull; Table: ${item.table_name}</div>
          </td>
          <td style="padding:12px 14px;">
            <span style="background:${catBadgeColor}; color:${catTextColor}; padding:3px 9px; border-radius:12px; font-weight:600; font-size:0.76rem; display:inline-block;">${catIcon}</span>
            <div style="font-size:0.76rem; color:var(--text-muted); margin-top:4px;">${item.wing_name ? `వింగ్: ${item.wing_name}` : (item.generaltype || 'District Leader')}</div>
          </td>
          <td style="padding:12px 14px;">
            <span style="padding:2px 8px; border-radius:6px; font-size:0.76rem; font-weight:600; background:rgba(255,255,255,0.05); color:var(--text-muted);">${item.state_name}</span>
          </td>
          <td style="padding:12px 14px;">
            <div style="font-weight:600; color:var(--text-main); font-size:0.86rem;">${item.district_name || 'District ID: ' + item.district_id}</div>
            <div style="font-size:0.76rem; color:var(--text-dim); margin-top:2px;">Const: ${item.constituency_name || item.constituency_id || '--'}</div>
          </td>
          <td style="padding:12px 14px;">
            ${item.mobile ? `<a href="tel:${item.mobile}" style="color:#60a5fa; text-decoration:none; font-weight:600;">📞 ${item.mobile}</a>` : '<span style="color:var(--text-dim);">--</span>'}
          </td>
          <td style="padding:12px 14px; text-align:center;">
            ${statusBadge}
          </td>
          <td style="padding:12px 14px; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
              <button class="btn btn-sm" onclick="handleAdminUpdateDistrictLeader('${item.table_name}', ${item.id}, 'approve')" style="background:#10b981; color:#fff; border:none; padding:5px 11px; border-radius:6px; font-weight:700; cursor:pointer;" title="Approve Leader (d_in=1, approval_ind=1)">
                ✓ Approve
              </button>
              <button class="btn btn-sm" onclick="handleAdminUpdateDistrictLeader('${item.table_name}', ${item.id}, 'reject')" style="background:#ef4444; color:#fff; border:none; padding:5px 11px; border-radius:6px; font-weight:700; cursor:pointer;" title="Reject Leader (d_in=0, approval_ind=2)">
                ✕ Reject
              </button>
              <button class="btn btn-sm" onclick="handleAdminUpdateDistrictLeader('${item.table_name}', ${item.id}, 'reset')" style="background:var(--bg-card); color:var(--text-muted); border:1px solid var(--border-subtle); padding:5px 9px; border-radius:6px; font-weight:600; cursor:pointer;" title="Reset Status to Pending">
                ↺ Reset
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function handleAdminUpdateDistrictLeader(tableName, id, action) {
    try {
      const res = await fetch(`${API_BASE}/dashboardapi/admin-update-district-leader`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ table: tableName, id, action })
      });

      if (res.ok) {
        // Update local item
        const idx = dlAllLeaders.findIndex(x => x.table_name === tableName && Number(x.id) === Number(id));
        if (idx !== -1) {
          if (action === 'approve') {
            dlAllLeaders[idx].approval_ind = 1;
            dlAllLeaders[idx].d_in = 1;
            dlAllLeaders[idx].is_approved = true;
            dlAllLeaders[idx].is_pending = false;
            dlAllLeaders[idx].is_rejected = false;
          } else if (action === 'reject') {
            dlAllLeaders[idx].approval_ind = 2;
            dlAllLeaders[idx].d_in = 0;
            dlAllLeaders[idx].is_approved = false;
            dlAllLeaders[idx].is_pending = false;
            dlAllLeaders[idx].is_rejected = true;
          } else if (action === 'reset') {
            dlAllLeaders[idx].approval_ind = 0;
            dlAllLeaders[idx].d_in = 0;
            dlAllLeaders[idx].is_approved = false;
            dlAllLeaders[idx].is_pending = true;
            dlAllLeaders[idx].is_rejected = false;
          }
        }

        // Update counters
        const appCount = dlAllLeaders.filter(x => x.is_approved).length;
        const penCount = dlAllLeaders.filter(x => x.is_pending).length;
        const rejCount = dlAllLeaders.filter(x => x.is_rejected).length;

        const elApp = document.getElementById('dlSummaryApproved');
        if (elApp) elApp.textContent = appCount.toLocaleString();
        const elPen = document.getElementById('dlSummaryPending');
        if (elPen) elPen.textContent = penCount.toLocaleString();
        const elRej = document.getElementById('dlSummaryRejected');
        if (elRej) elRej.textContent = rejCount.toLocaleString();

        renderDistrictLeadersTable();
        showNotification(`District Leader #${id} ${action.toUpperCase()}D successfully!`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert('Failed to update leader: ' + (err.error || res.statusText));
      }
    } catch (e) {
      alert('Error updating leader: ' + e.message);
    }
  }

  """

    assert js_anchor in html, "js_anchor not found in public.html"
    html = html.replace(js_anchor, dl_js + js_anchor, 1)
    print("3. Added JS logic to public.html")

    # 4. Trigger fetchDistrictLeadersData inside loadDashboardMetrics
    trigger_anchor = "setStat('stat-users', s.users, s.users_today);"
    trigger_code = "setStat('stat-users', s.users, s.users_today);\n          fetchDistrictLeadersData();"
    assert trigger_anchor in html, "trigger_anchor not found in public.html"
    html = html.replace(trigger_anchor, trigger_code, 1)
    print("4. Hooked fetchDistrictLeadersData into loadDashboardMetrics")

    with open('backend/public.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully updated backend/public.html")

patch_public_html()

import sys
import os

def patch_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'id="businessMatchHeroBox"' in html:
        print(f"Already patched {file_path}")
        return

    # 1. Add Hero Box right below districtLeadersHeroBox
    anchor_box = '    <!-- STATE-WISE DISTRICT LEADERS (ALL) HERO MANAGEMENT BOX -->'
    if anchor_box not in html:
        print(f"Anchor box not found in {file_path}")
        return

    hero_box = """    <!-- ENTREPRENEUR & INVESTOR CONNECT HERO BOX -->
    <div id="businessMatchHeroBox" style="background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 27, 75, 0.95)); border: 1px solid rgba(99, 102, 241, 0.45); border-radius: 14px; padding: 18px 24px; margin-bottom: 22px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.15); cursor: pointer; transition: all 0.25s ease;" onclick="openBusinessMatchModal()" onmouseover="this.style.borderColor='rgba(99, 102, 241, 0.9)'; this.style.boxShadow='0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)';" onmouseout="this.style.borderColor='rgba(99, 102, 241, 0.45)'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.15)';">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, #6366f1, #a855f7); display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 4px 14px rgba(99,102,241,0.35); flex-shrink:0;">
            💼
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <h3 style="margin:0; font-size:1.22rem; font-weight:700; color:#fff; letter-spacing:-0.2px;">Entrepreneur & Investor Connect (ఎంటర్‌ప్రెన్యూర్ & ఇన్వెస్టర్ డాష్‌బోర్డ్)</h3>
              <span style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4); padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Business Networking</span>
            </div>
            <p style="margin:5px 0 0; font-size:0.86rem; color:var(--text-muted);">
              Review entrepreneurs looking to launch startups, their business setup locations & needed capital, alongside investors ready to fund ideas across AP & TG.
            </p>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#a5b4fc; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Entrepreneurs</div>
            <div id="entSummaryCount" style="font-size:1.25rem; font-weight:700; color:#fff;">--</div>
          </div>
          <div style="background:rgba(236,72,153,0.1); border:1px solid rgba(236,72,153,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#f472b6; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Funds Needed</div>
            <div id="entSummaryCapital" style="font-size:1.15rem; font-weight:700; color:#f472b6;">--</div>
          </div>
          <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#34d399; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Investors</div>
            <div id="invSummaryCount" style="font-size:1.25rem; font-weight:700; color:#fff;">--</div>
          </div>
          <div style="background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.35); padding:8px 16px; border-radius:10px; text-align:center; min-width:110px;">
            <div style="font-size:0.7rem; color:#34d399; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">To Invest</div>
            <div id="invSummaryCapital" style="font-size:1.15rem; font-weight:700; color:#34d399;">--</div>
          </div>

          <button class="btn btn-primary" style="padding:10px 18px; border-radius:10px; font-weight:700; display:flex; align-items:center; gap:8px; cursor:pointer; background:linear-gradient(135deg, #6366f1, #8b5cf6); border:none;" onclick="event.stopPropagation(); openBusinessMatchModal();">
            <span>View Portfolios</span>
            <span style="font-size:1.1rem;">➔</span>
          </button>
        </div>
      </div>
    </div>\n\n"""

    html = html.replace(anchor_box, hero_box + anchor_box)

    # 2. Add Elaborative Modal right before </body>
    anchor_modal = '  <!-- District Leaders Elaborative Management Modal -->'
    if anchor_modal not in html:
        print(f"Anchor modal not found in {file_path}")
        return

    business_modal = """  <!-- Entrepreneur & Investor Elaborative Management Modal -->
  <div class="modal-backdrop" id="businessMatchModal" style="display:none; align-items:center; justify-content:center; padding:20px; z-index:9999;">
    <div class="modal-card" style="max-width:1300px; width:100%; max-height:92vh; display:flex; flex-direction:column; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7); overflow:hidden;">
      
      <!-- Modal Header -->
      <div style="padding:18px 24px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05));">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, #6366f1, #a855f7); display:flex; align-items:center; justify-content:center; font-size:20px; color:#fff;">
            💼
          </div>
          <div>
            <h3 style="margin:0; font-size:1.25rem; font-weight:700; color:#fff;">Entrepreneurs & Investors Console (ఎంటర్‌ప్రెన్యూర్ & ఇన్వెస్టర్ డాష్‌బోర్డ్)</h3>
            <p style="margin:2px 0 0; font-size:0.82rem; color:var(--text-muted);">
              Track business aspirations, self capital & investor pledges with localized address matching across AP & TG.
            </p>
          </div>
        </div>
        <button onclick="closeBusinessMatchModal()" style="background:none; border:none; color:var(--text-dim); font-size:24px; cursor:pointer; line-height:1; padding:4px 8px; border-radius:6px;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-dim)'">✕</button>
      </div>

      <!-- Tab Switcher & Filter Controls -->
      <div style="padding:14px 24px; background:rgba(255,255,255,0.015); border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        
        <!-- Tab Navigation -->
        <div style="display:flex; gap:8px;">
          <button id="bmTabEntrepreneurs" onclick="switchBmTab('entrepreneurs')" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.88rem; cursor:pointer; border:1px solid #6366f1; background:#6366f1; color:#fff; display:flex; align-items:center; gap:8px;">
            <span>🚀 Entrepreneurs (వ్యాపార ఔత్సాహికులు)</span>
            <span id="bmEntBadge" style="background:rgba(255,255,255,0.2); padding:1px 7px; border-radius:10px; font-size:0.75rem;">0</span>
          </button>
          <button id="bmTabInvestors" onclick="switchBmTab('investors')" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.88rem; cursor:pointer; border:1px solid var(--border-subtle); background:transparent; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
            <span>💰 Investors (పెట్టుబడిదారులు)</span>
            <span id="bmInvBadge" style="background:rgba(255,255,255,0.08); padding:1px 7px; border-radius:10px; font-size:0.75rem;">0</span>
          </button>
        </div>

        <!-- Filter Controls -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <select id="bmFilterState" onchange="applyBmFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; cursor:pointer;">
            <option value="all">All States (అన్ని రాష్ట్రాలు)</option>
            <option value="1">Andhra Pradesh (AP)</option>
            <option value="2">Telangana (TG)</option>
          </select>

          <select id="bmFilterType" onchange="applyBmFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; cursor:pointer; max-width:200px;">
            <option value="all">All Business Types (అన్ని రంగాలు)</option>
          </select>

          <input type="text" id="bmSearchInput" placeholder="🔍 Search by name, phone, district, town..." oninput="applyBmFilters()" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 12px; font-size:0.84rem; width:220px;">

          <button onclick="fetchBusinessMatchData(true)" style="background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-main); border-radius:8px; padding:7px 14px; font-size:0.84rem; cursor:pointer; font-weight:600;" title="Reload Data">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Modal Body (Table Container) -->
      <div style="flex:1; overflow-y:auto; padding:20px 24px;">
        
        <!-- Loading Spinner -->
        <div id="bmSpinner" style="display:none; text-align:center; padding:50px 0;">
          <div style="display:inline-block; width:36px; height:36px; border:3px solid rgba(99,102,241,0.2); border-top-color:#6366f1; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
          <div style="margin-top:12px; color:var(--text-muted); font-size:0.88rem;">Loading Entrepreneur & Investor records...</div>
        </div>

        <!-- ENTREPRENEURS TABLE -->
        <div id="bmEntrepreneursContainer">
          <table class="data-table" style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.85rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.03);">
                <th style="padding:10px 12px; text-align:center; width:45px;">#</th>
                <th style="padding:10px 14px; text-align:left;">Entrepreneur Name & Contact</th>
                <th style="padding:10px 14px; text-align:left;">Personal Residence</th>
                <th style="padding:10px 14px; text-align:left;">Business Setup Location</th>
                <th style="padding:10px 14px; text-align:left;">Business Sector</th>
                <th style="padding:10px 14px; text-align:right;">Self Fund</th>
                <th style="padding:10px 14px; text-align:right;">Capital Needed</th>
                <th style="padding:10px 12px; text-align:center;">Date</th>
                <th style="padding:10px 12px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody id="bmEntrepreneursTbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>

        <!-- INVESTORS TABLE -->
        <div id="bmInvestorsContainer" style="display:none;">
          <table class="data-table" style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.85rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.03);">
                <th style="padding:10px 12px; text-align:center; width:45px;">#</th>
                <th style="padding:10px 14px; text-align:left;">Investor Name & Contact</th>
                <th style="padding:10px 14px; text-align:left;">Residence / Location</th>
                <th style="padding:10px 14px; text-align:left;">Interested Sector(s)</th>
                <th style="padding:10px 14px; text-align:right;">Capital to Invest</th>
                <th style="padding:10px 12px; text-align:center;">Date</th>
                <th style="padding:10px 12px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody id="bmInvestorsTbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>

      </div>

      <!-- Modal Footer -->
      <div style="padding:12px 24px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2);">
        <div id="bmFooterStats" style="font-size:0.82rem; color:var(--text-dim);">
          Showing records
        </div>
        <button class="btn btn-secondary" onclick="closeBusinessMatchModal()" style="padding:6px 16px; border-radius:8px; font-size:0.85rem;">
          Close
        </button>
      </div>

    </div>
  </div>\n\n"""

    html = html.replace(anchor_modal, business_modal + anchor_modal)

    # 3. Add JavaScript logic right before </script>
    anchor_script = '  // Initial render\n  fetchData();'
    if anchor_script not in html:
        anchor_script = '  fetchData();'

    js_code = """
  // ==========================================
  // ENTREPRENEUR & INVESTOR MANAGEMENT CONSOLE
  // ==========================================
  let allEntrepreneursData = [];
  let allInvestorsData = [];
  let currentBmTab = 'entrepreneurs';

  async function fetchBusinessMatchData(isRefresh = false) {
    const spinner = document.getElementById('bmSpinner');
    const entContainer = document.getElementById('bmEntrepreneursContainer');
    const invContainer = document.getElementById('bmInvestorsContainer');

    if (spinner) spinner.style.display = 'block';
    if (entContainer) entContainer.style.opacity = '0.4';
    if (invContainer) invContainer.style.opacity = '0.4';

    try {
      const [resEnt, resInv, resTypes] = await Promise.all([
        fetch('/dashboardapi/admin-entrepreneurs').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/dashboardapi/admin-investors').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/dashboardapi/business-types').then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      allEntrepreneursData = (resEnt && resEnt.data) ? resEnt.data : [];
      allInvestorsData = (resInv && resInv.data) ? resInv.data : [];

      // Populate business type filter options
      const typeFilter = document.getElementById('bmFilterType');
      if (typeFilter && resTypes && resTypes.data && resTypes.data.length > 0 && typeFilter.options.length <= 1) {
        resTypes.data.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.business_type || t.type_english || t.id;
          opt.textContent = t.business_type || t.type_english;
          typeFilter.appendChild(opt);
        });
      }

      // Update Top Summary Box Counters
      updateBusinessMatchHeroStats();

      // Render Tables
      applyBmFilters();

    } catch (err) {
      console.error('Error fetching business match data:', err);
    } finally {
      if (spinner) spinner.style.display = 'none';
      if (entContainer) entContainer.style.opacity = '1';
      if (invContainer) invContainer.style.opacity = '1';
    }
  }

  function updateBusinessMatchHeroStats() {
    const entCount = document.getElementById('entSummaryCount');
    const entCapital = document.getElementById('entSummaryCapital');
    const invCount = document.getElementById('invSummaryCount');
    const invCapital = document.getElementById('invSummaryCapital');
    const entBadge = document.getElementById('bmEntBadge');
    const invBadge = document.getElementById('bmInvBadge');

    if (entCount) entCount.textContent = allEntrepreneursData.length;
    if (invCount) invCount.textContent = allInvestorsData.length;
    if (entBadge) entBadge.textContent = allEntrepreneursData.length;
    if (invBadge) invBadge.textContent = allInvestorsData.length;

    // Calculate approximate capital totals
    let totalNeed = 0;
    allEntrepreneursData.forEach(e => {
      const num = parseFloat(String(e.capital_need || '').replace(/[^0-9.]/g, '')) || 0;
      totalNeed += num;
    });

    let totalInvest = 0;
    allInvestorsData.forEach(i => {
      const num = parseFloat(String(i.capital_to_invest || '').replace(/[^0-9.]/g, '')) || 0;
      totalInvest += num;
    });

    const formatCurrency = (val) => {
      if (!val) return '₹0';
      if (val >= 10000000) return '₹' + (val / 10000000).toFixed(1) + ' Cr';
      if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + ' Lakh';
      return '₹' + val.toLocaleString('en-IN');
    };

    if (entCapital) entCapital.textContent = formatCurrency(totalNeed);
    if (invCapital) invCapital.textContent = formatCurrency(totalInvest);
  }

  function openBusinessMatchModal() {
    const modal = document.getElementById('businessMatchModal');
    if (modal) {
      modal.style.display = 'flex';
      fetchBusinessMatchData(true);
    }
  }

  function closeBusinessMatchModal() {
    const modal = document.getElementById('businessMatchModal');
    if (modal) modal.style.display = 'none';
  }

  function switchBmTab(tab) {
    currentBmTab = tab;
    const btnEnt = document.getElementById('bmTabEntrepreneurs');
    const btnInv = document.getElementById('bmTabInvestors');
    const contEnt = document.getElementById('bmEntrepreneursContainer');
    const contInv = document.getElementById('bmInvestorsContainer');

    if (tab === 'entrepreneurs') {
      btnEnt.style.background = '#6366f1';
      btnEnt.style.borderColor = '#6366f1';
      btnEnt.style.color = '#fff';

      btnInv.style.background = 'transparent';
      btnInv.style.borderColor = 'var(--border-subtle)';
      btnInv.style.color = 'var(--text-muted)';

      contEnt.style.display = 'block';
      contInv.style.display = 'none';
    } else {
      btnInv.style.background = '#10b981';
      btnInv.style.borderColor = '#10b981';
      btnInv.style.color = '#fff';

      btnEnt.style.background = 'transparent';
      btnEnt.style.borderColor = 'var(--border-subtle)';
      btnEnt.style.color = 'var(--text-muted)';

      contInv.style.display = 'block';
      contEnt.style.display = 'none';
    }
    applyBmFilters();
  }

  function applyBmFilters() {
    const stateVal = document.getElementById('bmFilterState')?.value || 'all';
    const typeVal = document.getElementById('bmFilterType')?.value || 'all';
    const searchVal = (document.getElementById('bmSearchInput')?.value || '').toLowerCase().trim();

    if (currentBmTab === 'entrepreneurs') {
      let filtered = allEntrepreneursData.filter(item => {
        // State filter (personal or business setup state)
        if (stateVal !== 'all') {
          const matchState = String(item.state_id) === stateVal || String(item.business_state_id) === stateVal;
          if (!matchState) return false;
        }
        // Business type filter
        if (typeVal !== 'all') {
          const bType = (item.business_type || '').toLowerCase();
          if (!bType.includes(typeVal.toLowerCase())) return false;
        }
        // Search filter
        if (searchVal) {
          const str = `${item.name || ''} ${item.mobile || ''} ${item.email || ''} ${item.district_name || ''} ${item.business_district_name || ''} ${item.business_type || ''} ${item.denomination || ''}`.toLowerCase();
          if (!str.includes(searchVal)) return false;
        }
        return true;
      });
      renderEntrepreneursTable(filtered);
    } else {
      let filtered = allInvestorsData.filter(item => {
        // State filter
        if (stateVal !== 'all') {
          if (String(item.state_id) !== stateVal) return false;
        }
        // Business type filter
        if (typeVal !== 'all') {
          const bType = (item.business_type || '').toLowerCase();
          if (!bType.includes(typeVal.toLowerCase())) return false;
        }
        // Search filter
        if (searchVal) {
          const str = `${item.name || ''} ${item.mobile || ''} ${item.email || ''} ${item.district_name || ''} ${item.business_type || ''} ${item.denomination || ''}`.toLowerCase();
          if (!str.includes(searchVal)) return false;
        }
        return true;
      });
      renderInvestorsTable(filtered);
    }
  }

  function renderEntrepreneursTable(list) {
    const tbody = document.getElementById('bmEntrepreneursTbody');
    const footer = document.getElementById('bmFooterStats');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:35px; color:var(--text-dim);">No entrepreneur registrations found matching filters.</td></tr>`;
      if (footer) footer.textContent = `Showing 0 of ${allEntrepreneursData.length} Entrepreneurs`;
      return;
    }

    if (footer) footer.textContent = `Showing ${list.length} of ${allEntrepreneursData.length} Entrepreneurs`;

    tbody.innerHTML = list.map((item, idx) => {
      const personalAddr = [item.district_name, item.constituency_name, item.mandal_name, item.panchayat_name].filter(Boolean).join(', ') || (item.state_id == 2 ? 'Telangana' : 'Andhra Pradesh');
      const bizAddr = [item.business_district_name, item.business_constituency_name, item.business_mandal_name, item.business_panchayat_name].filter(Boolean).join(', ') || personalAddr;
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : 'N/A';

      const isApproved = item.approval_ind == 1;
      const isRejected = item.approval_ind == 2;

      let statusBadge = `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Pending</span>`;
      if (isApproved) statusBadge = `<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Approved</span>`;
      if (isRejected) statusBadge = `<span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Rejected</span>`;

      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim);">${idx + 1}</td>
          <td style="padding:10px 14px;">
            <div style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${item.name || 'N/A'}</div>
            <div style="font-size:0.8rem; color:#38bdf8; display:flex; align-items:center; gap:6px;">
              <span>📞 ${item.mobile || 'N/A'}</span>
              ${item.email ? `<span style="color:var(--text-dim);">| ✉️ ${item.email}</span>` : ''}
            </div>
            ${item.denomination ? `<div style="font-size:0.75rem; color:#a78bfa; margin-top:2px;">⛪ ${item.denomination}</div>` : ''}
          </td>
          <td style="padding:10px 14px; color:var(--text-muted); font-size:0.82rem;">
            <div>${personalAddr}</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">${item.state_id == 2 ? 'Telangana' : 'Andhra Pradesh'}</div>
          </td>
          <td style="padding:10px 14px; color:#e0e7ff; font-size:0.84rem;">
            <div style="font-weight:600;">📍 ${bizAddr}</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">${item.business_state_id == 2 ? 'Telangana' : 'Andhra Pradesh'}</div>
          </td>
          <td style="padding:10px 14px;">
            <span style="background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3); padding:3px 9px; border-radius:6px; font-size:0.78rem; font-weight:600; display:inline-block;">
              ${item.business_type || 'General Business'}
            </span>
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:600; color:#34d399; font-size:0.88rem;">
            ₹${item.self_fund || '0'}
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; color:#f472b6; font-size:0.92rem;">
            ₹${item.capital_need || '0'}
          </td>
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim); font-size:0.78rem;">${dateStr}</td>
          <td style="padding:10px 12px; text-align:center;">
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
              ${statusBadge}
              <div style="display:flex; gap:4px; margin-top:4px;">
                <button onclick="handleAdminUpdateEntrepreneur(${item.id}, 'approve')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:#10b981; color:#fff; border:none; cursor:pointer;" title="Approve">✓</button>
                <button onclick="handleAdminUpdateEntrepreneur(${item.id}, 'reject')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:#ef4444; color:#fff; border:none; cursor:pointer;" title="Reject">✕</button>
                <button onclick="handleAdminUpdateEntrepreneur(${item.id}, 'reset')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:rgba(255,255,255,0.1); color:var(--text-main); border:none; cursor:pointer;" title="Reset Status">↺</button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderInvestorsTable(list) {
    const tbody = document.getElementById('bmInvestorsTbody');
    const footer = document.getElementById('bmFooterStats');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:35px; color:var(--text-dim);">No investor registrations found matching filters.</td></tr>`;
      if (footer) footer.textContent = `Showing 0 of ${allInvestorsData.length} Investors`;
      return;
    }

    if (footer) footer.textContent = `Showing ${list.length} of ${allInvestorsData.length} Investors`;

    tbody.innerHTML = list.map((item, idx) => {
      const personalAddr = [item.district_name, item.constituency_name, item.mandal_name, item.panchayat_name].filter(Boolean).join(', ') || (item.state_id == 2 ? 'Telangana' : 'Andhra Pradesh');
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : 'N/A';

      const isApproved = item.approval_ind == 1;
      const isRejected = item.approval_ind == 2;

      let statusBadge = `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Pending</span>`;
      if (isApproved) statusBadge = `<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Approved</span>`;
      if (isRejected) statusBadge = `<span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Rejected</span>`;

      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim);">${idx + 1}</td>
          <td style="padding:10px 14px;">
            <div style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${item.name || 'N/A'}</div>
            <div style="font-size:0.8rem; color:#38bdf8; display:flex; align-items:center; gap:6px;">
              <span>📞 ${item.mobile || 'N/A'}</span>
              ${item.email ? `<span style="color:var(--text-dim);">| ✉️ ${item.email}</span>` : ''}
            </div>
            ${item.denomination ? `<div style="font-size:0.75rem; color:#a78bfa; margin-top:2px;">⛪ ${item.denomination}</div>` : ''}
          </td>
          <td style="padding:10px 14px; color:var(--text-muted); font-size:0.82rem;">
            <div>📍 ${personalAddr}</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">${item.state_id == 2 ? 'Telangana' : 'Andhra Pradesh'}</div>
          </td>
          <td style="padding:10px 14px;">
            <span style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); padding:3px 9px; border-radius:6px; font-size:0.78rem; font-weight:600; display:inline-block;">
              ${item.business_type || 'All Sectors'}
            </span>
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; color:#34d399; font-size:0.95rem;">
            ₹${item.capital_to_invest || '0'}
          </td>
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim); font-size:0.78rem;">${dateStr}</td>
          <td style="padding:10px 12px; text-align:center;">
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
              ${statusBadge}
              <div style="display:flex; gap:4px; margin-top:4px;">
                <button onclick="handleAdminUpdateInvestor(${item.id}, 'approve')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:#10b981; color:#fff; border:none; cursor:pointer;" title="Approve">✓</button>
                <button onclick="handleAdminUpdateInvestor(${item.id}, 'reject')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:#ef4444; color:#fff; border:none; cursor:pointer;" title="Reject">✕</button>
                <button onclick="handleAdminUpdateInvestor(${item.id}, 'reset')" style="padding:3px 7px; border-radius:4px; font-size:0.72rem; background:rgba(255,255,255,0.1); color:var(--text-main); border:none; cursor:pointer;" title="Reset Status">↺</button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function handleAdminUpdateEntrepreneur(id, action) {
    try {
      const res = await fetch('/dashboardapi/admin-update-entrepreneur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      }).then(r => r.json());

      if (res && res.status === 200) {
        const item = allEntrepreneursData.find(e => e.id == id);
        if (item) {
          if (action === 'approve') item.approval_ind = 1;
          if (action === 'reject') item.approval_ind = 2;
          if (action === 'reset') item.approval_ind = 0;
        }
        applyBmFilters();
      } else {
        alert(res?.message || 'Failed to update entrepreneur status');
      }
    } catch (e) {
      console.error('Error updating entrepreneur:', e);
    }
  }

  async function handleAdminUpdateInvestor(id, action) {
    try {
      const res = await fetch('/dashboardapi/admin-update-investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      }).then(r => r.json());

      if (res && res.status === 200) {
        const item = allInvestorsData.find(i => i.id == id);
        if (item) {
          if (action === 'approve') item.approval_ind = 1;
          if (action === 'reject') item.approval_ind = 2;
          if (action === 'reset') item.approval_ind = 0;
        }
        applyBmFilters();
      } else {
        alert(res?.message || 'Failed to update investor status');
      }
    } catch (e) {
      console.error('Error updating investor:', e);
    }
  }
\n"""

    html = html.replace(anchor_script, js_code + "\n  fetchBusinessMatchData();\n" + anchor_script)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully patched {file_path}")

if __name__ == '__main__':
    patch_file('public.html')
    patch_file('backend/public.html')


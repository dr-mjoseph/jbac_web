import sys
import os

def apply_patch(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has fetchBusinessMatchData
    if 'async function fetchBusinessMatchData' in content:
        print(f"Already contains fetchBusinessMatchData in {file_path}")
        return

    anchor = '  async function loadDashboardMetrics(stateId = dashboardActiveState) {'
    if anchor not in content:
        print(f"Error: anchor not found in {file_path}")
        return

    js_code = """  // ==========================================
  // ENTREPRENEUR & INVESTOR MANAGEMENT CONSOLE
  // ==========================================
  let allEntrepreneursData = [];
  let allInvestorsData = [];
  let currentBmTab = 'entrepreneurs';
  let bmCurrentState = 'all';
  let bmCurrentType = 'all';

  function formatIndianCurrency(num) {
    if (!num) return '₹ 0';
    const n = typeof num === 'string' ? parseFloat(num.replace(/,/g, '').trim()) : Number(num);
    if (isNaN(n) || n <= 0) return '₹ 0';
    if (n >= 10000000) {
      return `₹ ${(n / 10000000).toFixed(2)} Cr`;
    } else if (n >= 100000) {
      return `₹ ${(n / 100000).toFixed(2)} L`;
    } else {
      return `₹ ${n.toLocaleString('en-IN')}`;
    }
  }

  async function fetchBusinessMatchData(isRefresh = false, stateFilter = dashboardActiveState) {
    const spinner = document.getElementById('bmSpinner');
    const entContainer = document.getElementById('bmEntrepreneursContainer');
    const invContainer = document.getElementById('bmInvestorsContainer');

    if (isRefresh && spinner) spinner.style.display = 'block';
    if (isRefresh && entContainer) entContainer.style.opacity = '0.4';
    if (isRefresh && invContainer) invContainer.style.opacity = '0.4';

    try {
      const [resEnt, resInv, resTypes] = await Promise.all([
        fetch(`${API_BASE}/dashboardapi/admin-entrepreneurs`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/dashboardapi/admin-investors`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/dashboardapi/business-types`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      allEntrepreneursData = (resEnt && resEnt.data && Array.isArray(resEnt.data)) ? resEnt.data : [];
      allInvestorsData = (resInv && resInv.data && Array.isArray(resInv.data)) ? resInv.data : [];

      // Populate business type filter options in modal if not already populated
      const typeFilter = document.getElementById('bmFilterType');
      if (typeFilter && resTypes && resTypes.data && Array.isArray(resTypes.data) && typeFilter.options.length <= 1) {
        resTypes.data.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.name_en || t.name_te || t.id;
          opt.textContent = `${t.name_te || ''} - ${t.name_en || ''}`;
          typeFilter.appendChild(opt);
        });
      }

      // Update Top Summary Box Counters
      updateBusinessMatchHeroStats(stateFilter);

      // Render Tables inside modal
      applyBmFilters();

    } catch (err) {
      console.error('Error fetching business match data:', err);
    } finally {
      if (spinner) spinner.style.display = 'none';
      if (entContainer) entContainer.style.opacity = '1';
      if (invContainer) invContainer.style.opacity = '1';
    }
  }

  function updateBusinessMatchHeroStats(stateFilter = dashboardActiveState) {
    const sId = String(stateFilter || 'all');
    
    // Filter entrepreneurs by state if stateFilter is active
    const entList = sId === 'all' 
      ? allEntrepreneursData 
      : allEntrepreneursData.filter(e => String(e.state_id) === sId || String(e.business_state_id) === sId);

    // Filter investors by state if stateFilter is active
    const invList = sId === 'all' 
      ? allInvestorsData 
      : allInvestorsData.filter(i => String(i.state_id) === sId);

    // Sum capital needed by entrepreneurs
    const totalFundsNeeded = entList.reduce((acc, curr) => {
      const val = parseFloat(String(curr.capital_need || '0').replace(/,/g, '').trim()) || 0;
      return acc + val;
    }, 0);

    // Sum capital to invest by investors
    const totalToInvest = invList.reduce((acc, curr) => {
      const val = parseFloat(String(curr.capital_to_invest || '0').replace(/,/g, '').trim()) || 0;
      return acc + val;
    }, 0);

    // Update Hero elements
    const elEntCount = document.getElementById('entSummaryCount');
    if (elEntCount) elEntCount.textContent = entList.length.toLocaleString();

    const elEntCapital = document.getElementById('entSummaryCapital');
    if (elEntCapital) elEntCapital.textContent = formatIndianCurrency(totalFundsNeeded);

    const elInvCount = document.getElementById('invSummaryCount');
    if (elInvCount) elInvCount.textContent = invList.length.toLocaleString();

    const elInvCapital = document.getElementById('invSummaryCapital');
    if (elInvCapital) elInvCapital.textContent = formatIndianCurrency(totalToInvest);

    // Also update modal header badges
    const badgeEnt = document.getElementById('bmEntBadge');
    if (badgeEnt) badgeEnt.textContent = allEntrepreneursData.length;

    const badgeInv = document.getElementById('bmInvBadge');
    if (badgeInv) badgeInv.textContent = allInvestorsData.length;
  }

  function openBusinessMatchModal() {
    const m = document.getElementById('businessMatchModal');
    if (m) {
      m.style.display = 'flex';
      // Sync modal state filter with global dashboard active state if applicable
      const stateSelect = document.getElementById('bmFilterState');
      if (stateSelect && dashboardActiveState) {
        stateSelect.value = dashboardActiveState;
      }
      fetchBusinessMatchData(true);
    }
  }

  function closeBusinessMatchModal() {
    const m = document.getElementById('businessMatchModal');
    if (m) m.style.display = 'none';
  }

  function switchBmTab(tab) {
    currentBmTab = tab;
    const btnEnt = document.getElementById('bmTabEntrepreneurs');
    const btnInv = document.getElementById('bmTabInvestors');
    const containerEnt = document.getElementById('bmEntrepreneursContainer');
    const containerInv = document.getElementById('bmInvestorsContainer');

    if (tab === 'entrepreneurs') {
      if (btnEnt) {
        btnEnt.style.background = '#6366f1';
        btnEnt.style.color = '#fff';
        btnEnt.style.borderColor = '#6366f1';
      }
      if (btnInv) {
        btnInv.style.background = 'transparent';
        btnInv.style.color = 'var(--text-muted)';
        btnInv.style.borderColor = 'var(--border-subtle)';
      }
      if (containerEnt) containerEnt.style.display = 'block';
      if (containerInv) containerInv.style.display = 'none';
    } else {
      if (btnInv) {
        btnInv.style.background = '#10b981';
        btnInv.style.color = '#fff';
        btnInv.style.borderColor = '#10b981';
      }
      if (btnEnt) {
        btnEnt.style.background = 'transparent';
        btnEnt.style.color = 'var(--text-muted)';
        btnEnt.style.borderColor = 'var(--border-subtle)';
      }
      if (containerEnt) containerEnt.style.display = 'none';
      if (containerInv) containerInv.style.display = 'block';
    }
    applyBmFilters();
  }

  function applyBmFilters() {
    const stateVal = document.getElementById('bmFilterState')?.value || 'all';
    const typeVal = document.getElementById('bmFilterType')?.value || 'all';
    const searchVal = (document.getElementById('bmSearchInput')?.value || '').toLowerCase().trim();

    const matchesFilter = (item, isEntrepreneur) => {
      // State filter check
      if (stateVal !== 'all') {
        const itemState = String(item.state_id);
        const itemBusState = String(item.business_state_id || item.state_id);
        if (itemState !== stateVal && itemBusState !== stateVal) return false;
      }

      // Business type filter check
      if (typeVal !== 'all') {
        const bType = (item.business_type || '').toLowerCase();
        if (!bType.includes(typeVal.toLowerCase())) return false;
      }

      // Search keyword filter check
      if (searchVal) {
        const hay = [
          item.name,
          item.mobile,
          item.email,
          item.district_name,
          item.constituency_name,
          item.mandal_name,
          item.panchayat_name,
          item.business_type,
          item.denomination,
          item.business_district_name,
          item.business_mandal_name,
          item.description
        ].filter(Boolean).join(' ').toLowerCase();

        if (!hay.includes(searchVal)) return false;
      }

      return true;
    };

    const filteredEnt = allEntrepreneursData.filter(e => matchesFilter(e, true));
    const filteredInv = allInvestorsData.filter(i => matchesFilter(i, false));

    renderEntrepreneursTable(filteredEnt);
    renderInvestorsTable(filteredInv);

    const footerStats = document.getElementById('bmFooterStats');
    if (footerStats) {
      if (currentBmTab === 'entrepreneurs') {
        footerStats.textContent = `Showing ${filteredEnt.length} of ${allEntrepreneursData.length} entrepreneurs`;
      } else {
        footerStats.textContent = `Showing ${filteredInv.length} of ${allInvestorsData.length} investors`;
      }
    }
  }

  function renderEntrepreneursTable(list) {
    const tbody = document.getElementById('bmEntrepreneursTbody');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:40px; color:var(--text-muted);">
            <div style="font-size:1.8rem; margin-bottom:8px;">🔍</div>
            <div style="font-weight:600;">No Entrepreneur Applications Found</div>
            <div style="font-size:0.8rem; margin-top:4px;">No records match your selected filters.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((item, idx) => {
      const personalLoc = [item.district_name, item.mandal_name, item.panchayat_name].filter(Boolean).join(', ') || item.state_name || 'N/A';
      const busLoc = [item.business_district_name, item.business_mandal_name, item.business_panchayat_name].filter(Boolean).join(', ') || item.business_state_name || personalLoc;
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '--';

      let statusBadge = `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Pending</span>`;
      if (item.approval_ind == 1) {
        statusBadge = `<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Approved</span>`;
      } else if (item.approval_ind == 2) {
        statusBadge = `<span style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Rejected</span>`;
      }

      return `
        <tr style="border-bottom:1px solid var(--border-subtle); transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim);">${idx + 1}</td>
          <td style="padding:10px 14px;">
            <div style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${item.name || '--'}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); display:flex; gap:8px; margin-top:2px;">
              <span>📞 <a href="tel:${item.mobile}" style="color:#818cf8; text-decoration:none;">${item.mobile || '--'}</a></span>
              ${item.email ? `<span>✉️ ${item.email}</span>` : ''}
            </div>
            ${item.denomination ? `<div style="font-size:0.75rem; color:#a5b4fc; margin-top:3px;">⛪ ${item.denomination}</div>` : ''}
          </td>
          <td style="padding:10px 14px; color:var(--text-muted); font-size:0.83rem;">
            <div>${personalLoc}</div>
            <span style="font-size:0.75rem; color:var(--text-dim);">${item.state_name || (item.state_id == 1 ? 'Andhra Pradesh' : 'Telangana')}</span>
          </td>
          <td style="padding:10px 14px; font-size:0.83rem;">
            <div style="color:var(--text-main); font-weight:600;">📍 ${busLoc}</div>
            <span style="font-size:0.75rem; color:var(--text-dim);">${item.business_state_name || (item.business_state_id == 1 ? 'Andhra Pradesh' : 'Telangana')}</span>
          </td>
          <td style="padding:10px 14px;">
            <span style="background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.25); padding:3px 9px; border-radius:6px; font-size:0.78rem; font-weight:600; display:inline-block;">
              ${item.business_type || 'General'}
            </span>
            ${item.description && item.description !== 'n/a' ? `<div style="font-size:0.76rem; color:var(--text-dim); margin-top:4px; max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.description}">💡 ${item.description}</div>` : ''}
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:600; color:#94a3b8; font-size:0.88rem;">
            ${formatIndianCurrency(item.self_fund)}
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; color:#f472b6; font-size:0.92rem;">
            ${formatIndianCurrency(item.capital_need)}
          </td>
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim); font-size:0.78rem; white-space:nowrap;">
            ${dateStr}
          </td>
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
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">
            <div style="font-size:1.8rem; margin-bottom:8px;">🔍</div>
            <div style="font-weight:600;">No Investor Profiles Found</div>
            <div style="font-size:0.8rem; margin-top:4px;">No investor records match your selected filters.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((item, idx) => {
      const loc = [item.district_name, item.mandal_name, item.panchayat_name].filter(Boolean).join(', ') || item.state_name || 'N/A';
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '--';

      let statusBadge = `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Pending</span>`;
      if (item.approval_ind == 1) {
        statusBadge = `<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Approved</span>`;
      } else if (item.approval_ind == 2) {
        statusBadge = `<span style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:600;">Rejected</span>`;
      }

      return `
        <tr style="border-bottom:1px solid var(--border-subtle); transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim);">${idx + 1}</td>
          <td style="padding:10px 14px;">
            <div style="font-weight:700; color:var(--text-main); font-size:0.92rem;">${item.name || '--'}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); display:flex; gap:8px; margin-top:2px;">
              <span>📞 <a href="tel:${item.mobile}" style="color:#34d399; text-decoration:none;">${item.mobile || '--'}</a></span>
              ${item.email ? `<span>✉️ ${item.email}</span>` : ''}
            </div>
            ${item.denomination ? `<div style="font-size:0.75rem; color:#6ee7b7; margin-top:3px;">⛪ ${item.denomination}</div>` : ''}
          </td>
          <td style="padding:10px 14px; color:var(--text-muted); font-size:0.83rem;">
            <div>📍 ${loc}</div>
            <span style="font-size:0.75rem; color:var(--text-dim);">${item.state_name || (item.state_id == 1 ? 'Andhra Pradesh' : 'Telangana')}</span>
          </td>
          <td style="padding:10px 14px;">
            <span style="background:rgba(16,185,129,0.12); color:#34d399; border:1px solid rgba(16,185,129,0.25); padding:3px 9px; border-radius:6px; font-size:0.78rem; font-weight:600; display:inline-block;">
              ${item.business_type || 'Multiple Sectors'}
            </span>
            ${item.description && item.description !== 'n/a' ? `<div style="font-size:0.76rem; color:var(--text-dim); margin-top:4px; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.description}">📝 ${item.description}</div>` : ''}
          </td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; color:#34d399; font-size:0.95rem;">
            ${formatIndianCurrency(item.capital_to_invest)}
          </td>
          <td style="padding:10px 12px; text-align:center; color:var(--text-dim); font-size:0.78rem; white-space:nowrap;">
            ${dateStr}
          </td>
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
      const res = await fetch(`${API_BASE}/dashboardapi/admin-update-entrepreneur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
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
      const res = await fetch(`${API_BASE}/dashboardapi/admin-update-investor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
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

"""

    content = content.replace(anchor, js_code + "\n" + anchor)

    # In loadDashboardMetrics, right after fetchDistrictLeadersData();
    target_call = 'fetchDistrictLeadersData();'
    replacement_call = 'fetchDistrictLeadersData();\n          fetchBusinessMatchData(false, stateId);'
    if target_call in content and 'fetchBusinessMatchData(false, stateId);' not in content:
        content = content.replace(target_call, replacement_call, 1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully applied JS patch to {file_path}")

if __name__ == '__main__':
    apply_patch('public.html')
    apply_patch('backend/public.html')

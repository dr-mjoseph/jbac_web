import os

def patch_public_html(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add CSS
    if '.metric-card-stat-row' not in html:
        css_anchor = '.metric-card-value {'
        new_css = """.metric-card-stat-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }

    .metric-today-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.02em;
    }

    .metric-today-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 6px #38bdf8;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    """
        html = html.replace(css_anchor, new_css + css_anchor, 1)

    # 2. Update metricsGrid cards
    old_grid_start = '<div class="metrics-grid" id="metricsGrid">'
    new_grid = """<div class="metrics-grid" id="metricsGrid">
      <div class="metric-card" onclick="openStateCategoryQuery('signup_form')">
        <div class="metric-card-header">
          <span>Believers Registered</span>
          <div class="metric-card-icon">👥</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-believers">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-believers-today">0</strong></div>
        </div>
        <div class="metric-card-footer">signup_form &bull; Total: <span id="stat-believers-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('pastor_reg')">
        <div class="metric-card-header">
          <span>Pastors Registered</span>
          <div class="metric-card-icon">✝️</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-pastors">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-pastors-today">0</strong></div>
        </div>
        <div class="metric-card-footer">pastor_reg &bull; Total: <span id="stat-pastors-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('church_reg')">
        <div class="metric-card-header">
          <span>Churches Registered</span>
          <div class="metric-card-icon">⛪</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-churches">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-churches-today">0</strong></div>
        </div>
        <div class="metric-card-footer">church_reg &bull; Total: <span id="stat-churches-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('student_reg')">
        <div class="metric-card-header">
          <span>Students Registered</span>
          <div class="metric-card-icon">🎓</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-students">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-students-today">0</strong></div>
        </div>
        <div class="metric-card-footer">student_reg &bull; Total: <span id="stat-students-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('ministry_signup')">
        <div class="metric-card-header">
          <span>Ministries Registered</span>
          <div class="metric-card-icon">🕊️</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-ministries">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-ministries-today">0</strong></div>
        </div>
        <div class="metric-card-footer">ministry_signup &bull; Total: <span id="stat-ministries-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('independentorganisation_reg')">
        <div class="metric-card-header">
          <span>Organizations Registered</span>
          <div class="metric-card-icon">🏛️</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-orgs">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-orgs-today">0</strong></div>
        </div>
        <div class="metric-card-footer">independentorganisation_reg &bull; Total: <span id="stat-orgs-total">--</span></div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('events')">
        <div class="metric-card-header">
          <span>Active Events</span>
          <div class="metric-card-icon">📅</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-events">--</div>
          <div class="metric-today-badge" title="Events Today"><span class="metric-today-dot"></span>Today: <strong id="stat-events-today">0</strong></div>
        </div>
        <div class="metric-card-footer" id="stat-events-total">Loading total...</div>
      </div>

      <div class="metric-card" onclick="openStateCategoryQuery('users')">
        <div class="metric-card-header">
          <span>Total Portal Accounts</span>
          <div class="metric-card-icon">🔐</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-users">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-users-today">0</strong></div>
        </div>
        <div class="metric-card-footer">users table &bull; Total: <span id="stat-users-total">--</span></div>
      </div>
    </div>"""

    # Find the end of metricsGrid
    grid_idx = html.find(old_grid_start)
    if grid_idx != -1:
        end_grid_idx = html.find('<div class="dash-sections">', grid_idx)
        if end_grid_idx != -1:
            html = html[:grid_idx] + new_grid + "\n\n    " + html[end_grid_idx:]
            print(f"Patched metricsGrid in {filepath}")

    # 3. Update loadDashboardMetrics JS logic
    old_js_start = "document.getElementById('stat-believers').textContent = Number(s.believers || 0).toLocaleString();"
    new_js = """const setStat = (id, total, today) => {
            const el = document.getElementById(id);
            if (el) el.textContent = Number(total || 0).toLocaleString();
            const elToday = document.getElementById(id + '-today');
            if (elToday) elToday.textContent = Number(today || 0).toLocaleString();
            const elTotal = document.getElementById(id + '-total');
            if (elTotal) elTotal.textContent = Number(total || 0).toLocaleString();
          };

          setStat('stat-believers', s.believers, s.believers_today);
          setStat('stat-pastors', s.pastors, s.pastors_today);
          setStat('stat-churches', s.churches, s.churches_today);
          setStat('stat-students', s.students, s.students_today);
          setStat('stat-ministries', s.ministries, s.ministries_today);
          setStat('stat-orgs', s.organisations, s.organisations_today);
          setStat('stat-events', s.events_active, s.events_today);
          setStat('stat-users', s.users, s.users_today);
          if (document.getElementById('stat-events-total')) {
            document.getElementById('stat-events-total').textContent = `${Number(s.events_total || 0).toLocaleString()} total meetings`;
          }"""

    if old_js_start in html:
        # replace from old_js_start to document.getElementById('stat-users').textContent = Number(s.users || 0).toLocaleString();
        js_end_marker = "document.getElementById('stat-users').textContent = Number(s.users || 0).toLocaleString();"
        js_end_idx = html.find(js_end_marker)
        if js_end_idx != -1:
            js_start_idx = html.find(old_js_start)
            html = html[:js_start_idx] + new_js + html[js_end_idx + len(js_end_marker):]
            print(f"Patched loadDashboardMetrics in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Saved {filepath}")

files = [
    'public.html',
    'backend/public.html',
    'src/public.html',
    'src/assets/public.html'
]

for f in files:
    patch_public_html(f)


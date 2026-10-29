import os

def update_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Pastor Associations metric card right after Organizations Registered
    old_card = """      <div class="metric-card" onclick="openStateCategoryQuery('independentorganisation_reg')">
        <div class="metric-card-header">
          <span>Organizations Registered</span>
          <div class="metric-card-icon">🏛️</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-orgs">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-orgs-today">0</strong></div>
        </div>
        <div class="metric-card-footer">independentorganisation_reg &bull; Total: <span id="stat-orgs-total">--</span></div>
      </div>"""

    new_card = """      <div class="metric-card" onclick="openStateCategoryQuery('independentorganisation_reg')">
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

      <div class="metric-card" onclick="openStateCategoryQuery('pastors_associations')">
        <div class="metric-card-header">
          <span>Pastor Associations</span>
          <div class="metric-card-icon">🤝</div>
        </div>
        <div class="metric-card-stat-row">
          <div class="metric-card-value" id="stat-pastor-associations">--</div>
          <div class="metric-today-badge" title="Registered Today"><span class="metric-today-dot"></span>Today: <strong id="stat-pastor-associations-today">0</strong></div>
        </div>
        <div class="metric-card-footer">pastors_associations &bull; Total: <span id="stat-pastor-associations-total">--</span></div>
      </div>"""

    if old_card in content:
        content = content.replace(old_card, new_card)
        print(f"Added Pastor Associations card to {filepath}")
    else:
        print(f"Card insertion point not found in {filepath}")

    # 2. Update setStat calls
    old_setstat = """          setStat('stat-ministries', s.ministries, s.ministries_today);
          setStat('stat-orgs', s.organisations, s.organisations_today);
          setStat('stat-events', s.events_active, s.events_today);"""

    new_setstat = """          setStat('stat-ministries', s.ministries, s.ministries_today);
          setStat('stat-orgs', s.organisations, s.organisations_today);
          setStat('stat-pastor-associations', s.pastor_associations, s.pastor_associations_today);
          setStat('stat-events', s.events_active, s.events_today);"""

    if old_setstat in content:
        content = content.replace(old_setstat, new_setstat)
        print(f"Added setStat for pastor-associations in {filepath}")
    else:
        print(f"setStat insertion point not found in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for p in ['public.html', 'src/public.html', 'backend/public.html']:
    if os.path.exists(p):
        update_html(p)
print("Finished updating admin HTML files.")


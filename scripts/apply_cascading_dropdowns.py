import os, re

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

def add_disabled_to_select(html, ctrl_name, disabled_condition):
    # Pattern to find <select ... formControlName="ctrl_name" ...>
    # Note: don't add [disabled] if already present on this select
    pattern = rf'(<select\b[^>]*\bformControlName=["\']{ctrl_name}["\'][^>]*)>'
    def repl(m):
        tag = m.group(1)
        if '[disabled]' in tag:
            # Replace existing [disabled]
            tag = re.sub(r'\[disabled\]="[^"]*"', f'[disabled]="{disabled_condition}"', tag)
            return tag + '>'
        return f'{tag} [disabled]="{disabled_condition}">'
    return re.sub(pattern, repl, html)

def ensure_state_default_option(html, ctrl_name):
    # Ensure the first option is disabled selected with blank value if not already
    pattern = rf'(<select\b[^>]*\bformControlName=["\']{ctrl_name}["\'][^>]*>)'
    def repl(m):
        tag = m.group(1)
        return tag + '\n                                                        <option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి / Select State</option>'
    # check if option value="" already exists right after select
    # Only if <option value="" does not exist immediately after
    return html

# 1. believerregister
# fg: beliverform, ctrls: state_id, districts, constituencyname, mandals, panchayati
b_html = os.path.join(base, "believerregister", "believerregister.component.html")
with open(b_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "districts", "!beliverform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituencyname", "!beliverform.get('districts')?.value")
c = add_disabled_to_select(c, "mandals", "!beliverform.get('constituencyname')?.value")
c = add_disabled_to_select(c, "panchayati", "!beliverform.get('mandals')?.value")
# Ensure state_id option has disabled selected blank option
if '<option value="" selected disabled>' not in c[c.find('formControlName="state_id"'):c.find('formControlName="state_id"')+400]:
    c = c.replace('<select class="form-control" formControlName="state_id"\n                                                        (change)="onStateChange($event);"\n                                                        style="height:37px;width: 273px;">',
                  '<select class="form-control" formControlName="state_id"\n                                                        (change)="onStateChange($event);"\n                                                        style="height:37px;width: 273px;">\n                                                        <option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి / Select State</option>')
with open(b_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. addattacks
# fg: attacksform, ctrls: state_id, district_id, constituency_id, mandal_id, village_id
a_html = os.path.join(base, "addattacks", "addattacks.component.html")
with open(a_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!attacksform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!attacksform.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!attacksform.get('constituency_id')?.value")
c = add_disabled_to_select(c, "village_id", "!attacksform.get('mandal_id')?.value")
with open(a_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 3. studentregister
# fg: studentform, native: state_id, district_id, constituency_id, mandal_id, village_id
# res: res_state_id, resdistricts, resconstituencyname, resmandals, respanchayati
s_html = os.path.join(base, "studentregister", "studentregister.component.html")
with open(s_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!studentform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!studentform.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!studentform.get('constituency_id')?.value")
c = add_disabled_to_select(c, "village_id", "!studentform.get('mandal_id')?.value")

c = add_disabled_to_select(c, "resdistricts", "!studentform.get('res_state_id')?.value")
c = add_disabled_to_select(c, "resconstituencyname", "!studentform.get('resdistricts')?.value")
c = add_disabled_to_select(c, "resmandals", "!studentform.get('resconstituencyname')?.value")
c = add_disabled_to_select(c, "respanchayati", "!studentform.get('resmandals')?.value")
with open(s_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 4. ministryregister
# fg: ministryform, ctrls: state_id, district_id, constituency_id, mandal_id, panchayat_id
m_html = os.path.join(base, "ministryregister", "ministryregister.component.html")
with open(m_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!ministryform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!ministryform.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!ministryform.get('constituency_id')?.value")
c = add_disabled_to_select(c, "panchayat_id", "!ministryform.get('mandal_id')?.value")
with open(m_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 5. pastorregister
# fg: pastorform, ctrls: state_id, district_id, constituency_id, mandal_id, panchayat_id
p_html = os.path.join(base, "pastorregister", "pastorregister.component.html")
with open(p_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!pastorform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!pastorform.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!pastorform.get('constituency_id')?.value")
c = add_disabled_to_select(c, "panchayat_id", "!pastorform.get('mandal_id')?.value")
with open(p_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 6. churchregister
# fg: churchregsiterform, ctrls: state_id, district_id, constituency_id, mandal_id, village_id
ch_html = os.path.join(base, "churchregister", "churchregister.component.html")
with open(ch_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!churchregsiterform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!churchregsiterform.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!churchregsiterform.get('constituency_id')?.value")
c = add_disabled_to_select(c, "village_id", "!churchregsiterform.get('mandal_id')?.value")
with open(ch_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 7. organisationregister
# fg: independentorgainsationform, ctrls: state_id, districts, constituencyname, mandals, panchayati
org_html = os.path.join(base, "organisationregister", "organisationregister.component.html")
with open(org_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "districts", "!independentorgainsationform.get('state_id')?.value")
c = add_disabled_to_select(c, "constituencyname", "!independentorgainsationform.get('districts')?.value")
c = add_disabled_to_select(c, "mandals", "!independentorgainsationform.get('constituencyname')?.value")
c = add_disabled_to_select(c, "panchayati", "!independentorgainsationform.get('mandals')?.value")
with open(org_html, 'w', encoding='utf-8') as f:
    f.write(c)

# 8. pastorassociationregister
# fg: pastorsassociations, ctrls: state_id, district_id, constituency_id, mandal_id, village_id
pa_html = os.path.join(base, "pastorassociationregister", "pastorassociationregister.component.html")
with open(pa_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!pastorsassociations.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!pastorsassociations.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!pastorsassociations.get('constituency_id')?.value")
c = add_disabled_to_select(c, "village_id", "!pastorsassociations.get('mandal_id')?.value")
with open(pa_html, 'w', encoding='utf-8') as f:
    f.write(c)

# Group 2 (Issue 7 - Services view/filter):
# institute, marriages, jobs, business, organization
# fg: serachMeetingform, ctrls: state_id, district_id, constenncy_id, mandal_id, panchayati_id
for s_comp in ["institute", "marriages", "jobs", "business", "organization"]:
    sh_path = os.path.join(base, s_comp, f"{s_comp}.component.html")
    with open(sh_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = add_disabled_to_select(c, "district_id", "!serachMeetingform.get('state_id')?.value")
    c = add_disabled_to_select(c, "constenncy_id", "!serachMeetingform.get('district_id')?.value")
    c = add_disabled_to_select(c, "mandal_id", "!serachMeetingform.get('constenncy_id')?.value")
    c = add_disabled_to_select(c, "panchayati_id", "!serachMeetingform.get('mandal_id')?.value")
    with open(sh_path, 'w', encoding='utf-8') as f:
        f.write(c)

# Group 3 (Issue 9 - Add Services):
# addchurchtimings: addingchurchtimimngs -> state_id, district_id, constituency_id, mandal_id, church
act_html = os.path.join(base, "addchurchtimings", "addchurchtimings.component.html")
with open(act_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!addingchurchtimimngs.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!addingchurchtimimngs.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!addingchurchtimimngs.get('constituency_id')?.value")
c = add_disabled_to_select(c, "church", "!addingchurchtimimngs.get('mandal_id')?.value")
with open(act_html, 'w', encoding='utf-8') as f:
    f.write(c)

# addinstitute: addinginsututies -> state_id, district_id, constituency_id, mandal_id, village_id
ai_html = os.path.join(base, "addinstitute", "addinstitute.component.html")
with open(ai_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "district_id", "!addinginsututies.get('state_id')?.value")
c = add_disabled_to_select(c, "constituency_id", "!addinginsututies.get('district_id')?.value")
c = add_disabled_to_select(c, "mandal_id", "!addinginsututies.get('constituency_id')?.value")
c = add_disabled_to_select(c, "village_id", "!addinginsututies.get('mandal_id')?.value")
with open(ai_html, 'w', encoding='utf-8') as f:
    f.write(c)

# addbusiness: addingbusiness -> state_id, districtname, constituencyname, mandals, village_name
ab_html = os.path.join(base, "addbusiness", "addbusiness.component.html")
with open(ab_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "districtname", "!addingbusiness.get('state_id')?.value")
c = add_disabled_to_select(c, "constituencyname", "!addingbusiness.get('districtname')?.value")
c = add_disabled_to_select(c, "mandals", "!addingbusiness.get('constituencyname')?.value")
c = add_disabled_to_select(c, "village_name", "!addingbusiness.get('mandals')?.value")
with open(ab_html, 'w', encoding='utf-8') as f:
    f.write(c)

# addmarriages: addingmarriages -> state_id, districtname, constituencyname, mandals, village_name
am_html = os.path.join(base, "addmarriages", "addmarriages.component.html")
with open(am_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "districtname", "!addingmarriages.get('state_id')?.value")
c = add_disabled_to_select(c, "constituencyname", "!addingmarriages.get('districtname')?.value")
c = add_disabled_to_select(c, "mandals", "!addingmarriages.get('constituencyname')?.value")
c = add_disabled_to_select(c, "village_name", "!addingmarriages.get('mandals')?.value")
with open(am_html, 'w', encoding='utf-8') as f:
    f.write(c)

# addjobs: jobsadding -> state_id, districtname, constituencyname, mandals, village_name
aj_html = os.path.join(base, "addjobs", "addjobs.component.html")
with open(aj_html, 'r', encoding='utf-8') as f:
    c = f.read()
c = add_disabled_to_select(c, "districtname", "!jobsadding.get('state_id')?.value")
c = add_disabled_to_select(c, "constituencyname", "!jobsadding.get('districtname')?.value")
c = add_disabled_to_select(c, "mandals", "!jobsadding.get('constituencyname')?.value")
c = add_disabled_to_select(c, "village_name", "!jobsadding.get('mandals')?.value")
with open(aj_html, 'w', encoding='utf-8') as f:
    f.write(c)

print("HTML updates applied successfully.")

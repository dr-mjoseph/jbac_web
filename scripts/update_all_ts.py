import os, re

web_base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"
app_base = r"c:\Users\rajes\StudioProjects\jbac_app\src\pages"

# --- 1. Web addbusiness.component.ts ---
ab_path = os.path.join(web_base, "addbusiness", "addbusiness.component.ts")
with open(ab_path, 'r', encoding='utf-8') as f:
    ab_content = f.read()

# Add state_id to addingbusiness group if missing
if "addingbusiness = this.formBuilder.group({" in ab_content and "state_id:" not in ab_content[ab_content.find("addingbusiness = this.formBuilder.group({"):ab_content.find("addingbusiness = this.formBuilder.group({")+250]:
    ab_content = ab_content.replace(
        "this.addingbusiness = this.formBuilder.group({",
        "this.addingbusiness = this.formBuilder.group({\n      state_id: ['', [Validators.required]],"
    )

# Add state_id and state to postbusiness()
old_postbusiness_data = """      var data = {
        type: this.addingbusiness.value.type,"""
new_postbusiness_data = """      const sId = Number(this.addingbusiness.value.state_id) || (Number(this.addingbusiness.value.districtname) >= 31 && Number(this.addingbusiness.value.districtname) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        type: this.addingbusiness.value.type,"""

if old_postbusiness_data in ab_content:
    ab_content = ab_content.replace(old_postbusiness_data, new_postbusiness_data)

with open(ab_path, 'w', encoding='utf-8') as f:
    f.write(ab_content)
print("Updated web addbusiness.component.ts")


# --- 2. Web addmarriages.component.ts ---
am_path = os.path.join(web_base, "addmarriages", "addmarriages.component.ts")
with open(am_path, 'r', encoding='utf-8') as f:
    am_content = f.read()

if "addingmarriages = this.formBuilder.group({" in am_content and "state_id:" not in am_content[am_content.find("addingmarriages = this.formBuilder.group({"):am_content.find("addingmarriages = this.formBuilder.group({")+250]:
    am_content = am_content.replace(
        "this.addingmarriages = this.formBuilder.group({",
        "this.addingmarriages = this.formBuilder.group({\n      state_id: ['', [Validators.required]],"
    )

old_postmarriages_data = """      var data = {
        description: this.addingmarriages.value.description,"""
new_postmarriages_data = """      const sId = Number(this.addingmarriages.value.state_id) || (Number(this.addingmarriages.value.districtname) >= 31 && Number(this.addingmarriages.value.districtname) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        description: this.addingmarriages.value.description,"""

if old_postmarriages_data in am_content:
    am_content = am_content.replace(old_postmarriages_data, new_postmarriages_data)

with open(am_path, 'w', encoding='utf-8') as f:
    f.write(am_content)
print("Updated web addmarriages.component.ts")


# --- 3. Web addjobs.component.ts ---
aj_path = os.path.join(web_base, "addjobs", "addjobs.component.ts")
with open(aj_path, 'r', encoding='utf-8') as f:
    aj_content = f.read()

if "jobsadding = this.formBuilder.group({" in aj_content and "state_id:" not in aj_content[aj_content.find("jobsadding = this.formBuilder.group({"):aj_content.find("jobsadding = this.formBuilder.group({")+250]:
    aj_content = aj_content.replace(
        "this.jobsadding = this.formBuilder.group({",
        "this.jobsadding = this.formBuilder.group({\n      state_id: ['', [Validators.required]],"
    )

old_postjobs_data = """    const val = this.jobsadding.value;
    const data = {
      jobname: val.jobname,"""
new_postjobs_data = """    const val = this.jobsadding.value;
    const sId = Number(val.state_id) || (Number(val.districtname) >= 31 && Number(val.districtname) <= 63 ? 2 : 1);
    const data = {
      state_id: sId,
      state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
      jobname: val.jobname,"""

if old_postjobs_data in aj_content:
    aj_content = aj_content.replace(old_postjobs_data, new_postjobs_data)

with open(aj_path, 'w', encoding='utf-8') as f:
    f.write(aj_content)
print("Updated web addjobs.component.ts")


# --- 4. Web pastorassociationregister.component.ts ---
pa_path = os.path.join(web_base, "pastorassociationregister", "pastorassociationregister.component.ts")
with open(pa_path, 'r', encoding='utf-8') as f:
    pa_content = f.read()

old_pa_payload = """    const formVal = this.pastorsassociations.value;
    const payload = {
      ...formVal,"""
new_pa_payload = """    const formVal = this.pastorsassociations.value;
    const sId = Number(formVal.state_id) || (Number(formVal.district_id) >= 31 && Number(formVal.district_id) <= 63 ? 2 : 1);
    const payload = {
      ...formVal,
      state_id: sId,
      state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',"""

if old_pa_payload in pa_content:
    pa_content = pa_content.replace(old_pa_payload, new_pa_payload)

with open(pa_path, 'w', encoding='utf-8') as f:
    f.write(pa_content)
print("Updated web pastorassociationregister.component.ts")


# --- 5. Mobile addbussiness.ts ---
mob_ab = os.path.join(app_base, "addbussiness", "addbussiness.ts")
with open(mob_ab, 'r', encoding='utf-8') as f:
    c = f.read()
old_mob_ab = """      var data = {
        type: this.addingbusiness.value.type,"""
new_mob_ab = """      const sId = Number(this.addingbusiness.value.state_id) || (Number(this.addingbusiness.value.districtname) >= 31 && Number(this.addingbusiness.value.districtname) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        type: this.addingbusiness.value.type,"""
if old_mob_ab in c:
    c = c.replace(old_mob_ab, new_mob_ab)
    with open(mob_ab, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated mobile addbussiness.ts")


# --- 6. Mobile addmarriage.ts ---
mob_am = os.path.join(app_base, "addmarriage", "addmarriage.ts")
with open(mob_am, 'r', encoding='utf-8') as f:
    c = f.read()
old_mob_am = """      var data = {
        description: this.addingmarriages.value.description,"""
new_mob_am = """      const sId = Number(this.addingmarriages.value.state_id) || (Number(this.addingmarriages.value.districtname) >= 31 && Number(this.addingmarriages.value.districtname) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        description: this.addingmarriages.value.description,"""
if old_mob_am in c:
    c = c.replace(old_mob_am, new_mob_am)
    with open(mob_am, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated mobile addmarriage.ts")


# --- 7. Mobile addjobs.ts ---
mob_aj = os.path.join(app_base, "addjobs", "addjobs.ts")
with open(mob_aj, 'r', encoding='utf-8') as f:
    c = f.read()
old_mob_aj = """      var data = {
        jobname: this.jobsadding.value.jobname,"""
new_mob_aj = """      const sId = Number(this.jobsadding.value.state_id) || (Number(this.jobsadding.value.districtname) >= 31 && Number(this.jobsadding.value.districtname) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        jobname: this.jobsadding.value.jobname,"""
if old_mob_aj in c:
    c = c.replace(old_mob_aj, new_mob_aj)
    with open(mob_aj, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated mobile addjobs.ts")


# --- 8. Mobile pastor.ts ---
mob_p = os.path.join(app_base, "pastor", "pastor.ts")
with open(mob_p, 'r', encoding='utf-8') as f:
    c = f.read()
old_mob_p = """    else {
      this.service.postpastor(this.form.value).subscribe((res: any) => {"""
new_mob_p = """    else {
      const sId = Number(this.form.value.state_id) || (Number(this.form.value.district_id) >= 31 && Number(this.form.value.district_id) <= 63 ? 2 : 1);
      this.form.value.state_id = sId;
      this.form.value.state = sId === 2 ? 'Telangana' : 'Andhra Pradesh';
      this.service.postpastor(this.form.value).subscribe((res: any) => {"""
if old_mob_p in c:
    c = c.replace(old_mob_p, new_mob_p)
    with open(mob_p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated mobile pastor.ts")


# --- 9. Mobile association.ts ---
mob_as = os.path.join(app_base, "association", "association.ts")
with open(mob_as, 'r', encoding='utf-8') as f:
    c = f.read()
old_mob_as = """    else {
      this.service.postpastorassociationss(this.form.value).subscribe((res: any) => {"""
new_mob_as = """    else {
      const sId = Number(this.form.value.state_id) || (Number(this.form.value.district_id) >= 31 && Number(this.form.value.district_id) <= 63 ? 2 : 1);
      this.form.value.state_id = sId;
      this.form.value.state = sId === 2 ? 'Telangana' : 'Andhra Pradesh';
      this.service.postpastorassociationss(this.form.value).subscribe((res: any) => {"""
if old_mob_as in c:
    c = c.replace(old_mob_as, new_mob_as)
    with open(mob_as, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated mobile association.ts")

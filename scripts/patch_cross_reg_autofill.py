import re

# 1. Patch signup.component.ts
with open('src/app/jesus/signup/signup.component.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

autofill_methods = """
  existingUserData: any = null;

  checkExistingUser(event: any) {
    const val = event?.target?.value || '';
    const digits = String(val).replace(/\\D/g, '').slice(-10);
    if (digits.length === 10) {
      this.fetchAndAutofill(digits);
    }
  }

  fetchAndAutofill(phone: string) {
    this.service.lookupExistingUser(phone).subscribe((res: any) => {
      if (res && res.found && res.data) {
        this.existingUserData = res.data;
        const catName = res.source_category ? res.source_category.toUpperCase() : 'EXISTING';
        Swal.fire({
          icon: 'info',
          title: 'Existing Profile Found!',
          text: `Found existing registration under ${catName} category for ${res.data.name || phone}. Details have been auto-filled!`,
          timer: 3500,
          showConfirmButton: true
        });
        this.applyAutofillToActiveForm();
      }
    }, () => {});
  }

  loadCascadingData(districtId: any, constId: any, mandalId: any) {
    if (districtId) {
      this.service.getconsistencys().subscribe((res: any) => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == districtId);
        }
      });
    }
    if (constId) {
      this.service.getmandals().subscribe((res: any) => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == constId);
        }
      });
    }
    if (mandalId) {
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        if (res && res.data) {
          this.panchayati = res.data.filter((data: any) => !mandalId || data.mndl_id == mandalId);
        }
      });
    }
  }

  applyAutofillToActiveForm() {
    if (!this.existingUserData) return;
    const d = this.existingUserData;
    const phone = d.phone || d.mobile_number || '';
    const name = d.name || d.fname || d.studentname || d.pastorname || '';
    const stateId = String(d.state_id || '1');
    const distId = d.district_id ? String(d.district_id) : '';
    const constId = d.constituency_id ? String(d.constituency_id) : '';
    const mandId = d.mandal_id ? String(d.mandal_id) : '';
    const panchId = d.panchayat_id ? String(d.panchayat_id) : '';

    this.loadCascadingData(distId, constId, mandId);

    if (this.form_ind == 1) { // Believer
      this.beliverform.patchValue({
        state_id: stateId,
        fname: name,
        mobile_number: phone,
        whatsapp: d.whatsapp || phone,
        dob: d.dob || '',
        gender: d.gender || '',
        email: d.email || '',
        districts: distId,
        constituencyname: constId,
        mandals: mandId,
        panchayati: panchId,
        villagename: d.villagename || d.nativeplace || '',
        nativeplace: d.nativeplace || '',
        caste: d.caste || '',
        subcaste: d.subcaste || '',
        education: d.education || '',
        talent: d.talent || '',
        denomination_id: d.denomination_id ? String(d.denomination_id) : '',
        hobbies: d.hobbies || '',
        spirti: d.spirti || '',
        lifegoal: d.lifegoal || '',
        leadership: d.leadership || 'NO',
        leadertype: d.leadertype || '',
        generaltype: d.generaltype || '',
        wingtype: d.wingtype || ''
      });
    } else if (this.form_ind == 2) { // Student
      this.studentform.patchValue({
        state_id: stateId,
        studentname: name,
        number: phone,
        whatsappnumber: d.whatsapp || phone,
        fathername: d.fathername || '',
        gender: d.gender || '',
        dob: d.dob || '',
        study: d.education || '',
        district_id: distId,
        resdistricts: distId,
        constituency_id: constId,
        resconstituencyname: constId,
        mandal_id: mandId,
        resmandals: mandId,
        village_id: panchId,
        respanchayati: panchId,
        villagename: d.villagename || d.nativeplace || '',
        nativeplace: d.nativeplace || '',
        caste: d.caste || '',
        subcaste: d.subcaste || '',
        talent: d.talent || '',
        denomination_id: d.denomination_id ? String(d.denomination_id) : '',
        hobbies: d.hobbies || '',
        spirti: d.spirti || '',
        lifegoal: d.lifegoal || '',
        leadership: d.leadership || 'NO',
        leadertype: d.leadertype || '2',
        generaltype: d.generaltype || '',
        wingtype: d.wingtype || ''
      });
    } else if (this.form_ind == 4) { // Pastor
      this.pastorform.patchValue({
        state_id: stateId,
        pastorname: name,
        phonenumber: phone,
        whatsapp: d.whatsapp || phone,
        dob: d.dob || '',
        gender: d.gender || '',
        district_id: distId,
        constituency_id: constId,
        mandal_id: mandId,
        panchayat_id: panchId,
        villagename: d.villagename || d.nativeplace || '',
        nativeplace: d.nativeplace || '',
        caste: d.caste || '',
        subcaste: d.subcaste || '',
        education: d.education || '',
        talent: d.talent || '',
        denomination_id: d.denomination_id ? String(d.denomination_id) : '',
        lifegoal: d.lifegoal || '',
        leadership: d.leadership || 'NO',
        leadertype: d.leadertype || '',
        generaltype: d.generaltype || '',
        wingtype: d.wingtype || ''
      });
    } else if (this.form_ind == 3) { // Ministry
      this.ministryform.patchValue({
        state_id: stateId,
        headnmber: phone,
        district_id: distId,
        constituency_id: constId,
        mandal_id: mandId,
        panchayat_id: panchId,
        denomation: d.denomination_id ? String(d.denomination_id) : ''
      });
    } else if (this.form_ind == 8) { // Pastor Association
      this.pastorsassociations.patchValue({
        state_id: stateId,
        phonenumber: phone,
        district_id: distId,
        constituency_id: constId,
        mandal_id: mandId,
        village_id: panchId
      });
    }
  }
"""

if 'checkExistingUser(' not in ts:
    # Add inside class
    idx = ts.find('this.father = false;')
    if idx != -1:
        end_formshow = ts.find('}', idx) + 1
        ts = ts[:end_formshow] + "\n    if (this.existingUserData) { setTimeout(() => { this.applyAutofillToActiveForm(); }, 100); }\n" + autofill_methods + ts[end_formshow:]
        with open('src/app/jesus/signup/signup.component.ts', 'w', encoding='utf-8') as f:
            f.write(ts)
        print("Updated signup.component.ts with cross-category autofill")

# 2. Patch signup.component.html
with open('src/app/jesus/signup/signup.component.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)" to mobile_number, number, phonenumber
html = html.replace('formControlName="mobile_number"', 'formControlName="mobile_number" (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)"')
html = html.replace('formControlName="number"', 'formControlName="number" (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)"')
html = html.replace('formControlName="phonenumber"', 'formControlName="phonenumber" (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)"')
html = html.replace('formControlName="headnmber"', 'formControlName="headnmber" (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)"')

with open('src/app/jesus/signup/signup.component.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated signup.component.html with event bindings")


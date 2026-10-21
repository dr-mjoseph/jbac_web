import os
import re

def update_web_update_component():
    file_path = 'src/app/jesus/update/update.component.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update credential retrieval in constructor
    old_ctor_creds = """    this.categoryid = this.normalizeCategoryId(sessionStorage.getItem("category_id") || sessionStorage.getItem("category"));
    this.category = sessionStorage.getItem("category") || 'Member';
    this.name = sessionStorage.getItem("name");
    this.mobile_number = sessionStorage.getItem("mobile_number");"""
    
    new_ctor_creds = """    this.categoryid = this.normalizeCategoryId(
      sessionStorage.getItem("category_id") || localStorage.getItem("category_id") || 
      sessionStorage.getItem("category") || localStorage.getItem("category")
    );
    this.category = sessionStorage.getItem("category") || localStorage.getItem("category") || 'Member';
    this.name = sessionStorage.getItem("name") || localStorage.getItem("name");
    this.mobile_number = sessionStorage.getItem("mobile_number") || localStorage.getItem("mobile_number");"""
    
    if old_ctor_creds in content:
        content = content.replace(old_ctor_creds, new_ctor_creds)

    # 2. Update auth check in ngOnInit
    old_auth = """    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {"""
    new_auth = """    const auth = sessionStorage.getItem("auth_ind") || localStorage.getItem("auth_ind");
    if (!auth) {"""
    if old_auth in content:
        content = content.replace(old_auth, new_auth)

    # 3. Update geteditdtails data payload
    old_getedit = """  geteditdtails() {
    var data = {
      category_id: this.categoryid,
      usr_id: sessionStorage.getItem('usr_id'),
      mobile_number: sessionStorage.getItem('mobile_number')
    };"""
    new_getedit = """  geteditdtails() {
    var data = {
      category_id: this.categoryid,
      usr_id: sessionStorage.getItem('usr_id') || localStorage.getItem('usr_id'),
      mobile_number: sessionStorage.getItem('mobile_number') || localStorage.getItem('mobile_number')
    };"""
    if old_getedit in content:
        content = content.replace(old_getedit, new_getedit)

    # 4. Enhance cascading dropdown loading & repatching in geteditdtails
    old_cascade = """      // Pre-populate cascading location dropdowns
      const distId = this.details.district_id || this.details.districts || this.details.districtname || this.details.resdistricts;
      const constId = this.details.constituency_id || this.details.constituencyname || this.details.resconstituencyname;
      const mandalId = this.details.mandal_id || this.details.mandals || this.details.resmandals;

      if (distId) {
        this.service.getconsistencys().subscribe((cRes: any) => {
          this.constituency = cRes.data ? cRes.data.filter((d: any) => d.dstrct_id == distId) : [];
        });
      }
      if (constId) {
        this.service.getmandals().subscribe((mRes: any) => {
          this.mandals = mRes.data ? mRes.data.filter((d: any) => d.const_id == constId) : [];
        });
      }
      if (mandalId) {
        this.service.gepanchayatis(mandalId).subscribe((pRes: any) => {
          this.panchayati = pRes.data ? pRes.data.filter((d: any) => !mandalId || d.mndl_id == mandalId) : [];
        });
      }"""

    new_cascade = """      // Pre-populate cascading location dropdowns and re-patch controls so <select> options display saved values
      const distId = this.details.district_id || this.details.districts || this.details.districtname || this.details.resdistricts;
      const constId = this.details.constituency_id || this.details.constituencyname || this.details.resconstituencyname;
      const mandalId = this.details.mandal_id || this.details.mandals || this.details.resmandals;
      const panchId = this.details.panchayat_id || this.details.panchayati || this.details.village_id;

      if (distId) {
        this.service.getconsistencys().subscribe((cRes: any) => {
          this.constituency = cRes.data ? cRes.data.filter((d: any) => d.dstrct_id == distId) : [];
          if (constId) {
            this.beliverform.patchValue({ constituencyname: constId });
            this.pastorform.patchValue({ constituency_id: constId });
            this.churchregsiterform.patchValue({ constituency_id: constId });
            this.updateprofileministry.patchValue({ constituency_id: constId });
            this.studentform.patchValue({ constituency_id: constId });
            this.independentorgainsationform.patchValue({ constituencyname: constId });
            this.pastorsassociations.patchValue({ constituency_id: constId });
            this.entryform.patchValue({ constituency_id: constId });
          }
        });
      }
      if (constId) {
        this.service.getmandals().subscribe((mRes: any) => {
          this.mandals = mRes.data ? mRes.data.filter((d: any) => d.const_id == constId) : [];
          if (mandalId) {
            this.beliverform.patchValue({ mandals: mandalId });
            this.pastorform.patchValue({ mandal_id: mandalId });
            this.churchregsiterform.patchValue({ mandal_id: mandalId });
            this.updateprofileministry.patchValue({ mandal_id: mandalId });
            this.studentform.patchValue({ mandal_id: mandalId });
            this.independentorgainsationform.patchValue({ mandals: mandalId });
            this.pastorsassociations.patchValue({ mandal_id: mandalId });
            this.entryform.patchValue({ mandal_id: mandalId });
          }
        });
      }
      if (mandalId) {
        this.service.gepanchayatis(mandalId).subscribe((pRes: any) => {
          this.panchayati = pRes.data ? pRes.data.filter((d: any) => !mandalId || d.mndl_id == mandalId) : [];
          if (panchId) {
            this.beliverform.patchValue({ panchayati: panchId });
            this.pastorform.patchValue({ panchayat_id: panchId });
            this.churchregsiterform.patchValue({ village_id: panchId });
            this.updateprofileministry.patchValue({ panchayat_id: panchId });
            this.studentform.patchValue({ village_id: panchId });
            this.independentorgainsationform.patchValue({ panchayati: panchId });
            this.pastorsassociations.patchValue({ village_id: panchId });
            this.entryform.patchValue({ village_id: panchId });
          }
        });
      }"""

    if old_cascade in content:
        content = content.replace(old_cascade, new_cascade)

    # 5. Update edit methods to fall back to localStorage
    edit_methods = ['editpastor', 'editchurch', 'editindependentorgainsation', 'editindepastororgainsation', 'editbeliver', 'editstudent', 'postministryupdate', 'editdoctor', 'editentry']
    for m in edit_methods:
        content = re.sub(
            rf'(sessionStorage\.getItem\(\'usr_id\'\))',
            r"sessionStorage.getItem('usr_id') || localStorage.getItem('usr_id')",
            content
        )
        content = re.sub(
            rf'(sessionStorage\.getItem\(\'mobile_number\'\))',
            r"sessionStorage.getItem('mobile_number') || localStorage.getItem('mobile_number')",
            content
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated src/app/jesus/update/update.component.ts successfully!")

if __name__ == '__main__':
    update_web_update_component()

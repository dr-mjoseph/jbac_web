def patch_pastorregister():
    with open('src/app/jesus/pastorregister/pastorregister.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()

    if 'checkExistingUser(' not in ts:
        methods = """
  existingUserData: any = null;

  checkExistingUser(event: any) {
    const val = event?.target?.value || '';
    const digits = String(val).replace(/\\D/g, '').slice(-10);
    if (digits.length === 10) {
      this.service.lookupExistingUser(digits).subscribe((res: any) => {
        if (res && res.found && res.data) {
          this.existingUserData = res.data;
          const cat = res.source_category ? res.source_category.toUpperCase() : 'EXISTING';
          Swal.fire({
            icon: 'info',
            title: 'Existing Profile Found!',
            text: `Found registration under ${cat} category for ${res.data.name || digits}. Your details have been auto-filled!`,
            timer: 3500,
            showConfirmButton: true
          });
          const d = res.data;
          const distId = d.district_id ? String(d.district_id) : '';
          const constId = d.constituency_id ? String(d.constituency_id) : '';
          const mandId = d.mandal_id ? String(d.mandal_id) : '';
          const panchId = d.panchayat_id ? String(d.panchayat_id) : '';

          if (distId) {
            this.service.getconsistencys().subscribe((cRes: any) => {
              if (cRes && cRes.data) this.constituency = cRes.data.filter((x: any) => x.dstrct_id == distId);
            });
          }
          if (constId) {
            this.service.getmandals().subscribe((mRes: any) => {
              if (mRes && mRes.data) this.mandals = mRes.data.filter((x: any) => x.const_id == constId);
            });
          }
          if (mandId) {
            this.service.gepanchayatis(mandId).subscribe((pRes: any) => {
              if (pRes && pRes.data) this.panchayati = pRes.data.filter((x: any) => !mandId || x.mndl_id == mandId);
            });
          }

          if (this.pastorform) {
            this.pastorform.patchValue({
              state_id: String(d.state_id || '1'),
              pastorname: d.name || d.fname || '',
              phonenumber: digits,
              whatsapp: d.whatsapp || digits,
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
          }
        }
      }, () => {});
    }
  }
"""
        marker = "get o() { return this.pastorform.controls; }"
        idx = ts.find(marker)
        if idx != -1:
            ts = ts[:idx] + methods + "\n  " + ts[idx:]
            with open('src/app/jesus/pastorregister/pastorregister.component.ts', 'w', encoding='utf-8') as f:
                f.write(ts)
            print("Patched pastorregister.component.ts")

    with open('src/app/jesus/pastorregister/pastorregister.component.html', 'r', encoding='utf-8') as f:
        html = f.read()
    if '(input)="checkExistingUser($event)"' not in html:
        html = html.replace('formControlName="phonenumber"', 'formControlName="phonenumber" (input)="checkExistingUser($event)" (blur)="checkExistingUser($event)"')
        with open('src/app/jesus/pastorregister/pastorregister.component.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Patched pastorregister.component.html")

patch_pastorregister()


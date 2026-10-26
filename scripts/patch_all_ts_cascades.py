import os, re

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

def patch_file(rel_path, patches):
    full_path = os.path.join(base, rel_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old, new in patches:
        if old in content:
            content = content.replace(old, new)
            modified = True
        else:
            print(f"Warning: pattern not found in {rel_path}:\n{old[:60]}...")
            
    if modified:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully patched {rel_path}")
    else:
        print(f"No changes made to {rel_path}")

# 1. addchurchtimings.component.ts
patch_file("addchurchtimings/addchurchtimings.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""      var data = {
        service_name: this.addingchurchtimimngs.value.service_name,""",
     """      const sId = Number(this.addingchurchtimimngs.value.state_id) || (Number(this.addingchurchtimimngs.value.district_id) >= 31 && Number(this.addingchurchtimimngs.value.district_id) <= 63 ? 2 : 1);
      var data = {
        state_id: sId,
        state: sId === 2 ? 'Telangana' : 'Andhra Pradesh',
        service_name: this.addingchurchtimimngs.value.service_name,"""),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.addingchurchtimimngs.patchValue({ constituency_id: '', mandal_id: '', church: '' });
    this.constituency = [];
    this.mandals = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {

    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.addingchurchtimimngs.patchValue({ mandal_id: '', church: '' });
    this.mandals = [];
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {

    })
  }""")
])

# 2. addinstitute.component.ts
patch_file("addinstitute/addinstitute.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""      this.service.postinsututies(this.addinginsututies.value).subscribe((res: any) => {""",
     """      const sId = Number(this.addinginsututies.value.state_id) || (Number(this.addinginsututies.value.district_id) >= 31 && Number(this.addinginsututies.value.district_id) <= 63 ? 2 : 1);
      this.addinginsututies.value.state_id = sId;
      this.addinginsututies.value.state = sId === 2 ? 'Telangana' : 'Andhra Pradesh';
      this.service.postinsututies(this.addinginsututies.value).subscribe((res: any) => {"""),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.addinginsututies.patchValue({ constituency_id: '', mandal_id: '', village_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {

    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.addinginsututies.patchValue({ mandal_id: '', village_id: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {

    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
      }
    }, error => {

    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.addinginsututies.patchValue({ village_id: '' });
    this.panchayati = [];
    this.service.gepanchayatis().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
      }
    }, error => {

    })
  }""")
])

# 3. ministryregister.component.ts
patch_file("ministryregister/ministryregister.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.ministryform.patchValue({ constituency_id: '', mandal_id: '', panchayat_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.ministryform.patchValue({ mandal_id: '', panchayat_id: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.ministryform.patchValue({ panchayat_id: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""")
])

# 4. pastorregister.component.ts
patch_file("pastorregister/pastorregister.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.pastorform.patchValue({ constituency_id: '', mandal_id: '', panchayat_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.pastorform.patchValue({ mandal_id: '', panchayat_id: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.pastorform.patchValue({ panchayat_id: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""")
])

# 5. churchregister.component.ts
patch_file("churchregister/churchregister.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.churchregsiterform.patchValue({ constituency_id: '', mandal_id: '', village_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.churchregsiterform.patchValue({ mandal_id: '', village_id: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.churchregsiterform.patchValue({ village_id: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""")
])

# 6. organisationregister.component.ts
patch_file("organisationregister/organisationregister.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.independentorgainsationform.patchValue({ constituencyname: '', mandals: '', panchayati: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.independentorgainsationform.patchValue({ mandals: '', panchayati: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.independentorgainsationform.patchValue({ panchayati: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""")
])

# 7. pastorassociationregister.component.ts
patch_file("pastorassociationregister/pastorassociationregister.component.ts", [
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],"),
    ("""  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }""",
     """  getconstency(event: any) {
    var id = event.target.value;
    this.pastorsassociations.patchValue({ constituency_id: '', mandal_id: '', village_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }"""),
    ("""  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }""",
     """  getmandals(event: any) {
    var id = event.target.value;
    this.pastorsassociations.patchValue({ mandal_id: '', village_id: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }"""),
    ("""  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""",
     """  gepanchayati(event: any) {
    var id = event.target.value;
    this.pastorsassociations.patchValue({ village_id: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
    })
  }""")
])

# 8. studentregister.component.ts
patch_file("studentregister/studentregister.component.ts", [
    ("res_state_id: ['1'],", "res_state_id: ['', [Validators.required]],"),
    ("state_id: ['1', [Validators.required]],", "state_id: ['', [Validators.required]],")
])

print("Finished applying all TypeScript cascading patches.")

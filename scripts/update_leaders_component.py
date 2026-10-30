import re

def update_leaders_ts():
    with open('src/app/jesus/leaders/leaders.component.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update getLeaderswebsiteData logic
    old_block = """        if (res.data[0].leadertype == 1) {
          if (res.data[0].generaltype == 1) {
            this.generals = "District"
            this.general = "Constituency "
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency"
            this.general = "Mandal "
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal "
            this.general = "Village "
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village "
            this.general = ""
          }
          var data = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,
            district_id: res.data[0].district_id,
            constituency_id: res.data[0].constituency_id,
           
            mandal_id: res.data[0].mandal_id,
            panchayat_id: res.data[0].village_id
          }
          this.service.getLeaderswebsiteD(data).subscribe((result: any) => {
            const rawBelievers = result.data[0] || [];
            const rawPastors = result.data[2] || [];
            // Keep only approved (1) and unapproved (0 / null); hide rejected (2)
            this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
            this.contituencyname = result.data[1];
            this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
            console.log(this.belearr, this.contituencyname, this.pastorarr, 'leader')
          })
        } else if (res.data[0].leadertype == 2) {
          this.wingtypes = res.data[0].wingtypes
          if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal";
            this.general = "Village";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village";
            this.general = "";
          }
          var data4 = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,
            wingtype: res.data[0].wingtype,
            district_id: res.data[0].district_id,
            constituency_id: res.data[0].constituency_id,
            mandal_id: res.data[0].mandal_id,
            panchayat_id: res.data[0].village_id
          }
          this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {
            this.belearr = result.data[0];
            this.studentarr = result.data[1];
            this.pastorarr = result.data[2];

            console.log(this.belearr, this.studentarr, this.pastorarr, 'leader')

          })
        }"""

    new_block = """        if (res.data[0].leadertype == 1) {
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District ";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency ";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal ";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal ";
            this.general = "Village ";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village ";
            this.general = "";
          }
          var data = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,
            state_id: res.data[0].state_id || 1,
            district_id: res.data[0].district_id,
            constituency_id: res.data[0].constituency_id,
            mandal_id: res.data[0].mandal_id,
            panchayat_id: res.data[0].village_id
          }
          this.service.getLeaderswebsiteD(data).subscribe((result: any) => {
            const rawBelievers = result.data[0] || [];
            this.contituencyname = result.data[1];
            const rawPastors = result.data[2] || [];
            const rawStudents = result.data[3] || [];
            // Keep only approved (1) and unapproved (0 / null); hide rejected (2)
            this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
            this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
            this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
            console.log(this.belearr, this.contituencyname, this.pastorarr, this.studentarr, 'leader')
          })
        } else if (res.data[0].leadertype == 2) {
          this.wingtypes = res.data[0].wingtypes
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal";
            this.general = "Village";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village";
            this.general = "";
          }
          var data4 = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,
            wingtype: res.data[0].wingtype,
            state_id: res.data[0].state_id || 1,
            district_id: res.data[0].district_id,
            constituency_id: res.data[0].constituency_id,
            mandal_id: res.data[0].mandal_id,
            panchayat_id: res.data[0].village_id
          }
          this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {
            const rawBelievers = result.data[0] || [];
            const rawStudents = result.data[1] || [];
            const rawPastors = result.data[2] || [];
            this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
            this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
            this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
            console.log(this.belearr, this.studentarr, this.pastorarr, 'wing leader')
          })
        }"""

    if old_block in content:
        content = content.replace(old_block, new_block)
        print("Updated getLeaderswebsiteData logic in leaders.component.ts")
    else:
        print("Warning: old_block in leaders.component.ts not found directly")

    # 2. Update getSubordinateSubtitle
    old_sub = """  getSubordinateSubtitle(): string {
    if (this.myresdata == 1) {
      return 'నియోజకవర్గాల వారీగా (Constituency-wise)';
    } else if (this.myresdata == 2) {
      return 'మండలాల వారీగా (Mandal-wise)';
    } else if (this.myresdata == 3) {
      return 'గ్రామ / వార్డుల వారీగా (Village / Ward-wise)';
    }
    return '';
  }"""

    new_sub = """  getSubordinateSubtitle(): string {
    if (this.myresdata == 0) {
      return 'జిల్లాల వారీగా (District-wise)';
    } else if (this.myresdata == 1) {
      return 'నియోజకవర్గాల వారీగా (Constituency-wise)';
    } else if (this.myresdata == 2) {
      return 'మండలాల వారీగా (Mandal-wise)';
    } else if (this.myresdata == 3) {
      return 'గ్రామ / వార్డుల వారీగా (Village / Ward-wise)';
    }
    return '';
  }"""

    if old_sub in content:
        content = content.replace(old_sub, new_sub)
        print("Updated getSubordinateSubtitle in leaders.component.ts")

    # 3. Update getDetailedLeaderStatus in leaders.component.ts
    old_status = """    // 2. Check General Leadership (leadertype == '1' or generaltype or ward/subward)
    const gType = String(x.generaltype || '');

    if (gType === '1') {
      return 'జిల్లా లీడర్ (District Leader)';
    }"""

    new_status = """    // 2. Check General Leadership (leadertype == '1' or generaltype or ward/subward)
    const gType = String(x.generaltype || '').trim();

    if (gType === '0' || gType.toLowerCase().includes('state')) {
      return 'రాష్ట్ర లీడర్ (State Leader)';
    }
    if (gType === '1' || gType.toLowerCase().includes('dist')) {
      return 'జిల్లా లీడర్ (District Leader)';
    }
    if (gType === '2' || gType.toLowerCase().includes('const')) {
      return 'నియోజకవర్గ లీడర్ (Constituency Leader)';
    }
    if (gType === '3' || gType.toLowerCase().includes('mandal') || gType.toLowerCase().includes('municip')) {
      return 'మండల లీడర్ (Mandal Leader)';
    }
    if (gType === '4' || gType.toLowerCase().includes('panchayat') || gType.toLowerCase().includes('village')) {
      return 'గ్రామ / పంచాయితీ లీడర్ (Panchayat Leader)';
    }
    if (gType === 'College Level') {
      return 'కాలేజ్ లీడర్ (College Leader)';
    }
    if (gType === 'Church Level') {
      return 'చర్చి లీడర్ (Church Leader)';
    }
    if (gType === 'Branch Level') {
      return 'బ్రాంచ్ లీడర్ (Branch Leader)';
    }
    if (gType === 'Section / Class Level') {
      return 'సెక్షన్ / క్లాస్ లీడర్ (Class Leader)';
    }"""

    if old_status in content:
        content = content.replace(old_status, new_status)
        print("Updated getDetailedLeaderStatus in leaders.component.ts")

    with open('src/app/jesus/leaders/leaders.component.ts', 'w', encoding='utf-8') as f:
        f.write(content)

def update_leaders_html():
    with open('src/app/jesus/leaders/leaders.component.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update buttons
    old_buttons = """        <div class="row justify-content-center">
            <div class="col-lg-4 col-md-6 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 1 ? '#00548F' : '#f0f4f8'" [style.color]="formshow == 1 ? '#fff' : '#00548F'" style="font-weight: 600; border: 2px solid #00548F; padding: 12px 24px; border-radius: 8px;" (click)="make(1)">
                    👥 Believers Requests (విశ్వాసులు)
                </button>
            </div>
            <div class="col-lg-4 col-md-6 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 3 ? '#8b0000' : '#fcf0f0'" [style.color]="formshow == 3 ? '#fff' : '#8b0000'" style="font-weight: 600; border: 2px solid #8b0000; padding: 12px 24px; border-radius: 8px;" (click)="make(3)">
                    ✝️ Pastors Requests (పాస్టర్లు)
                </button>
            </div>
        </div>"""

    new_buttons = """        <div class="row justify-content-center">
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 1 ? '#00548F' : '#f0f4f8'" [style.color]="formshow == 1 ? '#fff' : '#00548F'" style="font-weight: 600; border: 2px solid #00548F; padding: 12px 24px; border-radius: 8px;" (click)="make(1)">
                    👥 Believers Requests (విశ్వాసులు)
                </button>
            </div>
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 3 ? '#8b0000' : '#fcf0f0'" [style.color]="formshow == 3 ? '#fff' : '#8b0000'" style="font-weight: 600; border: 2px solid #8b0000; padding: 12px 24px; border-radius: 8px;" (click)="make(3)">
                    ✝️ Pastors Requests (పాస్టర్లు)
                </button>
            </div>
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 2 ? '#1e7e34' : '#f0fdf4'" [style.color]="formshow == 2 ? '#fff' : '#1e7e34'" style="font-weight: 600; border: 2px solid #1e7e34; padding: 12px 24px; border-radius: 8px;" (click)="make(2)">
                    🎓 Students Requests (విద్యార్థులు)
                </button>
            </div>
        </div>"""

    if old_buttons in content:
        content = content.replace(old_buttons, new_buttons)
        print("Updated buttons in leaders.component.html")

    # 2. Add Students Requests table
    student_table = """
    <!-- Students Requests Table -->
    <div *ngIf="formshow == 2">
        <section class="contact main-blog">
            <div class="container">
                <h3 style="text-align: center; margin-bottom: 20px; color: #1e7e34;">
                    {{general != '' ? general + ' Level Student Leaders Requests' : 'Student Leaders Requests'}} ({{getSubordinateSubtitle()}})
                </h3>
                <div class="table-responsive" style="background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden;">
                    <table class="table table-hover table-bordered mb-0" style="width: 100%; border-collapse: collapse;">
                        <thead style="background-color: #1e7e34; color: #fff;">
                            <tr>
                                <th style="padding: 12px; text-align: center; width: 60px;">S No.</th>
                                <th style="padding: 12px;">పేరు (Name)</th>
                                <th style="padding: 12px;">నాయకత్వ స్థాయి</th>
                                <th style="padding: 12px;">నియోజకవర్గం</th>
                                <th style="padding: 12px;">మండలం</th>
                                <th style="padding: 12px;">పంచాయితీ / గ్రామం</th>
                                <th style="padding: 12px; text-align: center;">ఫోన్ కాల్</th>
                                <th style="padding: 12px; text-align: center; width: 140px;">నిర్ణయం</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let x of studentarr; let i = index">
                                <td style="text-align: center; vertical-align: middle; font-weight: 600;">{{i+1}}</td>
                                <td style="vertical-align: middle; font-weight: 600;">{{x.fname}} {{x.lname || ''}}</td>
                                <td style="vertical-align: middle;">
                                    <span style="display: inline-block; padding: 5px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; background-color: #e8f5e9; color: #1e7e34; border: 1px solid #c8e6c9;">
                                        {{getDetailedLeaderStatus(x)}}
                                    </span>
                                </td>
                                <td style="vertical-align: middle;">{{x.constituency_name || 'N/A'}}</td>
                                <td style="vertical-align: middle;">{{x.mandal_name || 'N/A'}}</td>
                                <td style="vertical-align: middle;">{{x.panchayat_name || x.nativeplace || 'N/A'}}</td>
                                <td style="text-align: center; vertical-align: middle;">
                                    <a *ngIf="x.mobile_number" href="tel:{{x.mobile_number}}" style="color: #28a745; font-size: 18px;" title="Call {{x.mobile_number}}">
                                        📞
                                    </a>
                                </td>
                                <td style="text-align: center; vertical-align: middle;">
                                    <div *ngIf="x.approval_ind == 1" style="color: #1e7e34; font-weight: bold; font-size: 13px;">
                                        ✓ Approved
                                    </div>
                                    <div *ngIf="x.approval_ind != 1" style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
                                        <button class="btn btn-sm" style="background-color: #1e7e34; color: #fff; font-size: 12px; padding: 4px 12px; border-radius: 4px; border: none; width: 90px;" (click)="confirm(2, x.id)">
                                            అనుమతించు
                                        </button>
                                        <button class="btn btn-sm" style="background-color: #8b0000; color: #fff; font-size: 12px; padding: 4px 12px; border-radius: 4px; border: none; width: 90px;" (click)="deleteAlert(2, x.id)">
                                            తిరస్కరించు
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr *ngIf="!studentarr || studentarr.length == 0">
                                <td colspan="8" style="text-align: center; padding: 30px; font-weight: 600; color: #64748b;">
                                    ℹ️ ఎటువంటి విద్యార్థి అభ్యర్థనలు లేవు / No Student Requests
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br>
            </div>
        </section>
    </div>
"""

    if '<!-- Students Requests Table -->' not in content:
        # Append before the last </div>
        last_div_idx = content.rfind('</div>')
        if last_div_idx != -1:
            content = content[:last_div_idx] + student_table + content[last_div_idx:]
            print("Added Students Requests table in leaders.component.html")

    with open('src/app/jesus/leaders/leaders.component.html', 'w', encoding='utf-8') as f:
        f.write(content)

update_leaders_ts()
update_leaders_html()


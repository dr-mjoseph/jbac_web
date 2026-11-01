import os

def update_leaders_ts():
    filepath = os.path.join("src", "app", "jesus", "leaders", "leaders.component.ts")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new class body from fields up to deleteAlert
    old_start = "export class LeadersComponent {"
    new_methods = """export class LeadersComponent {
  leders_array: any;
  category_id: any;
  profiledata: any = [];
  belearr: any = [];
  studentarr: any = [];
  pastorarr: any = [];
  contituencyname: any;
  contituencynamebel: any;
  formshow: any = 1;
  selectedUserType: string = 'believer';
  general: any = '';
  generals: any = '';
  leaders: any = '';
  wingtypes: any = '';
  leaderid: any;
  myresdata: any;
  cachedUserRes: any = null;

  constructor(private service: ServiceService, private router: Router) {
    this.formshow = 1;
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required");
      this.router.navigate(['/']);
      return;
    }

    this.category_id = sessionStorage.getItem("category_id");
    // Pre-set formshow and selectedUserType based on stored category
    if (this.category_id === '4' || this.category_id === '3') {
      this.selectedUserType = 'pastor';
      this.formshow = 3;
    } else if (this.category_id === '2') {
      this.selectedUserType = 'student';
      this.formshow = 2;
    } else {
      this.selectedUserType = 'believer';
      this.formshow = 1;
    }

    this.getLeaderswebsiteData();
  }

  getLeaderswebsiteData(forceUserType?: string) {
    const storedCat = sessionStorage.getItem("category_id");
    const storedUsrId = sessionStorage.getItem("usr_id");

    var data = {
      "category": storedCat,
      "usr_id": storedUsrId
    };

    this.service.getUserMainData(data).subscribe((res: any) => {
      if (!res || !res.data || res.data.length == 0) {
        Swal.fire("Your Not a General Leader (Or) Wing leader");
        this.router.navigate(['/']);
        return;
      }

      this.cachedUserRes = res.data[0];
      const userRole = res.data[0].role; // 'pastor', 'student', 'believer'

      if (forceUserType) {
        this.selectedUserType = forceUserType;
        if (forceUserType === 'pastor') this.formshow = 3;
        else if (forceUserType === 'student') this.formshow = 2;
        else this.formshow = 1;
      } else {
        if (userRole === 'pastor' || storedCat === '4' || storedCat === '3') {
          this.selectedUserType = 'pastor';
          this.formshow = 3;
        } else if (userRole === 'student' || storedCat === '2') {
          this.selectedUserType = 'student';
          this.formshow = 2;
        } else {
          this.selectedUserType = 'believer';
          this.formshow = 1;
        }
      }

      this.fetchSubordinateRequests();
    });
  }

  fetchSubordinateRequests() {
    if (!this.cachedUserRes) return;
    const u = this.cachedUserRes;
    this.leaderid = u.leadertype;
    if (u.leadertype == 1) {
      this.leaders = "Leader ";
    } else if (u.leadertype == 2) {
      this.leaders = "Wing ";
    }
    this.myresdata = u.generaltype;

    if (u.leadertype == 1) {
      if (u.generaltype == 0) {
        this.generals = "State";
        this.general = "District ";
      } else if (u.generaltype == 1) {
        this.generals = "District";
        this.general = "Constituency ";
      } else if (u.generaltype == 2) {
        this.generals = "Constituency";
        this.general = "Mandal ";
      } else if (u.generaltype == 3) {
        this.generals = "Mandal ";
        this.general = "Panchayat ";
      } else if (u.generaltype == 4) {
        this.generals = "Panchayat ";
        this.general = "Ward ";
      } else if (u.generaltype == 5 || u.generaltype == 6) {
        this.generals = "Ward ";
        this.general = "";
      }

      var data = {
        "usr_id": sessionStorage.getItem("usr_id"),
        "category_id": sessionStorage.getItem("category_id"),
        "user_type": this.selectedUserType,
        "leadertype": u.leadertype,
        "wingtypes": u.wingtypes,
        "generaltype": u.generaltype,
        state_id: u.state_id || 1,
        district_id: u.district_id,
        constituency_id: u.constituency_id,
        mandal_id: u.mandal_id,
        panchayat_id: u.village_id
      };

      this.service.getLeaderswebsiteD(data).subscribe((result: any) => {
        const rawBelievers = result.data[0] || [];
        this.contituencyname = result.data[1];
        const rawPastors = result.data[2] || [];
        const rawStudents = result.data[3] || [];

        // USER TYPE ISOLATION: Display ONLY selected user type; clear others
        if (this.selectedUserType === 'pastor') {
          this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.studentarr = [];
        } else if (this.selectedUserType === 'student') {
          this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.pastorarr = [];
        } else {
          this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.pastorarr = [];
          this.studentarr = [];
        }
      });
    } else if (u.leadertype == 2) {
      this.wingtypes = u.wing_name || u.wingtypes || "";
      if (u.generaltype == 0) {
        this.generals = "State";
        this.general = "District";
      } else if (u.generaltype == 1) {
        this.generals = "District";
        this.general = "Constituency";
      } else if (u.generaltype == 2) {
        this.generals = "Constituency";
        this.general = "Mandal";
      } else if (u.generaltype == 3) {
        this.generals = "Mandal";
        this.general = "Panchayat";
      } else if (u.generaltype == 4) {
        this.generals = "Panchayat";
        this.general = "Ward";
      } else if (u.generaltype == 5 || u.generaltype == 6) {
        this.generals = "Ward";
        this.general = "";
      }

      var data4 = {
        "usr_id": sessionStorage.getItem("usr_id"),
        "category_id": sessionStorage.getItem("category_id"),
        "user_type": this.selectedUserType,
        "leadertype": u.leadertype,
        "wingtypes": u.wingtypes,
        "generaltype": u.generaltype,
        wingtype: u.wingtype,
        state_id: u.state_id || 1,
        district_id: u.district_id,
        constituency_id: u.constituency_id,
        mandal_id: u.mandal_id,
        panchayat_id: u.village_id
      };

      this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {
        const rawBelievers = result.data[0] || [];
        const rawStudents = result.data[1] || [];
        const rawPastors = result.data[2] || [];

        // USER TYPE ISOLATION: Display ONLY selected user type; clear others
        if (this.selectedUserType === 'pastor') {
          this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.studentarr = [];
        } else if (this.selectedUserType === 'student') {
          this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.pastorarr = [];
        } else {
          this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.pastorarr = [];
          this.studentarr = [];
        }
      });
    }
  }

  make(id: any) {
    this.formshow = id;
    if (id == 1) {
      this.selectedUserType = 'believer';
      this.pastorarr = [];
      this.studentarr = [];
    } else if (id == 3) {
      this.selectedUserType = 'pastor';
      this.belearr = [];
      this.studentarr = [];
    } else if (id == 2) {
      this.selectedUserType = 'student';
      this.belearr = [];
      this.pastorarr = [];
    }
    this.fetchSubordinateRequests();
  }"""

    # Replace from old_start up to deleteAlert(
    idx_start = content.find("export class LeadersComponent {")
    idx_delete = content.find("  deleteAlert(id: any, index: any) {")

    if idx_start != -1 and idx_delete != -1:
        updated = content[:idx_start] + new_methods + "\n\n" + content[idx_delete:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated)
        print(f"[SUCCESS] Updated {filepath}")
    else:
        print("[ERROR] Could not find insertion boundaries in leaders.component.ts")

def update_leaders_html():
    filepath = os.path.join("src", "app", "jesus", "leaders", "leaders.component.html")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add active filter badge right after the button container
    target_str = """        </div>
    </div>

    <br>"""

    replacement_str = """        </div>
    </div>

    <!-- Active User Type Filter Indicator -->
    <div class="container mb-3" style="text-align: center;">
        <span class="badge" style="font-size: 0.92rem; padding: 8px 18px; border-radius: 20px; font-weight: 600;"
            [ngStyle]="{
                'background-color': formshow == 1 ? '#e0f2fe' : (formshow == 3 ? '#fee2e2' : '#dcfce7'),
                'color': formshow == 1 ? '#0369a1' : (formshow == 3 ? '#991b1b' : '#166534'),
                'border': '1px solid ' + (formshow == 1 ? '#7dd3fc' : (formshow == 3 ? '#fca5a5' : '#86efac'))
            }">
            📌 ఎంచుకున్న యూజర్ రకం (Selected User Type): 
            <b>{{ formshow == 1 ? 'విశ్వాసులు (Believers)' : (formshow == 3 ? 'పాస్టర్లు (Pastors)' : 'విద్యార్థులు (Students)') }}</b>
            — ఇతర యూజర్ కేటగిరీలు తొలగించబడ్డాయి (Other user types isolated)
        </span>
    </div>

    <br>"""

    if target_str in content and "Active User Type Filter Indicator" not in content:
        content = content.replace(target_str, replacement_str, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[SUCCESS] Updated {filepath}")
    else:
        print("[INFO] HTML already updated or target pattern not matched.")

update_leaders_ts()
update_leaders_html()


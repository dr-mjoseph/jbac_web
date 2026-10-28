import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.css']
})
export class LeadersComponent {
  leders_array: any;
  category_id: any;
  profiledata: any = [];
  belearr: any;
  studentarr: any;
  pastorarr: any;
  contituencyname: any;
  contituencynamebel: any;
  formshow: any;
  general: any;
  generals: any;
  leaders: any;
  wingtypes: any;
  leaderid: any;
  myresdata: any;
  constructor(private service: ServiceService, private router: Router) {
    this.formshow = "1";
  }

  ngOnInit(): void {

    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }

    this.getLeaderswebsiteData();
    this.category_id = sessionStorage.getItem("category_id");
  }

  getLeaderswebsiteData() {
    var data = {
      "category": sessionStorage.getItem("category_id"),
      "usr_id": sessionStorage.getItem("usr_id")
    }
    this.service.getUserMainData(data).subscribe((res: any) => {
      if (res.data.length == "0") {
        Swal.fire("Your Not a General Leader (Or) Wing leader");
        this.router.navigate(['/']);
      } else {
        this.leaderid = res.data[0].leadertype
        if (res.data[0].leadertype == 1) {
          this.leaders = "Leader "
        } else if (res.data[0].leadertype == 2) {
          this.leaders = "Wing "
        }
        this.myresdata = res.data[0].generaltype
        if (res.data[0].leadertype == 1) {
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
            this.belearr = result.data[0];
            this.contituencyname = result.data[1];
            // this.studentarr = result.data[1];
            this.pastorarr = result.data[2];
         //   this.contituencynamebel = result.data[3];
          // console.log(this.pastorarr);

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
        }
      }
    })
  }

  deleteAlert(id: any, index: any) {
    Swal.fire({
      title: 'Are you sure to rejected ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Rejected it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteleader(id, index);
      }
    })
  }

  deleteleader(id: any, index: any) {
    var data = {
      tableid: id,
      id: index,
      leadertype: this.leaderid
    }
    this.service.deleteleaders(data).subscribe(res => {
      this.getLeaderswebsiteData();
    },
      error => {
      });
  }

  make(id: any) {
    this.formshow = id
  }


  confirm(id: any, index: any) {
    Swal.fire({
      title: 'Are you sure to Confirm ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.conformleader(id, index);
      }
    })
  }

  
  getDetailedLeaderStatus(x: any): string {
    if (!x) return 'లీడర్ (Leader)';

    // 1. Check Wing Leadership (leadertype == '2' or has wingtype / wingtypes)
    const isWing = String(x.leadertype) === '2' || (x.wingtype && x.wingtype !== 'null' && String(x.wingtype).trim() !== '') || (x.wingtypes && x.wingtypes !== 'null' && String(x.wingtypes).trim() !== '');

    let wingTitle = '';
    if (x.wing_name && x.wing_name !== 'null' && String(x.wing_name).trim()) {
      wingTitle = String(x.wing_name).trim();
    } else if (String(x.wingtype) === '1') {
      wingTitle = 'స్టూడెంట్ వింగ్ (Student Wing)';
    }

    let subWing = '';
    if (x.wingtypes && x.wingtypes !== 'null' && String(x.wingtypes).trim()) {
      const wt = String(x.wingtypes).trim();
      if (wt.toLowerCase() === 'meediareporters' || wt.toLowerCase() === 'mediareporters') {
        subWing = 'మీడియా రిపోర్టర్స్ (Media)';
      } else if (wt.toLowerCase() === 'socialmedia') {
        subWing = 'సోషల్ మీడియా (Social Media)';
      } else if (wt.toLowerCase() === 'papermedia') {
        subWing = 'పేపర్ మీడియా (Paper Media)';
      } else if (wt.toLowerCase() === 'driver') {
        subWing = 'డ్రైవర్స్ వింగ్ (Drivers)';
      } else {
        subWing = wt;
      }
    }

    if (isWing) {
      if (wingTitle && subWing) {
        return `${wingTitle} - ${subWing} లీడర్`;
      }
      if (wingTitle) {
        return wingTitle.includes('లీడర్') ? wingTitle : `${wingTitle} లీడర్`;
      }
      if (subWing) {
        return `${subWing} లీడర్`;
      }
      return 'వింగ్ లీడర్ (Wing Leader)';
    }

    // 2. Check General Leadership (leadertype == '1' or generaltype or ward/subward)
    const gType = String(x.generaltype || '');

    if (gType === '1') {
      return 'జిల్లా లీడర్ (District Leader)';
    }
    if (gType === '2') {
      return 'నియోజకవర్గ లీడర్ (Constituency Leader)';
    }
    if (gType === '3') {
      return 'మండల లీడర్ (Mandal Leader)';
    }
    if (gType === '4') {
      return 'గ్రామ / పంచాయితీ లీడర్ (Panchayat Leader)';
    }
    if (gType === '5') {
      const wardNum = x.wardnumber && x.wardnumber !== 'null' && String(x.wardnumber).trim() ? ` నెం. ${x.wardnumber}` : '';
      return `వార్డు${wardNum} లీడర్ (Ward Leader)`;
    }
    if (gType === '6') {
      const sub = x.subward && x.subward !== 'null' && String(x.subward).trim() ? ` (${x.subward})` : '';
      return `సబ్ వార్డు${sub} లీడర్ (Sub-Ward Leader)`;
    }

    // Fallbacks if generaltype is unset but subward / wardnumber are populated
    if (x.subward && x.subward !== 'null' && String(x.subward).trim()) {
      return `సబ్ వార్డు (${x.subward}) లీడర్`;
    }
    if (x.wardnumber && x.wardnumber !== 'null' && String(x.wardnumber).trim()) {
      return `వార్డు నెం. ${x.wardnumber} లీడర్`;
    }

    return 'జనరల్ లీడర్ (General Leader)';
  }

  getLeaderBadgeStyle(x: any): { [key: string]: string } {
    const isWing = String(x?.leadertype) === '2' || (x?.wingtype && x.wingtype !== 'null' && String(x.wingtype).trim() !== '') || (x?.wingtypes && x.wingtypes !== 'null' && String(x.wingtypes).trim() !== '');
    const gType = String(x?.generaltype || '');

    if (isWing) {
      return {
        'background-color': '#ede9fe',
        'color': '#6d28d9',
        'border': '1px solid #c4b5fd'
      };
    }
    if (gType === '1' || gType === '2') {
      return {
        'background-color': '#e0f2fe',
        'color': '#0369a1',
        'border': '1px solid #7dd3fc'
      };
    }
    if (gType === '3') {
      return {
        'background-color': '#e0f7fa',
        'color': '#00695c',
        'border': '1px solid #80deea'
      };
    }
    if (gType === '4') {
      return {
        'background-color': '#dcfce7',
        'color': '#15803d',
        'border': '1px solid #86efac'
      };
    }
    if (gType === '5' || gType === '6') {
      return {
        'background-color': '#fef3c7',
        'color': '#b45309',
        'border': '1px solid #fcd34d'
      };
    }
    return {
      'background-color': '#f1f5f9',
      'color': '#475569',
      'border': '1px solid #cbd5e1'
    };
  }

  getLevelName(level: any): string {
    return this.getDetailedLeaderStatus({ generaltype: level });
  }

  conformleader(id: any, index: any) {
    var data = {
      tableid: id,
      id: index,
      leadertype: this.leaderid
    }
    this.service.updateconsistency(data).subscribe(res => {
      this.getLeaderswebsiteData();
    },
      error => {
      });
  }

  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  personaldata() {
    var data = {
      usr_id: sessionStorage.getItem('usr_id'),
      category_id: sessionStorage.getItem('category_id'),
    }
    this.service.getuserprofilereport(data).subscribe((res: any) => {
      this.profiledata = res.data[0];
    })
  }

    ///////////////////mobile view///////////////
    login: boolean = true;
    notlogin: boolean = false;
    name: any;
    ngAfterContentInit() {
      this.service.getloginstatus.subscribe((res: any) => {
        if (res == '1') {
          console.log('tru')
          this.login = false;
          this.notlogin = true;
          this.name = sessionStorage.getItem('name');
        } else if (res == '2') {
          console.log('false')
          this.login = true;
          this.notlogin = false;
        }
      })
    }
  
    checklogin() {
      if ((sessionStorage.getItem('usr_id')) == null) {
        this.login = true;
      } else {
        this.login = false;
        this.notlogin = true;
        this.name = sessionStorage.getItem('name');
      }
    }
  
    logout() {
      Swal.fire({
        title: 'Are you sure ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Logout Sucessfully')
          sessionStorage.clear();
          this.router.navigate(['/gallery']);
          this.service.getlgstatus('2')
        }
      })
    }
  
  
    alert() {
      Swal.fire('Hey user!', 'please Login', 'info');
      this.router.navigate(['/login']);
    }
}

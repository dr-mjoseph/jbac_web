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

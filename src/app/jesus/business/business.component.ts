import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent {
  serachMeetingform: FormGroup;
  searchdenomation: FormGroup;
  form_ind: any;
  youth: any;
  revival: any;
  showSpinner: boolean = false;
  women: any;
  pastor: any;
  childern: any;
  musical: any;
  mandals: any;
  constituency: any;
  districts: any;
  searchevents: any;
  mettingtype: any;
  denomation: any;
  ministryname: any;
  titles: any;
  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {
    this.serachMeetingform = this.fromb.group({
      district_id: ['', [Validators.required]],
      constenncy_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      panchayati_id: ['', [Validators.required]],
    })
    this.searchdenomation = this.fromb.group({
      mettingtype: ['', [Validators.required]],
      denomation: ['', [Validators.required]],
      title: ['', [Validators.required]],
      ministry_id: ['', [Validators.required]],
    })


    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }
  }



  ngOnInit(): void {

    this.getdistric();
    this.searechevents();
    this.getadds();
    this.getdenomations();
    this.getbeliver();
  }

  getdistric() {
    this.service.getdistrict().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.districts = res.data;
      }
    }, error => {
      console.log(error);
    })
  }

  formshow(id: any) {
    this.form_ind = id
  }
  getbeliver() {
    this.service.getbeliversdata().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.ministryname = res.data;
      }
    }, error => {
      console.log(error);
    })
  }


  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }

  proofmodalDismis() {
    this.modalService.dismissAll()
  }


  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
  }


  adds: any;
  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
      console.log(res.data), 'hhh';
    }, error => {
      this.showSpinner = false;
    })
  }
  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {
      console.log(error);
    })
  }

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }
  panchayati: any;
  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
      }
    }, error => {
      console.log(error);
    })
  }

  type: any;
  searchchange(event: any) {
    this.type = event.target.value
    var data = {
      type: event.target.value,
      df: 1,
    }
    this.service.searchingbusiness(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }
  searchdeno: any;
  searchdenomationdata(event: any) {
    this.searchdeno = event.target.value
    var data = {
      type: this.type,
      denomation: this.searchdeno,
      df: 2
    }
    this.service.searchingbusiness(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }



  searchspeak(event: any) {
    this.titles = event.target.value
    var data = {
      type: this.type,
      denomation: this.searchdeno,
      title: this.titles,
      df: 3,
    }
    console.log(data);

    this.service.searchingbusiness(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('No Data')
      }
    },
      error => {
      })
  }


  ministry(event: any) {
    var data = {
      type: this.type,
      denomation: this.searchdeno,
      title: this.titles,
      ministry_id: event.target.value,
      df: 4,
    }
    console.log(data);

    this.service.searchingdemonationdata(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }
  searchdist: any;
  searchconts: any;

  searchdistric(event: any) {
    this.searchdist = event.target.value
    var data = {
      
      district_id: this.searchdist,
      df: 2
    }
    this.service.searchingdata(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }

  searchconstenct(event: any) {
    this.searchconts = event.target.value
    var data = {
      // mettingtype: this.mettingtype,
      district_id: this.searchdist,
      constenncy_id: this.searchconts,
      df: 3,
    }
    this.service.searchingdata(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('No Data')
      }
    },
      error => {
      })
  }

  searchmandals(event: any) {
    var data = {
      // mettingtype: this.mettingtype,
      district_id: this.searchdist,
      constenncy_id: this.searchconts,
      mandal_id: event.target.value,
      df: 4,
    }
    this.service.searchingdata(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }

  search() {
    this.service.searchingdata(this.serachMeetingform.value).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }

  searchdenomationalldata() {
    this.service.searchingdemonationdata(this.serachMeetingform.value).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }
  searechevents() {
    this.service.getbusiness().subscribe(res => {
      console.log("dfkgkdj", res.data);
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      }
    }, error => {
    })
  }

  reset() {
    this.serachMeetingform.reset();
    window.location.reload();
  }

  searchTerm: any;

  filterData() {
    this.searchevents = this.searchevents.filter((item: any) => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
    });
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
import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  // serachMeetingform: FormGroup;
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
  speaks: any;
  startdate: any;
  submitted: boolean = false;
  ministry_id: any;
  pastors: any;
  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {

    this.searchdenomation = this.fromb.group({
      mettingtype: [''],
      denomation_id: [''],
      speakerone: [''],
      ministry_id: [''],
      startdate: [''],
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
    })
  }
  now: any;
  ngOnInit(): void {

    // if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
    //   Swal.fire("Login Required")
    //   this.router.navigate(['/']);
    // }
    this.getpastors();
    this.getyouth();
    this.getrevival();
    this.getwomen();
    this.getpastor();
    this.getchildern();
    this.getmusical();
    this.getdistric();
    this.searechevents();
    this.getadds();
    this.getdenomations();
    this.getbeliver();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  get h() { return this.searchdenomation.controls; }

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
  getpastors() {
    this.service.getpastor().subscribe(res => {
      console.log(res.data, 'joo');

      this.pastors = res.data;
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

  getyouth() {
    this.showSpinner = true;
    this.service.getyouth().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.youth = res.data;
      }
    }, error => {
      this.showSpinner = false;
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

  getrevival() {
    this.showSpinner = true;
    this.service.getrevival().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.revival = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }


  getwomen() {
    this.showSpinner = true;
    this.service.getwomen().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.women = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }

  getpastor() {
    this.showSpinner = true;
    this.service.getpastormeeting().subscribe(res => {
      console.log(res.data, 'hii');

      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.pastor = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }

  getchildern() {
    this.showSpinner = true;
    this.service.getchildern().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.childern = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }
  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
  }

  getmusical() {
    this.showSpinner = true;
    this.service.getmusicals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.musical = res.data;
      }
    }, error => {
      this.showSpinner = false;
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

  searchchange(event: any) {
    this.mettingtype = event.target.value
    var data = {
      mettingtype: event.target.value,
      df: 1,
    }
    this.service.searchingdemonationdata(data).subscribe((res: any) => {
      this.searchevents = [];
      if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({

          ...item, showMore: false
        }));
        console.log(this.searchevents, 'jesus');
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }

  onDateChange(event: any) {
    this.startdate = event.target.value
    var data = {
      startdate: event.target.value,
      df: 5,
    }
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

  searchdeno: any;
  searchdenomationdata(event: any) {
    this.searchdeno = event.target.value;
    var data = {
      denomation: this.searchdeno,
      mettingtype: this.mettingtype,
      df: 2
    }
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

  searchspeak(event: any) {
    this.speaks = event.target.value
    var data = {
      denomation: this.searchdeno,
      mettingtype: this.mettingtype,
      speakerone: this.speaks,
      df: 3,
    }
    this.service.searchingdemonationdata(data).subscribe((res: any) => {
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
    this.ministry_id = event.target.value;
    var data = {
      ministry_id: event.target.value,
      denomation: this.searchdeno,
      mettingtype: this.mettingtype,
      speakerone: this.speaks,
      df: 4,
    }
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
      // mettingtype: this.mettingtype,
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

  search(event: any) {
    this.submitted = true;
    if (this.searchdenomation.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      this.service.searchingdata(this.searchdenomation.value).subscribe((res: any) => {
        this.searchevents = [];
        if (res.status == 200) {
          this.searchevents = res.data.map((item: any) => ({
            ...item, showMore: false
          }));
          this.submitted = true;
        } else {
          Swal.fire('server down')
        }
      },
        error => {
        })
    }
  }
  filterPastor(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastors.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastors = reportdata;
    } else if (val == "") {
      this.getpastors();
    }
  }
  searchdenomationalldata() {
    this.service.searchingdemonationdata(this.searchdenomation.value).subscribe((res: any) => {
      console.log(res.data);
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
    this.service.getevents().subscribe(res => {
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
    // this.serachMeetingform.reset();
    this.searchdenomation.reset();
    window.location.reload();
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

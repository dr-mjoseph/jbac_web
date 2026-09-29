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
  searchdist: any;
  searchconts: any;
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

  panchayati: any;

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
  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdist = id;
    this.searchdenomation.patchValue({ district_id: id, constenncy_id: '', mandal_id: '', panchayati_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getconsistencys().subscribe(res => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
        }
      });
    }
    this.applyFilter();
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchconts = id;
    this.searchdenomation.patchValue({ constenncy_id: id, mandal_id: '', panchayati_id: '' });
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getmandals().subscribe(res => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == id);
        }
      });
    }
    this.applyFilter();
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdenomation.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis().subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
        }
      });
    }
    this.applyFilter();
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdenomation.patchValue({ panchayati_id: id });
    this.applyFilter();
  }

  // Aliases for template backwards-compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }
  getconstency(event: any) { this.onDistrictChange(event); }
  gepanchayati(event: any) { this.onMandalChange(event); }

  applyFilter() {
    const vals = this.searchdenomation.value || {};
    const payload = {
      type: vals.mettingtype || this.type || '',
      denomation: vals.denomation || this.searchdeno || '',
      title: vals.title || this.titles || '',
      ministry_id: vals.ministry_id || '',
      district_id: vals.district_id || this.searchdist || '',
      constituency_id: vals.constenncy_id || this.searchconts || '',
      mandal_id: vals.mandal_id || '',
      panchayati_id: vals.panchayati_id || ''
    };
    this.service.searchingbusiness(payload).subscribe({
      next: (res: any) => {
        this.searchevents = [];
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.searchevents = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      },
      error: err => console.error(err)
    });
  }

  search() {
    this.applyFilter();
  }

  searchdenomationalldata() {
    this.applyFilter();
  }

  searechevents() {
    this.service.getbusiness().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.searchevents = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      }
    }, error => {
      console.error(error);
    });
  }

  reset() {
    this.searchdenomation.reset({
      mettingtype: '',
      denomation: '',
      title: '',
      ministry_id: '',
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.serachMeetingform.reset();
    this.searchdist = '';
    this.searchconts = '';
    this.type = '';
    this.searchdeno = '';
    this.titles = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.searchTerm = '';
    this.searechevents();
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
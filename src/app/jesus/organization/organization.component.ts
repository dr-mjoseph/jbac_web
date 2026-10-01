import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent {

  serachMeetingform: any
  districts: any;
  constituency: any;
  panchayati: any;
  mandals: any;
  searchdist: any;
  marriagedata: any;
  searchconts: any;
  searchmand: any;
  adds: any;
  ministryname: any;
  denomation: any;

  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {
    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.serachMeetingform = this.fromb.group({
      denomation_id: [''],
      ministry_id: [''],
      service_name: [''],
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
    })

    this.getdistric();
    this.defaultdata();
    this.getadds();
    this.getbeliver();
    this.getdenomations();
    this.getservice();
  }

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  services: any;
  getservice() {
    this.service.getservices().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.services = res.data;
      }
    }, error => {
    })
  }
  defaultdata() {
    this.service.getorganizations().subscribe((res: any) => {
      console.log(res.data);
      this.marriagedata = [];
      if (res.status == 200) {
        this.marriagedata = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
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

  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }

  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200 && res.data) {
        this.panchayati = res.data.filter((data: any) => !id || data.mndl_id == id);
      }
    }, error => {
      console.log(error);
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

 

  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }

  proofmodalDismis() {
    this.modalService.dismissAll()
  }
  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }


  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
      console.log(res.data), 'hhh';
    }, error => {
    })
  }

  searchdata(ev: any) {
    let reportdata = [];
    const val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {
      reportdata = this.marriagedata.filter((item: any) => {
        return ((item.panchayat_id.toLowerCase().indexOf(val.toLowerCase()) > -1)
        );
      })
      this.marriagedata = reportdata;
    }
  }

  searchTerm: any;
  filterData() {
    this.marriagedata = this.marriagedata.filter((item: any) => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
    });
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

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
  }


  serachcaste(event: any) {
    this.denomation_id = event.target.value
    var data = {
      denomation_id: event.target.value,
      df: 1,
    }
    this.service.searchorganization(data).subscribe((res: any) => {
      this.marriagedata = [];
      if (res.status == 200) {
        this.marriagedata = res.data.map((item: any) => ({
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
  ministry_id: any;
  serachgender(event: any) {
    this.ministry_id = event.target.value
    var data = {
      denomation_id: this.denomation_id,
      ministry_id: this.ministry_id,
      df: 2
    }
    this.service.searchorganization(data).subscribe((res: any) => {
      console.log(data);

      this.marriagedata = [];
      if (res.status == 200) {
        this.marriagedata = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }


  service_name: any
  servicessearch(event: any) {
    this.service_name = event.target.value
    var data = {
      denomation_id: this.denomation_id,
      ministry_id: this.ministry_id,
      service_name: this.service_name,
      df: 3,
    }
    console.log(data);
    this.service.searchorganization(data).subscribe((res: any) => {
      this.marriagedata = [];
      if (res.status == 200) {
        this.marriagedata = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('No Data')
      }
    },
      error => {
      })
  }

  onDenominationChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.denomation_id = id;
    this.serachMeetingform.patchValue({ denomation_id: id });
    this.applyFilter();
  }

  onMinistryChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.ministry_id = id;
    this.serachMeetingform.patchValue({ ministry_id: id });
    this.applyFilter();
  }

  onServiceChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.service_name = id;
    this.serachMeetingform.patchValue({ service_name: id });
    this.applyFilter();
  }

  denomation_id: any;
  titles: any;
  serachgenders(event: any, tableid: any) {
    var data = {
      name: event.target.value,
      columnid: tableid
    }
    console.log(data);

    this.service.searchinorganizations(data).subscribe((res: any) => {
      this.marriagedata = res.data;
    })
  }
  district_id: any;
  constenncy_id: any;
  mandal_id: any;
  panchayati_id: any;

  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.district_id = id;
    this.searchdist = id;
    this.serachMeetingform.patchValue({ district_id: id, constenncy_id: '', mandal_id: '', panchayati_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getconsistencys().subscribe(res => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
        }
      });
      this.applyFilter();
    }
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.constenncy_id = id;
    this.searchconts = id;
    this.serachMeetingform.patchValue({ constenncy_id: id, mandal_id: '', panchayati_id: '' });
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getmandals().subscribe(res => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == id);
        }
      });
      this.applyFilter();
    }
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.mandal_id = id;
    this.searchmand = id;
    this.serachMeetingform.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis(id).subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => !id || data.mndl_id == id);
        }
      });
      this.applyFilter();
    }
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.panchayati_id = id;
    this.serachMeetingform.patchValue({ panchayati_id: id });
    this.applyFilter();
  }

  // Aliases for template backwards-compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }
  searchvillages(event: any) { this.onPanchayatiChange(event); }

  applyFilter() {
    const vals = this.serachMeetingform.value || {};
    const data = {
      denomation_id: vals.denomation_id || this.denomation_id || '',
      ministry_id: vals.ministry_id || this.ministry_id || '',
      service_name: vals.service_name || this.service_name || '',
      district_id: vals.district_id || this.district_id || this.searchdist || '',
      constituency_id: vals.constenncy_id || this.constenncy_id || this.searchconts || '',
      mandal_id: vals.mandal_id || this.mandal_id || this.searchmand || '',
      panchayati_id: vals.panchayati_id || this.panchayati_id || '',
    };
    this.service.searchorganization(data).subscribe({
      next: (res: any) => {
        this.marriagedata = [];
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      },
      error: err => console.error(err)
    });
  }

  search() {
    this.applyFilter();
  }

  reset() {
    this.serachMeetingform.reset({
      denomation_id: '',
      ministry_id: '',
      service_name: '',
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.district_id = '';
    this.constenncy_id = '';
    this.mandal_id = '';
    this.panchayati_id = '';
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.denomation_id = '';
    this.service_name = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.defaultdata();
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



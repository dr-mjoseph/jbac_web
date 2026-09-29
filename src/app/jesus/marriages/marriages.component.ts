import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marriages',
  templateUrl: './marriages.component.html',
  styleUrls: ['./marriages.component.css']
})
export class MarriagesComponent {
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
      gender: [''],
      status: [''],
      caste: [''],
      spirti: [''],
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
  }

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  serach(event: any, tableid: any) {
    const val = event && event.target ? event.target.value : event;
    const data = {
      name: val,
      columnid: tableid
    };
    this.service.searchingmarriages(data).subscribe((res: any) => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
      }
    });
  }
  defaultdata() {
    var data = { df: 0 }
    this.service.searchmarriages(data).subscribe((res: any) => {
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

  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
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
      this.service.searchmarriages({ district_id: id, df: 1 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    }
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
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
      this.service.searchmarriages({ district_id: this.searchdist, constenncy_id: id, df: 2 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    }
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchmand = id;
    this.serachMeetingform.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis().subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
        }
      });
      this.service.searchmarriages({ district_id: this.searchdist, constenncy_id: this.searchconts, mandal_id: id, df: 3 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    }
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.serachMeetingform.patchValue({ panchayati_id: id });
    this.service.searchmarriages({ district_id: this.searchdist, constenncy_id: this.searchconts, mandal_id: this.searchmand, village_id: id, panchayati_id: id, df: 4 }).subscribe((res: any) => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
      }
    });
  }

  // Aliases for template backwards-compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }
  searchvillages(event: any) { this.onPanchayatiChange(event); }

  search() {
    const vals = this.serachMeetingform.value || {};
    const data = {
      district_id: vals.district_id || this.searchdist || '',
      constituency_id: vals.constenncy_id || this.searchconts || '',
      mandal_id: vals.mandal_id || this.searchmand || '',
      panchayati_id: vals.panchayati_id || '',
      village_id: vals.panchayati_id || '',
      denomation_id: vals.denomation_id || '',
      ministry_id: vals.ministry_id || '',
      gender: vals.gender || '',
      status: vals.status || '',
      caste: vals.caste || '',
      spirti: vals.spirti || '',
    };
    this.service.searchmarriages(data).subscribe({
      next: (res: any) => {
        this.marriagedata = [];
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({
            ...item, showMore: false
          }));
        } else {
          Swal.fire('No data found');
        }
      },
      error: err => console.error(err)
    });
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


  serachgender(event: any, tableid: any) {
    var data = {
      name: event.target.value,
      columnid: tableid
    }
    this.service.searchingmarriages(data).subscribe((res: any) => {
      this.marriagedata = res.data;
    })
  }

  serachcaste(event: any, tableid: any) {
    var data = {
      name: event.target.value,
      columnid: tableid
    }
    this.service.searchingmarriages(data).subscribe((res: any) => {
      this.marriagedata = res.data;
    })
  }
  spirit(event:any,tableid:any){
    var data = {
      name: event.target.value,
      columnid: tableid
    }
    console.log(data);
    
    this.service.searchingmarriages(data).subscribe((res: any) => {
      this.marriagedata = res.data;
    })
  }
  reset() {
    this.serachMeetingform.reset({
      denomation_id: '',
      ministry_id: '',
      gender: '',
      status: '',
      caste: '',
      spirti: '',
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.searchTerm = '';
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


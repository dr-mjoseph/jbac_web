import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})
export class InstituteComponent {
  serachMeetingform: any
  districts: any;
  constituency: any;
  panchayati: any;
  mandals: any;
  searchdist: any;
  institutedata: any;
  searchconts: any;
  searchmand: any;
  denomation: any;
  institutesdata: any;
  ministryname: any;
  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder ,  private router: Router) {

  }

  ngOnInit(): void {

    this.serachMeetingform = this.fromb.group({
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
      course_offered: [''],
      denomination_id: [''],
      ministry_id: [''],
      college_type: ['']
    })


    if (sessionStorage.getItem("auth_ind")==''||sessionStorage.getItem("auth_ind")==null|| sessionStorage.getItem("auth_ind")==undefined){
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }


    this.getdistric();
    // this.defaultdata();
    this.getdenomations();
    this.getbeliver();
    this.getinstitutes();
    this.getadds();
  }

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
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
      this.service.Searchinstitute({ district_id: id, df: 1 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
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
      this.service.Searchinstitute({ district_id: this.searchdist, constenncy_id: id, df: 2 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
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
      this.service.Searchinstitute({ district_id: this.searchdist, constenncy_id: this.searchconts, mandal_id: id, df: 3 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    }
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.serachMeetingform.patchValue({ panchayati_id: id });
    this.service.Searchinstitute({ district_id: this.searchdist, constenncy_id: this.searchconts, mandal_id: this.searchmand, village_id: id, panchayati_id: id, df: 4 }).subscribe((res: any) => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
      }
    });
  }

  // Aliases for backwards compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }
  searchvillages(event: any) { this.onPanchayatiChange(event); }

  submitted: boolean = false;
  search() {
    this.submitted = true;
    const vals = this.serachMeetingform.value || {};
    this.service.Searchinstitute(vals).subscribe({
      next: (res: any) => {
        this.institutedata = [];
        if (res.status == 200 && Array.isArray(res.data)) {
          this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
          this.submitted = false;
        } else {
          Swal.fire('No data found');
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
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
  reset() {
    this.serachMeetingform.reset({
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: '',
      course_offered: '',
      denomination_id: '',
      ministry_id: '',
      college_type: ''
    });
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.submitted = false;
    this.getinstitutes();
  }
  getinstitutes() {
    this.service.institutes().subscribe(res => {
      this.institutesdata = res.data || [];
      this.institutedata = res.data ? res.data.map((item: any) => ({ ...item, showMore: false })) : [];
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


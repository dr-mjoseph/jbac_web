import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
  showSpinner: boolean = false;
  mandals: any;
  constituency: any;
  panchayati: any;
  districts: any;
  searchdist: any;
  searchconts: any;
  jobs: any
  searchchurchingform: FormGroup;
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private modalService: NgbModal ,  private router: Router) {
    this.searchchurchingform = this.formBuilder.group({
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
      jobtile: [''],
      qual: [''],
      experience: [''],
    });
  }
  ngOnInit(): void {
    this.getdistric();
    this.getjobs();
    this.getadds();
    this.getjob();
    
    if (sessionStorage.getItem("auth_ind")==''||sessionStorage.getItem("auth_ind")==null|| sessionStorage.getItem("auth_ind")==undefined){
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }
  }

  getdistric() {
    this.showSpinner = true;
    this.service.getdistrict().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.districts = res.data;
      }
    }, error => {
      console.log(error);
      this.showSpinner = false;
    })
  }

  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdist = id;
    this.searchchurchingform.patchValue({ district_id: id, constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
    this.searchconts = id;
    this.searchchurchingform.patchValue({ constenncy_id: id, mandal_id: '', panchayati_id: '' });
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
    this.searchchurchingform.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis(id).subscribe(res => {
        if (res && res.data) {
          this.panchayati = res.data.filter((data: any) => !id || data.mndl_id == id);
        }
      });
      this.applyFilter();
    }
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchchurchingform.patchValue({ panchayati_id: id });
    this.applyFilter();
  }

  getconstency(event: any) { this.onDistrictChange(event); }
  getmandals(event: any) { this.onConstituencyChange(event); }
  gepanchayati(event: any) { this.onMandalChange(event); }
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }

  getjobs() {
    this.service.getjobs({ df: 0 }).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200 && Array.isArray(res.data)) {
        this.jobs = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      }
    }, error => {
      console.error(error);
    });
  }

  applyFilter() {
    this.showSpinner = true;
    const formVals = this.searchchurchingform.value || {};
    const data = {
      district_id: formVals.district_id || this.searchdist || '',
      constenncy_id: formVals.constenncy_id || this.searchconts || '',
      mandal_id: formVals.mandal_id || '',
      panchayati_id: formVals.panchayati_id || '',
      jobtile: formVals.jobtile || '',
      qual: formVals.qual || '',
      experience: formVals.experience || '',
    };
    this.service.getjobs(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        this.jobs = [];
        if (res.status == 200 && Array.isArray(res.data)) {
          this.jobs = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      },
      error: () => {
        this.showSpinner = false;
      }
    });
  }

  search() {
    this.applyFilter();
  }

  reset() {
    this.searchchurchingform.reset({
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: '',
      jobtile: '',
      qual: '',
      experience: ''
    });
    this.searchdist = '';
    this.searchconts = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getjobs();
  }

  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }

  proofmodalDismis() {
    this.modalService.dismissAll()
  }

  adds: any;
  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })
  }

  searchTerm: any;
  filterData() {
    this.jobs = this.jobs.filter((item: any) => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
    });
  }

  jobswe:any
  getjob() {
    this.service.getjob().subscribe((res: any) => {
      this.jobswe = res.data;
      console.log(this.jobswe);
      
    });
  }

  searchjobswise(event:any,colid:any){
    var data={
      name: event.target.value,
      colid:  colid
    }
    this.service.searchjobswise(data).subscribe((res: any) => {
      this.jobs = res.data;
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


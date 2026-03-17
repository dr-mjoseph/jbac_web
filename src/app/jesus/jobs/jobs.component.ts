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
      district_id: ['', [Validators.required]],
      constenncy_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      panchayati_id: ['', [Validators.required]],
    })
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


  getjobs() {
    var data = {
      df: 0
    }
    this.service.getjobs(data).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200) {
        console.log(res.data);
        this.jobs = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }

  searchdistric(event: any) {
    this.searchdist = event.target.value
    var data = {
      district_id: this.searchdist,
      df: 1
    }
    this.service.getjobs(data).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200) {
        this.jobs = res.data;
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
      district_id: this.searchdist,
      constenncy_id: this.searchconts,
      df: 2,
    }
    this.service.getjobs(data).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200) {
        this.jobs = res.data;
      } else {
        Swal.fire('No Data')
      }
    },
      error => {
      })
  }

  searchmandals(event: any) {
    var data = {
      district_id: this.searchdist,
      constenncy_id: this.searchconts,
      mandal_id: event.target.value,
      df: 3,
    }
    this.service.getjobs(data).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200) {
        this.jobs = res.data;
      } else {
        Swal.fire('server down')
      }
    },
      error => {
      })
  }
  search() {
    this.showSpinner = true;
    this.service.getjobs(this.searchchurchingform.value).subscribe((res: any) => {
      this.jobs = [];
      if (res.status == 200) {
        this.showSpinner = false;
        this.jobs = res.data;
      } else {
        Swal.fire('server down')
      }
    },
      error => {
        this.showSpinner = false;
      })
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


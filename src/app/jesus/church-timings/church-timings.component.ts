import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-church-timings',
  templateUrl: './church-timings.component.html',
  styleUrls: ['./church-timings.component.css']
})
export class ChurchTimingsComponent {
  mandals: any;
  constituency: any;
  panchayati: any;
  districts: any;
  church: any;
  searchdist: any;
  searchconts: any;
  searchchurchingform: FormGroup;
  denomationid: any;
  denomation: any;
  ministryname: any;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private modalService: NgbModal, private router: Router) {
   
    this.searchchurchingform = this.formBuilder.group({
      district_id: ['', [Validators.required]],
      constenncy_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      typetime: ['',],
      panchayati_id: ['',],
      denomationid: [''],
      ministry_id: [''],
      day: [''],
    })
  }
  ngOnInit(): void {
    if (sessionStorage.getItem("auth_ind")==''||sessionStorage.getItem("auth_ind")==null|| sessionStorage.getItem("auth_ind")==undefined){
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }
    this.getdistric();
    // this.churchtimings();
    this.getdenomations();
    this.getbeliver();
    this.getadds();
  }

  get h() { return this.searchchurchingform.controls; }
  
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
    })
  }

  ministry_id: any;
  day: any;

  churchtimings() {
    this.service.getchurches().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.church = res.data;
      }
    }, error => {
    })
  }

  search() {
    this.submitted = true;
    if (this.searchchurchingform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      this.service.searchingchurchdata(this.searchchurchingform.value).subscribe((res: any) => {
        this.church = [];
        if (res.status == 200) {
          this.church = res.data;
          this.submitted = false;
        } else {
          Swal.fire('no data')
        }
      },
        error => {
        })
    }
  }

  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }

  reset() {
    this.searchchurchingform.reset();
    window.location.reload();
  }

  village_id: any;
  adds: any;

  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
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
name:any;
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
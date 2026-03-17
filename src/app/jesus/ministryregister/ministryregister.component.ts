import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ministryregister',
  templateUrl: './ministryregister.component.html',
  styleUrls: ['./ministryregister.component.css']
})
export class MinistryregisterComponent {
  showSpinner: boolean = false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;
  ministryform: FormGroup;
  denomation: any;
  pattern: any;
  districts: any;
  mandals: any;
  panchayati: any;
  bliversdata: any;
  district: any;
  constituency: any;
  panchayatis: any;
  imagedata: any = []
  wings: any;
  now: any;
  ministryname: any;
  constituency_id: any;
  services: any;
  id: any
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router, private modalService: NgbModal) {
    this.ministryform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      denomation: ['', [Validators.required]],
      // pattern: ['', [Validators.required]],
      ministryemail: [''],
      ministrywebsite: [''],
      // headname: ['', [Validators.required]],
      headnmber: ['', [Validators.required, Validators.maxLength(10)]],
      number_ofchurches: ['', [Validators.required]],
      number_ofmembers: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      panchayat_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      // dob: ['', [Validators.required]],
      pastor: [''],
      description: [''],
      // // term: ['', [Validators.required]],

    })
  }

  get r() { return this.ministryform.controls; }
  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getdenomations();
    this.getdistric();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.usr_id = sessionStorage.getItem('usr_id');
    this.name = sessionStorage.getItem('name');
    if (this.usr_id) {
      this.logincon = true;
    } else {
      this.logincon = false;
    }
  }


  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }


  getdistric() {
    this.service.getdistrict().subscribe(res => {
      this.districts = res.data;
    })
  }

  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }

  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }

  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis().subscribe(res => {
      this.panchayati = res.data.filter((data: any) => data.mndl_id == id);

      console.log(this.panchayati, 'hhh');

    })
  }

  getministrypastors: any;
  ministrypastorsfilterdata() {
    if (this.ministryform.value.district_id == null || this.ministryform.value.constituency_id == null || this.ministryform.value.mandal_id == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.ministryform.value.district_id,
        constituencyname: this.ministryform.value.constituency_id,
        mandal_id: this.ministryform.value.mandal_id,
      }
      console.log(data);

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getministrypastors = res.data;
      })
    }
  }

  postministrysignup() {
    this.submitted = true;
    if (this.ministryform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else if (this.ministryform.value.password != this.ministryform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched");
    } else {
      this.service.postministrysignup(this.ministryform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
        } else if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు');
          this.ministryform.reset();
          this.submitted = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి');
        }
      },
        error => {
        })
    }
  }

  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  modalDismiss() {
    this.modalService.dismissAll()
  }
  elem: any
  scroll() {
    this.elem = document.getElementById("ele");
    this.elem.scrollIntoView();
  }
    ///////////////////mobile view///////////////
    login: boolean = true;
    notlogin: boolean = false;
 
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






import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-believerregister',
  templateUrl: './believerregister.component.html',
  styleUrls: ['./believerregister.component.css']
})
export class BelieverregisterComponent {
  showSpinner: boolean = false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;
  beliverform: FormGroup;
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
    this.beliverform = this.formBuilder.group({
      fname: ['', [Validators.required]],
      whatsapp: [''],
      // testwhatsapp: [''],
      dob: [''],
      gender: ['', [Validators.required]],
      email: [''],
      mobile_number: ['', [Validators.required, Validators.maxLength(10)]],
      status: ['', [Validators.required]],
      income: [''],
      caste: [''],
      subcaste: [''],
      nativeplace: [''],
      talent: ['', [Validators.required]],
      education: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      dpartment: ['', [Validators.required]],
      districts: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      panchayati: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      villagename: ['', [Validators.required]],
      wardnumber: [''],
      ward: ['', [Validators.required]],
      nri: ['', [Validators.required]],
      leadership: ['', [Validators.required]],
      leadertype: [''],
      generaltype: [''],
      subward: [''],
      wingtype: [''],
      wingtypes: [''],
      denomination_id: ['', [Validators.required]],
      hobbies: [''],
      spirti: [''],
      lifegoal: [''],
      church: [''],
      pastor: [''],
      youtube: [''],
      lname: [''],
      god: [''],
      // // term: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  get h() { return this.beliverform.controls; }
  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getdistric();
    this.getdenomations();
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

  get be(): { [key: string]: AbstractControl } {
    return this.beliverform.controls;
  }

  formshow(id: any) {
    this.form_ind = id
    this.beliverform.reset();
    this.lead = false;
    this.mini = false;
    this.assicoation = false;
    this.leadtype = false;
    this.wingtype = false;
    this.wingtypes = false;
    this.subward = false;
    this.father = false;
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

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
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
    })
  }
  getpastorsdatas: any;

  getpastorsdata() {
    if (this.beliverform.value.districts == null || this.beliverform.value.constituencyname == null || this.beliverform.value.mandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.beliverform.value.districts,
        constituencyname: this.beliverform.value.constituencyname,
        mandal_id: this.beliverform.value.mandals,
      }
      console.log(data);

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getpastorsdatas = res.data;
      })
    }
  }
  getchurchfilter: any;
  getchurchesdata() {
    if (this.beliverform.value.districts == null || this.beliverform.value.constituencyname == null || this.beliverform.value.mandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.beliverform.value.districts,
        constituencyname: this.beliverform.value.constituencyname,
        mandal_id: this.beliverform.value.mandals,
      }
      console.log(data);

      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchfilter = res.data;
      })
    }
  }
  postbeliversignup() {
    this.submitted = true;
    if (this.beliverform.invalid) {
      Swal.fire('please fill the details');
    } else if (this.beliverform.value.password != this.beliverform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    } else {
      this.service.postbeliver(this.beliverform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
        } else if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు');
          this.beliverform.reset();

          this.submitted = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి');

        }
      },
        error => {
        })
    }
  }
  church: any;
  pastor: any;
  getchurch() {
    this.service.getchurch().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.church = res.data;
      }
    }, error => {

    })
  }
  lead: boolean = false;
  mini: boolean = false;
  assicoation: boolean = false;
  leadtype: boolean = false;
  wingtype: boolean = false;
  wingtypes: boolean = false;
  subward: boolean = false;
  father: boolean = false;
  onradiochange(event: any) {
    var a = event.value
    if (a == 'YES') {
      this.beliverform.patchValue({
        leadertype: '',
      });
      this.lead = true
    }

    if (a == 'NO') {
      this.beliverform.patchValue({
        leadertype: '',
      });
      this.lead = false
      this.leadtype = false
      this.wingtype = false
      this.wingtypes = false
      this.subward = false
    }
  }
  onsubward(event: any) {
    var s = event.target.value
    if (s == '6') {
      this.subward = true
    } else {
      this.subward = false
    }

  }
  onradioleadertype(event: any) {
    var a = event.value
    if (a == '1') {
      this.leadtype = true
      this.wingtype = false
      this.wingtypes = false
      this.subward = true
    } else {
      this.leadtype = false
      this.wingtype = true
      this.wingtypes = true
      this.subward = false
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






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
  states: any = [];
  districts: any = [];
  mandals: any = [];
  panchayati: any = [];
  bliversdata: any;
  district: any;
  constituency: any = [];
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
      state_id: ['', [Validators.required]],
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
      term: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypepassword: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  get h() { return this.beliverform.controls; }
  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getstates();
    this.getdenomations();
    this.getwing();
    this.getleaderlevels();
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

  
  existingUserData: any = null;

  checkExistingUser(event: any) {
    const val = event?.target?.value || '';
    const digits = String(val).replace(/\D/g, '').slice(-10);
    if (digits.length === 10) {
      this.service.lookupExistingUser(digits).subscribe((res: any) => {
        if (res && res.found && res.data) {
          this.existingUserData = res.data;
          const cat = res.source_category ? res.source_category.toUpperCase() : 'EXISTING';
          Swal.fire({
            icon: 'info',
            title: 'Existing Profile Found!',
            text: `Found registration under ${cat} category for ${res.data.name || digits}. Your details have been auto-filled!`,
            timer: 3500,
            showConfirmButton: true
          });
          const d = res.data;
          const distId = d.district_id ? String(d.district_id) : '';
          const constId = d.constituency_id ? String(d.constituency_id) : '';
          const mandId = d.mandal_id ? String(d.mandal_id) : '';
          const panchId = d.panchayat_id ? String(d.panchayat_id) : '';

          if (distId) {
            this.service.getconsistencys().subscribe((cRes: any) => {
              if (cRes && cRes.data) this.constituency = cRes.data.filter((x: any) => x.dstrct_id == distId);
            });
          }
          if (constId) {
            this.service.getmandals().subscribe((mRes: any) => {
              if (mRes && mRes.data) this.mandals = mRes.data.filter((x: any) => x.const_id == constId);
            });
          }
          if (mandId) {
            this.service.gepanchayatis(mandId).subscribe((pRes: any) => {
              if (pRes && pRes.data) this.panchayati = pRes.data.filter((x: any) => !mandId || x.mndl_id == mandId);
            });
          }

          this.beliverform.patchValue({
            state_id: String(d.state_id || '1'),
            fname: d.name || d.fname || '',
            mobile_number: digits,
            whatsapp: d.whatsapp || digits,
            dob: d.dob || '',
            gender: d.gender || '',
            email: d.email || '',
            districts: distId,
            constituencyname: constId,
            mandals: mandId,
            panchayati: panchId,
            villagename: d.villagename || d.nativeplace || '',
            nativeplace: d.nativeplace || '',
            caste: d.caste || '',
            subcaste: d.subcaste || '',
            education: d.education || '',
            talent: d.talent || '',
            denomination_id: d.denomination_id ? String(d.denomination_id) : '',
            hobbies: d.hobbies || '',
            spirti: d.spirti || '',
            lifegoal: d.lifegoal || '',
            leadership: d.leadership || 'NO',
            leadertype: d.leadertype || '',
            generaltype: d.generaltype || '',
            wingtype: d.wingtype || ''
          });
        }
      }, () => {});
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
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.beliverform.patchValue({
      districts: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.getdistric(stateId);
    }
  }

  getdistric(stateId?: any) {
    const sid = stateId || this.beliverform.get('state_id')?.value;
    if (!sid) return;
    this.service.getdistrict(sid).subscribe(res => {
      this.districts = res.data;
    });
  }

  getconstency(event: any) {
    var id = event.target.value;
    this.beliverform.patchValue({
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }

  getmandals(event: any) {
    var id = event.target.value;
    this.beliverform.patchValue({
      mandals: '',
      panchayati: ''
    });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {
      this.mandals = res.data.filter((data: any) => data.const_id == id);
    })
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }

  gepanchayati(event: any) {
    var id = event.target.value;
    this.beliverform.patchValue({
      panchayati: ''
    });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {
      this.panchayati = res.data ? res.data.filter((data: any) => !id || data.mndl_id == id) : [];
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
    if (!this.beliverform.get('term')?.value) {
      this.beliverform.patchValue({ term: true });
    }
    if (this.beliverform.invalid) {
      Swal.fire('please fill the details');
    } else if (this.beliverform.value.password != this.beliverform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    } else {
      const val = this.beliverform.value;
      const stateIdVal = Number(val.state_id) || 1;
      const payload = {
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh',
        ...val,
        district_id: val.districts || val.district_id,
        constituency_id: val.constituencyname || val.constituency_id,
        mandal_id: val.mandals || val.mandal_id,
        panchayat_id: val.panchayati || val.panchayat_id || val.village_id
      };
      this.service.postbeliver(payload).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
        } else if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు');
          this.beliverform.reset({
            term: true
          });
          this.constituency = [];
          this.mandals = [];
          this.panchayati = [];

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
  leaderlevel: any = [];
  getleaderlevels() {
    this.service.getleaderlevel().subscribe((res: any) => {
      this.leaderlevel = res && res.data ? res.data : [];
    }, error => {
      this.leaderlevel = [];
    });
  }
  getwing() {
    this.service.getwing().subscribe((res: any) => {
      this.wings = res && res.data ? res.data : [];
    }, error => {
    });
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






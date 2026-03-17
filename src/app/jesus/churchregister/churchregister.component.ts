import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-churchregister',
  templateUrl: './churchregister.component.html',
  styleUrls: ['./churchregister.component.css']
})
export class ChurchregisterComponent {

  showSpinner: boolean = false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;
  beliverform: FormGroup;
  ministryform: FormGroup;
  independentorgainsationform: FormGroup;
  independentchurchform: FormGroup;
  churchregsiterform: FormGroup;
  denomation: any;
  pattern: any;
  districts: any;
  mandals: any;
  panchayati: any;
  bliversdata: any;
  studentform: FormGroup;
  pastorform: FormGroup;
  pastorsassociations: FormGroup;
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
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router, private modalService: NgbModal,
    private route: ActivatedRoute) {
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

    this.studentform = this.formBuilder.group({
      studentname: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.maxLength(10)]],
      study: ['', [Validators.required]],
      schname: ['', [Validators.required]],
      fathername: ['', [Validators.required]],
      aboutyourself: [''],
      nativeplace: [''],
      caste: [''],
      talent: [''],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      church: ['',],
      pastor: [''],
      leadership: ['', [Validators.required]],
      leadertype: ['2'],
      generaltype: [''],
      wingtype: ['',],
      wingtypes: [''],
      dob: [''],
      denomination_id: [''],
      hobbies: [''],
      spirti: [''],
      lifegoal: [''],
      whatsappnumber: [''],
      nri: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      wardnumber: [''],
      villagename: ['', [Validators.required]],
      respanchayati: ['', [Validators.required]],
      resmandals: ['', [Validators.required]],
      resconstituencyname: ['', [Validators.required]],
      resdistricts: ['', [Validators.required]],
      god: [''],
      // // term: ['', [Validators.required]],
      mother: [''],
      orphon: [''],
      subcaste: [''],
      gender: ['']

    })

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

    this.pastorform = this.formBuilder.group({
      pastorname: ['', [Validators.required]],
      dob: [''],
      about_desp: [''],
      gender: [''],
      phonenumber: ['', [Validators.required, Validators.maxLength(10)]],
      phonenumber2: [''],
      pa_phonenumber: [''],
      staus: [''],
      designation: [''],
      caste: [''],
      nativeplace: [''],
      talent: [''],
      education: [''],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      panchayat_id: ['', [Validators.required]],
      ward: [''],
      youtubechanel: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      leaders: ['', [Validators.required]],
      leadertype: [''],
      generaltype: ['',],
      wingtype: ['',],
      facebook: [''],
      god: [''],
      // // term: ['', [Validators.required]],
      lifegoal: [''],
      denomination_id: ['', [Validators.required]],
      villagename: ['', [Validators.required]],
      wingtypes: [''],
      pastortype: [''],
      ministry_id: [''],
      subward: [''],
      subcaste: ['']
    })

    this.churchregsiterform = this.formBuilder.group({
      church_name: ['', [Validators.required]],
      denomination_id: ['', [Validators.required]],
      total_members: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      street: ['', [Validators.required]],
      pastor_id: ['', [Validators.required]],
      location: [''],
      contactnumber: ['', [Validators.required]],
      description: [''],
      ministry_id: [''],
      churchtype: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      facebook: [''],
      youtube: [''],
      remarks: [''],
      village_name: ['', [Validators.required]],
      // // term: ['', [Validators.required]],

    })

    this.independentorgainsationform = this.formBuilder.group({

      organisation_name: ['', [Validators.required]],
      checkbox: [''],
      believer_id: [''],
      pastor_id: [''],
      denomation: ['', [Validators.required]],
      org_address: [''],
      location: ['', [Validators.required]],
      contact_num: ['', [Validators.required, Validators.maxLength(10)]],
      email: [''],
      website: [''],
      service_name: ['', [Validators.required]],
      organizationtype: ['', [Validators.required]],
      ministry_id: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      districts: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      panchayati: ['', [Validators.required]],
      villagename: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      // term: ['', [Validators.required]]
    })

    this.independentchurchform = this.formBuilder.group({
      churchname: ['', [Validators.required]],
      denomination_id: ['', [Validators.required]],
      pattern_id: ['', [Validators.required]],
      pastor_id: ['', [Validators.required]],
      location: ['', [Validators.required]],
      church_img: ['', [Validators.required]],
      contactnumber: ['', [Validators.required, Validators.maxLength(10)]],
      totalchurch_mem: ['', [Validators.required]],
      description: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      panchayat_id: ['', [Validators.required]],
      street: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
    })
    this.pastorsassociations = this.formBuilder.group({
      pa_name: ['', [Validators.required]],
      pastor_id: ['', [Validators.required]],
      level: [''],
      phonenumber: ['', [Validators.required, Validators.maxLength(10)]],
      whatsapp_number: [''],
      totalleadrs: [''],
      address: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      website: [''],
      workingareas: [''],
      description: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
     // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      // // term: ['', [Validators.required]],

    })
  }
  get h() { return this.beliverform.controls; }
  get e() { return this.studentform.controls; }
  get r() { return this.ministryform.controls; }
  get o() { return this.pastorform.controls; }
  get k() { return this.churchregsiterform.controls; }
  get i() { return this.independentorgainsationform.controls; }
  get n() { return this.independentchurchform.controls; }
  get g() { return this.pastorsassociations.controls; }

  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getdenomations();
    this.getpatterns();
    this.getdistric();
    this.getbelivers();
    // this.getchurch();
    this.getbeliver();
    // this.getpastor();
    this.getpastorassciation();
    this.getwing();
    this.getservice();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.usr_id = sessionStorage.getItem('usr_id');
    // this.constituencyname = sessionStorage.setItem('constituencyname');
    this.checklogin();
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
    this.ministryform.reset();
    this.beliverform.reset();
    this.independentorgainsationform.reset();
    this.independentchurchform.reset();
    this.churchregsiterform.reset();
    this.studentform.reset();
    this.pastorform.reset();
    this.pastorsassociations.reset();
    this.lead = false;
    this.mini = false;
    this.assicoation = false;
    this.leadtype = false;
    this.wingtype = false;
    this.wingtypes = false;
    this.subward = false;
    this.father = false;
  }

  getwing() {
    this.service.getwing().subscribe((res: any) => {
      this.wings = res.data;
    })
  }


  getbelivers() {
    this.service.getbelivers().subscribe((res: any) => {
      this.bliversdata = res.data;
    })
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }

  getpatterns() {
    this.service.getpattern().subscribe(res => {
      this.pattern = res.data;
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
  getorganizationpastors: any;
  getorgnaziationpstorsget() {
    if (this.independentorgainsationform.value.districts == null || this.independentorgainsationform.value.constituencyname == null || this.independentorgainsationform.value.mandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.independentorgainsationform.value.districts,
        constituencyname: this.independentorgainsationform.value.constituencyname,
        mandal_id: this.independentorgainsationform.value.mandals,

      }
      console.log(data);
      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getorganizationpastors = res.data;
      })
    }
  }
  getpastorassciationas: any;
  pastorassociationpastorfilter() {
    if (this.pastorsassociations.value.district_id == null || this.pastorsassociations.value.constituency_id == null || this.pastorsassociations.value.mandal_id == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.pastorsassociations.value.district_id,
        constituencyname: this.pastorsassociations.value.constituency_id,
        mandal_id: this.pastorsassociations.value.mandal_id,
      }
      console.log(data);
      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getpastorassciationas = res.data;
      })
    }
  }

  getchurchstudentfilter: any;
  getchurchesstudentdata() {
    if (this.studentform.value.resdistricts == null || this.studentform.value.resconstituencyname == null || this.studentform.value.resmandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.studentform.value.resdistricts,
        constituencyname: this.studentform.value.resconstituencyname,
        mandal_id: this.studentform.value.resmandals,


      }
      console.log(data);

      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchstudentfilter = res.data;
      })
    }
  }
  getstudentspastors: any;
  getpastorssdata() {
    if (this.studentform.value.resdistricts == null || this.studentform.value.resconstituencyname == null || this.studentform.value.resmandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.studentform.value.resdistricts,
        constituencyname: this.studentform.value.resconstituencyname,
        mandal_id: this.studentform.value.resmandals,

      }
      console.log(data);

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getstudentspastors = res.data;
      })
    }
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
  getchurchpastors: any;
  churchpastorfilter() {
    if (this.churchregsiterform.value.district_id == null || this.churchregsiterform.value.constituency_id == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.churchregsiterform.value.district_id,
        constituencyname: this.churchregsiterform.value.constituency_id,
        mandal_id: this.churchregsiterform.value.mandal_id,
      }
      console.log(data);

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getchurchpastors = res.data;
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

  postindepedentorganisation() {
    this.submitted = true;

    if (this.independentorgainsationform.invalid) {
      Swal.fire('please fiil the details ');
      return;
    } else if (this.independentorgainsationform.value.password != this.independentorgainsationform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched");
    } else {
      this.service.postindepedentorganisation(this.independentorgainsationform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
        } else if (res.status == 200) {

          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు');
          this.independentorgainsationform.reset();
          this.submitted = false;

        } else {
          alert('Error');
        }

      })
    }
  }

  postchurchregister() {
    this.submitted = true;
    if (this.churchregsiterform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
      return;
    } else if (this.churchregsiterform.value.password != this.churchregsiterform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    }
    else {
      this.service.postchurchregister(this.churchregsiterform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు')
        } else if (res.status == 200) {
          Swal.fire('Your Church is Submited Successfully,Please Submit your Church Service Timings')
          this.router.navigate(['/profile'], { queryParams: { id: "1" } });
          this.churchregsiterform.reset();
          this.submitted = false;
        }
      },
        error => {
        })
    }

  }
  postpastorassociations() {
    this.submitted = true;
    if (this.pastorsassociations.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
      return;
    } else if (this.pastorsassociations.value.password != this.pastorsassociations.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    }
    else {
      this.service.postpastorassociationss(this.pastorsassociations.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు')
        } else if (res.status == 200) {
          Swal.fire('Submited Successfully')
          this.pastorsassociations.reset();
          this.submitted = false;
        }
      },
        error => {
        })
    }
  }

  postpastorsignup() {
    this.submitted = true;
    // this.showSpinner = true;
    if (this.pastorform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
      return;
    } else if (this.pastorform.value.password != this.pastorform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
      // this.showSpinner = false;
    } else {
      this.service.postrpastor(this.pastorform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు')
          // this.showSpinner = false;
        } else if (res.status == 200) {
          // this.showSpinner = false;
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.pastorform.reset();
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
          // this.showSpinner = false;
        })
    }

  }

  // Image Upload Function //
  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[bfile_typeEmpl.length - 1];
        this.imagedata.push({ reviewimg: imgFile, filetype: imgtype })
      };
    }
  }

  postindepedentchurched() {
    // this.showSpinner = true;
    this.submitted = true;
    if (this.independentchurchform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    }   else {
      this.independentchurchform.value.church_img = this.imagedata
      this.service.postindepedentchurch(this.independentchurchform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
        } else if (res.status == 200) {
          // this.showSpinner = false;
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు');
          this.independentchurchform.reset();
          this.imagedata = [];
          this.submitted = false;
          // this.showSpinner = false;
        } else {
          alert('Error');
        }
      },
        error => {
        })
    }
    // this.showSpinner = false;
  }

  poststudentsignup() {
    this.showSpinner = true;
    this.submitted = true;
    if (this.studentform.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else if (this.studentform.value.password != this.studentform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    } else {
      this.service.poststudentsignup(this.studentform.value).subscribe((res: any) => {
        if (res.status == 451) {
          Swal.fire('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు')
        } else if (res.status == 200) {
          this.showSpinner = false;
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.studentform.reset();
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
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

  getbeliver() {
    this.service.getbeliversdata().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.ministryname = res.data;
      }
    }, error => {

    })
  }


  assicoations: any;
  getpastorassciation() {
    this.service.getpastorassci().subscribe(res => {
      this.assicoations = res.data;
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
      this.pastorform.patchValue({
        leadertype: '',

      });
      this.studentform.patchValue({
        leadertype: '',

      });
      this.lead = true

    }

    if (a == 'NO') {
      this.beliverform.patchValue({
        leadertype: '',

      });
      this.pastorform.patchValue({
        leadertype: '',

      });
      this.studentform.patchValue({
        leadertype: '',

      });
      this.lead = false
      this.leadtype = false
      this.wingtype = false
      this.wingtypes = false
      this.subward = false
    }
  }
  onparent(event: any) {
    var parents = event.value
    if (parents == 'YES') {
      this.father = true
    } else {
      this.father = false
    }
  }

  subwardevent(event: any) {
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

  churchchange(event: any) {
    var a = event.value
    if (a == 'Ministry') {
      this.mini = true
    } else {
      this.mini = false
      this.leadtype = false
    }
  }

  pastorassicoation(event: any) {
    var as = event.value
    if (as == 'yes') {
      this.assicoation = true
    } else {
      this.assicoation = false
    }
  }


  login: boolean = true;
  notlogin: boolean = false;

  ngAfterContentInit() {
    this.service.getloginstatus.subscribe((res: any) => {
      if (res == '1') {
        this.login = false;
        this.notlogin = true;
        this.name = sessionStorage.getItem('name');
      } else if (res == '2') {
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
  addNew(event: any, serviceadding: any) {
    if (event.target.value == 1) {
      this.modalService.open(serviceadding, { size: 'xl', centered: true });
    }
  }
  ProofValue: any;
  addNewSubmit() {
    if (this.ProofValue == '') {
      this.service.errorMessageAlert('Please Fill The service type Value');
      return;
    }
    var data = {
      service_name: this.ProofValue
    }
    this.service.addNew(data).subscribe(res => {
      this.ProofValue = '';
      this.modalDismiss();
      this.getservice();
    }, error => {
      this.ProofValue = '';

    })
  }

  modalDismiss() {
    this.modalService.dismissAll()
  }
  onradioleadertyperajkumar(event: any) {
    if (event.value == "YES") {
      this.wingtype = true
    } else {
      this.wingtype = false;
    }
  }


  elem: any

  scroll() {
    this.elem = document.getElementById("ele");
    this.elem.scrollIntoView();
  }

  show: boolean = false;
  currentValue: string = "";

  optionselected(option: string) {

    this.currentValue = option;
    this.show = false;
  }
  handleFocusIn() {
    this.show = true;

  }

  filterPastor(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      // this.pastor = reportdata;
    } else if (val == "") {
      // this.getpastor();
    }
  }

  filterChurch(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.church.filter((item: any) => {
        return (item.church_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.church = reportdata;
    } else if (val == "") {
      this.getchurch();
    }
  }


  filterbelivers(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.bliversdata.filter((item: any) => {
        return (item.fname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.bliversdata = reportdata;
    } else if (val == "") {
      this.getbelivers();
    }
  }

  form: any
  churchchangewe(event: any) {
    this.form = event.value
  }

  filterItems: any = [];
  testname: any
  testid: any


  getdiagnosis() {
    this.filterItems = this.districts;
  }

  getsearchitems(ev: any) {
    if (ev.target.value != "") {
      this.filterItems = [];
      let reportdata = [];
      const val = ev.target.value;
      if (val == undefined || val == null || val == "") {
        this.filterItems = this.districts;
      } else {
        if (val && val.trim() != '') {
          reportdata = this.districts.filter((item: any) => {
            return (item.distrct_nm.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
          this.filterItems = [];
          this.filterItems = reportdata;
        } else {
          this.filterItems = this.districts;
        }
      }
    } else {
      this.filterItems = [];
    }
  }


  selected_treename(treedetails: any) {
    this.testname = "";
    this.filterItems = [];
    this.testname = treedetails.testname;
    this.testid = treedetails.testid;
  }



  alert() {
    Swal.fire('Hey user!', 'please Login', 'info');
    this.router.navigate(['/login']);
  }

}


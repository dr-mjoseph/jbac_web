import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  pastorform: FormGroup;
  churchregsiterform: FormGroup;
  updateprofileministry: FormGroup;
  beliverform: FormGroup;
  studentform: FormGroup;
  independentorgainsationform: FormGroup;
  pastorsassociations: FormGroup;
  ministryform: FormGroup
  profiledata: any = [];
  form_ind: any;
  now: any;
  categoryid: any;
  category: any;
  name: any;
  mobile_number: any;
  districts: any;

  mandals: any;
  constituency: any;
  panchayati: any;
  denomation: any;
  pastor: any;

  constructor(private service: ServiceService, private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal) {

    this.pastorform = this.formBuilder.group({
      pastorname: [''],
      dob: [''],
      about_desp: [''],
      gender: [''],
      phonenumber: [''],
      phonenumber2: [''],
      pa_phonenumber: [''],
      staus: [''],
      designation: [''],
      caste: [''],
      nativeplace: [''],
      talent: [''],
      education: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      panchayat_id: [''],
      ward: [''],
      youtubechanel: [''],
      password: [''],
      leaders: [''],
      leadertype: ['',],
      generaltype: ['',],
      wingtype: ['',],
      facebook: [''],
      god: [''],
      lifegoal: [''],
      denomination_id: [''],
      villagename: [''],
      wingtypes: [''],
      pastortype: [''],
      ministry_id: [''],
      subward: [''],
      fellowship: [''],
      assicoation_id: [''],
      position: [''],
      subcaste: [''],
      leadership: [''],


    })

    this.churchregsiterform = this.formBuilder.group({
      church_name: [''],
      denomination_id: [''],
      total_members: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      village_id: [''],
      street: [''],
      pastor_id: [''],
      location: [''],
      contactnumber: [''],
      description: [''],
      village_name: [''],
      password: [''],
      churchtype: [''],
      ministry_id: [''],
      facebook: [''],
      youtube: ['']

    })
    this.updateprofileministry = this.formBuilder.group({

      firstname: [''],
      denomation: [''],
      ministryemail: [''],
      ministrywebsite: [''],
      headnmber: [''],
      number_ofchurches: [''],
      number_ofmembers: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      panchayat_id: [''],
      password: [''],

      pastor: [''],
      description: [''],
      term: [''],
    })
    this.beliverform = this.formBuilder.group({
      fname: [''],
      whatsapp: [''],
      dob: [''],
      gender: [''],
      email: [''],
      mobile_number: [''],
      status: [''],
      income: [''],
      caste: [''],
      subcaste: [''],
      nativeplace: [''],
      talent: [''],
      education: [''],
      designation: [''],
      dpartment: [''],
      districts: [''],
      mandals: [''],
      panchayati: [''],
      constituencyname: [''],
      villagename: [''],
      wardnumber: [''],
      ward: [''],
      nri: [''],
      leadership: [''],
      leadertype: [''],
      generaltype: [''],
      subward: [''],
      wingtype: [''],
      wingtypes: [''],
      denomination_id: [''],
      hobbies: [''],
      spirti: [''],
      lifegoal: [''],
      church: [''],
      pastor: [''],
      youtube: [''],
      lname: [''],
      god: [''],
    })
    this.studentform = this.formBuilder.group({
      studentname: [''],
      number: [''],
      study: [''],
      schname: [''],
      fathername: [''],
      aboutyourself: [''],
      nativeplace: [''],
      caste: [''],
      talent: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      village_id: [''],
      password: [''],
      church: ['',],
      pastor: [''],
      leadership: [''],
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
      nri: [''],
      ward: [''],
      wardnumber: [''],
      villagename: [''],
      respanchayati: [''],
      resmandals: [''],
      resconstituencyname: ['',],
      resdistricts: [''],
      god: [''],
      term: [''],
      mother: [''],
      orphon: [''],
      subcaste: [''],

    })
    this.independentorgainsationform = this.formBuilder.group({

      organisation_name: [''],
      checkbox: [''],
      believer_id: [''],
      pastor_id: [''],
      denomation: [''],
      org_address: [''],
      location: [''],
      contact_num: [''],
      email: [''],
      website: [''],
      service_name: [''],
      organizationtype: [''],
      ministry_id: [''],
      password: [''],
      districts: [''],
      constituencyname: [''],
      mandals: [''],
      panchayati: [''],
      villagename: [''],
      ward: [''],
      term: ['']
    })
    this.pastorsassociations = this.formBuilder.group({
      pa_name: [''],
      pastor_id: [''],
      level: [''],
      phonenumber: [''],
      whatsapp_number: [''],
      totalleadrs: [''],
      address: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      village_id: [''],
      website: [''],
      workingareas: [''],
      description: [''],
      password: [''],

      term: [''],

    })

    this.ministryform = this.formBuilder.group({
      ministryname: [''],
      denomation_id: [''],
      headname: [''],
      ministryemail: [''],
      ministrywebsite: [''],
      headnmber: [''],
      number_ofchurches: [''],
      number_ofmembers: [''],
      district_id: [''],
      constituency_id: [''],
      mandal_id: [''],
      panchayat_id: [''],
      pastor: [''],
      personal_secretary: [''],
      remarks: [''],
      description: ['']
    })



    this.categoryid = sessionStorage.getItem("category_id");
    this.category = sessionStorage.getItem("category");
    this.name = sessionStorage.getItem("name");
    this.mobile_number = sessionStorage.getItem("mobile_number");
  }

  ngOnInit(): void {
    this.personaldata();
    this.getdenomations();
    this.getpastorassciation();
    this.getwing();
    this.getbelivers();
    // this.getpastor();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required");
      this.router.navigate(['/']);
    }
    this.geteditdtails();
    this.getdistric();
    // this.getchurch();
    this.getservice();
    this.getbeliver();

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
  addNew(event: any, serviceadding: any) {
    if (event.target.value == 1) {
      this.modalService.open(serviceadding, { size: 'l', centered: true });
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
  modalDismiss() {
    this.modalService.dismissAll()
  }
  church: any;
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

  onparent(event: any) {
    var parents = event.value
    if (parents == 'YES') {
      this.father = true
    } else {
      this.father = false
    }
  }
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
  personaldata() {
    var data = {
      category_id: sessionStorage.getItem('category_id'),
    }
    this.service.getuserprofilereport(data).subscribe((res: any) => {
      this.profiledata = res.data[0];
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

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }

  getpastor() {
    this.service.getpastor().subscribe(res => {
      this.pastor = res.data;
    })
  }
  leadership: any;
  details: any;
  pastorname: any;
  phonenumber: any;
  dob: any;
  subcaste: any;
  gender: any;
  designation: any;
  staus: any;
  caste: any;
  nativeplace: any;
  talent: any;
  education: any;
  youtubechanel: any;
  facebook: any;
  about_desp: any;
  lifegoal: any;
  god: any;
  district_id: any;
  constituency_id: any;
  mandal_id: any;
  panchayat_id: any;
  location: any;
  villagename: any;
  church_name: any;
  denomination_id: any;
  total_members: any;
  contactnumber: any;
  description: any;
  village_id: any;
  street: any;
  ministryname: any;
  headname: any;
  denomation_id: any;
  number_ofchurches: any;
  number_ofmembers: any;
  ministrywebsite: any;
  headnmber: any;
  ministryemail: any;
  geteditdtails() {
    var data = {
      category_id: this.categoryid,
      usr_id: sessionStorage.getItem('usr_id')
    }
    this.service.geteditdtails(data).subscribe((res: any) => {
      this.details = res.data[0];
      this.pastorform.patchValue({
        pastorname: this.details.pastorname,
        phonenumber: this.details.phonenumber,
        dob: this.details.dob,
        gender: this.details.gender,
        designation: this.details.designation,
        staus: this.details.staus,
        caste: this.details.caste,
        nativeplace: this.details.nativeplace,
        talent: this.details.talent,
        education: this.details.education,
        youtubechanel: this.details.youtubechanel,
        facebook: this.details.facebook,
        about_desp: this.details.about_desp,
        lifegoal: this.details.lifegoal,
        god: this.details.god,
        district_id: this.details.district_id,
        constituency_id: this.details.constituency_id,
        mandal_id: this.details.mandal_id,
        panchayat_id: this.details.panchayat_id,
        location: this.details.location,
        villagename: this.details.villagename,
        subcaste: this.details.subcaste,
        fellowship: this.details.fellowship,
        position: this.details.position,
        assicoation_id: this.details.assicoation_id


      })


      this.churchregsiterform.patchValue({
        church_name: this.details.church_name,
        denomination_id: this.details.denomination_id,
        pastor_id: this.details.pastor_id,
        total_members: this.details.total_members,
        contactnumber: this.details.contactnumber,
        description: this.details.description,
        district_id: this.details.district_id,
        constituency_id: this.details.constituency_id,
        mandal_id: this.details.mandal_id,
        village_id: this.details.village_id,
        street: this.details.street,
        location: this.details.location,
        password: this.details.password,
        village_name: this.details.village_name,
        churchtype: this.details.churchtype,
        ministry_id: this.details.ministry_id,
        youtube: this.details.youtube,
        facebook: this.details.facebook
      })
      this.updateprofileministry.patchValue({

        firstname: this.details.firstname,
        headnmber: this.details.headnmber,
        denomation: this.details.denomation,
        ministryemail: this.details.ministryemail,
        ministrywebsite: this.details.ministrywebsite,
        number_ofchurches: this.details.number_ofchurches,
        number_ofmembers: this.details.number_ofmembers,
        district_id: this.details.district_id,
        constituency_id: this.details.constituency_id,
        mandal_id: this.details.mandal_id,
        panchayat_id: this.details.panchayat_id,
        password: this.details.password,
        pastor: this.details.pastor,
        description: this.details.description,
        term: this.details.term
      })
      this.beliverform.patchValue({
        fname: this.details.fname,
        whatsapp: this.details.whatsapp,
        dob: this.details.dob,
        gender: this.details.gender,
        email: this.details.email,
        mobile_number: this.details.mobile_number,
        status: this.details.status,
        income: this.details.income,
        caste: this.details.caste,
        subcaste: this.details.subcaste,
        nativeplace: this.details.nativeplace,
        talent: this.details.talent,
        education: this.details.education,
        designation: this.details.designation,
        dpartment: this.details.dpartment,
        districts: this.details.district_id,
        mandals: this.details.mandal_id,
        panchayati: this.details.panchayat_id,
        constituencyname: this.details.constituency_id,
        villagename: this.details.villagename,
        wardnumber: this.details.wardnumber,
        ward: this.details.ward,
        nri: this.details.livingfrom,
        leadership: this.details.leadership,
        leadertype: this.details.leadertype,
        generaltype: this.details.generaltype,
        subward: this.details.subward,
        wingtype: this.details.wingtype,
        wingtypes: this.details.wingtypes,
        denomination_id: this.details.denomination_id,
        hobbies: this.details.hobbies,
        spirti: this.details.spirti,
        lifegoal: this.details.lifegoal,
        church: this.details.church_id,
        pastor: this.details.pastor_id,
        youtube: this.details.youtube,
        lname: this.details.lname,
        god: this.details.god,
      })
      this.studentform.patchValue({
        studentname: this.details.studentname,
        number: this.details.number,
        study: this.details.study,
        schname: this.details.schname,
        fathername: this.details.fathername,
        aboutyourself: this.details.aboutyourself,
        nativeplace: this.details.nativeplace,
        caste: this.details.caste,
        talent: this.details.talent,
        district_id: this.details.district_id,
        constituency_id: this.details.constituency_id,
        mandal_id: this.details.mandal_id,
        village_id: this.details.village_id,
        password: this.details.password,

        church: this.details.church_id,
        pastor: this.details.pastor_id,
        leadership: this.details.leadership,
        leadertype: this.details.leadertype,
        generaltype: this.details.generaltype,
        wingtype: this.details.wingtype,
        wingtypes: this.details.wingtypes,
        dob: this.details.dob,
        denomination_id: this.details.denomination_id,
        hobbies: this.details.hobbies,
        spirti: this.details.spirti,
        lifegoal: this.details.lifegoal,
        whatsappnumber: this.details.whatsappnumber,
        nri: this.details.nri,
        ward: this.details.ward,
        wardnumber: this.details.wardnumber,
        villagename: this.details.villagename,
        respanchayati: this.details.respanchayati,
        resmandals: this.details.resmandals,
        resconstituencyname: this.details.resconstituencyname,
        resdistricts: this.details.resdistricts,
        god: this.details.god,
        term: this.details.term,
        mother: this.details.mother,
        orphon: this.details.orphonintersted,
        subcaste: this.details.subcaste,

      })
      this.independentorgainsationform.patchValue({

        organisation_name: this.details.organisation_name,
        checkbox: this.details.organizationtype,
        believer_id: this.details.believer_id,
        pastor_id: this.details.pastor_id,
        denomation: this.details.denomation,
        org_address: this.details.org_address,
        location: this.details.location,
        contact_num: this.details.contact_num,
        email: this.details.email,
        website: this.details.website,
        service_name: this.details.service_name,
        organizationtype: this.details.organizationtype,
        ministry_id: this.details.ministry_id,
        password: this.details.password,
        districts: this.details.districts,
        constituencyname: this.details.constituencyname,
        mandals: this.details.mandals,
        panchayati: this.details.panchayati,
        villagename: this.details.villagename,
        ward: this.details.ward,
        term: this.details.term,
      })

      this.pastorsassociations.patchValue({
        pa_name: this.details.paname,
        pastor_id: this.details.headname,
        level: this.details.level,
        phonenumber: this.details.phonenumber,
        whatsapp_number: this.details.whatsapp_number,
        totalleadrs: this.details.totalleadrs,
        address: this.details.address,
        district_id: this.details.districtname,
        constituency_id: this.details.constituencyname,
        mandal_id: this.details.mandals,
        village_id: this.details.panchaiti,
        website: this.details.website,
        workingareas: this.details.workingareas,
        description: this.details.description,
        // password: this.details.password,

        // term: this.details.term,

      })


      this.ministryform.patchValue({
        ministryname: this.details.ministryname,
        denomation_id: this.details.denomation_id,
        headname: this.details.headname,
        ministryemail: this.details.ministryemail,
        ministrywebsite: this.details.ministrywebsite,
        headnmber: this.details.headnmber,
        number_ofchurches: this.details.number_ofchurches,
        number_ofmembers: this.details.number_ofmembers,
        district_id: this.details.district_id,
        constituency_id: this.details.constituency_id,
        mandal_id: this.details.mandal_id,
        panchayat_id: this.details.panchayat_id,
        pastor: this.details.pastor,
        personal_secretary: this.details.personal_secretary,
        remarks: this.details.remarks,
        description: this.details.description,
      })
    })
  }

  //////////////////////pastor change/////////////////////
  assicoation: boolean = false;
  pastorassicoation(event: any) {
    var as = event.value
    if (as == 'yes') {
      this.assicoation = true
    } else {
      this.assicoation = false
    }
  }
  wingtypesystem: boolean = false;
  onradioleadertyperajkumar(event: any) {


    var apple = event.target.value
    if (apple == "YES") {
      this.wingtypesystem = true;

    } else {
      this.wingtypesystem = false;
      this.leadtype = false;

    }
  }

  assicoations: any;
  getpastorassciation() {
    this.service.getpastorassci().subscribe(res => {
      this.assicoations = res.data;


    })
  }
  editpastor() {
    this.pastorform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editpastor(this.pastorform.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  // editministry() {
  //   this.pastorform.value.usr_id = sessionStorage.getItem('usr_id');
  //   this.service.editministry(this.ministryform.value).subscribe((res: any) => {
  //     if (res.status == 200) {
  //       Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
  //     } else {
  //       alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
  //     }
  //   })
  // }
  editchurch() {
    this.churchregsiterform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editchurch(this.churchregsiterform.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  editindependentorgainsation() {
    this.independentorgainsationform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editindependentorgainsation(this.independentorgainsationform.value).subscribe((res: any) => {


      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  editindepastororgainsation() {
    this.pastorsassociations.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editpastororgainsation(this.pastorsassociations.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  editbeliver() {
    this.beliverform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editbeliver(this.beliverform.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  editstudent() {
    this.studentform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editstudent(this.studentform.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }
  postministryupdate() {
    this.ministryform.value.usr_id = sessionStorage.getItem('usr_id');
    this.service.editministry(this.ministryform.value).subscribe((res: any) => {


      if (res.status == 200) {
        Swal.fire('Update Successfully')
      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    })
  }


  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
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

  lead: boolean = false;
  mini: boolean = false;
  leadertype: boolean = false;
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
  onsubward(event: any) {
    var s = event.target.value

    if (s == '6') {
      this.subward = true

    } else {
      this.subward = false


    }

  }
  wings: any;
  getwing() {
    this.service.getwing().subscribe((res: any) => {
      this.wings = res.data;
    })
  }
  filterPastor(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastor = reportdata;
    } else if (val == "") {
      this.getpastor();
    }
  }
  form: any
  churchchangewe(event: any) {
    this.form = event.value
  }
  bliversdata: any;
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
  getbelivers() {
    this.service.getbelivers().subscribe((res: any) => {

      this.bliversdata = res.data;
    })
  }
  getpastorassciationas: any;
  pastorfilter() {
    var data = {
      districts: this.beliverform.value.districts,
      constituencyname: this.beliverform.value.constituencyname,
    }

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getpastorassciationas = res.data;
    })
  }
  getchurchstudentfilter: any;
  churchfilter() {
    var data = {
      districts: this.beliverform.value.districts,
      constituencyname: this.beliverform.value.constituencyname,
    }

    this.service.getchurchesdatafilters(data).subscribe((res: any) => {
      this.getchurchstudentfilter = res.data;
    })
  }
  getchurchstudent: any;
  studentchurch() {
    var data = {
      districts: this.studentform.value.resdistricts,
      constituencyname: this.studentform.value.resconstituencyname,
    }

    this.service.getchurchesdatafilters(data).subscribe((res: any) => {
      this.getchurchstudent = res.data;
    })
  }
  getstudentpastor: any
  studentpastor() {
    var data = {
      districts: this.studentform.value.resdistricts,
      constituencyname: this.studentform.value.resconstituencyname,
    }

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getstudentpastor = res.data;
    })
  }
  getministrypastor: any
  ministrypastor() {
    var data = {
      districts: this.studentform.value.district_id,
      constituencyname: this.studentform.value.constituency_id,
      mandal_id: this.studentform.value.mandal_id,

    }
    console.log(data);

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getministrypastor = res.data;
    })
  }
  getministrypast: any;
  churchpastor() {
    var data = {
      districts: this.churchregsiterform.value.district_id,
      constituencyname: this.churchregsiterform.value.constituency_id,
      mandal_id: this.churchregsiterform.value.mandal_id,

    }

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getministrypast = res.data;
      console.log(this.getministrypast)
    })
  }
  getministrypa: any;
  pastororganization() {
    var data = {
      districts: this.independentorgainsationform.value.districts,
      constituencyname: this.independentorgainsationform.value.constituencyname,
    }

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getministrypa = res.data;
    })
  }
  getpastorassociat: any;
  pastorassociation() {
    var data = {
      districts: this.pastorsassociations.value.district_id,
      constituencyname: this.pastorsassociations.value.constituency_id,
    }

    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.getpastorassociat = res.data;
    })
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


  alert() {
    Swal.fire('Hey user!', 'please Login', 'info');
    this.router.navigate(['/login']);
  }

}




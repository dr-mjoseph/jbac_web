import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-church-pastor-search',
  templateUrl: './church-pastor-search.component.html',
  styleUrls: ['./church-pastor-search.component.css']
})
export class ChurchPastorSearchComponent {
  ProofValue: any;
  constituency: any;
  mandals: any;
  districts: any;
  panchayati: any;
  usr_id: any;
  name: any;
  imagesData: any = [];
  bliversdata: any;
  pastor: any;
  now: any;
  denomation: any;
  ministryname: any;
  from_id: any;
  search: FormGroup;
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router) {
    this.search = this.formBuilder.group({
      district_id: ['', [Validators.required]],
      constituency_id: [''],
      mandal_id: [''],
      // village_id:[''],
      pastor_id: [''],
      church: [''],
      checkbox: ['']
    })

  }
  ngOnInit(): void {
    this.getdistric();
    this.defaultdata();
  }
  getpastorassciationas: any;
  pastorfilter() {
    if (this.search.value.district_id == '' || this.search.value.constituency_id == '' || this.search.value.mandal_id == '') {
      alert("Please Fill the Districts & Constituency & Mandal")
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id
      }
      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getpastorassciationas = res.data;
      })
    }
  }
  getchurchfilter: any;
  getchurchesdata() {
    if (this.search.value.district_id == '' || this.search.value.constituency_id == '' || this.search.value.mandal_id == '') {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id
      }


      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchfilter = res.data;
      })
    }
  }



  defaultdata() {
    var data = { df: 0 }
    this.service.searchmarriages(data).subscribe((res: any) => {
      this.getpastorassciationas = [];
      if (res.status == 200) {
        this.getpastorassciationas = res.data.map((item: any) => ({
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
    })
  }
  searchdist: any;
  searchdistric(event: any) {
    this.searchdist = event.target.value
    var data = {
      district_id: this.searchdist,
      df: 1
    }
    this.service.searchpastors(data).subscribe((res: any) => {
      this.getpastorassciationas = [];
      if (res.status == 200) {
        this.getpastorassciationas = res.data.map((item: any) => ({
          ...item, showMore: false
        }));
        console.log(this.getpastorassciationas);

      } else {
        alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
      }
    },
      error => {
      })
  }


  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  postinsututies() {

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
  form: any;

  churchchangewe(event: any) {
    this.form = event.value
  }
  afterchanges: any;
  churchview() {
    if (this.search.value.district_id == '' || this.search.value.constituency_id == '') {
      alert("Please Fill the Districts & Constituency")
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id,
        // village_id:this.search.value.village_id,

        church: this.search.value.church,
      }
      console.log(data);
      this.service.viewupdates(data).subscribe((res: any) => {
        console.log(res.data);

        this.afterchanges = res.data;
        console.log(res.data, 'hello');

        this.search.reset();
      })
    }
  }
  afterchangespastor: any;
  pastorview() {
    if (this.search.value.district_id == '' || this.search.value.constituency_id == '' || this.search.value.mandal_id == '') {
      alert("Please Fill the Districts & Constituency")
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id,
        // village_id:this.search.value.village_id,
        pastor_id: this.search.value.pastor_id,

      }
      console.log(data);
      this.service.viewpastorupdates(data).subscribe((res: any) => {
        console.log(res.data, 'hello');

        this.afterchangespastor = res.data;
        this.search.reset();
      })
    }
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



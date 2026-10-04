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
    var data = { df: 0 };
    this.service.searchpastors(data).subscribe({
      next: (res: any) => {
        this.getpastorassciationas = [];
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.getpastorassciationas = res.data.map((item: any) => ({
            ...item, showMore: false
          }));
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  getdistric() {
    this.service.getdistrict().subscribe({
      next: res => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.districts = res.data;
        }
      },
      error: err => console.error(err)
    });
  }

  searchdist: any;

  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdist = id;
    this.search.patchValue({ district_id: id, constituency_id: '', mandal_id: '', pastor_id: '', church: '' });
    this.constituency = [];
    this.mandals = [];
    this.getpastorassciationas = [];
    this.getchurchfilter = [];
    if (id) {
      this.service.getconsistencys().subscribe(res => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
        }
      });
      this.service.searchpastors({ district_id: id, df: 1 }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.getpastorassciationas = res.data;
        }
      });
    }
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.search.patchValue({ constituency_id: id, mandal_id: '', pastor_id: '', church: '' });
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getmandals().subscribe(res => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == id);
        }
      });
    }
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.search.patchValue({ mandal_id: id, pastor_id: '', church: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis(id).subscribe((res: any) => {
        if (res && res.data) {
          this.panchayati = res.data.filter((data: any) => !id || data.mndl_id == id);
        }
      });
    }
    if (this.form == 1) {
      this.pastorfilter();
    } else if (this.form == 2) {
      this.getchurchesdata();
    }
  }

  // Aliases for template backwards-compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  getconstency(event: any) { this.onDistrictChange(event); }
  getmandals(event: any) { this.onConstituencyChange(event); }
  gepanchayati(event: any) { this.onMandalChange(event); }

  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  postinsututies() {
  }

  form: any;

  churchchangewe(event: any) {
    this.form = event ? (event.value || event) : null;
    if (this.search.value.district_id && this.search.value.constituency_id && this.search.value.mandal_id) {
      if (this.form == 1) {
        this.pastorfilter();
      } else if (this.form == 2) {
        this.getchurchesdata();
      }
    }
  }

  afterchanges: any;
  churchview() {
    if (!this.search.value.district_id || !this.search.value.constituency_id) {
      alert("Please Fill the Districts & Constituency");
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id,
        church: this.search.value.church,
      };
      this.service.viewupdates(data).subscribe({
        next: (res: any) => {
          this.afterchanges = res.data || [];
        },
        error: err => console.error(err)
      });
    }
  }

  afterchangespastor: any;
  pastorview() {
    if (!this.search.value.district_id || !this.search.value.constituency_id) {
      alert("Please Fill the Districts & Constituency");
    } else {
      var data = {
        districts: this.search.value.district_id,
        constituencyname: this.search.value.constituency_id,
        mandal_id: this.search.value.mandal_id,
        pastor_id: this.search.value.pastor_id,
      };
      this.service.viewpastorupdates(data).subscribe({
        next: (res: any) => {
          this.afterchangespastor = res.data || [];
        },
        error: err => console.error(err)
      });
    }
  }

  reset() {
    this.search.reset({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      pastor_id: '',
      church: '',
      checkbox: ''
    });
    this.form = null;
    this.constituency = [];
    this.mandals = [];
    this.afterchanges = [];
    this.afterchangespastor = [];
    this.getpastorassciationas = [];
    this.getchurchfilter = [];
    this.defaultdata();
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



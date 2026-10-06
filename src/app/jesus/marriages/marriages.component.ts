import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marriages',
  templateUrl: './marriages.component.html',
  styleUrls: ['./marriages.component.css']
})
export class MarriagesComponent {
  serachMeetingform: any
  districts: any;
  constituency: any;
  panchayati: any;
  mandals: any;
  searchdist: any;
  marriagedata: any;
  searchconts: any;
  searchmand: any;
  adds: any;
  ministryname: any;
  denomation: any;

  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {
    if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.serachMeetingform = this.fromb.group({
      denomation_id: [''],
      ministry_id: [''],
      gender: [''],
      status: [''],
      caste: [''],
      spirti: [''],
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
    })

    this.getdistric();
    this.defaultdata();
    this.getadds();
    this.getbeliver();
    this.getdenomations();
  }

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  serach(event: any, tableid: any) {
    const val = event && event.target ? event.target.value : event;
    const data = {
      name: val,
      columnid: tableid
    };
    this.service.searchingmarriages(data).subscribe((res: any) => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
      }
    });
  }
  noRecordsFound: boolean = false;
  hasSearched: boolean = false;
  showSpinner: boolean = false;

  getDenominationName(id: any): string {
    if (!id || !this.denomation || !Array.isArray(this.denomation)) return '';
    const found = this.denomation.find((d: any) => d.id == id);
    return found ? (found.denomation_name || found.denomination_name || '') : '';
  }

  getMinistryName(id: any): string {
    if (!id || !this.ministryname || !Array.isArray(this.ministryname)) return '';
    const found = this.ministryname.find((m: any) => m.id == id);
    return found ? (found.ministryname || found.name || '') : '';
  }

  defaultdata() {
    var data = { df: 0 };
    this.service.searchmarriages(data).subscribe((res: any) => {
      this.marriagedata = [];
      if (res && res.status == 200 && Array.isArray(res.data)) {
        const validRows = res.data.filter((item: any) => item && (item.name || item.phonenumber || item.work));
        if (validRows.length > 0) {
          this.marriagedata = validRows.map((item: any) => ({
            ...item,
            showMore: false
          }));
          this.noRecordsFound = false;
        } else {
          this.noRecordsFound = true;
        }
      } else {
        this.noRecordsFound = true;
      }
    }, error => {
      this.noRecordsFound = true;
    });
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
    });
  }

  getconstency(event: any) {
    var id = event && event.target ? event.target.value : event;
    this.service.getconsistencys(id).subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
    });
  }

  gepanchayati(event: any) {
    var id = event && event.target ? event.target.value : event;
    this.service.gepanchayatis(id).subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
      }
    }, error => {
      console.log(error);
    });
  }

  getmandals(event: any) {
    var id = event && event.target ? event.target.value : event;
    this.service.getmandals(id).subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
      }
    }, error => {
      console.log(error);
    });
  }

  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdist = id;
    this.serachMeetingform.patchValue({ district_id: id, constenncy_id: '', mandal_id: '', panchayati_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getconsistencys(id).subscribe(res => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
        }
      });
    }
    this.search();
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchconts = id;
    this.serachMeetingform.patchValue({ constenncy_id: id, mandal_id: '', panchayati_id: '' });
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getmandals(id).subscribe(res => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == id);
        }
      });
    }
    this.search();
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchmand = id;
    this.serachMeetingform.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis(id).subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
        }
      });
    }
    this.search();
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.serachMeetingform.patchValue({ panchayati_id: id });
    this.search();
  }

  // Aliases for template backwards-compatibility
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }
  searchvillages(event: any) { this.onPanchayatiChange(event); }

  search() {
    const vals = this.serachMeetingform.value || {};
    const data: any = {};
    if (vals.district_id || this.searchdist) data.district_id = vals.district_id || this.searchdist;
    if (vals.constenncy_id || this.searchconts) data.constituency_id = vals.constenncy_id || this.searchconts;
    if (vals.mandal_id || this.searchmand) data.mandal_id = vals.mandal_id || this.searchmand;
    if (vals.panchayati_id) {
      data.panchayati_id = vals.panchayati_id;
      data.village_id = vals.panchayati_id;
    }
    if (vals.denomation_id) data.denomation_id = vals.denomation_id;
    if (vals.ministry_id) data.ministry_id = vals.ministry_id;
    if (vals.gender) data.gender = vals.gender;
    if (vals.status) data.status = vals.status;
    if (vals.caste) data.caste = vals.caste;
    if (vals.spirti) data.spirti = vals.spirti;

    this.hasSearched = true;
    this.showSpinner = true;
    this.service.searchmarriages(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        this.marriagedata = [];
        if (res && res.status == 200 && Array.isArray(res.data) && res.data.length > 0) {
          this.noRecordsFound = false;
          this.marriagedata = res.data.map((item: any) => ({
            ...item,
            showMore: false
          }));
        } else {
          this.noRecordsFound = true;
          Swal.fire({
            icon: 'info',
            title: 'No Records Found',
            text: 'You have no records / No records found matching the search criteria.',
            confirmButtonColor: '#3085d6'
          });
        }
      },
      error: err => {
        this.showSpinner = false;
        this.noRecordsFound = true;
        console.error(err);
      }
    });
  }

  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }

  proofmodalDismis() {
    this.modalService.dismissAll();
  }
  isShowDiv = true;

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  toggleShowMore(item: any) {
    if (item) {
      item.showMore = !item.showMore;
    }
  }

  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
    }, error => {
    });
  }

  searchdata(ev: any) {
    let reportdata = [];
    const val = ev && ev.target ? ev.target.value : ev;
    if (val && val.trim() != '') {
      reportdata = this.marriagedata.filter((item: any) => {
        return (JSON.stringify(item).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.marriagedata = reportdata;
    }
  }

  searchTerm: any;
  filterData() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.defaultdata();
      return;
    }
    this.marriagedata = this.marriagedata.filter((item: any) => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
    });
  }

  getbeliver() {
    this.service.getministry().subscribe(res => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.ministryname = res.data
          .filter((item: any) => item && (item.ministryname || item.name) && (item.ministryname || item.name).trim() !== '')
          .map((item: any) => ({ ...item, ministryname: (item.ministryname || item.name).trim() }))
          .sort((a: any, b: any) => a.ministryname.localeCompare(b.ministryname));
      } else if (res && res.status == 202) {
        Swal.fire(res.message);
      }
    }, error => {
      this.service.getbeliversdata().subscribe((bRes: any) => {
        if (bRes && bRes.status == 200 && Array.isArray(bRes.data)) {
          this.ministryname = bRes.data
            .filter((item: any) => item && (item.ministryname || item.name) && (item.ministryname || item.name).trim() !== '')
            .map((item: any) => ({ ...item, ministryname: (item.ministryname || item.name).trim() }))
            .sort((a: any, b: any) => a.ministryname.localeCompare(b.ministryname));
        }
      });
    });
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      if (res && res.status == 200 && Array.isArray(res.data)) {
        this.denomation = res.data;
      }
    });
  }

  serachgender(event: any, tableid?: any) {
    this.search();
  }

  serachcaste(event: any, tableid?: any) {
    this.search();
  }

  spirit(event: any, tableid?: any) {
    this.search();
  }

  reset() {
    this.serachMeetingform.reset({
      denomation_id: '',
      ministry_id: '',
      gender: '',
      status: '',
      caste: '',
      spirti: '',
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.searchTerm = '';
    this.noRecordsFound = false;
    this.hasSearched = false;
    this.defaultdata();
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


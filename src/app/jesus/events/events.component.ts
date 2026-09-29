import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  // serachMeetingform: FormGroup;
  searchdenomation: FormGroup;
  form_ind: any;
  youth: any;
  revival: any;
  showSpinner: boolean = false;
  women: any;
  pastor: any;
  childern: any;
  musical: any;
  mandals: any = [];
  constituency: any = [];
  districts: any = [];
  searchevents: any = [];
  allEvents: any[] = [];
  todayEventsCount: number = 0;
  upcomingEventsCount: number = 0;
  activeTab: 'today' | 'upcoming' = 'today';
  mettingtype: any;
  denomation: any;
  ministryname: any;
  speaks: any;
  startdate: any;
  submitted: boolean = false;
  ministry_id: any;
  pastors: any;
  showFilters = false;
  searchdist: any;
  searchconts: any;
  searchdeno: any;
  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {

    this.searchdenomation = this.fromb.group({
      mettingtype: [''],
      denomation_id: [''],
      speakerone: [''],
      ministry_id: [''],
      startdate: [''],
      district_id: [''],
      constenncy_id: [''],
      mandal_id: [''],
      panchayati_id: [''],
    })
  }
  now: any;
  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.getpastors();
    this.getyouth();
    this.getrevival();
    this.getwomen();
    this.getpastor();
    this.getchildern();
    this.getmusical();
    this.getdistric();
    this.searechevents();
    this.getadds();
    this.getdenomations();
    this.getbeliver();
  }
  get h() { return this.searchdenomation.controls; }

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
  getpastors() {
    this.service.getpastor().subscribe(res => {
      console.log(res.data, 'joo');

      this.pastors = res.data;
    })
  }
  formshow(id: any) {
    this.form_ind = id
  }
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

  getyouth() {
    this.showSpinner = true;
    this.service.getyouth().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.youth = res.data;
      }
    }, error => {
      this.showSpinner = false;
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

  getrevival() {
    this.showSpinner = true;
    this.service.getrevival().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.revival = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }


  getwomen() {
    this.showSpinner = true;
    this.service.getwomen().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.women = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }

  getpastor() {
    this.showSpinner = true;
    this.service.getpastormeeting().subscribe(res => {
      console.log(res.data, 'hii');

      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.pastor = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }

  getchildern() {
    this.showSpinner = true;
    this.service.getchildern().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.childern = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })

  }
  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
  }

  getmusical() {
    this.showSpinner = true;
    this.service.getmusicals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.showSpinner = false;
        this.musical = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })
  }
  adds: any;
  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
      console.log(res.data), 'hhh';
    }, error => {
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

  trimString(string: any, length: any) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  formatDateString(dateVal: any): string {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }

  isCurrentDateEvent(event: any): boolean {
    const today = this.now;
    if (!today) return true;
    const start = this.formatDateString(event.startdate);
    const end = this.formatDateString(event.enddate);
    if (start && end) {
      return start <= today && end >= today;
    }
    if (start) {
      return start === today;
    }
    if (end) {
      return end === today;
    }
    return false;
  }

  isOldMeeting(event: any): boolean {
    const today = this.now;
    if (!today) return false;
    const end = this.formatDateString(event.enddate);
    const start = this.formatDateString(event.startdate);
    if (end) {
      return end < today;
    }
    if (start) {
      return start < today;
    }
    return false;
  }

  isUpcomingMeeting(event: any): boolean {
    const today = this.now;
    if (!today) return false;
    const start = this.formatDateString(event.startdate);
    return Boolean(start && start > today);
  }

  setMeetingTab(tab: 'today' | 'upcoming') {
    this.activeTab = tab;
    this.displayEventsForCurrentTab();
  }

  displayEventsForCurrentTab(sourceList?: any[]) {
    const list = sourceList || this.allEvents;
    if (this.activeTab === 'today') {
      this.searchevents = list.filter(item => this.isCurrentDateEvent(item));
    } else {
      this.searchevents = list.filter(item => this.isUpcomingMeeting(item));
    }
  }

  updateCounts() {
    this.todayEventsCount = this.allEvents.filter(e => this.isCurrentDateEvent(e)).length;
    this.upcomingEventsCount = this.allEvents.filter(e => this.isUpcomingMeeting(e)).length;
  }

  searechevents() {
    this.showSpinner = true;
    this.service.getevents().subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          const raw = res.data || [];
          // Exclude old meetings completely
          this.allEvents = raw
            .filter((item: any) => !this.isOldMeeting(item))
            .map((item: any) => ({ ...item, showMore: false }));
          this.updateCounts();
          this.displayEventsForCurrentTab();
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error(err);
      }
    });
  }

  panchayati: any = [];

  // Unified cascading dropdown handlers
  onDistrictChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdist = id;
    this.searchdenomation.patchValue({ district_id: id, constenncy_id: '', mandal_id: '', panchayati_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getconsistencys().subscribe(res => {
        if (res && res.data) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
        }
      });
    }
    this.applyCombinedFilter();
  }

  onConstituencyChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchconts = id;
    this.searchdenomation.patchValue({ constenncy_id: id, mandal_id: '', panchayati_id: '' });
    this.mandals = [];
    this.panchayati = [];
    if (id) {
      this.service.getmandals().subscribe(res => {
        if (res && res.data) {
          this.mandals = res.data.filter((data: any) => data.const_id == id);
        }
      });
    }
    this.applyCombinedFilter();
  }

  onMandalChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdenomation.patchValue({ mandal_id: id, panchayati_id: '' });
    this.panchayati = [];
    if (id) {
      this.service.gepanchayatis().subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
        }
      });
    }
    this.applyCombinedFilter();
  }

  onPanchayatiChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchdenomation.patchValue({ panchayati_id: id });
    this.applyCombinedFilter();
  }

  onDateChange(event: any) {
    const dateVal = event && event.target ? event.target.value : event;
    this.startdate = dateVal;
    this.searchdenomation.patchValue({ startdate: dateVal });
    this.applyCombinedFilter();
  }

  onMeetingTypeChange(event: any) {
    const val = event && event.target ? event.target.value : event;
    this.mettingtype = val;
    this.searchdenomation.patchValue({ mettingtype: val });
    this.applyCombinedFilter();
  }

  onDenominationChange(event: any) {
    const val = event && event.target ? event.target.value : event;
    this.searchdeno = val;
    this.searchdenomation.patchValue({ denomation_id: val });
    this.applyCombinedFilter();
  }

  onSpeakerChange(event: any) {
    const val = event && event.target ? event.target.value : event;
    this.speaks = val;
    this.searchdenomation.patchValue({ speakerone: val });
    this.applyCombinedFilter();
  }

  onMinistryChange(event: any) {
    const val = event && event.target ? event.target.value : event;
    this.ministry_id = val;
    this.searchdenomation.patchValue({ ministry_id: val });
    this.applyCombinedFilter();
  }

  // Backward-compatibility wrappers for any old references
  getconstency(event: any) { this.onDistrictChange(event); }
  gepanchayati(event: any) { this.onMandalChange(event); }
  searchchange(event: any) { this.onMeetingTypeChange(event); }
  searchdenomationdata(event: any) { this.onDenominationChange(event); }
  searchspeak(event: any) { this.onSpeakerChange(event); }
  ministry(event: any) { this.onMinistryChange(event); }
  searchdistric(event: any) { this.onDistrictChange(event); }
  searchconstenct(event: any) { this.onConstituencyChange(event); }
  searchmandals(event: any) { this.onMandalChange(event); }

  applyCombinedFilter() {
    const formVals = this.searchdenomation.value || {};
    const queryPayload: any = {
      district_id: formVals.district_id || this.searchdist || '',
      constituency_id: formVals.constenncy_id || this.searchconts || '',
      constenncy_id: formVals.constenncy_id || this.searchconts || '',
      mandal_id: formVals.mandal_id || '',
      panchayati_id: formVals.panchayati_id || '',
      startdate: formVals.startdate || this.startdate || '',
      mettingtype: formVals.mettingtype || this.mettingtype || '',
      denomation: formVals.denomation_id || this.searchdeno || '',
      denomation_id: formVals.denomation_id || this.searchdeno || '',
      speakerone: formVals.speakerone || this.speaks || '',
      ministry_id: formVals.ministry_id || this.ministry_id || '',
    };

    const hasFilter = Object.keys(queryPayload).some(k => queryPayload[k] !== '' && queryPayload[k] != null);
    if (!hasFilter) {
      this.displayEventsForCurrentTab();
      return;
    }

    this.service.searchingdata(queryPayload).subscribe({
      next: (res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          const results = res.data
            .filter((item: any) => !this.isOldMeeting(item))
            .map((item: any) => ({ ...item, showMore: false }));
          if (queryPayload.startdate) {
            this.searchevents = results;
          } else {
            this.displayEventsForCurrentTab(results);
          }
        } else {
          this.applyClientSideFilter(queryPayload);
        }
      },
      error: () => {
        this.applyClientSideFilter(queryPayload);
      }
    });
  }

  applyClientSideFilter(payload: any) {
    let filtered = this.allEvents.filter(item => !this.isOldMeeting(item));
    if (payload.district_id) {
      filtered = filtered.filter(item => item.district_id == payload.district_id || item.distrct_id == payload.district_id);
    }
    if (payload.constituency_id || payload.constenncy_id) {
      const cid = payload.constituency_id || payload.constenncy_id;
      filtered = filtered.filter(item => item.constituency_id == cid || item.constenncy_id == cid || item.const_id == cid);
    }
    if (payload.mandal_id) {
      filtered = filtered.filter(item => item.mandal_id == payload.mandal_id || item.mndl_id == payload.mandal_id);
    }
    if (payload.panchayati_id) {
      filtered = filtered.filter(item => item.panchayati_id == payload.panchayati_id || item.pnchyt_id == payload.panchayati_id);
    }
    if (payload.startdate) {
      filtered = filtered.filter(item => {
        const itemStart = this.formatDateString(item.startdate);
        const itemEnd = this.formatDateString(item.enddate);
        if (itemStart && itemEnd) {
          return itemStart <= payload.startdate && itemEnd >= payload.startdate;
        }
        return itemStart === payload.startdate;
      });
      this.searchevents = filtered;
      return;
    }
    if (payload.mettingtype) {
      filtered = filtered.filter(item => item.mettingtype == payload.mettingtype);
    }
    if (payload.denomation || payload.denomation_id) {
      const did = payload.denomation || payload.denomation_id;
      filtered = filtered.filter(item => item.denomation == did || item.denomation_id == did);
    }
    if (payload.speakerone) {
      filtered = filtered.filter(item => item.speakerone == payload.speakerone);
    }
    if (payload.ministry_id) {
      filtered = filtered.filter(item => item.ministry_id == payload.ministry_id);
    }
    this.displayEventsForCurrentTab(filtered);
  }

  search(event?: any) {
    this.submitted = true;
    this.applyCombinedFilter();
  }

  filterPastor(inputValue: any) {
    let val = inputValue ? (inputValue.value || inputValue) : '';
    if (val && typeof val === 'string' && val.trim() != '') {
      this.pastors = (this.pastors || []).filter((item: any) =>
        item.pastorname && item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1
      );
    } else {
      this.getpastors();
    }
  }

  searchdenomationalldata() {
    this.applyCombinedFilter();
  }

  reset() {
    this.searchdenomation.reset({
      mettingtype: '',
      denomation_id: '',
      speakerone: '',
      ministry_id: '',
      startdate: '',
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.mettingtype = '';
    this.searchdeno = '';
    this.speaks = '';
    this.ministry_id = '';
    this.startdate = '';
    this.searchdist = '';
    this.searchconts = '';
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.activeTab = 'today';
    this.submitted = false;
    this.searechevents();
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

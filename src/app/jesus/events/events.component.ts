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
  showSpinner: boolean = true;
  women: any;
  pastor: any;
  childern: any;
  musical: any;
  mandals: any = [];
  constituency: any = [];
  districts: any = [];
  states: any = [
    { id: 1, state_name: 'ఆంధ్రప్రదేశ్ - Andhra Pradesh (AP)', code: 'AP' },
    { id: 2, state_name: 'తెలంగాణ - Telangana (TG)', code: 'TG' }
  ];
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
  searchstate: any = '';
  searchdist: any;
  searchconts: any;
  searchdeno: any;
  constructor(public service: ServiceService, private modalService: NgbModal, private fromb: FormBuilder, private router: Router) {

    this.searchdenomation = this.fromb.group({
      state_id: [''],
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
  now: string = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd') || '';
  ngOnInit(): void {
    const datePipe = new DatePipe('en-US');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd') || this.now;
    this.showSpinner = true;
    this.getstates();
    this.getpastors();
    this.getdistric();
    this.getdenomations();
    this.getRibbonEvents();
    this.searechevents();
  }
  get h() { return this.searchdenomation.controls; }

  getstates() {
    this.service.getstates().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.states = res.data;
      }
    });
  }

  getdistric(stateId?: any) {
    this.service.getdistrict(stateId).subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.districts = res.data;
      }
    }, error => {
      console.log(error);
    });
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
    this.service.getyouth().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.youth = res.data;
      }
    }, error => {
      console.error(error);
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

  getrevival() {
    this.service.getrevival().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.revival = res.data;
      }
    }, error => {
      console.error(error);
    });
  }


  getwomen() {
    this.service.getwomen().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.women = res.data;
      }
    }, error => {
      console.error(error);
    });
  }

  getpastor() {
    this.service.getpastormeeting().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.pastor = res.data;
      }
    }, error => {
      console.error(error);
    });
  }

  getchildern() {
    this.service.getchildern().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.childern = res.data;
      }
    }, error => {
      console.error(error);
    });
  }
  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
      console.log(res.data);

    })
  }

  getmusical() {
    this.service.getmusicals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.musical = res.data;
      }
    }, error => {
      console.error(error);
    });
  }

  ribbonEvents: any[] = [];
  adds: any[] = [];

  getRibbonEvents() {
    this.service.getRibbonEvents().subscribe({
      next: (res: any) => {
        const raw = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        // Display if and only if there is 1 in d_in column AND meeting dates have not passed
        this.ribbonEvents = (raw || []).filter((item: any) => item && (item.d_in == 1 || item.d_in === '1') && !this.isOldMeeting(item));
      },
      error: (err: any) => {
        console.error('getRibbonEvents error:', err);
        this.ribbonEvents = [];
      }
    });
  }

  getSafeImageUrl(url: any): string {
    if (!url || url === 'undefined' || url === 'null') {
      return 'assets/images/no.jpg';
    }
    const trimmed = String(url).trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
      return 'assets/images/no.jpg';
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('assets/')) {
      return trimmed;
    }
    return `https://jbac.in/websiteimages/${trimmed}`;
  }

  onImageError(event: any): void {
    if (event && event.target) {
      event.target.src = 'assets/images/no.jpg';
    }
  }

  getadds() {
    this.getRibbonEvents();
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
    if (typeof dateVal === 'string') {
      const match = dateVal.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
      const ddmmyyyy = dateVal.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (ddmmyyyy) {
        return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`;
      }
    }
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
    const today = this.now || this.formatDateString(new Date());
    if (!today || !event) return true;
    const start = this.formatDateString(event.startdate || event.event_date);
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
    const today = this.now || this.formatDateString(new Date());
    if (!today || !event) return false;
    const end = this.formatDateString(event.enddate);
    const start = this.formatDateString(event.startdate || event.event_date);
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

  sortEventsAscending(list: any[]): any[] {
    const today = this.now || this.formatDateString(new Date());
    return list.sort((a, b) => {
      const startA = this.formatDateString(a.startdate || a.event_date);
      const startB = this.formatDateString(b.startdate || b.event_date);
      // Meetings happening today or ongoing with enddate >= today appear first
      const effA = (startA && startA < today) ? today : (startA || '9999-99-99');
      const effB = (startB && startB < today) ? today : (startB || '9999-99-99');
      if (effA !== effB) {
        return effA.localeCompare(effB);
      }
      if (startA !== startB) {
        return (startA || '').localeCompare(startB || '');
      }
      return Number(a.id || 0) - Number(b.id || 0);
    });
  }

  displayEvents(sourceList?: any[]) {
    const list = sourceList ? [...sourceList] : [...this.allEvents];
    this.sortEventsAscending(list);
    this.searchevents = list;
  }

  // Backward compatibility aliases
  setMeetingTab(tab: 'today' | 'upcoming') {
    this.activeTab = tab;
    this.displayEvents();
  }

  displayEventsForCurrentTab(sourceList?: any[]) {
    this.displayEvents(sourceList);
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
          const dInItems = raw.filter((item: any) => item && (item.d_in == 1 || item.d_in === '1') && !this.isOldMeeting(item));
          if (dInItems.length > 0 && this.ribbonEvents.length === 0) {
            this.ribbonEvents = dInItems;
          }
          // Exclude old meetings completely and display active/future in ascending date order
          this.allEvents = raw
            .filter((item: any) => !this.isOldMeeting(item))
            .map((item: any) => ({ ...item, showMore: false }));
          this.updateCounts();
          this.displayEvents();
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
  onStateChange(event: any) {
    const id = event && event.target ? event.target.value : event;
    this.searchstate = id;
    this.searchdenomation.patchValue({
      state_id: id,
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.searchdist = '';
    this.searchconts = '';
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(id);
    this.applyCombinedFilter();
  }

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
      this.service.gepanchayatis(id).subscribe(res => {
        if (res && res.status == 200 && res.data) {
          this.panchayati = res.data.filter((data: any) => !id || data.mndl_id == id);
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
      state_id: formVals.state_id || this.searchstate || '',
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
      this.displayEvents();
      return;
    }

    this.showSpinner = true;
    this.service.searchingdata(queryPayload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res && res.status == 200 && Array.isArray(res.data)) {
          const results = res.data
            .filter((item: any) => !this.isOldMeeting(item))
            .map((item: any) => ({ ...item, showMore: false }));
          this.displayEvents(results);
        } else {
          this.applyClientSideFilter(queryPayload);
        }
      },
      error: () => {
        this.showSpinner = false;
        this.applyClientSideFilter(queryPayload);
      }
    });
  }

  applyClientSideFilter(payload: any) {
    this.showSpinner = false;
    let filtered = this.allEvents.filter(item => !this.isOldMeeting(item));
    if (payload.state_id) {
      const targetState = Number(payload.state_id);
      filtered = filtered.filter(item => {
        const did = item.district_id ? Number(item.district_id) : (item.distrct_id ? Number(item.distrct_id) : null);
        let itemState = Number(item.state_id);
        if (did) {
          itemState = did >= 31 ? 2 : 1;
        } else if (!itemState) {
          itemState = 1;
        }
        return itemState === targetState;
      });
    }
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
    this.displayEvents(filtered);
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
      state_id: '',
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
    this.searchstate = '';
    this.mettingtype = '';
    this.searchdeno = '';
    this.speaks = '';
    this.ministry_id = '';
    this.startdate = '';
    this.searchdist = '';
    this.searchconts = '';
    this.getdistric();
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.activeTab = 'today';
    this.submitted = false;
    this.showSpinner = true;
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

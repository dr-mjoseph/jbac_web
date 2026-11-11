import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  showFilters: boolean = false;
  addinghelp: FormGroup;
  imagesData: any = [];
  showSpinner: boolean = false;
  submitted: boolean = false;

  denomation: any[] = [];
  districts: any[] = [];
  constituencies: any[] = [];
  mandals: any[] = [];
  panchayats: any[] = [];
  adds: any;
  searchevents: any;
  image: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.addinghelp = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      denomination_id: ['', [Validators.required]],
      state_id: ['', [Validators.required]],
      district_id: [{ value: '', disabled: true }, [Validators.required]],
      constituency_id: [{ value: '', disabled: true }, [Validators.required]],
      mandal_id: [{ value: '', disabled: true }, [Validators.required]],
      panchayat_id: [{ value: '', disabled: true }, [Validators.required]],
      address: ['', [Validators.required]],
      help: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['']
    });
  }

  get h() { return this.addinghelp.controls; }

  ngOnInit(): void {
    if (sessionStorage.getItem('auth_ind') == '' || sessionStorage.getItem('auth_ind') == null || sessionStorage.getItem('auth_ind') == undefined) {
      Swal.fire('Login Required');
      this.router.navigate(['/']);
    }

    this.getdenomations();
    this.getadds();
  }

  getdenomations(): void {
    this.service.getdenomation().subscribe(
      (res: any) => {
        this.denomation = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      },
      () => {
        this.denomation = [];
      }
    );
  }

  onStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.addinghelp.get('district_id');
    const ctrlConst = this.addinghelp.get('constituency_id');
    const ctrlMndl = this.addinghelp.get('mandal_id');
    const ctrlPanch = this.addinghelp.get('panchayat_id');

    this.districts = [];
    this.constituencies = [];
    this.mandals = [];
    this.panchayats = [];

    ctrlDist?.reset('');
    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlConst?.disable();
    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (stateId) {
      ctrlDist?.enable();
      this.service.getdistrict(stateId).subscribe(
        (res: any) => {
          this.districts = res?.data || [];
        },
        () => {
          this.districts = [];
        }
      );
    } else {
      ctrlDist?.disable();
    }
  }

  onDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.addinghelp.get('constituency_id');
    const ctrlMndl = this.addinghelp.get('mandal_id');
    const ctrlPanch = this.addinghelp.get('panchayat_id');

    this.constituencies = [];
    this.mandals = [];
    this.panchayats = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe(
        (res: any) => {
          const list = res?.data || [];
          const filtered = list.filter((item: any) => item.dstrct_id == districtId);
          this.constituencies = filtered.length > 0 ? filtered : list;
        },
        () => {
          this.constituencies = [];
        }
      );
    } else {
      ctrlConst?.disable();
    }
  }

  onConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.addinghelp.get('mandal_id');
    const ctrlPanch = this.addinghelp.get('panchayat_id');

    this.mandals = [];
    this.panchayats = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe(
        (res: any) => {
          const list = res?.data || [];
          const filtered = list.filter((item: any) => item.const_id == constId);
          this.mandals = filtered.length > 0 ? filtered : list;
        },
        () => {
          this.mandals = [];
        }
      );
    } else {
      ctrlMndl?.disable();
    }
  }

  onMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.addinghelp.get('panchayat_id');

    this.panchayats = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe(
        (res: any) => {
          const list = res?.data || [];
          const filtered = list.filter((item: any) => item.mndl_id == mandalId);
          this.panchayats = filtered.length > 0 ? filtered : list;
        },
        () => {
          this.panchayats = [];
        }
      );
    } else {
      ctrlPanch?.disable();
    }
  }

  numericOnly(event: any): boolean {
    const patt = /^([0-9])$/;
    return patt.test(event.key);
  }

  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imgFile = reader.result as string;
        const bfile_typeEmpl = e.target.files[0].name.split('.');
        const imgtype = bfile_typeEmpl[bfile_typeEmpl.length - 1];
        this.imagesData = [];
        this.imagesData.push({ reviewimg: imgFile, filetype: imgtype });
      };
    }
  }

  resetFormCompletely(): void {
    this.submitted = false;
    this.addinghelp.reset({
      name: '',
      mobile_number: '',
      denomination_id: '',
      state_id: '',
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayat_id: '',
      address: '',
      help: '',
      description: '',
      image: ''
    });

    this.addinghelp.get('district_id')?.disable();
    this.addinghelp.get('constituency_id')?.disable();
    this.addinghelp.get('mandal_id')?.disable();
    this.addinghelp.get('panchayat_id')?.disable();

    this.districts = [];
    this.constituencies = [];
    this.mandals = [];
    this.panchayats = [];
    this.imagesData = [];

    const fileEl = document.getElementById('formFile') as HTMLInputElement;
    if (fileEl) {
      fileEl.value = '';
    }
  }

  postmeetings() {
    this.submitted = true;
    const raw = this.addinghelp.getRawValue();

    if (
      this.addinghelp.invalid ||
      !raw.state_id ||
      !raw.district_id ||
      !raw.constituency_id ||
      !raw.mandal_id ||
      !raw.panchayat_id
    ) {
      Swal.fire('దయచేసి అన్ని వివరాలను మరియు రాష్ట్రం నుండి పంచాయతీ/వార్డు వరకు క్రమంలో ఎంచుకోండి');
      return;
    }

    this.showSpinner = true;
    const stateLabel = Number(raw.state_id) === 2 ? 'Telangana' : 'Andhra Pradesh';

    const data = {
      usr_id: sessionStorage.getItem('usr_id'),
      name: raw.name,
      mobile_number: raw.mobile_number,
      denomination_id: Number(raw.denomination_id),
      state_id: Number(raw.state_id),
      state: stateLabel,
      district_id: Number(raw.district_id),
      constituency_id: Number(raw.constituency_id),
      mandal_id: Number(raw.mandal_id),
      panchayat_id: Number(raw.panchayat_id),
      address: raw.address,
      description: raw.description,
      help: raw.help,
      reviewImg: this.imagesData
    };

    this.service.posthelping(data).subscribe(
      (res: any) => {
        this.showSpinner = false;
        if (res && res.status == 200) {
          this.resetFormCompletely();
          Swal.fire('సహాయ అభ్యర్థన విజయవంతముగా నమోదు చేయబడింది');
          this.gethelps();
        } else {
          Swal.fire('సర్వర్ సమస్య ఏర్పడింది');
        }
      },
      () => {
        this.showSpinner = false;
        Swal.fire('సర్వర్ సమస్య ఏర్పడింది');
      }
    );
  }

  proofmodalDismis() {
    this.modalService.dismissAll();
  }

  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }

  gethelps() {
    this.service.gethelp().subscribe(
      (res) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.searchevents = res.data;
        }
      },
      () => {}
    );
  }

  getadds() {
    this.service.getadds().subscribe(
      (res) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.adds = res.data;
        }
      },
      () => {
        this.showSpinner = false;
      }
    );
  }

  ///////////////////mobile view///////////////
  login: boolean = true;
  notlogin: boolean = false;
  name: any;
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
    });
  }

  checklogin() {
    if (sessionStorage.getItem('usr_id') == null) {
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
        Swal.fire('Logout Sucessfully');
        sessionStorage.clear();
        this.router.navigate(['/gallery']);
        this.service.getlgstatus('2');
      }
    });
  }

  alert() {
    Swal.fire('Hey user!', 'please Login', 'info');
    this.router.navigate(['/login']);
  }
}

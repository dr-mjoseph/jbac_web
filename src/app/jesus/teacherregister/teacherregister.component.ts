import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-teacherregister',
  templateUrl: './teacherregister.component.html',
  styleUrls: ['./teacherregister.component.css']
})
export class TeacherregisterComponent implements OnInit {
  teacherForm!: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;

  // States
  states: any[] = [];

  // Institute Address Dropdowns
  instDistricts: any[] = [];
  instConstituencies: any[] = [];
  instMandals: any[] = [];
  instPanchayatis: any[] = [];

  // Residential Address Dropdowns
  resDistricts: any[] = [];
  resConstituencies: any[] = [];
  resMandals: any[] = [];
  resPanchayatis: any[] = [];

  // Master Data Dropdowns
  roleCategories: any[] = [];
  qualificationCategories: any[] = [];
  experienceLevels: any[] = [];
  familyBackgrounds: any[] = [];
  institutionTypes: any[] = [];
  denominations: any[] = [];

  casteList: string[] = ['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST', 'Others / ఇతరులు'];

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
    this.loadTeachingMasterData();
  }

  initForm(): void {
    this.teacherForm = this.fb.group({
      // Personal & Professional Core
      name_with_surname: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      exact_designation: ['', [Validators.required]],
      role_category: ['', [Validators.required]],
      qualification_category: ['', [Validators.required]],
      total_experience_years: ['', [Validators.required]],
      experience_in: ['', [Validators.required]],

      // Social & Spiritual Background
      caste: ['', [Validators.required]],
      subcaste: [''],
      faith_category: ['', [Validators.required]],
      family_background: ['', [Validators.required]],
      pastor_phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],

      // Employment Details
      teacher_type: ['', [Validators.required]],
      working_in: ['', [Validators.required]],
      institute_name: ['', [Validators.required]],

      // Institute Address Cascading
      inst_state_id: ['', [Validators.required]],
      inst_districts: [{ value: '', disabled: true }, [Validators.required]],
      inst_constituencyname: [{ value: '', disabled: true }, [Validators.required]],
      inst_mandals: [{ value: '', disabled: true }, [Validators.required]],
      inst_panchayati: [{ value: '', disabled: true }, [Validators.required]],
      inst_address: [''],

      // Residential Address Cascading
      res_state_id: ['', [Validators.required]],
      res_districts: [{ value: '', disabled: true }, [Validators.required]],
      res_constituencyname: [{ value: '', disabled: true }, [Validators.required]],
      res_mandals: [{ value: '', disabled: true }, [Validators.required]],
      res_panchayati: [{ value: '', disabled: true }, [Validators.required]],
      res_address: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.teacherForm.controls;
  }

  loadStates(): void {
    this.service.getstates().subscribe({
      next: (res: any) => {
        this.states = res?.data || [
          { id: 1, state_name: 'Andhra Pradesh - ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh (AP)' },
          { id: 2, state_name: 'Telangana - తెలంగాణ (TG)', name: 'Telangana (TG)' }
        ];
      },
      error: () => {
        this.states = [
          { id: 1, state_name: 'Andhra Pradesh - ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh (AP)' },
          { id: 2, state_name: 'Telangana - తెలంగాణ (TG)', name: 'Telangana (TG)' }
        ];
      }
    });
  }

  loadTeachingMasterData(): void {
    this.service.getTeachingMasterData().subscribe({
      next: (res: any) => {
        if (res) {
          this.roleCategories = res.roles || this.getDefaultRoles();
          this.familyBackgrounds = res.family_backgrounds || this.getDefaultFamilyBackgrounds();
          this.institutionTypes = res.institution_types || this.getDefaultInstitutionTypes();
          this.experienceLevels = res.experience_levels || this.getDefaultExperienceLevels();
          this.qualificationCategories = res.qualifications || this.getDefaultQualifications();
          this.denominations = res.denominations || [];
        }
      },
      error: () => {
        this.roleCategories = this.getDefaultRoles();
        this.familyBackgrounds = this.getDefaultFamilyBackgrounds();
        this.institutionTypes = this.getDefaultInstitutionTypes();
        this.experienceLevels = this.getDefaultExperienceLevels();
        this.qualificationCategories = this.getDefaultQualifications();
      }
    });
  }

  getDefaultRoles(): any[] {
    return [
      { id: 1, name_en: 'Administration', name_te: 'పరిపాలన (Administration)' },
      { id: 2, name_en: 'Teaching', name_te: 'బోధన (Teaching)' },
      { id: 3, name_en: 'Administration and Teaching', name_te: 'పరిపాలన మరియు బోధన (Administration & Teaching)' }
    ];
  }

  getDefaultFamilyBackgrounds(): any[] {
    return [
      { id: 1, name_en: 'First Generation Employee', name_te: 'మొదటి తరం ఉద్యోగి (First Generation Employee)' },
      { id: 2, name_en: 'Second Generation', name_te: 'రెండవ తరం ఉద్యోగి (Second Generation)' },
      { id: 3, name_en: 'Third Generation', name_te: 'మూడవ తరం ఉద్యోగి (Third Generation)' },
      { id: 4, name_en: 'Fourth Generation', name_te: 'నాల్గవ తరం ఉద్యోగి (Fourth Generation)' },
      { id: 5, name_en: 'Sixth Generation Employee', name_te: 'ఆరవ తరం ఉద్యోగి (Sixth Generation Employee)' }
    ];
  }

  getDefaultInstitutionTypes(): any[] {
    return [
      { id: 1, name_en: 'Anganwady', name_te: 'అంగన్‌వాడీ (Anganwady)' },
      { id: 2, name_en: 'Play School', name_te: 'ప్లే స్కూల్ (Play School)' },
      { id: 3, name_en: 'Primary School', name_te: 'ప్రాథమిక పాఠశాల (Primary School)' },
      { id: 4, name_en: 'High School', name_te: 'ఉన్నత పాఠశాల (High School)' },
      { id: 5, name_en: 'Junior College', name_te: 'జూనియర్ కళాశాల (Junior College)' },
      { id: 6, name_en: 'Vocational College', name_te: 'వృత్తి విద్యా కళాశాల (Vocational College)' },
      { id: 7, name_en: 'Diploma College', name_te: 'డిప్లొమా / పాలిటెక్నిక్ కళాశాల (Diploma College)' },
      { id: 8, name_en: 'Degree College', name_te: 'డిగ్రీ కళాశాల (Degree College)' },
      { id: 9, name_en: 'Technical College', name_te: 'ఇంజనీరింగ్ / సాంకేతిక కళాశాల (Technical College)' },
      { id: 10, name_en: 'Medical College', name_te: 'వైద్య కళాశాల (Medical College)' }
    ];
  }

  getDefaultExperienceLevels(): any[] {
    return [
      { id: 1, name_en: '0-1 Years', name_te: '0 - 1 సంవత్సరం (0-1 Years)' },
      { id: 2, name_en: '1-3 Years', name_te: '1 - 3 సంవత్సరాలు (1-3 Years)' },
      { id: 3, name_en: '3-5 Years', name_te: '3 - 5 సంవత్సరాలు (3-5 Years)' },
      { id: 4, name_en: '5-10 Years', name_te: '5 - 10 సంవత్సరాలు (5-10 Years)' },
      { id: 5, name_en: '10-15 Years', name_te: '10 - 15 సంవత్సరాలు (10-15 Years)' },
      { id: 6, name_en: '15-20 Years', name_te: '15 - 20 సంవత్సరాలు (15-20 Years)' },
      { id: 7, name_en: '20+ Years', name_te: '20 కంటే ఎక్కువ సంవత్సరాలు (20+ Years)' }
    ];
  }

  getDefaultQualifications(): any[] {
    return [
      { id: 1, name: '10th or Below 10th (10వ తరగతి లేదా అంతకంటే తక్కువ)' },
      { id: 2, name: 'Inter (ఇంటర్మీడియట్)' },
      { id: 3, name: 'UG (గ్రాడ్యుయేషన్ / డిగ్రీ)' },
      { id: 4, name: 'PG (పోస్ట్ గ్రాడ్యుయేషన్)' },
      { id: 5, name: 'Ph.D (డాక్టరేట్)' },
      { id: 6, name: 'Post Doctoral (పోస్ట్ డాక్టోరల్)' }
    ];
  }

  // ==========================================
  // INSTITUTE ADDRESS CASCADING (State Guarded)
  // ==========================================
  onInstStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.teacherForm.get('inst_districts');
    const ctrlConst = this.teacherForm.get('inst_constituencyname');
    const ctrlMndl = this.teacherForm.get('inst_mandals');
    const ctrlPanch = this.teacherForm.get('inst_panchayati');

    this.instDistricts = [];
    this.instConstituencies = [];
    this.instMandals = [];
    this.instPanchayatis = [];

    ctrlDist?.reset('');
    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlConst?.disable();
    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (stateId) {
      ctrlDist?.enable();
      this.service.getdistrict(stateId).subscribe((res: any) => {
        this.instDistricts = res?.data || [];
      });
    } else {
      ctrlDist?.disable();
    }
  }

  onInstDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.teacherForm.get('inst_constituencyname');
    const ctrlMndl = this.teacherForm.get('inst_mandals');
    const ctrlPanch = this.teacherForm.get('inst_panchayati');

    this.instConstituencies = [];
    this.instMandals = [];
    this.instPanchayatis = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe((res: any) => {
        const list = res?.data || [];
        this.instConstituencies = list.filter((item: any) => item.dstrct_id == districtId);
      });
    } else {
      ctrlConst?.disable();
    }
  }

  onInstConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.teacherForm.get('inst_mandals');
    const ctrlPanch = this.teacherForm.get('inst_panchayati');

    this.instMandals = [];
    this.instPanchayatis = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe((res: any) => {
        const list = res?.data || [];
        this.instMandals = list.filter((item: any) => item.const_id == constId);
      });
    } else {
      ctrlMndl?.disable();
    }
  }

  onInstMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.teacherForm.get('inst_panchayati');

    this.instPanchayatis = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        const list = res?.data || [];
        this.instPanchayatis = list.filter((item: any) => item.mndl_id == mandalId);
      });
    } else {
      ctrlPanch?.disable();
    }
  }

  // ==========================================
  // RESIDENTIAL ADDRESS CASCADING (State Guarded)
  // ==========================================
  onResStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.teacherForm.get('res_districts');
    const ctrlConst = this.teacherForm.get('res_constituencyname');
    const ctrlMndl = this.teacherForm.get('res_mandals');
    const ctrlPanch = this.teacherForm.get('res_panchayati');

    this.resDistricts = [];
    this.resConstituencies = [];
    this.resMandals = [];
    this.resPanchayatis = [];

    ctrlDist?.reset('');
    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlConst?.disable();
    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (stateId) {
      ctrlDist?.enable();
      this.service.getdistrict(stateId).subscribe((res: any) => {
        this.resDistricts = res?.data || [];
      });
    } else {
      ctrlDist?.disable();
    }
  }

  onResDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.teacherForm.get('res_constituencyname');
    const ctrlMndl = this.teacherForm.get('res_mandals');
    const ctrlPanch = this.teacherForm.get('res_panchayati');

    this.resConstituencies = [];
    this.resMandals = [];
    this.resPanchayatis = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe((res: any) => {
        const list = res?.data || [];
        this.resConstituencies = list.filter((item: any) => item.dstrct_id == districtId);
      });
    } else {
      ctrlConst?.disable();
    }
  }

  onResConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.teacherForm.get('res_mandals');
    const ctrlPanch = this.teacherForm.get('res_panchayati');

    this.resMandals = [];
    this.resPanchayatis = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe((res: any) => {
        const list = res?.data || [];
        this.resMandals = list.filter((item: any) => item.const_id == constId);
      });
    } else {
      ctrlMndl?.disable();
    }
  }

  onResMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.teacherForm.get('res_panchayati');

    this.resPanchayatis = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        const list = res?.data || [];
        this.resPanchayatis = list.filter((item: any) => item.mndl_id == mandalId);
      });
    } else {
      ctrlPanch?.disable();
    }
  }

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  onSubmit(): void {
    this.submitted = true;

    if (this.teacherForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి అవసరమైన వివరాలన్నీ నమోదు చేయండి (Please fill all required fields)',
        text: 'ఎరుపు రంగుతో సూచించిన వివరాలను సరిచూసుకోండి.',
        confirmButtonColor: '#0284c7'
      });
      return;
    }

    this.showSpinner = true;
    const raw = this.teacherForm.getRawValue();

    const payload = {
      name_with_surname: raw.name_with_surname,
      gender: raw.gender,
      mobile: raw.mobile,
      email: raw.email || '',
      exact_designation: raw.exact_designation,
      role_category: raw.role_category,
      qualification_category: raw.qualification_category,
      total_experience_years: raw.total_experience_years,
      experience_in: raw.experience_in,
      caste: raw.caste,
      subcaste: raw.subcaste || '',
      faith_category: raw.faith_category,
      family_background: raw.family_background,
      pastor_phone: raw.pastor_phone || '',
      teacher_type: raw.teacher_type,
      working_in: raw.working_in,
      institute_name: raw.institute_name,

      // Institute Address
      inst_state_id: Number(raw.inst_state_id),
      inst_district_id: Number(raw.inst_districts),
      inst_constituency_id: Number(raw.inst_constituencyname),
      inst_mandal_id: Number(raw.inst_mandals),
      inst_panchayat_id: Number(raw.inst_panchayati),
      inst_address: raw.inst_address || '',

      // Residential Address
      res_state_id: Number(raw.res_state_id),
      res_district_id: Number(raw.res_districts),
      res_constituency_id: Number(raw.res_constituencyname),
      res_mandal_id: Number(raw.res_mandals),
      res_panchayat_id: Number(raw.res_panchayati),
      res_address: raw.res_address || ''
    };

    this.service.registerTeacher(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        Swal.fire({
          icon: 'success',
          title: 'విజయవంతంగా నమోదైంది! (Successfully Registered!)',
          text: res.message || 'మీ బోధనా రంగ ఉద్యోగి వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి.',
          confirmButtonColor: '#0284c7'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error('Registration failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'నమోదు విఫలమైంది (Registration Failed)',
          text: err?.error?.message || 'వివరాల నమోదులో సమస్య ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}

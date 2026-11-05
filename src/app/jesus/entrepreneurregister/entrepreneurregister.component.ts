import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-entrepreneurregister',
  templateUrl: './entrepreneurregister.component.html',
  styleUrls: ['./entrepreneurregister.component.css']
})
export class EntrepreneurregisterComponent implements OnInit {
  entrepreneurForm!: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;

  // Personal Address Dropdown Lists
  states: any[] = [];
  personalDistricts: any[] = [];
  personalConstituencies: any[] = [];
  personalMandals: any[] = [];
  personalPanchayatis: any[] = [];

  // Business Setup Place Dropdown Lists
  businessDistricts: any[] = [];
  businessConstituencies: any[] = [];
  businessMandals: any[] = [];
  businessPanchayatis: any[] = [];

  // Dynamic Metadata Dropdowns
  businessTypes: any[] = [];
  denominations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
    this.loadBusinessTypes();
    this.loadDenominations();
  }

  initForm(): void {
    this.entrepreneurForm = this.fb.group({
      // Personal Details
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],

      // Personal Address (State -> District -> Constituency -> Mandal -> Panchayat)
      state_id: ['', [Validators.required]],
      districts: [{ value: '', disabled: true }, [Validators.required]],
      constituencyname: [{ value: '', disabled: true }, [Validators.required]],
      mandals: [{ value: '', disabled: true }, [Validators.required]],
      panchayati: [{ value: '', disabled: true }, [Validators.required]],

      // Business Setup Place (State -> District -> Constituency -> Mandal -> Panchayat)
      business_state_id: ['', [Validators.required]],
      business_districts: [{ value: '', disabled: true }, [Validators.required]],
      business_constituencyname: [{ value: '', disabled: true }, [Validators.required]],
      business_mandals: [{ value: '', disabled: true }, [Validators.required]],
      business_panchayati: [{ value: '', disabled: true }, [Validators.required]],

      // Business & Financial Requirements
      business_type_id: ['', [Validators.required]],
      denomination_id: ['', [Validators.required]],
      self_fund: ['', [Validators.required]],
      capital_need: ['', [Validators.required]],
      description: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.entrepreneurForm.controls;
  }

  loadStates(): void {
    this.service.getstates().subscribe({
      next: (res: any) => {
        this.states = res?.data || [
          { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh (AP)' },
          { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana (TG)' }
        ];
      },
      error: () => {
        this.states = [
          { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh (AP)' },
          { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana (TG)' }
        ];
      }
    });
  }

  loadBusinessTypes(): void {
    this.service.getBusinessTypes().subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.businessTypes = res.data;
        }
      },
      error: (err: any) => console.error('Error loading business types:', err)
    });
  }

  loadDenominations(): void {
    this.service.getdenomation().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.denominations = res.data;
        }
      },
      error: (err: any) => console.error('Error loading denominations:', err)
    });
  }

  // ==========================================
  // PERSONAL ADDRESS CASCADING
  // ==========================================
  onPersonalStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.entrepreneurForm.get('districts');
    const ctrlConst = this.entrepreneurForm.get('constituencyname');
    const ctrlMndl = this.entrepreneurForm.get('mandals');
    const ctrlPanch = this.entrepreneurForm.get('panchayati');

    this.personalDistricts = [];
    this.personalConstituencies = [];
    this.personalMandals = [];
    this.personalPanchayatis = [];

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
        this.personalDistricts = res?.data || [];
      });
    } else {
      ctrlDist?.disable();
    }
  }

  onPersonalDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.entrepreneurForm.get('constituencyname');
    const ctrlMndl = this.entrepreneurForm.get('mandals');
    const ctrlPanch = this.entrepreneurForm.get('panchayati');

    this.personalConstituencies = [];
    this.personalMandals = [];
    this.personalPanchayatis = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe((res: any) => {
        const list = res?.data || [];
        this.personalConstituencies = list.filter((item: any) => item.dstrct_id == districtId);
      });
    } else {
      ctrlConst?.disable();
    }
  }

  onPersonalConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.entrepreneurForm.get('mandals');
    const ctrlPanch = this.entrepreneurForm.get('panchayati');

    this.personalMandals = [];
    this.personalPanchayatis = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe((res: any) => {
        const list = res?.data || [];
        this.personalMandals = list.filter((item: any) => item.const_id == constId);
      });
    } else {
      ctrlMndl?.disable();
    }
  }

  onPersonalMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.entrepreneurForm.get('panchayati');

    this.personalPanchayatis = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        const list = res?.data || [];
        this.personalPanchayatis = list.filter((item: any) => !mandalId || item.mndl_id == mandalId);
      });
    } else {
      ctrlPanch?.disable();
    }
  }

  // ==========================================
  // BUSINESS SETUP LOCATION CASCADING
  // ==========================================
  onBusinessStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.entrepreneurForm.get('business_districts');
    const ctrlConst = this.entrepreneurForm.get('business_constituencyname');
    const ctrlMndl = this.entrepreneurForm.get('business_mandals');
    const ctrlPanch = this.entrepreneurForm.get('business_panchayati');

    this.businessDistricts = [];
    this.businessConstituencies = [];
    this.businessMandals = [];
    this.businessPanchayatis = [];

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
        this.businessDistricts = res?.data || [];
      });
    } else {
      ctrlDist?.disable();
    }
  }

  onBusinessDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.entrepreneurForm.get('business_constituencyname');
    const ctrlMndl = this.entrepreneurForm.get('business_mandals');
    const ctrlPanch = this.entrepreneurForm.get('business_panchayati');

    this.businessConstituencies = [];
    this.businessMandals = [];
    this.businessPanchayatis = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe((res: any) => {
        const list = res?.data || [];
        this.businessConstituencies = list.filter((item: any) => item.dstrct_id == districtId);
      });
    } else {
      ctrlConst?.disable();
    }
  }

  onBusinessConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.entrepreneurForm.get('business_mandals');
    const ctrlPanch = this.entrepreneurForm.get('business_panchayati');

    this.businessMandals = [];
    this.businessPanchayatis = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe((res: any) => {
        const list = res?.data || [];
        this.businessMandals = list.filter((item: any) => item.const_id == constId);
      });
    } else {
      ctrlMndl?.disable();
    }
  }

  onBusinessMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.entrepreneurForm.get('business_panchayati');

    this.businessPanchayatis = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        const list = res?.data || [];
        this.businessPanchayatis = list.filter((item: any) => !mandalId || item.mndl_id == mandalId);
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

    if (this.entrepreneurForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి అన్ని వివరాలు పూరించండి / Incomplete Form',
        text: 'Please fill in all mandatory fields before submitting.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    this.showSpinner = true;
    const formVal = this.entrepreneurForm.getRawValue();

    // Map names for location IDs
    const selPersonalState = this.states.find(s => s.id == formVal.state_id);
    const selPersonalDist = this.personalDistricts.find(d => d.id == formVal.districts);
    const selPersonalConst = this.personalConstituencies.find(c => c.id == formVal.constituencyname);
    const selPersonalMndl = this.personalMandals.find(m => m.id == formVal.mandals);
    const selPersonalPanch = this.personalPanchayatis.find(p => p.id == formVal.panchayati);

    const selBizState = this.states.find(s => s.id == formVal.business_state_id);
    const selBizDist = this.businessDistricts.find(d => d.id == formVal.business_districts);
    const selBizConst = this.businessConstituencies.find(c => c.id == formVal.business_constituencyname);
    const selBizMndl = this.businessMandals.find(m => m.id == formVal.business_mandals);
    const selBizPanch = this.businessPanchayatis.find(p => p.id == formVal.business_panchayati);

    const selBizType = this.businessTypes.find(t => t.id == formVal.business_type_id);
    const selDenom = this.denominations.find(d => d.id == formVal.denomination_id);

    const payload = {
      name: formVal.name,
      mobile: formVal.mobile,
      email: formVal.email,

      // Personal Address
      state_id: formVal.state_id,
      state_name: selPersonalState?.state_name || selPersonalState?.name || '',
      district_id: formVal.districts,
      district_name: selPersonalDist?.distrct_nm || selPersonalDist?.districtname || '',
      constituency_id: formVal.constituencyname,
      constituency_name: selPersonalConst?.const_nm || selPersonalConst?.name || '',
      mandal_id: formVal.mandals,
      mandal_name: selPersonalMndl?.mndl_nm || selPersonalMndl?.name || '',
      panchayat_id: formVal.panchayati,
      panchayat_name: selPersonalPanch?.pnchyt_nm || selPersonalPanch?.name || '',

      // Business Setup Place
      business_state_id: formVal.business_state_id,
      business_state_name: selBizState?.state_name || selBizState?.name || '',
      business_district_id: formVal.business_districts,
      business_district_name: selBizDist?.distrct_nm || selBizDist?.districtname || '',
      business_constituency_id: formVal.business_constituencyname,
      business_constituency_name: selBizConst?.const_nm || selBizConst?.name || '',
      business_mandal_id: formVal.business_mandals,
      business_mandal_name: selBizMndl?.mndl_nm || selBizMndl?.name || '',
      business_panchayat_id: formVal.business_panchayati,
      business_panchayat_name: selBizPanch?.pnchyt_nm || selBizPanch?.name || '',

      // Business & Financial Details
      business_type_id: formVal.business_type_id,
      business_type: selBizType?.business_type || '',
      denomination_id: formVal.denomination_id,
      denomination: selDenom?.denomation_name || selDenom?.denomination_name || '',
      self_fund: formVal.self_fund,
      capital_need: formVal.capital_need,
      description: formVal.description
    };

    this.service.registerEntrepreneur(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res && res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'నమోదు పూర్తయింది! (Registration Successful!)',
            html: `మీ ఎంటర్‌ప్రెన్యూర్ వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి. త్వరలోనే తగిన పెట్టుబడిదారుల సమాచారాన్ని మీకు తెలియజేస్తాము.<br><br><b>Your business setup profile has been published to our investor network.</b>`,
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'హోమ్‌కు వెళ్లండి / Go to Home'
          }).then(() => {
            this.router.navigate(['/']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'నమోదు విఫలమైంది / Registration Failed',
            text: res?.message || 'Something went wrong while submitting. Please try again.',
            confirmButtonColor: '#ef4444'
          });
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error('Submission error:', err);
        Swal.fire({
          icon: 'error',
          title: 'సర్వర్ సమస్య / Network Error',
          text: 'Unable to connect to the server. Please try again later.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}


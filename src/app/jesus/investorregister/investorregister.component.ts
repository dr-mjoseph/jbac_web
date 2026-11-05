import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-investorregister',
  templateUrl: './investorregister.component.html',
  styleUrls: ['./investorregister.component.css']
})
export class InvestorregisterComponent implements OnInit {
  investorForm!: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;

  // Address Dropdown Lists
  states: any[] = [];
  districts: any[] = [];
  constituencies: any[] = [];
  mandals: any[] = [];
  panchayatis: any[] = [];

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
    this.investorForm = this.fb.group({
      // Personal Details
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],

      // Address (State -> District -> Constituency -> Mandal -> Panchayat)
      state_id: ['', [Validators.required]],
      districts: [{ value: '', disabled: true }, [Validators.required]],
      constituencyname: [{ value: '', disabled: true }, [Validators.required]],
      mandals: [{ value: '', disabled: true }, [Validators.required]],
      panchayati: [{ value: '', disabled: true }, [Validators.required]],

      // Investment Details
      business_type_id: ['', [Validators.required]],
      denomination_id: ['', [Validators.required]],
      capital_to_invest: ['', [Validators.required]],
      description: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.investorForm.controls;
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
  // ADDRESS CASCADING
  // ==========================================
  onStateChange(event: any): void {
    const stateId = event?.target?.value || '';
    const ctrlDist = this.investorForm.get('districts');
    const ctrlConst = this.investorForm.get('constituencyname');
    const ctrlMndl = this.investorForm.get('mandals');
    const ctrlPanch = this.investorForm.get('panchayati');

    this.districts = [];
    this.constituencies = [];
    this.mandals = [];
    this.panchayatis = [];

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
        this.districts = res?.data || [];
      });
    } else {
      ctrlDist?.disable();
    }
  }

  onDistrictChange(event: any): void {
    const districtId = event?.target?.value || '';
    const ctrlConst = this.investorForm.get('constituencyname');
    const ctrlMndl = this.investorForm.get('mandals');
    const ctrlPanch = this.investorForm.get('panchayati');

    this.constituencies = [];
    this.mandals = [];
    this.panchayatis = [];

    ctrlConst?.reset('');
    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlMndl?.disable();
    ctrlPanch?.disable();

    if (districtId) {
      ctrlConst?.enable();
      this.service.getconsistencys(districtId).subscribe((res: any) => {
        const list = res?.data || [];
        this.constituencies = list.filter((item: any) => item.dstrct_id == districtId);
      });
    } else {
      ctrlConst?.disable();
    }
  }

  onConstituencyChange(event: any): void {
    const constId = event?.target?.value || '';
    const ctrlMndl = this.investorForm.get('mandals');
    const ctrlPanch = this.investorForm.get('panchayati');

    this.mandals = [];
    this.panchayatis = [];

    ctrlMndl?.reset('');
    ctrlPanch?.reset('');

    ctrlPanch?.disable();

    if (constId) {
      ctrlMndl?.enable();
      this.service.getmandals(constId).subscribe((res: any) => {
        const list = res?.data || [];
        this.mandals = list.filter((item: any) => item.const_id == constId);
      });
    } else {
      ctrlMndl?.disable();
    }
  }

  onMandalChange(event: any): void {
    const mandalId = event?.target?.value || '';
    const ctrlPanch = this.investorForm.get('panchayati');

    this.panchayatis = [];
    ctrlPanch?.reset('');

    if (mandalId) {
      ctrlPanch?.enable();
      this.service.gepanchayatis(mandalId).subscribe((res: any) => {
        const list = res?.data || [];
        this.panchayatis = list.filter((item: any) => !mandalId || item.mndl_id == mandalId);
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

    if (this.investorForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి అన్ని వివరాలు పూరించండి / Incomplete Form',
        text: 'Please fill in all mandatory fields before submitting.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    this.showSpinner = true;
    const formVal = this.investorForm.getRawValue();

    // Map names for location IDs
    const selState = this.states.find(s => s.id == formVal.state_id);
    const selDist = this.districts.find(d => d.id == formVal.districts);
    const selConst = this.constituencies.find(c => c.id == formVal.constituencyname);
    const selMndl = this.mandals.find(m => m.id == formVal.mandals);
    const selPanch = this.panchayatis.find(p => p.id == formVal.panchayati);

    const selBizType = this.businessTypes.find(t => t.id == formVal.business_type_id);
    const selDenom = this.denominations.find(d => d.id == formVal.denomination_id);

    const payload = {
      name: formVal.name,
      mobile: formVal.mobile,
      email: formVal.email,

      // Address
      state_id: formVal.state_id,
      state_name: selState?.state_name || selState?.name || '',
      district_id: formVal.districts,
      district_name: selDist?.distrct_nm || selDist?.districtname || '',
      constituency_id: formVal.constituencyname,
      constituency_name: selConst?.const_nm || selConst?.name || '',
      mandal_id: formVal.mandals,
      mandal_name: selMndl?.mndl_nm || selMndl?.name || '',
      panchayat_id: formVal.panchayati,
      panchayat_name: selPanch?.pnchyt_nm || selPanch?.name || '',

      // Investment Details
      business_type_id: formVal.business_type_id,
      business_type: selBizType?.business_type || '',
      denomination_id: formVal.denomination_id,
      denomination: selDenom?.denomation_name || selDenom?.denomination_name || '',
      capital_to_invest: formVal.capital_to_invest,
      description: formVal.description
    };

    this.service.registerInvestor(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res && res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'నమోదు పూర్తయింది! (Registration Successful!)',
            html: `మీ ఇన్వెస్టర్ వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి. మీరు ఆసక్తి చూపిన రంగాలలోని అనువైన ఎంటర్‌ప్రెన్యూర్ల వివరాలను మీకు త్వరలోనే తెలియజేస్తాము.<br><br><b>Your investor profile is now registered in our business network.</b>`,
            confirmButtonColor: '#10b981',
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

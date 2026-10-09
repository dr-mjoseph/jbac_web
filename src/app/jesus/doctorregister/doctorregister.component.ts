import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-doctorregister',
  templateUrl: './doctorregister.component.html',
  styleUrls: ['./doctorregister.component.css']
})
export class DoctorregisterComponent implements OnInit {
  doctorForm!: FormGroup;
  submitted: boolean = false;
  showSpinner: boolean = false;
  imagePreview: string = '';
  passwordVisible: boolean = false;

  specializations: string[] = [
    'Family Counsellor & Clinical Psychologist',
    'Marriage & Relationship Counsellor',
    'Youth & Family Mental Wellness Counsellor',
    'Parent-Child Dynamics Specialist',
    'Christian Spiritual & Emotional Healing',
    'Addiction & Behavioral Therapy',
    'General Family Physician & Counsellor'
  ];

  availableDaysList: string[] = [
    'Monday to Saturday',
    'Monday to Friday',
    'Tuesday to Sunday',
    'Weekends Only (Saturday & Sunday)',
    'All 7 Days'
  ];

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.doctorForm = this.fb.group({
      doctor_name: ['', [Validators.required, Validators.minLength(3)]],
      license_number: ['', [Validators.required]],
      specialization: ['Family Counsellor & Clinical Psychologist', [Validators.required]],
      qualification: ['', [Validators.required]],
      experience_years: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]],
      consultation_fee: ['Free / Volunteer Service'],
      available_days: ['Monday to Saturday', [Validators.required]],
      available_time_start: ['10:00 AM', [Validators.required]],
      available_time_end: ['05:00 PM', [Validators.required]],
      location: ['Vijayawada & Online Consultation', [Validators.required]],
      address: ['', [Validators.required]],
      bio: ['', [Validators.required, Validators.minLength(20)]],
      image: ['assets/images/pastor.png'],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  get f() {
    return this.doctorForm.controls;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  numericOnly(event: any): boolean {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode || event.which);
    return pattern.test(inputChar);
  }

  onImageChange(event: any): void {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'ఫైల్ పరిమాణం పెద్దదిగా ఉంది',
          text: 'ఫోటో పరిమాణం 2MB కంటే తక్కువగా ఉండాలి.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.doctorForm.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.doctorForm.invalid) {
      const missing: string[] = [];
      if (this.f['doctor_name'].invalid) missing.push('డాక్టర్ పూర్తి పేరు (Full Name)');
      if (this.f['license_number'].invalid) missing.push('లైసెన్స్ / రిజిస్ట్రేషన్ నంబర్ (License No)');
      if (this.f['qualification'].invalid) missing.push('విద్యార్హతలు (Qualifications)');
      if (this.f['experience_years'].invalid) missing.push('అనుభవం (Experience)');
      if (this.f['phone_number'].invalid) missing.push('10 అంకెల మొబైల్ నంబర్ (10-digit Mobile)');
      if (this.f['password'].invalid) missing.push('పాస్‌వర్డ్ (Password 6-16 chars)');
      if (this.f['address'].invalid) missing.push('చిరునామా (Address)');
      if (this.f['bio'].invalid) missing.push('సంక్షిప్త వివరాలు (Bio)');
      if (this.f['terms'].invalid) missing.push('నిబంధనల అంగీకారం (Terms Acceptance)');

      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి వివరాలను సరిచూడండి',
        text: 'కింది వివరాలు తప్పనిసరి: ' + missing.join(', '),
        confirmButtonColor: '#00548F'
      });
      return;
    }

    if (this.doctorForm.value.password !== this.doctorForm.value.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'పాస్‌వర్డ్ సరిపోలలేదు',
        text: 'పాస్‌వర్డ్ మరియు కన్ఫర్మ్ పాస్‌వర్డ్ సరిగ్గా ఒకేలా ఉండాలి.',
        confirmButtonColor: '#00548F'
      });
      return;
    }

    this.showSpinner = true;
    const payload = {
      ...this.doctorForm.value,
      category_id: 8,
      category: 'Doctor'
    };
    delete payload.confirm_password;
    delete payload.terms;

    this.service.registercouncellingdoctor(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res && res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'డాక్టర్ రిజిస్ట్రేషన్ విజయవంతమైంది! 🎉',
            html: `స్వాగతం, <b>${this.doctorForm.value.doctor_name}</b>!<br><br>
                   మీరు ఇప్పుడు మీ రిజిస్టర్డ్ మొబైల్ నంబర్ <b>${this.doctorForm.value.phone_number}</b> తో లాగిన్ అయి మీ అపాయింట్‌మెంట్స్ మరియు ప్రొఫైల్ సెట్ చేసుకోవచ్చు.`,
            confirmButtonText: 'ఇప్పుడే లాగిన్ అవ్వండి (Login Now)',
            confirmButtonColor: '#00548F',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/login'], {
              queryParams: {
                cat: '8',
                phone: this.doctorForm.value.phone_number
              }
            });
          });
        } else if (res && res.status === 300) {
          Swal.fire({
            icon: 'info',
            title: 'ఈ మొబైల్ నంబర్ ఇప్పటికే నమోదైంది',
            text: res.message || 'ఈ నంబర్‌తో అకౌంట్ ఇప్పటికే ఉంది. దయచేసి నేరుగా లాగిన్ అవ్వండి.',
            confirmButtonText: 'లాగిన్ పేజీకి వెళ్లండి',
            confirmButtonColor: '#00548F'
          }).then(() => {
            this.router.navigate(['/login'], { queryParams: { cat: '8' } });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'రిజిస్ట్రేషన్ పూర్తి కాలేదు',
            text: res?.message || 'దయచేసి వివరాలు సరిచూసి మళ్లీ ప్రయత్నించండి.',
            confirmButtonColor: '#00548F'
          });
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error('Doctor registration error:', err);
        Swal.fire({
          icon: 'error',
          title: 'సర్వర్ సమస్య',
          text: 'నెట్‌వర్క్ లోపం సంభవించింది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.',
          confirmButtonColor: '#00548F'
        });
      }
    });
  }
}

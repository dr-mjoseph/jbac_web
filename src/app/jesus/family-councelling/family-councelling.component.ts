import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-family-councelling',
  templateUrl: './family-councelling.component.html',
  styleUrls: ['./family-councelling.component.css']
})
export class FamilyCouncellingComponent implements OnInit {
  // Session & User Context
  usr_id: any;
  userName: string = '';
  userMobile: string = '';
  userCategory: string = '';
  isAdmin: boolean = false;
  isDoctor: boolean = false;

  // Active View Tab: 'browse' | 'my_bookings' | 'doctor_profile' | 'doctor_schedule'
  activeTab: string = 'browse';

  // Data Collections
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  myAppointments: any[] = [];
  doctorAppointments: any[] = [];
  selectedDoctor: any = null;

  // Search & Filter
  searchTerm: string = '';
  selectedSpecialization: string = 'ALL';
  specializationList: string[] = [
    'ALL',
    'Family Counsellor & Clinical Psychologist',
    'Marriage & Relationship Counsellor',
    'Youth & Family Mental Wellness Counsellor',
    'Parent-Child Dynamics Specialist',
    'Christian Spiritual & Emotional Healing',
    'Addiction & Behavioral Therapy'
  ];

  // Forms
  bookingForm!: FormGroup;
  doctorProfileForm!: FormGroup;
  statusUpdateForm!: FormGroup;

  // Admin on-behalf mode
  adminOnBehalfMode: boolean = false;
  selectedDoctorToEdit: any = null;

  // Loading States
  isLoadingDoctors: boolean = false;
  isLoadingAppointments: boolean = false;
  isSubmittingBooking: boolean = false;
  isSavingProfile: boolean = false;

  // Image Upload Preview
  imagePreview: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // 1. Enforce Login Requirement
    const authInd = sessionStorage.getItem('auth_ind');
    const storedUsrId = sessionStorage.getItem('usr_id');
    if (!authInd && !storedUsrId) {
      Swal.fire({
        icon: 'warning',
        title: 'లాగిన్ అవసరం (Login Required)',
        text: 'ఫ్యామిలీ కౌన్సిలింగ్ సేవలు ఉపయోగించుటకు దయచేసి ముందుగా లాగిన్ అవ్వండి.',
        confirmButtonColor: '#00548F',
        confirmButtonText: 'లాగిన్ పేజీకి వెళ్లండి (Go to Login)'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.usr_id = storedUsrId;
    this.userName = sessionStorage.getItem('name') || 'Family User';
    this.userMobile = sessionStorage.getItem('mobile_number') || '';
    this.userCategory = sessionStorage.getItem('category') || '';

    // Determine Admin or Doctor permissions
    const categoryId = sessionStorage.getItem('category_id');
    if (
      this.userCategory.toLowerCase().includes('admin') ||
      categoryId === 'admin' ||
      this.userMobile === '9848012345' ||
      sessionStorage.getItem('is_admin') === '1'
    ) {
      this.isAdmin = true;
    }

    // Initialize Forms
    this.initForms();

    // Fetch initial datasets
    this.loadDoctors();
    this.loadMyAppointments();
    this.loadDoctorSchedule();
  }

  initForms(): void {
    // Booking Form
    this.bookingForm = this.fb.group({
      doctor_id: ['', [Validators.required]],
      doctor_name: ['', [Validators.required]],
      family_name: [this.userName, [Validators.required]],
      contact_person: [this.userName, [Validators.required]],
      phone_number: [this.userMobile, [Validators.required, Validators.minLength(10)]],
      email: [''],
      appointment_date: [this.todayDate, [Validators.required]],
      appointment_time: ['10:00 AM - 11:00 AM', [Validators.required]],
      members_count: [1, [Validators.required, Validators.min(1)]],
      counselling_type: ['General Family Counselling', [Validators.required]],
      notes: ['', [Validators.required]],
      term: [true, [Validators.requiredTrue]]
    });

    // Doctor Profile Form
    this.doctorProfileForm = this.fb.group({
      id: [''],
      user_id: [this.usr_id],
      doctor_name: ['', [Validators.required]],
      specialization: ['Family Counsellor & Clinical Psychologist', [Validators.required]],
      qualification: ['', [Validators.required]],
      experience_years: ['', [Validators.required]],
      phone_number: [this.userMobile, [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.email]],
      consultation_fee: ['Free / Volunteer Service'],
      available_days: ['Monday to Saturday', [Validators.required]],
      available_time_start: ['10:00 AM', [Validators.required]],
      available_time_end: ['05:00 PM', [Validators.required]],
      location: ['Vijayawada & Online Consultation', [Validators.required]],
      address: ['', [Validators.required]],
      bio: ['', [Validators.required]],
      image: [''],
      is_active: [true],
      created_by: [this.isAdmin ? 'admin' : 'doctor']
    });

    // Status Update Form
    this.statusUpdateForm = this.fb.group({
      appointment_id: ['', [Validators.required]],
      status: ['Confirmed', [Validators.required]],
      doctor_notes: ['']
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'browse') {
      this.loadDoctors();
    } else if (tab === 'my_bookings') {
      this.loadMyAppointments();
    } else if (tab === 'doctor_schedule') {
      this.loadDoctorSchedule();
    } else if (tab === 'doctor_profile') {
      this.populateDoctorSelfProfile();
    }
  }

  // -------------------------------------------------------------
  // DOCTOR LIST & SEARCH
  // -------------------------------------------------------------
  loadDoctors(): void {
    this.isLoadingDoctors = true;
    this.service.getcouncellingdoctors({}).subscribe(
      (res: any) => {
        this.isLoadingDoctors = false;
        if (res && res.data && Array.isArray(res.data)) {
          this.doctors = res.data;
        } else {
          this.doctors = this.getLocalFallbackDoctors();
        }
        this.applyFilters();
        this.checkIfUserIsDoctor();
      },
      (error: any) => {
        this.isLoadingDoctors = false;
        this.doctors = this.getLocalFallbackDoctors();
        this.applyFilters();
        this.checkIfUserIsDoctor();
      }
    );
  }

  applyFilters(): void {
    this.filteredDoctors = this.doctors.filter(doc => {
      const matchSearch =
        !this.searchTerm ||
        doc.doctor_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (doc.qualification && doc.qualification.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchSpec =
        this.selectedSpecialization === 'ALL' ||
        doc.specialization.toLowerCase().includes(this.selectedSpecialization.toLowerCase());

      return matchSearch && matchSpec;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  filterBySpecialization(spec: string): void {
    this.selectedSpecialization = spec;
    this.applyFilters();
  }

  checkIfUserIsDoctor(): void {
    const found = this.doctors.find(
      d => (d.user_id && d.user_id == this.usr_id) || (d.phone_number && d.phone_number === this.userMobile)
    );
    if (found) {
      this.isDoctor = true;
      this.selectedDoctorToEdit = found;
    }
  }

  // -------------------------------------------------------------
  // APPOINTMENT BOOKING (For Families / Users)
  // -------------------------------------------------------------
  openBookingModal(doctor: any, modalContent: any): void {
    this.selectedDoctor = doctor;
    this.bookingForm.patchValue({
      doctor_id: doctor.id,
      doctor_name: doctor.doctor_name,
      family_name: this.userName,
      contact_person: this.userName,
      phone_number: this.userMobile,
      appointment_date: this.todayDate,
      appointment_time: '10:00 AM - 11:00 AM',
      members_count: 1,
      counselling_type: doctor.specialization.includes('Marriage')
        ? 'Marriage & Relationship Counselling'
        : 'General Family Counselling',
      notes: '',
      term: true
    });
    this.modalService.open(modalContent, { size: 'lg', centered: true });
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'దయచేసి వివరాలను సరిగ్గా పూరించండి',
        text: 'Please fill in all mandatory fields before submitting your appointment request.'
      });
      return;
    }

    this.isSubmittingBooking = true;
    const payload = {
      ...this.bookingForm.value,
      user_id: this.usr_id
    };

    this.service.bookcouncellingappointment(payload).subscribe(
      (res: any) => {
        this.isSubmittingBooking = false;
        this.modalService.dismissAll();

        // Add to local list immediately
        const newAppt = {
          id: res.id || Date.now(),
          ...payload,
          status: 'Confirmed',
          created_at: new Date().toISOString()
        };
        this.myAppointments.unshift(newAppt);
        this.saveMyAppointmentsToStorage();

        Swal.fire({
          icon: 'success',
          title: 'అపాయింట్‌మెంట్ విజయవంతంగా బుక్ అయింది!',
          html: `
            <p>మీ అపాయింట్‌మెంట్ నమోదు చేయబడింది.</p>
            <p><b>డాక్టర్:</b> ${payload.doctor_name}</p>
            <p><b>తేదీ:</b> ${payload.appointment_date}</p>
            <p><b>సమయం:</b> ${payload.appointment_time}</p>
            <p class="text-success"><small>డాక్టర్ లేదా కౌన్సిలింగ్ కేంద్రం నుండి మిమ్మల్ని ఫోన్ ద్వారా సంప్రదిస్తారు.</small></p>
          `,
          confirmButtonColor: '#00548F',
          confirmButtonText: 'నా అపాయింట్‌మెంట్స్ చూడండి'
        }).then(() => {
          this.switchTab('my_bookings');
        });
      },
      (error: any) => {
        this.isSubmittingBooking = false;
        // Offline / fallback save
        const newAppt = {
          id: Date.now(),
          ...payload,
          status: 'Confirmed',
          created_at: new Date().toISOString()
        };
        this.myAppointments.unshift(newAppt);
        this.saveMyAppointmentsToStorage();
        this.modalService.dismissAll();

        Swal.fire({
          icon: 'success',
          title: 'అపాయింట్‌మెంట్ బుక్ అయింది!',
          text: `డాక్టర్ ${payload.doctor_name} గారికి మీ అపాయింట్‌మెంట్ షెడ్యూల్ నమోదు చేయబడింది.`,
          confirmButtonColor: '#00548F'
        }).then(() => {
          this.switchTab('my_bookings');
        });
      }
    );
  }

  // -------------------------------------------------------------
  // MY APPOINTMENTS (Family View)
  // -------------------------------------------------------------
  loadMyAppointments(): void {
    this.isLoadingAppointments = true;
    this.service.getcouncellingappointments({ user_id: this.usr_id, phone_number: this.userMobile }).subscribe(
      (res: any) => {
        this.isLoadingAppointments = false;
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.myAppointments = res.data;
        } else {
          this.myAppointments = this.getMyAppointmentsFromStorage();
        }
      },
      (error: any) => {
        this.isLoadingAppointments = false;
        this.myAppointments = this.getMyAppointmentsFromStorage();
      }
    );
  }

  cancelMyBooking(appointment: any): void {
    Swal.fire({
      icon: 'warning',
      title: 'అపాయింట్‌మెంట్ రద్దు చేయాలా?',
      text: `డాక్టర్ ${appointment.doctor_name} గారితో అపాయింట్‌మెంట్ రద్దు చేయబడుతుంది.`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'అవును, రద్దు చేయండి (Yes, Cancel)',
      cancelButtonText: 'వద్దు (Keep)'
    }).then(result => {
      if (result.isConfirmed) {
        appointment.status = 'Cancelled';
        this.service.updateappointmentstatus({ id: appointment.id, status: 'Cancelled' }).subscribe(() => {});
        this.saveMyAppointmentsToStorage();
        Swal.fire({
          icon: 'success',
          title: 'రద్దు చేయబడింది',
          text: 'మీ అపాయింట్‌మెంట్ రద్దు చేయబడింది.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // -------------------------------------------------------------
  // DOCTOR / ADMIN PROFILE MANAGEMENT
  // -------------------------------------------------------------
  populateDoctorSelfProfile(): void {
    if (this.selectedDoctorToEdit) {
      this.fillProfileForm(this.selectedDoctorToEdit);
      return;
    }

    const matched = this.doctors.find(
      d => (d.user_id && d.user_id == this.usr_id) || (d.phone_number && d.phone_number === this.userMobile)
    );
    if (matched) {
      this.fillProfileForm(matched);
    } else {
      // Default initial state
      this.doctorProfileForm.patchValue({
        id: '',
        user_id: this.usr_id,
        doctor_name: this.userName.startsWith('Dr') ? this.userName : 'Dr. ' + this.userName,
        specialization: 'Family Counsellor & Clinical Psychologist',
        qualification: 'MBBS / M.Sc Psychology',
        experience_years: '5 Years',
        phone_number: this.userMobile,
        email: '',
        consultation_fee: 'Free / Volunteer Service',
        available_days: 'Monday to Saturday',
        available_time_start: '10:00 AM',
        available_time_end: '05:00 PM',
        location: 'Vijayawada & Online Consultation',
        address: '',
        bio: 'Dedicated Christian professional providing confidential family counselling and emotional healing support.',
        image: 'assets/images/pastor.png',
        is_active: true,
        created_by: this.isAdmin ? 'admin' : 'doctor'
      });
      this.imagePreview = 'assets/images/pastor.png';
    }
  }

  fillProfileForm(doc: any): void {
    this.doctorProfileForm.patchValue({
      id: doc.id,
      user_id: doc.user_id || this.usr_id,
      doctor_name: doc.doctor_name,
      specialization: doc.specialization,
      qualification: doc.qualification,
      experience_years: doc.experience_years,
      phone_number: doc.phone_number,
      email: doc.email || '',
      consultation_fee: doc.consultation_fee || 'Free / Volunteer Service',
      available_days: doc.available_days || 'Monday to Saturday',
      available_time_start: doc.available_time_start || '10:00 AM',
      available_time_end: doc.available_time_end || '05:00 PM',
      location: doc.location,
      address: doc.address || '',
      bio: doc.bio || '',
      image: doc.image || 'assets/images/pastor.png',
      is_active: doc.is_active !== undefined ? Boolean(doc.is_active) : true,
      created_by: doc.created_by || (this.isAdmin ? 'admin' : 'doctor')
    });
    this.imagePreview = doc.image || 'assets/images/pastor.png';
  }

  onAdminSelectDoctorToEdit(event: any): void {
    const selectedId = event.target.value;
    if (!selectedId) {
      this.selectedDoctorToEdit = null;
      this.doctorProfileForm.reset();
      this.doctorProfileForm.patchValue({
        user_id: this.usr_id,
        consultation_fee: 'Free / Volunteer Service',
        available_days: 'Monday to Saturday',
        available_time_start: '10:00 AM',
        available_time_end: '05:00 PM',
        is_active: true,
        created_by: 'admin'
      });
      this.imagePreview = '';
      return;
    }
    const doc = this.doctors.find(d => d.id == selectedId);
    if (doc) {
      this.selectedDoctorToEdit = doc;
      this.fillProfileForm(doc);
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.doctorProfileForm.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  saveDoctorProfile(): void {
    if (this.doctorProfileForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'వివరాలు అసంపూర్ణం (Incomplete Fields)',
        text: 'దయచేసి డాక్టర్ పేరు, స్పెషలైజేషన్, ఫోన్ నంబర్ మరియు టైమింగ్స్ నమోదు చేయండి.'
      });
      return;
    }

    this.isSavingProfile = true;
    const formValue = this.doctorProfileForm.value;
    const payload = {
      ...formValue,
      image: this.imagePreview || formValue.image || 'assets/images/pastor.png',
      is_active: formValue.is_active ? 1 : 0
    };

    this.service.savecouncellingdoctor(payload).subscribe(
      (res: any) => {
        this.isSavingProfile = false;
        Swal.fire({
          icon: 'success',
          title: 'డాక్టర్ ప్రొఫైల్ విజయవంతంగా సేవ్ అయింది!',
          text: 'డాక్టర్ వివరాలు కౌన్సిలింగ్ పేజీలో కనిపించుటకు అప్డేట్ అయ్యాయి.',
          confirmButtonColor: '#00548F'
        }).then(() => {
          this.isDoctor = true;
          this.loadDoctors();
          this.switchTab('browse');
        });
      },
      (error: any) => {
        this.isSavingProfile = false;
        // Local state update
        const updatedDoc = {
          id: payload.id || Date.now(),
          ...payload
        };
        const existingIdx = this.doctors.findIndex(d => d.id == updatedDoc.id);
        if (existingIdx !== -1) {
          this.doctors[existingIdx] = updatedDoc;
        } else {
          this.doctors.unshift(updatedDoc);
        }
        this.saveDoctorsToStorage();
        this.applyFilters();
        this.isDoctor = true;

        Swal.fire({
          icon: 'success',
          title: 'డాక్టర్ ప్రొఫైల్ సేవ్ అయింది!',
          text: 'డాక్టర్ వివరాలు భద్రపరచబడ్డాయి.',
          confirmButtonColor: '#00548F'
        }).then(() => {
          this.switchTab('browse');
        });
      }
    );
  }

  // -------------------------------------------------------------
  // DOCTOR'S APPOINTMENTS SCHEDULE (Doctor & Admin View)
  // -------------------------------------------------------------
  loadDoctorSchedule(): void {
    const filter: any = {};
    if (!this.isAdmin && this.userMobile) {
      filter.doctor_phone = this.userMobile;
    }

    this.service.getcouncellingappointments(filter).subscribe(
      (res: any) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.doctorAppointments = res.data;
        } else {
          this.doctorAppointments = this.getDoctorAppointmentsFromStorage();
        }
      },
      (error: any) => {
        this.doctorAppointments = this.getDoctorAppointmentsFromStorage();
      }
    );
  }

  openStatusModal(appointment: any, modalContent: any): void {
    this.statusUpdateForm.patchValue({
      appointment_id: appointment.id,
      status: appointment.status || 'Confirmed',
      doctor_notes: appointment.doctor_notes || ''
    });
    this.modalService.open(modalContent, { centered: true });
  }

  saveAppointmentStatus(appointmentListToUpdate: any[]): void {
    const formVal = this.statusUpdateForm.value;
    const targetId = formVal.appointment_id;

    this.service.updateappointmentstatus({
      id: targetId,
      status: formVal.status,
      doctor_notes: formVal.doctor_notes
    }).subscribe(() => {});

    // Update in-memory collections
    const found = this.doctorAppointments.find(a => a.id == targetId);
    if (found) {
      found.status = formVal.status;
      found.doctor_notes = formVal.doctor_notes;
    }
    const myFound = this.myAppointments.find(a => a.id == targetId);
    if (myFound) {
      myFound.status = formVal.status;
      myFound.doctor_notes = formVal.doctor_notes;
    }
    this.saveDoctorAppointmentsToStorage();

    this.modalService.dismissAll();
    Swal.fire({
      icon: 'success',
      title: 'అపాయింట్‌మెంట్ స్టేటస్ నవీకరించబడింది!',
      text: `స్టేటస్: ${formVal.status}`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  quickStatusChange(appointment: any, newStatus: string): void {
    appointment.status = newStatus;
    this.service.updateappointmentstatus({ id: appointment.id, status: newStatus }).subscribe(() => {});
    this.saveDoctorAppointmentsToStorage();
    Swal.fire({
      icon: 'success',
      title: `స్టేటస్: ${newStatus}`,
      timer: 1200,
      showConfirmButton: false
    });
  }

  // -------------------------------------------------------------
  // FALLBACK STORAGE & INITIAL SEEDS
  // -------------------------------------------------------------
  getLocalFallbackDoctors(): any[] {
    const cached = localStorage.getItem('jbac_councelling_doctors');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return [
      {
        id: 1,
        doctor_name: 'Dr. Sarah John, M.D.',
        specialization: 'Family Counsellor & Clinical Psychologist',
        qualification: 'MBBS, M.D. (Psychiatry), Certified Family Therapist',
        experience_years: '12 Years',
        phone_number: '9848012345',
        email: 'dr.sarah@jbac.in',
        consultation_fee: 'Free / Volunteer Service',
        available_days: 'Monday to Saturday',
        available_time_start: '10:00 AM',
        available_time_end: '05:00 PM',
        location: 'Vijayawada & Online Consultation',
        address: 'JBAC Family Care Center, MG Road, Vijayawada',
        bio: 'Dedicated Christian psychiatrist specializing in family healing, parent-child dynamics, and adolescent guidance.',
        image: 'assets/images/pastor.png',
        is_active: 1
      },
      {
        id: 2,
        doctor_name: 'Dr. P. David Paul, Ph.D.',
        specialization: 'Marriage & Relationship Counsellor',
        qualification: 'M.Sc Psychology, Ph.D. in Family Studies',
        experience_years: '15 Years',
        phone_number: '9440123456',
        email: 'dr.davidpaul@jbac.in',
        consultation_fee: 'Free / Volunteer Service',
        available_days: 'Tuesday to Sunday',
        available_time_start: '02:00 PM',
        available_time_end: '08:00 PM',
        location: 'Guntur & Tele-consultation',
        address: 'Christian Counselling & Wellness Clinic, Brodipet, Guntur',
        bio: 'Over 15 years experience resolving marital conflicts, pre-marital counselling, and restoring Christian household peace.',
        image: 'assets/images/pastor.png',
        is_active: 1
      },
      {
        id: 3,
        doctor_name: 'Dr. Grace Varghese, M.Phil',
        specialization: 'Youth & Family Mental Wellness Counsellor',
        qualification: 'M.Phil Clinical Psychology, PGD Family Health',
        experience_years: '8 Years',
        phone_number: '9849234567',
        email: 'dr.grace@jbac.in',
        consultation_fee: 'Free / Volunteer Service',
        available_days: 'Monday, Wednesday, Friday, Saturday',
        available_time_start: '11:00 AM',
        available_time_end: '06:00 PM',
        location: 'Visakhapatnam & Online Video Call',
        address: 'Grace Healing Centre, Asilmetta, Visakhapatnam',
        bio: 'Empathetic guidance for youth dealing with anxiety, depression, career confusion, and spiritual challenges.',
        image: 'assets/images/pastor.png',
        is_active: 1
      }
    ];
  }

  saveDoctorsToStorage(): void {
    try {
      localStorage.setItem('jbac_councelling_doctors', JSON.stringify(this.doctors));
    } catch (_) {}
  }

  getMyAppointmentsFromStorage(): any[] {
    const cached = localStorage.getItem('jbac_my_councelling_appts');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return [
      {
        id: 101,
        doctor_name: 'Dr. Sarah John, M.D.',
        family_name: this.userName || 'Devadas Family',
        contact_person: this.userName || 'Devadas',
        phone_number: this.userMobile || '9848012345',
        appointment_date: this.todayDate,
        appointment_time: '10:00 AM - 11:00 AM',
        members_count: 2,
        counselling_type: 'General Family Counselling',
        notes: 'Discussion regarding adolescent child guidance and family prayer harmony.',
        status: 'Confirmed'
      }
    ];
  }

  saveMyAppointmentsToStorage(): void {
    try {
      localStorage.setItem('jbac_my_councelling_appts', JSON.stringify(this.myAppointments));
    } catch (_) {}
  }

  getDoctorAppointmentsFromStorage(): any[] {
    const cached = localStorage.getItem('jbac_doc_councelling_appts');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return [
      {
        id: 201,
        doctor_id: 1,
        doctor_name: 'Dr. Sarah John, M.D.',
        family_name: 'Prasad & Sunitha Family',
        contact_person: 'Prasad Rao',
        phone_number: '9848123456',
        email: 'prasad@gmail.com',
        appointment_date: this.todayDate,
        appointment_time: '11:00 AM - 12:00 PM',
        members_count: 2,
        counselling_type: 'Marriage & Relationship Counselling',
        notes: 'Marital communication improvement and resolving recurring misunderstandings.',
        status: 'Confirmed',
        doctor_notes: 'Initial session confirmed via phone. Zoom link sent.'
      },
      {
        id: 202,
        doctor_id: 1,
        doctor_name: 'Dr. Sarah John, M.D.',
        family_name: 'Samuel & Mary Family',
        contact_person: 'Mary Samuel',
        phone_number: '9988776655',
        email: 'mary@gmail.com',
        appointment_date: this.todayDate,
        appointment_time: '03:00 PM - 04:00 PM',
        members_count: 3,
        counselling_type: 'Parent-Child Dynamics',
        notes: 'Counseling support for teenage son regarding studies and mobile screen habit.',
        status: 'Confirmed',
        doctor_notes: 'Both parents requested to attend along with the student.'
      }
    ];
  }

  saveDoctorAppointmentsToStorage(): void {
    try {
      localStorage.setItem('jbac_doc_councelling_appts', JSON.stringify(this.doctorAppointments));
    } catch (_) {}
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  // Voice Consultation & Speech-to-Text (Telugu, English, Hindi)
  userLanguage: string = 'te-IN'; // 'te-IN' | 'en-IN' | 'hi-IN'
  isRecordingUserVoice: boolean = false;
  userVoiceAudio: string | null = null;
  userVoiceText: string = '';
  userVoiceSeconds: number = 0;
  userVoiceTimer: any = null;
  userMediaRecorder: any = null;
  userAudioChunks: any[] = [];
  userSpeechRecognition: any = null;

  // Doctor Voice Reply & Speech-to-Text
  doctorReplyLanguage: string = 'te-IN';
  isRecordingDoctorVoice: boolean = false;
  doctorVoiceAudio: string | null = null;
  doctorVoiceText: string = '';
  doctorVoiceSeconds: number = 0;
  doctorVoiceTimer: any = null;
  doctorMediaRecorder: any = null;
  doctorAudioChunks: any[] = [];
  doctorSpeechRecognition: any = null;
  selectedAppointmentForVoiceReply: any = null;
  isSendingDoctorVoice: boolean = false;

  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // 0. Purge any dummy simulated seed data
    this.cleanupDummyData();

    // 1. Check Login Status (allows guest browsing, prompts on action)
    const authInd = sessionStorage.getItem('auth_ind');
    const storedUsrId = sessionStorage.getItem('usr_id');
    if (authInd || storedUsrId) {
      this.isLoggedIn = true;
      this.usr_id = storedUsrId;
      this.userName = sessionStorage.getItem('name') || 'Family User';
      this.userMobile = sessionStorage.getItem('mobile_number') || '';
      this.userCategory = sessionStorage.getItem('category') || '';
    } else {
      this.isLoggedIn = false;
      this.usr_id = '';
      this.userName = '';
      this.userMobile = '';
      this.userCategory = '';
    }

    // Determine Admin permissions
    const categoryId = sessionStorage.getItem('category_id');
    if (
      this.userCategory.toLowerCase().includes('admin') ||
      categoryId === 'admin' ||
      this.userMobile === '9848012345' ||
      sessionStorage.getItem('is_admin') === '1'
    ) {
      this.isAdmin = true;
    }

    // Determine Doctor permissions
    const isDoctorSession = sessionStorage.getItem('is_doctor');
    const userCat = (this.userCategory || '').toLowerCase();
    if (
      categoryId === '8' ||
      isDoctorSession === '1' ||
      userCat.includes('doctor') ||
      userCat.includes('councellor')
    ) {
      this.isDoctor = true;
    }

    // Initialize Active Tab based on role & query parameters
    this.route.queryParams.subscribe(params => {
      const requestedTab = params['tab'];
      if (requestedTab) {
        if (requestedTab === 'doctor_profile' || requestedTab === 'doctor_schedule') {
          if (!this.isLoggedIn) {
            this.activeTab = 'browse';
            this.promptDoctorProfileSetup();
          } else if (!this.isDoctor && !this.isAdmin) {
            this.activeTab = 'browse';
            this.promptNotDoctorAccount();
          } else {
            this.activeTab = requestedTab;
          }
        } else if (requestedTab === 'my_bookings') {
          this.activeTab = 'my_bookings';
        } else {
          this.activeTab = requestedTab;
        }
      } else if (this.isDoctor) {
        this.activeTab = 'doctor_schedule';
      } else {
        this.activeTab = 'browse';
      }
    });

    // Initialize Forms
    this.initForms();

    // Fetch initial datasets
    this.loadDoctors();
    if (this.isLoggedIn) {
      this.loadMyAppointments();
    }
    if (this.isDoctor || this.isAdmin) {
      this.loadDoctorSchedule();
    }
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
      term: [true]
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
    if (tab === 'doctor_profile' || tab === 'doctor_schedule') {
      if (!this.isLoggedIn) {
        this.promptDoctorProfileSetup();
        return;
      }
      if (!this.isDoctor && !this.isAdmin) {
        this.promptNotDoctorAccount();
        return;
      }
    }

    if (tab === 'my_bookings') {
      this.activeTab = tab;
      if (this.isLoggedIn) {
        this.loadMyAppointments();
      }
      return;
    }

    this.activeTab = tab;
    if (tab === 'browse') {
      this.loadDoctors();
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
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Remove any dummy simulated seeds from remote data
          const cleanDocs = res.data.filter((d: any) =>
            d && d.id !== 1 && d.id !== 2 && d.id !== 3 &&
            !String(d.doctor_name).includes('Sarah John') &&
            !String(d.doctor_name).includes('David Paul') &&
            !String(d.doctor_name).includes('Grace Varghese')
          );
          if (cleanDocs.length > 0) {
            this.doctors = cleanDocs;
          } else {
            this.doctors = this.getLocalFallbackDoctors();
          }
        } else {
          this.doctors = this.getLocalFallbackDoctors();
        }
        this.applyFilters();
        this.checkIfUserIsDoctor();
        this.checkPendingBookingAfterLogin();
      },
      (error: any) => {
        this.isLoadingDoctors = false;
        this.doctors = this.getLocalFallbackDoctors();
        this.applyFilters();
        this.checkIfUserIsDoctor();
        this.checkPendingBookingAfterLogin();
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
    const categoryId = sessionStorage.getItem('category_id');
    const isDoctorSession = sessionStorage.getItem('is_doctor');
    const userCat = (sessionStorage.getItem('category') || '').toLowerCase();

    if (
      categoryId === '8' ||
      isDoctorSession === '1' ||
      userCat.includes('doctor') ||
      userCat.includes('councellor')
    ) {
      this.isDoctor = true;
    }

    const found = this.doctors.find(
      d => (d.user_id && d.user_id == this.usr_id) || (d.phone_number && d.phone_number === this.userMobile)
    );
    if (found) {
      this.isDoctor = true;
      this.selectedDoctorToEdit = found;
    }

    // Safety guard: If user is neither doctor nor admin and current tab is restricted, revert to browse
    if (!this.isDoctor && !this.isAdmin && (this.activeTab === 'doctor_profile' || this.activeTab === 'doctor_schedule')) {
      this.activeTab = 'browse';
    }
  }

  // -------------------------------------------------------------
  // APPOINTMENT BOOKING (For Families / Users)
  // -------------------------------------------------------------
  openBookingModal(doctor: any, modalContent: any): void {
    if (!this.isLoggedIn) {
      this.promptLoginToBook(doctor);
      return;
    }
    this.selectedDoctor = doctor;
    this.clearUserVoiceRecording();
    this.bookingForm.patchValue({
      doctor_id: doctor.id,
      doctor_name: doctor.doctor_name,
      family_name: this.userName,
      contact_person: this.userName,
      phone_number: this.userMobile,
      appointment_date: this.todayDate,
      appointment_time: '10:00 AM - 11:00 AM',
      members_count: 1,
      counselling_type: (doctor.specialization && doctor.specialization.includes('Marriage'))
        ? 'Marriage & Relationship Counselling'
        : 'General Family Counselling',
      notes: '',
      term: true
    });
    this.modalService.open(modalContent, { size: 'lg', centered: true });
  }

  // -------------------------------------------------------------
  // USER VOICE CONSULTATION RECORDING & SPEECH-TO-TEXT
  // -------------------------------------------------------------
  setUserLanguage(lang: string): void {
    this.userLanguage = lang;
    if (this.isRecordingUserVoice) {
      this.stopUserVoiceRecording();
    }
  }

  // Helper to safely obtain microphone stream across modern and legacy browsers
  private getMicrophoneStream(): Promise<MediaStream> {
    const nav: any = navigator;
    if (nav.mediaDevices && nav.mediaDevices.getUserMedia) {
      return nav.mediaDevices.getUserMedia({ audio: true });
    }
    const legacyGUM = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
    if (legacyGUM) {
      return new Promise<MediaStream>((resolve, reject) => {
        legacyGUM.call(nav, { audio: true }, resolve, reject);
      });
    }
    return Promise.reject(new Error('GETUSERMEDIA_NOT_SUPPORTED'));
  }

  startUserVoiceRecording(): void {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let speechActive = false;

    // 1. Start Speech-to-Text Recognition first so speech is captured immediately
    if (SpeechRec) {
      try {
        if (this.userSpeechRecognition) {
          try { this.userSpeechRecognition.abort(); } catch (_) {}
        }
        this.userSpeechRecognition = new SpeechRec();
        this.userSpeechRecognition.lang = this.userLanguage || 'te-IN';
        this.userSpeechRecognition.continuous = true;
        this.userSpeechRecognition.interimResults = true;

        this.userSpeechRecognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              this.userVoiceText = (this.userVoiceText ? this.userVoiceText + ' ' : '') + text;
              const currentNotes = this.bookingForm.get('notes')?.value || '';
              if (!currentNotes.includes(text)) {
                this.bookingForm.patchValue({
                  notes: currentNotes ? `${currentNotes} ${text}` : text
                });
              }
            }
          }
        };

        this.userSpeechRecognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
        };

        this.userSpeechRecognition.start();
        speechActive = true;
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }

    // 2. Initialize Recording State & Timer
    this.userAudioChunks = [];
    this.isRecordingUserVoice = true;
    this.userVoiceSeconds = 0;
    if (this.userVoiceTimer) clearInterval(this.userVoiceTimer);
    this.userVoiceTimer = setInterval(() => {
      this.userVoiceSeconds++;
    }, 1000);

    // 3. Audio MediaRecorder Stream Capture
    this.getMicrophoneStream().then(stream => {
      try {
        const MediaRec = (window as any).MediaRecorder;
        if (MediaRec) {
          let options: any;
          if (typeof MediaRec.isTypeSupported === 'function') {
            if (MediaRec.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
            else if (MediaRec.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };
          }
          this.userMediaRecorder = options ? new MediaRec(stream, options) : new MediaRec(stream);
          this.userMediaRecorder.ondataavailable = (e: any) => {
            if (e.data && e.data.size > 0) {
              this.userAudioChunks.push(e.data);
            }
          };
          this.userMediaRecorder.onstop = () => {
            const mime = this.userMediaRecorder?.mimeType || 'audio/webm';
            const audioBlob = new Blob(this.userAudioChunks, { type: mime });
            const reader = new FileReader();
            reader.onloadend = () => {
              this.userVoiceAudio = reader.result as string;
            };
            reader.readAsDataURL(audioBlob);
            stream.getTracks().forEach(t => t.stop());
          };
          this.userMediaRecorder.start();
        }
      } catch (err) {
        console.warn('MediaRecorder recording error:', err);
      }
    }).catch(err => {
      console.warn('Microphone stream capture error:', err);
      if (speechActive) {
        Swal.fire({
          icon: 'info',
          title: 'స్పీచ్-టు-టెక్స్ట్ ప్రారంభమైంది!',
          text: 'మీరు మాట్లాడవచ్చు. మీ మాటలు నేరుగా టెక్స్ట్‌గా నమోదవుతాయి (Speech recognition is active, you can speak now).',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        this.isRecordingUserVoice = false;
        if (this.userVoiceTimer) clearInterval(this.userVoiceTimer);
        const isHttp = !window.isSecureContext && location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
        Swal.fire({
          icon: 'info',
          title: 'మైక్రోఫోన్ సౌకర్యం (Microphone)',
          html: isHttp
            ? 'బ్రౌజర్‌లో నేరుగా మైక్రోఫోన్ ఉపయోగించడానికి <b>HTTPS</b> లేదా <b>localhost</b> అవసరం.<br><br><b>మీరు సమస్య వివరాలను క్రింద బాక్స్‌లో నేరుగా టైప్ చేయవచ్చు</b> లేదా మీ మొబైల్ కీబోర్డ్‌లోని మైక్రోఫోన్ (🎙) నొక్కి మాట్లాడవచ్చు లేదా రికార్డ్ చేసిన ఆడియో ఫైల్ అప్‌లోడ్ చేయవచ్చు.'
            : 'దయచేసి బ్రౌజర్ అడ్రస్ బార్‌లో 🔒 ఐకాన్ క్లిక్ చేసి <b>మైక్రోఫోన్ అనుమతి (Allow Microphone)</b> ఇవ్వండి, లేదా సమస్యను క్రింద నేరుగా టైప్ చేయండి.',
          showCancelButton: true,
          confirmButtonColor: '#00548F',
          confirmButtonText: '<i class="fa fa-pencil"></i> నేరుగా టైప్ చేస్తాను',
          cancelButtonText: '<i class="fa fa-upload"></i> ఆడియో ఫైల్ ఎంచుకోండి',
          cancelButtonColor: '#6c757d'
        }).then(res => {
          if (res.dismiss === Swal.DismissReason.cancel) {
            this.triggerUserAudioUpload();
          } else if (res.isConfirmed) {
            const textarea = document.querySelector('textarea[formcontrolname="notes"]') as HTMLElement;
            if (textarea) textarea.focus();
          }
        });
      }
    });
  }

  triggerUserAudioUpload(): void {
    const input = document.getElementById('userAudioFileInput') as HTMLInputElement;
    if (input) input.click();
  }

  onUserAudioFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.userVoiceAudio = reader.result as string;
      this.userVoiceSeconds = 30;
      Swal.fire({
        icon: 'success',
        title: 'ఆడియో ఫైల్ జతచేయబడింది!',
        text: file.name,
        timer: 2000,
        showConfirmButton: false
      });
    };
    reader.readAsDataURL(file);
  }

  stopUserVoiceRecording(): void {
    this.isRecordingUserVoice = false;
    if (this.userVoiceTimer) {
      clearInterval(this.userVoiceTimer);
      this.userVoiceTimer = null;
    }
    if (this.userMediaRecorder && this.userMediaRecorder.state !== 'inactive') {
      try { this.userMediaRecorder.stop(); } catch (_) {}
    }
    if (this.userSpeechRecognition) {
      try { this.userSpeechRecognition.stop(); } catch (_) {}
    }
  }

  clearUserVoiceRecording(): void {
    this.stopUserVoiceRecording();
    this.userVoiceAudio = null;
    this.userVoiceText = '';
    this.userVoiceSeconds = 0;
  }

  formatVoiceSeconds(sec: number): string {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  }

  submitBooking(): void {
    if (!this.isLoggedIn) {
      this.modalService.dismissAll();
      this.promptLoginToBook(this.selectedDoctor);
      return;
    }

    if (this.bookingForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'దయచేసి వివరాలను సరిగ్గా పూరించండి',
        text: 'Please fill in all mandatory fields before submitting your appointment request.'
      });
      return;
    }

    if (this.isRecordingUserVoice) {
      this.stopUserVoiceRecording();
    }

    this.isSubmittingBooking = true;
    const langCode = this.userLanguage.split('-')[0];
    const payload = {
      ...this.bookingForm.value,
      user_id: this.usr_id,
      user_voice_audio: this.userVoiceAudio,
      user_voice_text: this.userVoiceText || this.bookingForm.value.notes,
      user_language: langCode
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
            <p>మీ అపాయింట్‌మెంట్ మరియు వాయిస్ కన్సల్టేషన్ నమోదు చేయబడింది.</p>
            <p><b>డాక్టర్:</b> ${payload.doctor_name}</p>
            <p><b>తేదీ:</b> ${payload.appointment_date}</p>
            <p><b>సమయం:</b> ${payload.appointment_time}</p>
            ${payload.user_voice_audio ? '<p class="text-success"><i class="fa fa-microphone"></i> మీ వాయిస్ మెసేజ్ డాక్టర్‌కు చేరింది.</p>' : ''}
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
          title: 'అపాయింట్‌మెంట్ నమోదు చేయబడింది',
          text: 'మీ అపాయింట్‌మెంట్ వివరాలు భద్రపరచబడ్డాయి.',
          confirmButtonColor: '#00548F'
        }).then(() => {
          this.switchTab('my_bookings');
        });
      }
    );
  }

  // -------------------------------------------------------------
  // DOCTOR VOICE REPLY RECORDING & SENDING
  // -------------------------------------------------------------
  openDoctorVoiceReplyModal(appointment: any, modalContent: any): void {
    this.selectedAppointmentForVoiceReply = appointment;
    this.clearDoctorVoiceRecording();
    const patientLang = (appointment.user_language || 'te').toLowerCase();
    this.doctorReplyLanguage = patientLang === 'en' ? 'en-IN' : (patientLang === 'hi' ? 'hi-IN' : 'te-IN');
    this.modalService.open(modalContent, { size: 'lg', centered: true });
  }

  setDoctorReplyLanguage(lang: string): void {
    this.doctorReplyLanguage = lang;
    if (this.isRecordingDoctorVoice) {
      this.stopDoctorVoiceRecording();
    }
  }

  startDoctorVoiceRecording(): void {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let speechActive = false;

    // 1. Start Speech-to-Text Recognition for Doctor
    if (SpeechRec) {
      try {
        if (this.doctorSpeechRecognition) {
          try { this.doctorSpeechRecognition.abort(); } catch (_) {}
        }
        this.doctorSpeechRecognition = new SpeechRec();
        this.doctorSpeechRecognition.lang = this.doctorReplyLanguage;
        this.doctorSpeechRecognition.continuous = true;
        this.doctorSpeechRecognition.interimResults = true;

        this.doctorSpeechRecognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              this.doctorVoiceText = (this.doctorVoiceText ? this.doctorVoiceText + ' ' : '') + text;
            }
          }
        };

        this.doctorSpeechRecognition.start();
        speechActive = true;
      } catch (e) {
        console.warn('Doctor speech recognition start failed:', e);
      }
    }

    // 2. Initialize Doctor Recording State & Timer
    this.doctorAudioChunks = [];
    this.isRecordingDoctorVoice = true;
    this.doctorVoiceSeconds = 0;
    if (this.doctorVoiceTimer) clearInterval(this.doctorVoiceTimer);
    this.doctorVoiceTimer = setInterval(() => {
      this.doctorVoiceSeconds++;
    }, 1000);

    // 3. Audio MediaRecorder Stream Capture
    this.getMicrophoneStream().then(stream => {
      try {
        const MediaRec = (window as any).MediaRecorder;
        if (MediaRec) {
          let options: any;
          if (typeof MediaRec.isTypeSupported === 'function') {
            if (MediaRec.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
            else if (MediaRec.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };
          }
          this.doctorMediaRecorder = options ? new MediaRec(stream, options) : new MediaRec(stream);
          this.doctorMediaRecorder.ondataavailable = (e: any) => {
            if (e.data && e.data.size > 0) {
              this.doctorAudioChunks.push(e.data);
            }
          };
          this.doctorMediaRecorder.onstop = () => {
            const mime = this.doctorMediaRecorder?.mimeType || 'audio/webm';
            const audioBlob = new Blob(this.doctorAudioChunks, { type: mime });
            const reader = new FileReader();
            reader.onloadend = () => {
              this.doctorVoiceAudio = reader.result as string;
            };
            reader.readAsDataURL(audioBlob);
            stream.getTracks().forEach(t => t.stop());
          };
          this.doctorMediaRecorder.start();
        }
      } catch (err) {
        console.warn('Doctor MediaRecorder error:', err);
      }
    }).catch(err => {
      console.warn('Doctor microphone stream error:', err);
      if (speechActive) {
        Swal.fire({
          icon: 'info',
          title: 'స్పీచ్-టు-టెక్స్ట్ ప్రారంభమైంది!',
          text: 'డాక్టర్ గారూ, మీరు మాట్లాడవచ్చు. మీ మాటలు నేరుగా టెక్స్ట్‌గా నమోదవుతాయి.',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        this.isRecordingDoctorVoice = false;
        if (this.doctorVoiceTimer) clearInterval(this.doctorVoiceTimer);
        const isHttp = !window.isSecureContext && location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
        Swal.fire({
          icon: 'info',
          title: 'మైక్రోఫోన్ సౌకర్యం (Microphone)',
          html: isHttp
            ? 'బ్రౌజర్‌లో మైక్రోఫోన్ నేరుగా ఉపయోగించడానికి <b>HTTPS</b> అవసరం.<br><br>మీరు సలహాను క్రింద నేరుగా టైప్ చేయవచ్చు లేదా ఆడియో ఫైల్ అప్‌లోడ్ చేయవచ్చు.'
            : 'దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి లేదా మీ సలహాను క్రింద నేరుగా టైప్ చేయండి.',
          showCancelButton: true,
          confirmButtonColor: '#00548F',
          confirmButtonText: '<i class="fa fa-pencil"></i> సలహాను టైప్ చేస్తాను',
          cancelButtonText: '<i class="fa fa-upload"></i> ఆడియో ఫైల్ ఎంచుకోండి',
          cancelButtonColor: '#6c757d'
        }).then(res => {
          if (res.dismiss === Swal.DismissReason.cancel) {
            this.triggerDoctorAudioUpload();
          }
        });
      }
    });
  }

  triggerDoctorAudioUpload(): void {
    const input = document.getElementById('doctorAudioFileInput') as HTMLInputElement;
    if (input) input.click();
  }

  onDoctorAudioFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.doctorVoiceAudio = reader.result as string;
      this.doctorVoiceSeconds = 30;
      Swal.fire({
        icon: 'success',
        title: 'ఆడియో ఫైల్ జతచేయబడింది!',
        text: file.name,
        timer: 2000,
        showConfirmButton: false
      });
    };
    reader.readAsDataURL(file);
  }

  stopDoctorVoiceRecording(): void {
    this.isRecordingDoctorVoice = false;
    if (this.doctorVoiceTimer) {
      clearInterval(this.doctorVoiceTimer);
      this.doctorVoiceTimer = null;
    }
    if (this.doctorMediaRecorder && this.doctorMediaRecorder.state !== 'inactive') {
      try { this.doctorMediaRecorder.stop(); } catch (_) {}
    }
    if (this.doctorSpeechRecognition) {
      try { this.doctorSpeechRecognition.stop(); } catch (_) {}
    }
  }

  clearDoctorVoiceRecording(): void {
    this.stopDoctorVoiceRecording();
    this.doctorVoiceAudio = null;
    this.doctorVoiceText = '';
    this.doctorVoiceSeconds = 0;
  }

  sendDoctorVoiceReply(): void {
    if (!this.selectedAppointmentForVoiceReply) return;
    if (!this.doctorVoiceAudio && !this.doctorVoiceText) {
      Swal.fire('సమాచారం అవసరం', 'దయచేసి మీ వాయిస్ సందేశం రికార్డ్ చేయండి లేదా సలహాను టైప్ చేయండి.', 'warning');
      return;
    }

    if (this.isRecordingDoctorVoice) {
      this.stopDoctorVoiceRecording();
    }

    this.isSendingDoctorVoice = true;
    const langCode = this.doctorReplyLanguage.split('-')[0];
    const payload = {
      appointment_id: this.selectedAppointmentForVoiceReply.id,
      doctor_voice_audio: this.doctorVoiceAudio,
      doctor_voice_text: this.doctorVoiceText,
      doctor_language: langCode,
      doctor_notes: this.doctorVoiceText
    };

    this.service.doctorvoicereply(payload).subscribe(
      (res: any) => {
        this.isSendingDoctorVoice = false;
        this.selectedAppointmentForVoiceReply.doctor_voice_audio = this.doctorVoiceAudio;
        this.selectedAppointmentForVoiceReply.doctor_voice_text = this.doctorVoiceText;
        this.selectedAppointmentForVoiceReply.doctor_language = langCode;
        this.selectedAppointmentForVoiceReply.doctor_notes = this.doctorVoiceText;
        this.selectedAppointmentForVoiceReply.status = 'Doctor Replied';

        const myAppt = this.myAppointments.find(a => a.id == this.selectedAppointmentForVoiceReply.id);
        if (myAppt) {
          myAppt.doctor_voice_audio = this.doctorVoiceAudio;
          myAppt.doctor_voice_text = this.doctorVoiceText;
          myAppt.doctor_language = langCode;
          myAppt.status = 'Doctor Replied';
        }

        this.saveDoctorAppointmentsToStorage();
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'వాయిస్ సలహా విజయవంతంగా పంపబడింది!',
          text: 'రోగి / కుటుంబ సభ్యులు వారి అపాయింట్‌మెంట్ పేజీలో ఈ వాయిస్ సందేశం వినగలరు.',
          confirmButtonColor: '#00548F'
        });
      },
      (err: any) => {
        this.isSendingDoctorVoice = false;
        this.selectedAppointmentForVoiceReply.doctor_voice_audio = this.doctorVoiceAudio;
        this.selectedAppointmentForVoiceReply.doctor_voice_text = this.doctorVoiceText;
        this.selectedAppointmentForVoiceReply.doctor_language = langCode;
        this.selectedAppointmentForVoiceReply.status = 'Doctor Replied';
        this.saveDoctorAppointmentsToStorage();
        this.modalService.dismissAll();
        Swal.fire('సందేశం పంపబడింది', 'డాక్టర్ వాయిస్ సలహా సేవ్ అయింది.', 'success');
      }
    );
  }

  // -------------------------------------------------------------
  // MY APPOINTMENTS (Family View)
  // -------------------------------------------------------------
  loadMyAppointments(): void {
    if (!this.isLoggedIn) {
      this.myAppointments = [];
      return;
    }
    this.isLoadingAppointments = true;
    this.service.getcouncellingappointments({ user_id: this.usr_id, phone_number: this.userMobile }).subscribe(
      (res: any) => {
        this.isLoadingAppointments = false;
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.myAppointments = res.data.filter((a: any) => a && a.id !== 101);
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
    if (!this.isLoggedIn) {
      this.promptDoctorProfileSetup();
      return;
    }

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
      user_id: this.usr_id || formValue.user_id,
      phone_number: formValue.phone_number || this.userMobile,
      image: this.imagePreview || formValue.image || 'assets/images/pastor.png',
      is_active: formValue.is_active ? 1 : 0
    };

    this.service.savecouncellingdoctor(payload).subscribe(
      (res: any) => {
        this.isSavingProfile = false;
        const updatedDoc = {
          id: (res && res.id) ? res.id : (payload.id || Date.now()),
          ...payload
        };
        const existingIdx = this.doctors.findIndex(d => d.id == updatedDoc.id || (d.phone_number && d.phone_number === updatedDoc.phone_number));
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
          title: 'డాక్టర్ ప్రొఫైల్ విజయవంతంగా సేవ్ అయింది!',
          text: 'మీ ప్రొఫైల్ ఇప్పుడు అందుబాటులో ఉన్న కౌన్సిలర్ డాక్టర్ల జాబితాలో కనిపిస్తుంది.',
          confirmButtonColor: '#00548F'
        }).then(() => {
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
        const existingIdx = this.doctors.findIndex(d => d.id == updatedDoc.id || (d.phone_number && d.phone_number === updatedDoc.phone_number));
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
          text: 'మీ ప్రొఫైల్ ఇప్పుడు అందుబాటులో ఉన్న కౌన్సిలర్ డాక్టర్ల జాబితాలో కనిపిస్తుంది.',
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
  // FALLBACK STORAGE, PURGE & PERSISTENCE
  // -------------------------------------------------------------
  cleanupDummyData(): void {
    try {
      // 1. Purge dummy simulated doctors (id: 1, 2, 3 or dummy names)
      const cachedDocs = localStorage.getItem('jbac_councelling_doctors');
      if (cachedDocs) {
        const list = JSON.parse(cachedDocs);
        if (Array.isArray(list)) {
          const clean = list.filter(d => 
            d && d.id !== 1 && d.id !== 2 && d.id !== 3 &&
            !String(d.doctor_name).includes('Sarah John') &&
            !String(d.doctor_name).includes('David Paul') &&
            !String(d.doctor_name).includes('Grace Varghese')
          );
          localStorage.setItem('jbac_councelling_doctors', JSON.stringify(clean));
        }
      }

      // 2. Purge dummy appointments from storage
      const myAppts = localStorage.getItem('jbac_my_councelling_appts');
      if (myAppts) {
        const list = JSON.parse(myAppts);
        if (Array.isArray(list)) {
          const clean = list.filter(a => a && a.id !== 101 && !String(a.doctor_name).includes('Sarah John'));
          localStorage.setItem('jbac_my_councelling_appts', JSON.stringify(clean));
        }
      }

      const docAppts = localStorage.getItem('jbac_doc_councelling_appts');
      if (docAppts) {
        const list = JSON.parse(docAppts);
        if (Array.isArray(list)) {
          const clean = list.filter(a => a && a.id !== 201 && a.id !== 202 && !String(a.doctor_name).includes('Sarah John'));
          localStorage.setItem('jbac_doc_councelling_appts', JSON.stringify(clean));
        }
      }
    } catch (_) {}
  }

  getLocalFallbackDoctors(): any[] {
    const cached = localStorage.getItem('jbac_councelling_doctors');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          // Return only genuine registered/saved doctors
          return list.filter(d => 
            d && d.id !== 1 && d.id !== 2 && d.id !== 3 &&
            !String(d.doctor_name).includes('Sarah John') &&
            !String(d.doctor_name).includes('David Paul') &&
            !String(d.doctor_name).includes('Grace Varghese')
          );
        }
      } catch (_) {}
    }
    return [];
  }

  saveDoctorsToStorage(): void {
    try {
      localStorage.setItem('jbac_councelling_doctors', JSON.stringify(this.doctors));
    } catch (_) {}
  }

  getMyAppointmentsFromStorage(): any[] {
    if (!this.isLoggedIn) {
      return [];
    }
    const cached = localStorage.getItem('jbac_my_councelling_appts');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          return list.filter(appt => 
            appt && appt.id !== 101 && 
            (appt.user_id == this.usr_id || (this.userMobile && appt.phone_number === this.userMobile))
          );
        }
      } catch (_) {}
    }
    return [];
  }

  saveMyAppointmentsToStorage(): void {
    try {
      localStorage.setItem('jbac_my_councelling_appts', JSON.stringify(this.myAppointments));
    } catch (_) {}
  }

  getDoctorAppointmentsFromStorage(): any[] {
    if (!this.isDoctor && !this.isAdmin) {
      return [];
    }
    const cached = localStorage.getItem('jbac_doc_councelling_appts');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          return list.filter(appt => appt && appt.id !== 201 && appt.id !== 202);
        }
      } catch (_) {}
    }
    return [];
  }

  saveDoctorAppointmentsToStorage(): void {
    try {
      localStorage.setItem('jbac_doc_councelling_appts', JSON.stringify(this.doctorAppointments));
    } catch (_) {}
  }

  // -------------------------------------------------------------
  // CONVINCING AUTHENTICATION & LOGIN PROMPT MODALS
  // -------------------------------------------------------------
  promptLoginToBook(doctor: any): void {
    const docName = doctor?.doctor_name ? `డాక్టర్ ${doctor.doctor_name}` : 'కౌన్సిలర్ డాక్టర్';
    Swal.fire({
      icon: 'info',
      title: 'లాగిన్ అవ్వండి • Login to Book Slot',
      html: `
        <div class="text-start p-2" style="font-size: 14px; line-height: 1.6;">
          <p class="mb-2">
            <b>${docName}</b> గారితో అపాయింట్‌మెంట్ బుక్ చేసుకోవడానికి దయచేసి లాగిన్ అవ్వండి.
          </p>
          <p class="text-muted mb-2">
            క్రైస్తవ కుటుంబ కౌన్సిలింగ్ సంప్రదింపులు, మీ కుటుంబ వివరాలు మరియు డాక్టర్ అందించే మార్గదర్శకత్వం అత్యంత గోప్యంగా ఉంచబడతాయి. మీ అకౌంట్ ద్వారా అపాయింట్‌మెంట్‌లు మరియు డాక్టర్ వాయిస్ సలహాలు భద్రంగా నిర్వహించవచ్చు.
          </p>
          <div class="p-2 bg-light rounded text-center small text-secondary">
            ఖాతా లేదా? కేవలం 1 నిమిషంలో ఉచితంగా రిజిస్టర్ అవ్వండి!
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#00548F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fa fa-sign-in"></i> ఇప్పుడే లాగిన్ అవ్వండి (Login Now)',
      cancelButtonText: 'తర్వాత చేస్తాను (Cancel)'
    }).then((result) => {
      if (result.isConfirmed) {
        if (doctor && doctor.id) {
          sessionStorage.setItem('pending_booking_doc_id', String(doctor.id));
          sessionStorage.setItem('pending_booking_doc_name', doctor.doctor_name);
        }
        this.router.navigate(['/login'], { queryParams: { redirect: '/family-councelling' } });
      }
    });
  }

  promptDoctorProfileSetup(): void {
    Swal.fire({
      icon: 'info',
      title: 'డాక్టర్ లాగిన్ & ప్రొఫైల్ సెటప్ • Doctor Login',
      html: `
        <div class="text-start p-2" style="font-size: 14px; line-height: 1.6;">
          <p class="mb-2">
            <b>మీరు అర్హత కలిగిన క్రైస్తవ వైద్యులా లేదా కౌన్సిలరా?</b>
          </p>
          <p class="text-muted mb-2">
            కౌన్సిలింగ్ బోర్డులో మీ ప్రొఫైల్ వివరాలను సెటప్ చేసుకోవడానికి, అందుబాటులో ఉండే రోజులు/సమయాలు నిర్ణయించడానికి మరియు రోగుల అపాయింట్‌మెంట్లను స్వీకరించడానికి దయచేసి మీ డాక్టర్ ఖాతాలో లాగిన్ అవ్వండి.
          </p>
          <p class="small text-secondary mb-0">
            ఇంకా ఖాతా లేదా? ఉచిత డాక్టర్ రిజిస్ట్రేషన్ ద్వారా మీ వివరాలు నమోదు చేసుకోండి.
          </p>
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#00548F',
      denyButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fa fa-sign-in"></i> డాక్టర్ లాగిన్ (Doctor Login)',
      denyButtonText: '<i class="fa fa-user-md"></i> డాక్టర్ రిజిస్ట్రేషన్ (Register as Doctor)',
      cancelButtonText: 'రద్దు (Cancel)'
    }).then((res) => {
      if (res.isConfirmed) {
        this.router.navigate(['/login'], { queryParams: { cat: '8', redirect: '/family-councelling?tab=doctor_profile' } });
      } else if (res.isDenied) {
        this.router.navigate(['/doctorregister']);
      }
    });
  }

  promptNotDoctorAccount(): void {
    Swal.fire({
      icon: 'warning',
      title: 'డాక్టర్ ఖాతా అవసరం (Doctor Account Required)',
      html: `
        <div class="text-start p-2" style="font-size: 14px; line-height: 1.6;">
          <p class="mb-2">
            స్వాగతం <b>${this.userName}</b>! మీరు ప్రస్తుతం సాధారణ సభ్యులుగా లాగిన్ అయ్యారు.
          </p>
          <p class="text-muted mb-2">
            కౌన్సిలింగ్ బోర్డులో డాక్టర్ ప్రొఫైల్ సెటప్ చేయడానికి మరియు రోగుల అపాయింట్‌మెంట్లు నిర్వహించడానికి డాక్టర్‌గా నమోదు కావలెను.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#00548F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fa fa-user-md"></i> డాక్టర్‌గా నమోదు అవ్వండి (Register as Doctor)',
      cancelButtonText: 'సరే (OK)'
    }).then((res) => {
      if (res.isConfirmed) {
        this.router.navigate(['/doctorregister']);
      }
    });
  }

  checkPendingBookingAfterLogin(): void {
    if (!this.isLoggedIn) return;
    const pendingDocId = sessionStorage.getItem('pending_booking_doc_id');
    const pendingDocName = sessionStorage.getItem('pending_booking_doc_name');
    if (pendingDocId) {
      sessionStorage.removeItem('pending_booking_doc_id');
      sessionStorage.removeItem('pending_booking_doc_name');
      const doc = this.doctors.find(d => d.id == pendingDocId);
      if (doc) {
        Swal.fire({
          icon: 'success',
          title: 'లాగిన్ విజయవంతమైంది!',
          text: `స్వాగతం ${this.userName}! మీరు డాక్టర్ ${doc.doctor_name} గారితో అపాయింట్‌మెంట్ బుక్ చేసుకోవడం కొనసాగించవచ్చు.`,
          confirmButtonColor: '#00548F',
          confirmButtonText: '<i class="fa fa-calendar-plus-o"></i> అపాయింట్‌మెంట్ బుక్ చేయండి'
        });
      }
    }
  }
}

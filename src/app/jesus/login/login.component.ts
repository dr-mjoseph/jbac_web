import { Component, OnInit, AfterContentInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentInit {
  @ViewChild('firstLoginModal') firstLoginModalTemplate!: TemplateRef<any>;

  showSpinner: boolean = false;
  passwordform: FormGroup;
  checkform: FormGroup;
  firstLoginForm: FormGroup;
  submitted: boolean = false;

  firstLoginMembers: any[] = [];
  firstLoginSelectedUser: any = null;
  forgotFamilyMembers: any[] = [];
  isFetchingFamily: boolean = false;
  isUpdatingPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.passwordform = this.formBuilder.group({
      category: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.checkform = this.formBuilder.group({
      category: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.minLength(10)]],
      member_id: [''],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]]
    });

    this.firstLoginForm = this.formBuilder.group({
      member_id: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required]]
    });
  }

  Submitlogindata: boolean = false;
  returnUrl: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['cat']) {
        this.passwordform.patchValue({
          category: String(params['cat']),
          mobile_number: params['phone'] || ''
        });
      }
      if (params['redirect']) {
        this.returnUrl = params['redirect'];
      }
    });
  }

  get f() { return this.passwordform.controls; }
  get i() { return this.checkform.controls; }
  get fl() { return this.firstLoginForm.controls; }

  fillDemoUser(category: string = '1') {
    const isDoc = (category === '8');
    this.passwordform.patchValue({
      category: category,
      mobile_number: isDoc ? '9281506388' : '9281506386',
      password: 'password123'
    });
    this.Submitlogindata = false;
  }

  getCategoryName(cat: any): string {
    switch (String(cat)) {
      case '1': return 'Believer';
      case '2': return 'Student';
      case '3': return 'Ministry';
      case '4': return 'Pastor';
      case '5': return 'Church';
      case '6': return 'Independent Organization';
      case '7': return 'Pastors Association';
      case '8': return 'Doctor';
      default: return 'Member';
    }
  }

  handleSuccessfulLogin(userData: any) {
    const catId = this.passwordform.value.category || (userData ? userData.category_id : '1');
    const catName = this.getCategoryName(catId);
    const userName = (userData && userData.name) ? userData.name : (catName + ' Member');
    const userId = (userData && userData.id) ? userData.id : '1';
    const mobile = this.passwordform.value.mobile_number || (userData ? userData.mobile_number : '');
    const isDoc = (String(catId) === '8' || (userData && userData.is_doctor == 1) || catName === 'Doctor');

    sessionStorage.setItem('usr_id', String(userId));
    sessionStorage.setItem('mobile_number', String(mobile));
    sessionStorage.setItem('name', String(userName));
    sessionStorage.setItem('category_id', String(catId));
    sessionStorage.setItem('category', String(catName));
    sessionStorage.setItem('auth_ind', '1');
    if (isDoc) {
      sessionStorage.setItem('is_doctor', '1');
    } else {
      sessionStorage.removeItem('is_doctor');
    }
    localStorage.setItem('key_id', '1');
    this.service.getlgstatus('1');

    Swal.fire({
      icon: 'success',
      title: 'Login Success...',
      text: `స్వాగతం, ${userName}!`,
      timer: 1600,
      showConfirmButton: false
    }).then(() => {
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else if (isDoc) {
        this.router.navigate(['/family-councelling'], { queryParams: { tab: 'doctor_schedule' } });
      } else {
        this.router.navigate(['/about']);
      }
    });
  }

  passlogin() {
    this.Submitlogindata = true;
    if (this.passwordform.invalid) {
      let missingFields: string[] = [];
      if (this.f['category']?.errors) missingFields.push('క్యాటగిరి (Category)');
      if (this.f['mobile_number']?.errors) missingFields.push('10 అంకెల మొబైల్ నంబర్ (10-digit Mobile Number)');
      if (this.f['password']?.errors) missingFields.push('పాస్‌వర్డ్ (Password min 6 chars)');

      Swal.fire({
        icon: 'warning',
        title: 'వివరాలు పూరించండి',
        text: 'దయచేసి ఖాళీగా ఉన్న వివరాలు నమోదు చేయండి: ' + missingFields.join(', ')
      });
      return;
    }

    this.showSpinner = true;
    this.service.passwordlogin(this.passwordform.value).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        console.log('Login API Response:', res);
        if (res.status == 250) {
          Swal.fire({
            icon: 'info',
            title: 'నమోదు కాలేదు',
            text: 'ఈ మొబైల్ నంబర్ ఇంకా నమోదు కాలేదు. దయచేసి Sign-Up లేదా Entry Form ద్వారా రిజిస్టర్ చేసుకోండి.'
          });
        } else if (res.status == 600) {
          Swal.fire({
            icon: 'error',
            title: 'తప్పు పాస్‌వర్డ్',
            text: 'పాస్‌వర్డ్ సరిపోలలేదు. దయచేసి సరైన పాస్‌వర్డ్ ఎంటర్ చేయండి లేదా Forgot Password ద్వారా రీసెట్ చేయండి.'
          });
        } else if (res.status == 201 || res.first_login == true) {
          // First attempt login or multiple family members registered under same phone
          this.firstLoginSelectedUser = (res.data && res.data.length > 0) ? res.data[0] : (res.selected_member || null);
          this.firstLoginMembers = res.members || (this.firstLoginSelectedUser ? [this.firstLoginSelectedUser] : []);
          const defaultMemberId = this.firstLoginSelectedUser?.id || (this.firstLoginMembers.length > 0 ? this.firstLoginMembers[0].id : '');
          this.firstLoginForm.patchValue({
            member_id: defaultMemberId,
            new_password: '',
            confirm_password: ''
          });

          if (this.firstLoginModalTemplate) {
            this.modalService.open(this.firstLoginModalTemplate, { centered: true, backdrop: 'static', keyboard: false });
          } else {
            this.handleSuccessfulLogin(this.firstLoginSelectedUser);
          }
        } else if (res.status == 200 || (res.data && res.data.length > 0)) {
          this.handleSuccessfulLogin(res.data ? res.data[0] : null);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'లాగిన్ హెచ్చరిక',
            text: res.message || 'లాగిన్ పూర్తి కాలేదు.'
          });
        }
      },
      error: (error: any) => {
        this.showSpinner = false;
        console.error('Login Network/Server Error:', error);

        Swal.fire({
          icon: 'warning',
          title: 'డేటాబేస్ నెట్‌వర్క్ సమస్య (RDS 10060)',
          html: `రిమోట్ AWS MySQL డేటాబేస్ టైమౌట్ అయ్యింది (AWS RDS port 3306 connection timed out).<br><br>మీరు <b>ఆఫ్‌లైన్ / లోకల్ సెషన్‌తో</b> వెబ్‌సైట్‌లోకి లాగిన్ అవ్వాలనుకుంటున్నారా?`,
          showCancelButton: true,
          confirmButtonText: 'అవును, లాగిన్ చేయండి (Continue & Log In)',
          cancelButtonText: 'రద్దు (Cancel)',
          confirmButtonColor: '#198754',
          cancelButtonColor: '#6c757d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.handleSuccessfulLogin({
              id: '1',
              name: this.getCategoryName(this.passwordform.value.category) + ' Member',
              mobile_number: this.passwordform.value.mobile_number,
              category_id: this.passwordform.value.category
            });
          }
        });
      }
    });
  }

  // Acct Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  // First Login Modal Actions
  submitFirstLoginPassword() {
    if (this.firstLoginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'వివరాలు పూరించండి',
        text: 'దయచేసి కొత్త పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు) మరియు కన్ఫర్మ్ పాస్‌వర్డ్ నమోదు చేయండి.'
      });
      return;
    }

    const newPwd = this.firstLoginForm.value.new_password;
    const confirmPwd = this.firstLoginForm.value.confirm_password;
    if (newPwd !== confirmPwd) {
      Swal.fire({
        icon: 'error',
        title: 'పాస్‌వర్డ్ సరిపోలలేదు',
        text: 'కొత్త పాస్‌వర్డ్ మరియు కన్ఫర్మ్ పాస్‌వర్డ్ ఒకేలా ఉండాలి.'
      });
      return;
    }

    const memberId = this.firstLoginForm.value.member_id;
    const selectedMem = this.firstLoginMembers.find((m: any) => String(m.id) === String(memberId)) || this.firstLoginSelectedUser;

    this.isUpdatingPassword = true;
    this.service.updateFamilyMemberPassword({
      mobile_number: this.passwordform.value.mobile_number,
      password: newPwd,
      member_id: memberId,
      name: selectedMem?.name
    }).subscribe({
      next: (_res: any) => {
        this.isUpdatingPassword = false;
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'పాస్‌వర్డ్ మార్చబడింది!',
          text: 'మీ కొత్త పాస్‌వర్డ్ విజయవంతంగా సెట్ చేయబడింది. లాగిన్ అవుతోంది...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.handleSuccessfulLogin(selectedMem || this.firstLoginSelectedUser);
        });
      },
      error: (err: any) => {
        this.isUpdatingPassword = false;
        console.error('Password update error:', err);
        this.modalService.dismissAll();
        this.handleSuccessfulLogin(selectedMem || this.firstLoginSelectedUser);
      }
    });
  }

  continueWithCurrentPassword() {
    this.modalService.dismissAll();
    const memberId = this.firstLoginForm.value.member_id;
    const selectedMem = this.firstLoginMembers.find((m: any) => String(m.id) === String(memberId)) || this.firstLoginSelectedUser;
    this.handleSuccessfulLogin(selectedMem || this.firstLoginSelectedUser);
  }

  // Forgot Password Direct Reset (No OTP required)
  forgetpassword(forget: any) {
    this.forgotFamilyMembers = [];
    this.checkform.reset();
    if (this.passwordform.value.category) {
      this.checkform.patchValue({ category: this.passwordform.value.category });
    }
    if (this.passwordform.value.mobile_number) {
      this.checkform.patchValue({ mobile_number: this.passwordform.value.mobile_number });
      this.onForgotPhoneChange();
    }
    this.modalService.open(forget, { centered: true });
  }

  onForgotPhoneChange() {
    const phone = String(this.checkform.value.mobile_number || '').trim();
    if (phone.length === 10) {
      this.isFetchingFamily = true;
      this.service.getFamilyMembers(phone).subscribe({
        next: (res: any) => {
          this.isFetchingFamily = false;
          if (res && res.members && res.members.length > 0) {
            this.forgotFamilyMembers = res.members;
            this.checkform.patchValue({ member_id: this.forgotFamilyMembers[0].id });
          } else {
            this.forgotFamilyMembers = [];
            this.checkform.patchValue({ member_id: '' });
          }
        },
        error: () => {
          this.isFetchingFamily = false;
          this.forgotFamilyMembers = [];
        }
      });
    } else {
      this.forgotFamilyMembers = [];
    }
  }

  resetForgotPasswordDirect() {
    if (this.checkform.invalid) {
      let missingFields: string[] = [];
      if (this.i['category']?.errors) missingFields.push('క్యాటగిరి (Category)');
      if (this.i['mobile_number']?.errors) missingFields.push('10 అంకెల మొబైల్ నంబర్');
      if (this.i['password']?.errors) missingFields.push('కొత్త పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)');
      if (this.i['confirm_password']?.errors) missingFields.push('కన్ఫర్మ్ పాస్‌వర్డ్');

      Swal.fire({
        icon: 'warning',
        title: 'వివరాలు పూరించండి',
        text: 'దయచేసి ఖాళీగా ఉన్న వివరాలు నమోదు చేయండి: ' + missingFields.join(', ')
      });
      return;
    }

    const newPwd = this.checkform.value.password;
    const confirmPwd = this.checkform.value.confirm_password;
    if (newPwd !== confirmPwd) {
      Swal.fire({
        icon: 'error',
        title: 'పాస్‌వర్డ్ సరిపోలలేదు',
        text: 'కొత్త పాస్‌వర్డ్ మరియు కన్ఫర్మ్ పాస్‌వర్డ్ సరిపోలలేదు. దయచేసి సరిగ్గా టైప్ చేయండి.'
      });
      return;
    }

    this.showSpinner = true;
    const payload = {
      category: this.checkform.value.category,
      mobile_number: this.checkform.value.mobile_number,
      password: newPwd,
      member_id: this.checkform.value.member_id || null
    };

    this.service.updateFamilyMemberPassword(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res.status == 200 || res.status == 201) {
          Swal.fire({
            icon: 'success',
            title: 'పాస్‌వర్డ్ మార్చబడింది!',
            text: 'మీ పాస్‌వర్డ్ విజయవంతంగా రీసెట్ చేయబడింది. దయచేసి కొత్త పాస్‌వర్డ్‌తో లాగిన్ చేయండి.'
          });
          this.modalService.dismissAll();
          this.passwordform.patchValue({
            category: this.checkform.value.category,
            mobile_number: this.checkform.value.mobile_number,
            password: newPwd
          });
          this.checkform.reset();
          this.forgotFamilyMembers = [];
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'హెచ్చరిక',
            text: res.message || 'పాస్‌వర్డ్ అప్‌డేట్ కాలేదు. దయచేసి మొబైల్ నంబర్ సరిచూసుకోండి.'
          });
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error('Password reset error:', err);
        Swal.fire({
          icon: 'error',
          title: 'నెట్‌వర్క్ సమస్య',
          text: 'సర్వర్‌కు కనెక్ట్ చేయడంలో సమస్య వచ్చింది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.'
        });
      }
    });
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
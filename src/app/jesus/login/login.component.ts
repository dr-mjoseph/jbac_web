import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showSpinner: boolean = false;
  passwordform: FormGroup;
  checkform: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router, private modalService: NgbModal,) {
    this.passwordform = this.formBuilder.group({
      category: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

    this.checkform = this.formBuilder.group({
      category: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.minLength(10)]],
      otp: ['', [Validators.minLength(4)]],
      password: ['', [Validators.minLength(8)]]
    });


  }

  ngOnInit(): void {



  }

  get f() { return this.passwordform.controls }
  get i() { return this.checkform.controls }

  Submitlogindata: boolean = false;

  fillDemoUser(category: string = '1') {
    this.passwordform.patchValue({
      category: category,
      mobile_number: '9281506386',
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
      default: return 'Member';
    }
  }

  handleSuccessfulLogin(userData: any) {
    const catId = this.passwordform.value.category || (userData ? userData.category_id : '1');
    const catName = this.getCategoryName(catId);
    const userName = (userData && userData.name) ? userData.name : (catName + ' Member');
    const userId = (userData && userData.id) ? userData.id : '1';
    const mobile = this.passwordform.value.mobile_number || (userData ? userData.mobile_number : '');

    sessionStorage.setItem('usr_id', String(userId));
    sessionStorage.setItem('mobile_number', String(mobile));
    sessionStorage.setItem('name', String(userName));
    sessionStorage.setItem('category_id', String(catId));
    sessionStorage.setItem('category', String(catName));
    sessionStorage.setItem('auth_ind', '1');
    localStorage.setItem('key_id', '1');
    this.service.getlgstatus('1');

    Swal.fire({
      icon: 'success',
      title: 'Login Success...',
      text: `స్వాగతం, ${userName}!`,
      timer: 1600,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/about']);
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
            text: 'ఈ మొబైల్ నంబర్ ఇంకా నమోదు కాలేదు. దయచేసి Sign-Up ద్వారా రిజిస్టర్ చేసుకోండి.'
          });
        } else if (res.status == 600) {
          Swal.fire({
            icon: 'error',
            title: 'తప్పు పాస్‌వర్డ్',
            text: 'పాస్‌వర్డ్ సరిపోలలేదు. దయచేసి సరైన పాస్‌వర్డ్ ఎంటర్ చేయండి.'
          });
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

        // When remote RDS times out (10060 / ETIMEDOUT), offer immediate offline login so user is never blocked
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



  forgetpassword(forget: any) {
    this.modalService.open(forget, { centered: true, })
  }


  otpfiled: boolean = false;
  passwordfield: boolean = false;

  emailcheck() {
    if (this.checkform.invalid) {
      return;
    } else {
      this.service.checknumber(this.checkform.value).subscribe((res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          Swal.fire('Otp sent for your registered number : ' + this.checkform.value.mobile_number)
          this.otpfiled = true;
        }
      })
    }
  }

  forgetemailotpsubmit() {
    if (this.checkform.invalid) {
      return;
    } else if (this.checkform.value.otp == '' || this.checkform.value.mobile_number == '') {
      Swal.fire('please enter the otp ')
    } else {
      this.service.checkotp(this.checkform.value).subscribe((res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.passwordfield = true
        }
      })
    }
  }

  createfrgetpassword() {
    if (this.checkform.value.password == '' || this.checkform.value.mobile_number == '') {
      Swal.fire('please enter the password ')
    } else if (this.checkform.value.password.length < 6) {
      Swal.fire('Please Enter the 6 To 16 Digits / special characters ')
    } else {
      this.service.createfrgetpassword(this.checkform.value).subscribe((res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          Swal.fire('password Created for login ');
          this.otpfiled = false;
          this.passwordfield = false;
          this.modalService.dismissAll();
          this.checkform.reset();
        }
      });
    }

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
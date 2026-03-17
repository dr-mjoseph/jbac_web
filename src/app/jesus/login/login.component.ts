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
  passlogin() {
    this.showSpinner = true;
    this.Submitlogindata = true;
    if (this.passwordform.invalid) {
      Swal.fire("Please fill the empty fields");
      this.showSpinner = false;
      return;
    } else {
      this.service.passwordlogin(this.passwordform.value).subscribe((res: any) => {
        this.showSpinner = false;
        console.log(40, res);
        if (res.status == 250) {
          Swal.fire('This number not Registered ... ')
        } else if (res.status == 600) {
          Swal.fire('Wrong Password ... ')
        } else {
          Swal.fire('Login Success...')
          sessionStorage.setItem('usr_id', res.data[0].id);
          sessionStorage.setItem('mobile_number', this.passwordform.value.mobile_number);
          sessionStorage.setItem('name', res.data[0].name);
          sessionStorage.setItem('category_id', this.passwordform.value.category);
          sessionStorage.setItem('auth_ind', "1");
          if (this.passwordform.value.category == 1) {
            sessionStorage.setItem('category', 'Believer');
          } else if (this.passwordform.value.category == 2) {
            sessionStorage.setItem('category', 'Student');
          } else if (this.passwordform.value.category == 3) {
            sessionStorage.setItem('category', 'Ministry');
          } else if (this.passwordform.value.category == 4) {
            sessionStorage.setItem('category', 'Pastor');
          } else if (this.passwordform.value.category == 5) {
            sessionStorage.setItem('category', 'Church');
          } else if (this.passwordform.value.category == 6) {
            sessionStorage.setItem('category', 'Independent Organization ');
          }
          else if (this.passwordform.value.category == 7) {
            sessionStorage.setItem('category', 'Pastors Association ');
          }
          this.service.getlgstatus('1');
          localStorage.setItem('key_id','1');
          this.router.navigate(['/about']);
        }
        
      }, error => {
        this.showSpinner = false;
      });
    }
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
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {

  contactform: any;
  extension: boolean = false;
  formsubmit: boolean = false;

  constructor(public service: ServiceService, public formBuilder: FormBuilder,private router:Router) {

  }

  ngOnInit(): void {
    this.contactform = this.formBuilder.group({
      name: ['', [Validators.required]],
      e_mail: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],

    });
  }
  submitcontact() {
    if (this.contactform.invalid) {
      Swal.fire("please fill the details");
      return;
    }
    var data = {
      name: this.contactform.value.name,
      e_mail: this.contactform.value.e_mail,
      subject: this.contactform.value.subject,
      message: this.contactform.value.message
    }
    this.service.contact(data).subscribe(
      res => {
        console.log(data);
        Swal.fire('Successfully submitted the data')
        this.contactform.reset();
      },
      error => {
      });
  }


  ///////////////////mobile view///////////////
  login: boolean = true;
  notlogin: boolean = false;
name:any;
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





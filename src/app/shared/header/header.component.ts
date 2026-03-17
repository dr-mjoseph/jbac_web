import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/jesus/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  name: any;
  usr_id: any;
  logincon: boolean = false

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.usr_id = sessionStorage.getItem('usr_id');
    this.checklogin();
    this.name = sessionStorage.getItem('name');
    if (this.usr_id) {
      this.logincon = true;
    } else {
      this.logincon = false;
    }
  }

  alert() {
    Swal.fire('Hey user!', 'please Login', 'info');
    this.router.navigate(['/login']);
  }

  form_ind: any;
  formshow(id: any) {
    this.form_ind = id
  }
  login: boolean = true;
  notlogin: boolean = false;

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
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Logout Sucessfully'
        )
        sessionStorage.clear();
        localStorage.setItem('key_id','1');
        this.router.navigate(['/about']);
        this.service.getlgstatus('2')
        
      } else {
        location.reload();
      }
    })
  }
}


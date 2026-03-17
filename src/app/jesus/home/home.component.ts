import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/jesus/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name: any;
  usr_id: any;
  logincon: boolean = false
  musical: any;
  img: boolean = true;

  slideIndex: any;
  slides: any;
  dots: any;
  timeoutId: any;

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

  ngAfterViewInit() {
    this.slideIndex = 0;
    this.timeoutId = null;
    this.slides = document.getElementsByClassName("mySlides");
    this.dots = document.getElementsByClassName("dot");
    this.showSlides();
  }

  currentSlide(index: any) {
    this.slideIndex = index;
    this.showSlides();
  }

  plusSlides(step: any) {
    if (step < 0) {
      this.slideIndex -= 2;
      if (this.slideIndex < 0) {
        this.slideIndex = this.slides.length - 1;
      }
    }
  }

  showSlides() {

    for (let i = 0; i < this.slides.length; i++) {
      this.slides[i].style.display = "none";
      this.dots[i].classList.remove('active');
    }
    this.slideIndex++;
    if (this.slideIndex > this.slides.length) {
      this.slideIndex = 1
    }
    this.slides[this.slideIndex - 1].style.display = "block";
    this.dots[this.slideIndex - 1].classList.add('active');
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.showSlides();
    }, 4000); // Change image every 5 seconds
  }


  alert() {
    Swal.fire('Hey user!',
      'please Login',
      'info');
    this.router.navigate(['/login']);
  }

  login: boolean = true;
  notlogin: boolean = false;

  ngAfterContentInit() {
    this.service.getloginstatus.subscribe((res: any) => {
      if (res == '1') {
        this.login = false;
        this.notlogin = true;
        this.name = sessionStorage.getItem('name');
      } else if (res == '2') {
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
        this.router.navigate(['/']);
        this.service.getlgstatus('2')
      }
    })
  }



  getmusical() {
    this.service.getevents().subscribe(res => {

      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.musical = res.data;
      }
    }, error => {

    })
  }

  search() {
    this.img = false
  }

}





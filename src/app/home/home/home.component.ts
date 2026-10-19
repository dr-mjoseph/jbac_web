import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServiceService } from 'src/app/jesus/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  name: any;
  usr_id: any;
  logincon: boolean = false;
  musical: any;
  img: boolean = true;
  
  slideIndex: number = 0;
  slides: any;
  dots: any;
  timeoutId: any;

  banners: string[] = [
    'assets/images/Banner01.png',
    'assets/images/Banner03.png',
    'assets/images/Banner04.png',
    'assets/images/Banner05.png',
    'assets/images/Banner06.png',
    'assets/images/Banner07.png'
  ];

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.preloadBanners();
    this.usr_id = sessionStorage.getItem('usr_id');
    this.checklogin();
    this.name = sessionStorage.getItem('name');

    if (this.usr_id) {
      this.logincon = true;
    } else {
      this.logincon = false;
    }
  }

  preloadBanners(): void {
    if (typeof window !== 'undefined') {
      const bannerNums = ['01', '03', '04', '05', '06', '07'];
      for (const num of bannerNums) {
        const webpImg = new Image();
        webpImg.src = `assets/images/Banner${num}.webp`;
        const pngImg = new Image();
        pngImg.src = `assets/images/Banner${num}.png`;
      }
    }
  }

  ngAfterViewInit() {
    this.slides = document.getElementsByClassName("mySlides");
    this.dots = document.getElementsByClassName("dot");
    this.showSlide(0);
    this.startAutoTimer();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  currentSlide(index: number) {
    this.showSlide(index);
    this.startAutoTimer();
  }

  plusSlides(step: number) {
    const total = this.slides && this.slides.length > 0 ? this.slides.length : 6;
    let nextIndex = (this.slideIndex + step) % total;
    if (nextIndex < 0) {
      nextIndex = total - 1;
    }
    this.showSlide(nextIndex);
    this.startAutoTimer();
  }

  showSlide(index: number) {
    if (!this.slides || this.slides.length === 0) {
      this.slides = document.getElementsByClassName("mySlides");
    }
    if (!this.dots || this.dots.length === 0) {
      this.dots = document.getElementsByClassName("dot");
    }

    const total = this.slides ? this.slides.length : 0;
    if (total === 0) return;

    const previousIndex = this.slideIndex;
    this.slideIndex = (index + total) % total;

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      slide.style.display = "";

      if (i === this.slideIndex) {
        slide.classList.remove('prev-slide');
        slide.classList.add('active-slide');
      } else if (i === previousIndex && previousIndex !== this.slideIndex) {
        slide.classList.remove('active-slide');
        slide.classList.add('prev-slide');
      } else {
        slide.classList.remove('active-slide', 'prev-slide');
      }
    }

    for (let i = 0; i < this.dots.length; i++) {
      if (i === this.slideIndex) {
        this.dots[i].classList.add('active');
      } else {
        this.dots[i].classList.remove('active');
      }
    }
  }

  showSlides() {
    this.plusSlides(1);
  }

  startAutoTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.plusSlides(1);
    }, 5000);
  }

  onBannerError(event: any, index: number) {
    const num = (index + 1).toString().padStart(2, '0');
    const fallbackUrl = `https://jbac.in/baneers/Banner${num}.png`;
    if (event && event.target && event.target.src !== fallbackUrl) {
      event.target.src = fallbackUrl;
    }
  }


  goToCounselling(tab: string = 'browse') {
    this.router.navigate(['/family-councelling'], { queryParams: { tab: tab } });
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




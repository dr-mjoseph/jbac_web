import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-videospage',
  templateUrl: './videospage.component.html',
  styleUrls: ['./videospage.component.css']
})
export class VideospageComponent {

  blogdetails: any
  constructor(private router: ActivatedRoute, private sanitizer: DomSanitizer, public service: ServiceService, private routerp: Router) {
 

    this.getvideourldatadetails()
  }
  page: number = 1;


  ngOnInit(): void {
  }
  getvideourldatadetails() {
    this.service.getvideourldatadetails().subscribe((res: any) => {
      console.log(res.data);
      this.blogdetails = res.data;
      this.blogdetails.map((res: any) => {
        res.banner_url = this.sanitizer.bypassSecurityTrustResourceUrl(res.banner_url)
      })
    }, error => {
    })
  }
}

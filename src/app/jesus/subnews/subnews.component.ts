import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subnews',
  templateUrl: './subnews.component.html',
  styleUrls: ['./subnews.component.css']
})
export class SubnewsComponent {
  id: any = [];
  gallery: any;
  page: number = 1;

  constructor(private router: ActivatedRoute, private service: ServiceService, private modalCtrl: NgbModal,private rout:Router) {

    this.id = this.router.snapshot.params['id'];
    console.log(this.id)
  }

  ngOnInit(): void {
    this.getnews();
  }
  imagesget: any;
  searchnews: any;


  getnews() {
    this.service.getupdatenews().subscribe(res => {
      console.log(res.data);
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.searchnews = res.data.filter((data: any) => data.id == this.id);
        console.log(res.data);
      }
    }, error => {

    })

  }

  modalDismiss() {
    this.modalCtrl.dismissAll()
  }

  showi: boolean = true;

  close() {
    this.showi = false;
  }
  modalimage1: any;
  modalimage: any = [];
  zoom(openmodal: any, image: any, img: any) {
    //console.log( img);
    this.modalimage1 = img.image;
    //console.log(this.modalimage1);
    this.modalimage = image[0].image;
    //console.log( this.modalimage);
    this.showi = true;
    this.modalCtrl.open(openmodal, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl' })
  }
  login: boolean = true;
  notlogin: boolean = false;
  name: any;
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
        this.rout.navigate(['/gallery']);
        this.service.getlgstatus('2')
      }
    })
  }


  alert() {
    Swal.fire('Hey user!', 'please Login', 'info');
    this.rout.navigate(['/login']);
  }

}




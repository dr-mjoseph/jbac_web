import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subgallery',
  templateUrl: './subgallery.component.html',
  styleUrls: ['./subgallery.component.css']
})
export class SubgalleryComponent {
  id:any=[];
  gallery: any;
  page: number = 1;

  constructor(private router: ActivatedRoute, private service: ServiceService, private modalCtrl: NgbModal) {

    this.id = this.router.snapshot.params['id'];
    console.log( this.id )
   }


  ngOnInit(): void {
    this.getimages();
  }

  imagesget: any;


  
  getimages() {
    this.service.getcatewebsitegallery().subscribe((res: any) => {
      console.log(res,'hi');
      this.gallery = res.data.filter((data: any) => data.category_id == this.id);
      console.log(this.gallery);
    })
  }
  modalDismiss() {
    this.modalCtrl.dismissAll()
  }
  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalCtrl.open(openmodel, { size: 'xl', centered: true });
  }
  showi: boolean = true;

  close() {
    this.showi = false;
  }
  modalimage1: any;
  modalimage: any = [];
  zoom(openmodal: any, image: any, img: any) {
    this.modalimage1 = img.image;
    this.modalimage = image[0].image;
    this.showi = true;
    this.modalCtrl.open(openmodal, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl' })
  }
  proofmodalDismis() {
    this.modalCtrl.dismissAll()
  }
}


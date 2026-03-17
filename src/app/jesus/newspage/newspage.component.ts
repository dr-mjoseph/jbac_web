import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newspage',
  templateUrl: './newspage.component.html',
  styleUrls: ['./newspage.component.css']
})
export class NewspageComponent {
  image: any;
  
  constructor(private modalCtrl: NgbModal) {
  

  }
  openimg(openmodel: any) {
  
    this.modalCtrl.open(openmodel, { size: 'xl', centered: true });
  }
  proofmodalDismis() {
    this.modalCtrl.dismissAll()
  }
}

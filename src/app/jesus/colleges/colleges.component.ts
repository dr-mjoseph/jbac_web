import { Component } from '@angular/core';

@Component({
  selector: 'app-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.css']
})
export class CollegesComponent {
  form_ind: any;
  formshow(id: any) {
    this.form_ind = id
  }
}

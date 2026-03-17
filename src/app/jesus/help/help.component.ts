import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  addinghelp: FormGroup;
  imagesData: any = [];
  showSpinner: boolean = false
  // showSpinner: boolean = true;
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private modalService: NgbModal , private router: Router) {

    this.addinghelp = this.formBuilder.group({
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
      help: ['']
    })


  }
  ngOnInit(): void {

    if (sessionStorage.getItem("auth_ind")==''||sessionStorage.getItem("auth_ind")==null|| sessionStorage.getItem("auth_ind")==undefined){
      Swal.fire("Login Required")
      this.router.navigate(['/']);
    }

    
    this.gethelps();
    this.getadds();
  }
  ///image code

  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader);
        var imgFile = reader.result as string;
        console.log(imgFile);
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        this.imagesData = [];
        this.imagesData.push({ reviewimg: imgFile, filetype: imgtype })
        console.log(imgtype, 'hello');
      };
    }
  }


  postmeetings() {
    this.showSpinner = true;
    if (this.addinghelp.invalid) {
      Swal.fire('please fill the details');
      this.showSpinner = false
    } else {
      var data = {
        usr_id: sessionStorage.getItem('usr_id'),
        mobile_number: sessionStorage.getItem('mobile_number'),
        name: sessionStorage.getItem('name'),
        description: this.addinghelp.value.description,
        help: this.addinghelp.value.help,
        reviewImg: this.imagesData
      }
      this.service.posthelping(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.showSpinner = false
          this.addinghelp.reset();
          this.imagesData = [];
          this.gethelps();
        } else {
          Swal.fire('server down')
          this.showSpinner = false;
        }
      },
        error => {
          this.showSpinner = true
        })
    }

  }

  proofmodalDismis() {
    this.modalService.dismissAll()
  }
  searchevents: any;
  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }


  gethelps() {
    this.service.gethelp().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.searchevents = res.data;
      }
    }, error => {

    })
  }

adds:any;
  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
    }, error => {
      this.showSpinner = false;
    })
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


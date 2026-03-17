import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent {
  showSpinner: boolean = false;
  loading: boolean = false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;
  wishform: FormGroup;
  
imagesData: any = [];
  denomation: any;
  pattern: any;
  districts: any;
  
  data: any;
  clearData() {
    this.data = null; // or reset to initial value
    this.id = null;
    this.constituency_id = null;
    this.district = null;
        this.panchayati=null;
    //this.panchayati=null;
  }
  mandals: any;
  panchayati: any;
  bliversdata: any;
  district: any;
  constituency: any;
  panchayatis: any;
  imagedata: any = []
  wings: any;
  now: any;

  ministryname: any;
  constituency_id: any;
  services: any;
  id: any

  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router, private modalService: NgbModal) {
    this.wishform = this.formBuilder.group({
      category: ['', [Validators.required]],
      phnumber: ['', [Validators.required, Validators.minLength(10)]],
      whatsapnum: [''],
      name: ['', [Validators.required]],
      churchname: [''],
       image: [''],
       denomation: ['', [Validators.required]],
       number_ofmembers: [''],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      address: [''],
      description: [''],


    })

  }
  get f() { return this.wishform.controls }
  get r() { return this.wishform.controls; }
get t() { return this.wishform.controls; }
get e() { return this.wishform.controls }

  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getdenomations();
    this.getdistric();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    //this.usr_id = sessionStorage.getItem('usr_id');
    //this.name = sessionStorage.getItem('name');
    // if (this.usr_id) {
    //   this.logincon = true;
    // } else {
    //   this.logincon = false;
    // }
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }
//  onImageChange(e: any) {
//     const reader = new FileReader();
//     if (e.target.files && e.target.files.length) {
//       const [file] = e.target.files;
//       reader.readAsDataURL(file);
//       reader.onload = () => {

//         var imgFile = reader.result as string;

//         var bfile_typeEmpl = e.target.files[0].name.split('.');
//         var imgtype = bfile_typeEmpl[1];
//         this.imagesData = [];
//         this.imagesData.push({ reviewimg: imgFile, filetype: imgtype })

//       };
//     }
//   }
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
  getdistric() {
    this.showSpinner = true;

    this.service.getdistrict().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.districts = res.data;
        }
        else {
          Swal.fire("జిల్లాల సమాచారము అందుబాటులో లేదు.");
        }
        this.showSpinner = false;
      },
      (error) => {
        console.error('జిల్లా పొందడంలో సమస్య వుంది', error);
        Swal.fire("జిల్లా పొందడంలో సమస్య వుంది, దయచేసి మరల ప్రయత్నించండి.");
        this.showSpinner = false;
      }
    );
  }

  

  getconstency(event: any) {
    const id = event.target.value?.trim(); // Ensure valid ID

    if (!id) {
      Swal.fire(" దయచేసి సరైన జిల్లా ఎంపిక చేయండి.");
      return;
      
    }

    this.showSpinner = true; // Start loading indicator

    this.service.getconsistencys().subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);

          if (this.constituency.length === 0) {
            Swal.fire("ఎంచుకున్న జిల్లాకు నియోజకవర్గాల సమాచారం అందుబాటులో లేదు.");
          }
        } else {
          Swal.fire("నియోజకవర్గాల సమాచారం అందుబాటులో లేదు.");
        }
        this.showSpinner = false; // Stop loading indicator
      },
      (error) => {
        console.error('Error fetching constituencies:', error);
        Swal.fire("నియోజకవర్గాల సమాచారం పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.");
        this.showSpinner = false; // Stop loading indicator on error
      }
    );
  }
getmandals(event: any) {
    const id = event.target.value?.trim(); // Ensure ID is valid
  
      if (!id) {
      Swal.fire({
        icon: 'warning',
        title: 'గమనిక!',
        text: 'దయచేసి చక్కటి నియోజకవర్గాన్ని ఎంచుకోండి.',
      });
      return;
    }
  
    this.showSpinner = true;
  
    this.service.getmandals().subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          // Filter and assign mandals
          this.mandals = res.data.filter((data: any) => data.const_id == id);
          
          if (this.mandals.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'సమాచారం',
              text: 'ఎంచుకున్న నియోజకవర్గానికి మండలాలు లభ్యం కావడంలేదు.',
            });
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'గమనిక!',
            text: 'మండలాల సమాచారం అందుబాటులో లేదు.',
          });
        }
        this.showSpinner = false;
      },
      (error) => {
        console.error('Error fetching mandals:', error);
        Swal.fire("మండలాలను / మున్సిపాలిటీ పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.");
        this.showSpinner = false;
      }
    );
  }
 

  gepanchayati(event: any) {
    const id = event.target.value?.trim(); // Ensure valid ID

    if (!id) {
      Swal.fire("దయచేసి సరైన మండలాన్ని ఎంచుకోండి.");
      return;
    }

    this.showSpinner = true; // Show loading spinner

    this.service.gepanchayatis().subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);

          if (this.panchayati.length === 0) {
            Swal.fire("ఎంచుకున్న మండలానికి పంచాయితీలు / వార్డులు లభ్యం కావడంలేదు.");
          }
        } else {
          Swal.fire("పంచాయితీ / వార్డు వివరాలు అందుబాటులో లేవు.");
        }

        this.showSpinner = false; // Hide loading spinner
        console.log('Panchayati Data:', this.panchayati);
      },
      (error) => {
        console.error('Error fetching panchayati:', error);
        Swal.fire("పంచాయితీ / వార్డ్ నంబర్ పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి."  );

        this.showSpinner = false; // Hide spinner in case of error
      }
    );
  }

  postwishform() {
    this.submitted = true;
    this.showSpinner = true;

    if (this.wishform.invalid) {
     Swal.fire(
        "మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి"
      );
      this.showSpinner = false; // Stop spinner on validation failure
      return;
    }
else {
      this.showSpinner = true;
      var data = {
     category: this.wishform.value.category,
     phnumber: this.wishform.value.phnumber,
     whatsapnum: this.wishform.value.whatsapnum,
     name: this.wishform.value.name,
     churchname: this.wishform.value.churchname,
    denomation: this.wishform.value.denomation,
       number_ofmembers: this.wishform.value.number_ofmembers,
       district_id: this.wishform.value.district_id,
       constituency_id: this.wishform.value.constituency_id,
       mandal_id: this.wishform.value.mandal_id,
       village_id: this.wishform.value.village_id,
       address: this.wishform.value.address,
       description: this.wishform.value.description,
        reviewImg: this.imagesData

      }
console.log(data);
    this.service.postwishform(data).subscribe(
      (res: any) => {
        if (res.status === 200) {
         Swal.fire(" మీరు రాసిన శుభాకాంక్షలు  నమోదు అయినాయి, ప్రొఫెసర్ జోసెఫ్ మోసిగంటి గారు చూస్తారు, కృతజ్ఞతలు");
          this.wishform.reset();
            this.imagesData = [];
          this.submitted = false;
        } else {
          Swal.fire
         Swal.fire("సర్వర్ లో సమస్య ఉంది. దయచేసి మరల ప్రయత్నించండి.");
        }
        this.showSpinner = false; // Stop spinner after response
      },
           error => {
           Swal.fire("సర్వర్ లో సమస్య ఉంది.");
          this.showSpinner = false;
        }
      // (error) => {
      //   console.error('Server Error:', error);
      //  Swal.fire('error', 'లోపం!', 'సర్వర్ లో సమస్య ఉంది.');
      //   this.showSpinner = false; // Stop spinner on error
      // }
    )
  }

  //private showAlert(icon: any, title: string, text: string) {
    //Swal.fire({ icon, title, html: text });
  }



  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  modalDismiss() {
    this.modalService.dismissAll()
  }
  elem: any
  scroll() {
    this.elem = document.getElementById("ele");
    this.elem.scrollIntoView();
  }
  ///////////////////mobile view///////////////
  // login: boolean = true;
  // notlogin: boolean = false;

  // ngAfterContentInit() {
  //   this.service.getloginstatus.subscribe((res: any) => {
  //     if (res == '1') {
  //       console.log('tru')
  //       this.login = false;
  //       this.notlogin = true;
  //       this.name = sessionStorage.getItem('name');
  //     } else if (res == '2') {
  //       console.log('false')
  //       this.login = true;
  //       this.notlogin = false;
  //     }
  //   })
  // }

  // checklogin() {
  //   if ((sessionStorage.getItem('usr_id')) == null) {
  //     this.login = true;
  //   } else {
  //     this.login = false;
  //     this.notlogin = true;
  //     this.name = sessionStorage.getItem('name');
  //   }
  // }

  // logout() {
  //   Swal.fire({
  //     title: 'Are you sure ?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, logout it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire('Logout Sucessfully')
  //       sessionStorage.clear();
  //       this.router.navigate(['/gallery']);
  //       this.service.getlgstatus('2')
  //     }
  //   })
  // }


  // alert() {
  //   Swal.fire('Hey user!', 'please Login', 'info');
  //   this.router.navigate(['/login']);
  // }

}



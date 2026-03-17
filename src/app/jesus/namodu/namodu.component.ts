import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-namodu',
  templateUrl: './namodu.component.html',
  styleUrls: ['./namodu.component.css']
})
export class NamoduComponent {



  

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.entryform.valid) {
  //     console.log(this.entryform.value);
  //   }
  // }

  showSpinner: boolean = false;
  loading :boolean=false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;
  entryform: FormGroup;

  //denomation: any;
  pattern: any;
  districts: any;
  mdistricts: any;
 
  data: any;
  clearData() {
    this.data = null; // or reset to initial value
    this.id = null;
    this.constituency_id=null;
    this.district=null;
    this.mandals=null;
  }
  mandals: any;
  mmandals: any;
  panchayati: any;
  mpanchayati: any;
  bliversdata: any;
  district: any;
  constituency: any;
  mconstituency: any;
  panchayatis: any;
  imagedata: any = []
  wings: any;
  now: any;
  
  ministryname: any;
  constituency_id: any;
 mconstituency_id: any;
  services: any;
  id: any

  constructor(private formBuilder: FormBuilder, private service: ServiceService, private router: Router, private modalService: NgbModal) {
    this.entryform = this.formBuilder.group({
      category: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(10)]],
      password: [''],
      // optselect:[''],
      // meetdate:[''],
      name: ['', [Validators.required]],
      // option1:[''],
      // option2:[''],
      //denomation: ['', [Validators.required]],
      // pattern: ['', [Validators.required]],
      //ministryemail: [''],
      //ministrywebsite: [''],
      // headname: ['', [Validators.required]],
      // headnmber: ['', [Validators.required, Validators.maxLength(10)]],
      // number_ofchurches: ['', [Validators.required]],
      // number_ofmembers: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      address: [''],
      description:[''],
      // mdistrict_id: ['', [Validators.required]],
      // mconstituency_id: ['', [Validators.required]],
      // mmandal_id: ['', [Validators.required]],
      // mpanchayat_id: ['', [Validators.required]],
      //password: ['', [Validators.required, Validators.minLength(6)]],
      //retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      // dob: ['', [Validators.required]],
      //pastor: [''],
      // description: [''],
      //// // term: ['', [Validators.required]],

    })

  }
  get f() { return this.entryform.controls }
  get r() { return this.entryform.controls; }


  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    //this.getdenomations();
    this.getdistric();
    this.getmdistric();
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


  // getdenomations() {
  //   this.service.getdenomation().subscribe(res => {
  //     this.denomation = res.data;
  //   })
  // }


  // getdistric() {
  //   this.showSpinner=true;
  //   this.service.getdistrict().subscribe(res => {
  //     this.districts = res.data;
  //     this.showSpinner=false;
  //   },
  //   (error) => {
  //     // Handle errors and reset loading
  //     Swal.fire('పొందడంలో సమస్య వుంది, దయచేసి మరల ప్రయత్నించండి.');
  //     this.showSpinner=false;
  //    // this.loading = false;
  //   })
  // }
  getdistric() {
    this.showSpinner = true;
  
    this.service.getdistrict().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.districts = res.data;
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'గమనిక!',
            text: 'జిల్లాల సమాచారము అందుబాటులో లేదు.',
          });
        }
        this.showSpinner = false;
      },
      (error) => {
        console.error('జిల్లా పొందడంలో సమస్య వుంది', error);
        Swal.fire({
          icon: 'error',
          title: 'లోపం!',
          text: 'జిల్లా పొందడంలో సమస్య వుంది, దయచేసి మరల ప్రయత్నించండి.',
        });
        this.showSpinner = false;
      }
    );
  }
  
  getmdistric() {
    this.service.getmdistrict().subscribe(res => {
      this.mdistricts = res.data;
    })
  }
// getmandals(event: any) {
//     const id = event.target.value;
  
//     // Set loading to true before making the API call
//     this.showSpinner=true;
//     //this.loading = true;
    
//     this.service.getmandals().subscribe(
//       (res) => {
//         // Filter the data and set it to mandals
//         this.mandals = res.data.filter((data: any) => data.const_id == id);
//         this.showSpinner=false;
//         // Reset loading to false after data is fetched
//   //      this.loading = false;
//       },
//       (error) => {
//         // Handle errors and reset loading
//         Swal.fire('మండలాలను / మున్సిపాలిటీ పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.');
//         this.showSpinner=false;
//        // this.loading = false;
//       }
//     );
//   }
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
        Swal.fire({
          icon: 'error',
          title: 'లోపం!',
          text: 'మండలాలను / మున్సిపాలిటీ పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.',
        });
        this.showSpinner = false;
      }
    );
  }
  
  // getmandals(event: any) {
  //   var id = event.target.value;
  //   this.service.getmandals().subscribe(res => {
  //     this.mandals = res.data.filter((data: any) => data.const_id == id);
  //   })
  // }

 
  // getconstency(event: any) {
  //   var id = event.target.value;
  //   this.service.getconsistencys().subscribe(res => {
  //     this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
  //   })
  // }
  getconstency(event: any) {
    const id = event.target.value?.trim(); // Ensure valid ID
  
    if (!id) {
      Swal.fire({
        icon: 'warning',
        title: 'గమనిక!',
        text: 'దయచేసి సరైన జిల్లా ఎంపిక చేయండి.',
      });
      return;
    }
  
    this.showSpinner = true; // Start loading indicator
  
    this.service.getconsistencys().subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
  
          if (this.constituency.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'సమాచారం',
              text: 'ఎంచుకున్న జిల్లాకు నియోజకవర్గాల సమాచారం అందుబాటులో లేదు.',
            });
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'గమనిక!',
            text: 'నియోజకవర్గాల సమాచారం అందుబాటులో లేదు.',
          });
        }
        this.showSpinner = false; // Stop loading indicator
      },
      (error) => {
        console.error('Error fetching constituencies:', error);
        Swal.fire({
          icon: 'error',
          title: 'లోపం!',
          text: 'నియోజకవర్గాల సమాచారం పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.',
        });
        this.showSpinner = false; // Stop loading indicator on error
      }
    );
  }
  
  getmconstency(event: any) {
    var id = event.target.value;
    this.service.getmconsistencys().subscribe(res => {
      this.mconstituency = res.data.filter((data: any) => data.dstrct_id == id);
    })
  }
  // gepanchayati(event: any) {
  //   var id = event.target.value;
  //   this.showSpinner=true;
  //   this.service.gepanchayatis().subscribe(res => {
  //     this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
  //     this.showSpinner=false;
  //     console.log(this.panchayati, 'hhh');

  //   }
  //   ,
  //   (error) => {
  //     // Handle errors and reset loading
  //     Swal.fire('పంచాయితీ / వార్డ్ నంబర్  పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.');
  //     this.showSpinner=false;
  //    // this.loading = false;
  //   })
  // }
  gepanchayati(event: any) {
    const id = event.target.value?.trim(); // Ensure valid ID
  
    if (!id) {
      Swal.fire({
        icon: 'warning',
        title: 'గమనిక!',
        text: 'దయచేసి సరైన మండలాన్ని ఎంచుకోండి.',
      });
      return;
    }
  
    this.showSpinner = true; // Show loading spinner
  
    this.service.gepanchayatis().subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
  
          if (this.panchayati.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'సమాచారం',
              text: 'ఎంచుకున్న మండలానికి పంచాయితీలు / వార్డులు లభ్యం కావడంలేదు.',
            });
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'గమనిక!',
            text: 'పంచాయితీ / వార్డు వివరాలు అందుబాటులో లేవు.',
          });
        }
  
        this.showSpinner = false; // Hide loading spinner
        console.log('Panchayati Data:', this.panchayati);
      },
      (error) => {
        console.error('Error fetching panchayati:', error);
        Swal.fire({
          icon: 'error',
          title: 'లోపం!',
          text: 'పంచాయితీ / వార్డ్ నంబర్ పొందడంలో సమస్య, దయచేసి మరల ప్రయత్నించండి.',
        });
  
        this.showSpinner = false; // Hide spinner in case of error
      }
    );
  }
  
 
  //getministrypastors: any;
  // ministrypastorsfilterdata() {
  //   if (this.entryform.value.district_id == null || this.entryform.value.constituency_id == null || this.entryform.value.mandal_id == null) {
  //     alert("Please Fill the Districts, Constituency & Mandal")
  //   } else {
  //     var data = {
  //       districts: this.entryform.value.district_id,
  //       constituencyname: this.entryform.value.constituency_id,
  //       mandal_id: this.entryform.value.mandal_id,
  //     }
  //     console.log(data);

  //     this.service.getpastorsfilters(data).subscribe((res: any) => {
  //       this.getministrypastors = res.data;
  //     })
  //   }
  // }

  // chat gpt code on 08-02-2025 start
  postregform() {
    this.submitted = true;
    this.showSpinner = true;

    if (this.entryform.invalid) {
      this.showAlert(
        'warning',
        'గమనిక!',
        `<p style="font-size: 16px; color: black;">
          <span style="color: red; font-size: 40px;">*</span>  
          <b>మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి</b>
        </p>`
      );
      this.showSpinner = false; // Stop spinner on validation failure
      return;
    }

    this.service.postregform(this.entryform.value).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.showAlert('success', 'నమోదు విజయవంతం', 'మీ ఫోన్ నంబర్ కు సామాచారం పంపిస్తాము.');
          this.entryform.reset();
          this.submitted = false;
        } else {
          this.showAlert('error', 'లోపం!', 'సర్వర్ లో సమస్య ఉంది. దయచేసి మరల ప్రయత్నించండి.');
        }
        this.showSpinner = false; // Stop spinner after response
      },
      (error) => {
        console.error('Server Error:', error);
        this.showAlert('error', 'లోపం!', 'సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి.');
        this.showSpinner = false; // Stop spinner on error
      }
    );
  }

  private showAlert(icon: any, title: string, text: string) {
    Swal.fire({ icon, title, html: text });
  }


  // chat gpt code on 08-02-2025 end
  
  // chat gpt code on 07-02-2025 start
  // postregform() {
  //   this.submitted = true;
  //   this.showSpinner = true;
  
  //   if (this.entryform.invalid) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'గమనిక!',
  //       html: `<p style="font-size: 16px; color: black;">
  //           <span style="color: red; font-size: 40px;">*</span>  
  //           <b>మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి</b>
  //         </p>`,
  //     });
  //     this.showSpinner = false;
  //     return;
  //   }
  
  //   this.service.postregform(this.entryform.value).subscribe(
  //     (res: any) => {
  //       if (res.status === 200) {
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'నమోదు విజయవంతం ',
  //           text: 'మీ ఫోన్ నంబర్ కు సామాచారం పంపిస్తాము.',
  //         });
  //         this.entryform.reset();
  //         this.submitted = false;
  //       } else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'లోపం!',
  //           text: 'సర్వర్ లో సమస్య ఉంది. దయచేసి మరల ప్రయత్నించండి.',
  //         });
  //       }
  //       this.showSpinner = false;
  //     },
  //     (error) => {
  //       console.error('Server Error:', error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'లోపం!',
  //         text: 'సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి.',
  //       });
  //       this.showSpinner = false;
  //     }
  //   );
  // }
  // chat gpt code on 07-02-2025 end
  // postregform() {
  //  // this.submitted = true;
  //  this.showSpinner=true;
  //   if (this.entryform.invalid) {
      
  //     Swal.fire('* మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి ');
  //     this.showSpinner=false;
  //   } else {
  //     this.service.postregform(this.entryform.value).subscribe((res: any) => {
  //       if (res.status == 200) {
  //         Swal.fire('విజయవంతముగా నమోదు చేసినారు, మీ ఫోన్ నంబర్ కు సామాచారం పంపిస్తాము');
  //         this.entryform.reset();
  //         this.showSpinner=false;
  //         //this.submitted = false;
  //       } 
  //       // else {
  //       //   alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి');
  //       // }
  //      }
  //      ,
  //     (error) => {
  //       // Handle errors and reset loading
  //       Swal.fire('సర్వర్ లో సమస్య ఉంది. దయచేసి మరల ప్రయత్నించండి.');
  //       this.showSpinner=false;
  //     }
        
  //     );
  //   }
    
  // }
  
// Accept Input As a Number Only

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

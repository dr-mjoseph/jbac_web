import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-studentregister',
  templateUrl: './studentregister.component.html',
  styleUrls: ['./studentregister.component.css']
})
export class StudentregisterComponent {
  showSpinner: boolean = false;
  extension: boolean = false;
  submitted: boolean = false;
  form_ind: any;

  denomation: any;
  pattern: any;
  districts: any;
  mandals: any;
  mandals1: any;
  panchayati: any;
  panchayati1: any;
  bliversdata: any;
  studentform: FormGroup;

  district: any;
  constituency: any;
  constituency1: any;
  panchayatis: any;
  imagedata: any = []
  wings: any;
  now: any;
  ministryname: any;
  constituency_id: any;
  services: any;
  id: any
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private modalService: NgbModal,
    private route: ActivatedRoute, private router: Router) {
    this.studentform = this.formBuilder.group({
      studentname: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.maxLength(10)]],
      pastornum: [''],
      study: ['', [Validators.required]],
//      schname: ['', [Validators.required]],
      //fathername: ['', [Validators.required]],
      aboutyourself: [''],
      sstatus: [''],
      finanstat: [''],
      //nativeplace: [''],
      caste: [''],
      talent: [''],
      passexam: [''],
      tmarks: ['', [Validators.required]],
      mmarks: ['', [Validators.required]],
      // district_id: ['', [Validators.required]],
      // constituency_id: ['', [Validators.required]],
      // mandal_id: ['', [Validators.required]],
      // village_id: ['', [Validators.required]],
     // password: [''],
      // retypepassword: [''],
      //church: [''],
      //pastor: [''],
      leadership: [''],
      // leadertype: [''],
      generaltype: [''],
      // wingtype: [''],
      // wingtypes: [''],
      dob: [''],
      denomination_id: ['', [Validators.required]],
      hobbies: [''],
      spirti: [''],
      lifegoal: [''],
      //whatsappnumber: [''],
      parentnum: [''],
      //nri: ['', [Validators.required]],
      //ward: [''],
      wardnumber: [''],
      villagename: ['', [Validators.required]],
      respanchayati: ['', [Validators.required]],
      resmandals: ['', [Validators.required]],
      resconstituencyname: ['', [Validators.required]],
      resdistricts: ['', [Validators.required]],
      god: [''],
     // term: [''],
      mother: [''],
      orphon: [''],
      subcaste: [''],
      gender: ['']

    })
  }
  get e() { return this.studentform.controls; }

  name: any;
  usr_id: any;
  constituencyname: any;
  logincon: boolean = false
  ngOnInit(): void {
    this.getdenomations();
    this.getdistric();
    this.getwing()
    const datePipe = new DatePipe('en-US');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');


    this.usr_id = sessionStorage.getItem('usr_id');
    this.name = sessionStorage.getItem('name');
    if (this.usr_id) {
      this.logincon = true;
    } else {
      this.logincon = false;
    }
  }


  formshow(id: any) {
    this.form_ind = id
    this.studentform.reset();
    this.lead = false;
    this.mini = false;
    this.assicoation = false;
    this.leadtype = false;
    this.wingtype = false;
    this.wingtypes = false;
    this.subward = false;
    this.father = false;
  }

  getwing() {
    this.service.getwing().subscribe((res: any) => {
      this.wings = res.data;
    })
  }


  getbelivers() {
    this.service.getbelivers().subscribe((res: any) => {
      this.bliversdata = res.data;
    })
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;
    })
  }

  getpatterns() {
    this.service.getpattern().subscribe(res => {
      this.pattern = res.data;
    })
  }

  // getdistric() {
  //   this.service.getdistrict().subscribe(res => {
  //     this.districts = res.data;
  //   })


  // }
  getdistric() {
    this.showSpinner = true;

    this.service.getdistrict().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.districts = res.data;
        }
        else {
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

  // getconstency1(event: any) {
  //   var id = event.target.value;
  //   this.service.getconsistencys().subscribe(res => {
  //     this.constituency1 = res.data.filter((data: any) => data.dstrct_id == id);
  //   })
  // }
  getconstency1(event: any) {
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
          this.constituency1 = res.data.filter((data: any) => data.dstrct_id == id);

          if (this.constituency1.length === 0) {
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

  // getmandals(event: any) {
  //   var id = event.target.value;
  //   this.service.getmandals().subscribe(res => {
  //     this.mandals = res.data.filter((data: any) => data.const_id == id);
  //   })
  // }
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

  // getmandals1(event: any) {
  //   var id = event.target.value;
  //   this.service.getmandals().subscribe(res => {
  //     this.mandals1 = res.data.filter((data: any) => data.const_id == id);
  //   })
  // }


  // gepanchayati(event: any) {
  //   var id = event.target.value;
  //   this.service.gepanchayatis().subscribe(res => {
  //     this.panchayati = res.data.filter((data: any) => data.mndl_id == id);


  //   })
  // }
  getmandals1(event: any) {
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
          this.mandals1 = res.data.filter((data: any) => data.const_id == id);

          if (this.mandals1.length === 0) {
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
  // gepanchayati1(event: any) {
  //   var id = event.target.value;
  //   this.service.gepanchayatis().subscribe(res => {
  //     this.panchayati1 = res.data.filter((data: any) => data.mndl_id == id);


  //   })
  // }
  gepanchayati1(event: any) {
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
          this.panchayati1 = res.data.filter((data: any) => data.mndl_id == id);

          if (this.panchayati1.length === 0) {
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
  getchurchstudentfilter: any;
  getchurchesstudentdata() {
    if (this.studentform.value.resdistricts == null || this.studentform.value.resconstituencyname == null || this.studentform.value.resmandals == null) {
      alert("Please Fill the Districts, Constituency & Mandal")
    } else {
      var data = {
        districts: this.studentform.value.resdistricts,
        constituencyname: this.studentform.value.resconstituencyname,
        mandal_id: this.studentform.value.resmandals,
      }
      console.log(data);
      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchstudentfilter = res.data;
      })
    }
  }
  getstudentspastors: any;
  // getpastorssdata() {
  //   if (this.studentform.value.resdistricts == null || this.studentform.value.resconstituencyname == null || this.studentform.value.resmandals == null) {
  //     alert("Please Fill the Districts, Constituency & Mandal")
  //   } else {
  //     var data = {
  //       districts: this.studentform.value.resdistricts,
  //       constituencyname: this.studentform.value.resconstituencyname,
  //       mandal_id: this.studentform.value.resmandals,

  //     }
  //     console.log(data);

  //     this.service.getpastorsfilters(data).subscribe((res: any) => {
  //       this.getstudentspastors = res.data;
  //     })
  //   }
  // }



  // Image Upload Function //
  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[bfile_typeEmpl.length - 1];
        this.imagedata.push({ reviewimg: imgFile, filetype: imgtype })
      };
    }
  }

  // chat gpt code
  poststudentsignup() {
    this.submitted = true;
    this.showSpinner = true;

    if (this.studentform.invalid) {
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

  
    this.service.poststudentsignup(this.studentform.value)
      .pipe(finalize(() => this.showSpinner = false)) // Ensures spinner is hidden no matter what
      .subscribe(
        (res: any) => {
          if (res?.status === 200) {
            this.showAlert('success', 'నమోదు విజయవంతం', 'మీ ఫోన్ నంబర్‌కు సమాచారం పంపిస్తాము.');
            this.studentform.reset();
            this.submitted = false;
          } else {
            this.showAlert('error', 'లోపం!', 'సర్వర్‌లో సమస్య ఉంది. దయచేసి మరలా ప్రయత్నించండి.');
          }
        },
        (error) => {
          console.error('Server Error:', error);
          this.showAlert('error', 'లోపం!', 'Something went wrong, please try again later');
        }
      );
    
  }
  
  // poststudentsignup() {
  //   this.submitted = true;
  //   this.showSpinner = true;

  //   if (this.studentform.invalid) {
  //     this.showAlert(
  //       'warning',
  //       'గమనిక!',
  //       `<p style="font-size: 16px; color: black;">
  //             <span style="color: red; font-size: 40px;">*</span>  
  //             <b>మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి</b>
  //           </p>`
  //     );
  //     this.showSpinner = false; // Stop spinner on validation failure
  //     return;
  //   }

  //   this.service.poststudentsignup(this.studentform.value).subscribe(
  //     (res: any) => {

  //       if (res && res.status === 200) {
  //         this.showAlert('success', 'నమోదు విజయవంతం', 'మీ ఫోన్ నంబర్‌కు సమాచారం పంపిస్తాము.');
  //         this.studentform.reset();
  //         this.submitted = false;

  //       } else {
  //         this.showAlert('error', 'లోపం!', 'సర్వర్‌లో సమస్య ఉంది. దయచేసి మరలా ప్రయత్నించండి.');
  //       }
  //       this.showSpinner = false; // Always stop spinner first

  //     },
  //     (error) => {
  //       console.error('Server Error:', error);
  //       this.showAlert('error', 'లోపం!', 'Something went wrong, please try again later');
  //       this.showSpinner = false; // Always stop spinner on error

  //     }
  //   );
  // }


  // this.service.poststudentsignup(this.studentform.value).subscribe(
  //   (res: any) => {
  //     if (res.status === 200) {
  //       this.showAlert('success', 'నమోదు విజయవంతం', 'మీ ఫోన్ నంబర్ కు సామాచారం పంపిస్తాము.');
  //       this.studentform.reset();
  //       this.submitted = false;
  //     } else {
  //       this.showAlert('error', 'లోపం!', 'సర్వర్ లో సమస్య ఉంది. దయచేసి మరల ప్రయత్నించండి.');
  //     }
  //     this.showSpinner = false; // Stop spinner after response
  //   },
  //   (error) => {
  //     console.error('Server Error:', error);
  //     this.showAlert('error', 'లోపం!', 'సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి.');
  //     this.showSpinner = false; // Stop spinner on error
  //   }
  // );
  // }

  private showAlert(icon: any, title: string, text: string) {
    Swal.fire({ icon, title, html: text });
  }


  church: any;
  pastor: any;

  getchurch() {
    this.service.getchurch().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.church = res.data;
      }
    }, error => {

    })
  }

  lead: boolean = false;
  mini: boolean = false;
  assicoation: boolean = false;
  leadtype: boolean = false;
  wingtype: boolean = false;
  wingtypes: boolean = false;
  subward: boolean = false;
  father: boolean = false;

  onradiochange(event: any) {
    var a = event.value
    if (a == 'YES') {
      this.studentform.patchValue({
        leadertype: '',

      });
      this.lead = true
    }

    if (a == 'NO') {

      this.studentform.patchValue({
        leadertype: '',

      });
      this.lead = false
      this.leadtype = false
      this.wingtype = false
      this.wingtypes = false
      this.subward = false
    }
  }
  onparent(event: any) {
    var parents = event.value
    if (parents == 'Medical') {
      this.father = false
    }
    else if (parents == 'POLYCET') {
      this.father = false
    }
    else if (parents == 'Engineering') {
      this.father = false
    }
    else if (parents == 'IIT-JEE') {
      this.father = false
    }
    else {
      this.father = true
    }
  }

  subwardevent(event: any) {
  }
  onsubward(event: any) {
    var s = event.target.value
    if (s == '6') {
      this.subward = true

    } else {
      this.subward = false


    }

  }

  onradioleadertype(event: any) {
    var a = event.value
    if (a == '1') {
      this.leadtype = true
      this.wingtype = false
      this.wingtypes = false
      this.subward = true
    } else {
      this.leadtype = false
      this.wingtype = true
      this.wingtypes = true
      this.subward = false
    }
  }


  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  churchchange(event: any) {
    var a = event.value
    if (a == 'Ministry') {
      this.mini = true
    } else {
      this.mini = false
      this.leadtype = false
    }
  }

  pastorassicoation(event: any) {
    var as = event.value
    if (as == 'yes') {
      this.assicoation = true
    } else {
      this.assicoation = false
    }
  }





  modalDismiss() {
    this.modalService.dismissAll()
  }
  onradioleadertyperajkumar(event: any) {
    if (event.value == "YES") {
      this.leadtype = true;
    } else {
      this.leadtype = false;
    }
  }
  elem: any
  scroll() {
    this.elem = document.getElementById("ele");
    this.elem.scrollIntoView();
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






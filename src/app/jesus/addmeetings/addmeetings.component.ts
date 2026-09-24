import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-addmeetings',
  templateUrl: './addmeetings.component.html',
  styleUrls: ['./addmeetings.component.css']
})
export class AddmeetingsComponent {
  attacksform: FormGroup;
  showSpinner: boolean = false;
  loginform: FormGroup;
  addingchurchtimimngs: FormGroup;
  addinginsututies: FormGroup;
  addingmeetings: FormGroup;
  jobsadding: FormGroup;
  addingcolleges: FormGroup;
  addingmarriages: FormGroup;
  addsadding: FormGroup;
  addingbusiness: FormGroup;
  submitted: boolean = false;
  categorys: any;
  form_ind: any;
  services: any;
  modalReference = null;
  hello: any;
  ProofValue: any;
  constituency: any;
  mandals: any;
  districts: any;
  panchayati: any;
  usr_id: any;
  name: any;
  imagesData: any = [];
  bliversdata: any;
  pastor: any;
  now: any;
  denomation: any;
  ministryname: any;
  from_id: any;
  locationLoading: boolean = false;
  locationError: string = '';
  locationSuccess: string = '';
  locationName: string = '';
  locationSourceMessage: string = '';
  googleMapsApiKey: string = (environment as any).googleMapsApiKey || '';

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      this.from_id = params['id'];
    });

    if (this.from_id != '') {
      this.formshow(3);
    }

    // if (sessionStorage.getItem("auth_ind") == '' || sessionStorage.getItem("auth_ind") == null || sessionStorage.getItem("auth_ind") == undefined) {
    //   Swal.fire("Login Required")
    //   this.router.navigate(['/']);
    // }

    this.loginform = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobilenumber: ['', [Validators.required, Validators.maxLength(10)]],
      mail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
      retypepassword: ['', [Validators.required, Validators.maxLength(8)]],
      category: ['', [Validators.required]],
    })

    this.addingchurchtimimngs = this.formBuilder.group({
      service_name: ['', [Validators.required]],
      day: ['', [Validators.required]],
      time_start: ['', [Validators.required]],
      time_end: ['', [Validators.required]],
      description: ['', [Validators.required]],
      church: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      // mandal_id: ['', [Validators.required]],
      // village_id: ['', [Validators.required]],
    })
    
    this.addingmeetings = this.formBuilder.group({
      mettingtype: ['', [Validators.required]],
      speakerone: [''],
      // pastor_id:[''],
      orgname: ['', [Validators.required]],
      orgphone: ['', [Validators.required, Validators.maxLength(10)]],
      evntphone: ['', [Validators.required, Validators.maxLength(10)]],
      meetsize: ['', [Validators.required]],
      speakertwo: [''],
      speakerthree: [''],
      speakerfour: [''],
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
      image: [''],
      districtname: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      village_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      fromtime: [''],
      totime: [''],
      address: ['', [Validators.required]],
      location: [''],
      facebook: [''],
      youtube: [''],
      denomation: ['', [Validators.required]]
    })

    this.addinginsututies = this.formBuilder.group({
      checkbox: [''],
      believer_id: ['',],
      pastor_id: ['',],
      institutename: ['', [Validators.required]],
      collegetype: ['', [Validators.required]],
      courses: ['', [Validators.required]],
      phonenumber: ['', [Validators.required, Validators.maxLength(10)]],
      youtube: [''],
      website: [''],
      image: [''],
      description: [''],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      location: [''],
      address: ['', [Validators.required]],
      facebook: [''],
      // // term: ['', [Validators.required]],
      ministry: [''],
      ministry_id: [''],
    })

    this.addingcolleges = this.formBuilder.group({
      collegename: ['', [Validators.required]],
      image: ['', [Validators.required, Validators.maxLength(10)]],
      location: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      address: ['', [Validators.required, Validators.maxLength(8)]],
      phonenumber: ['', [Validators.required, Validators.maxLength(8)]],
      districtname: [''],
      constituencyname: [''],
      mandals: [''],
      village_name: [''],
      church: ['']
    })

    this.addingmarriages = this.formBuilder.group({
      gender: ['', [Validators.required]],
      status: [''],
      name: ['', [Validators.required]],
      denomation_id: ['', [Validators.required]],
      ministry_id: ['', [Validators.required]],
      believer_id: [''],
      pastor_id: [''],
      image: [''],
      dob: ['', [Validators.required]],
      work: ['', [Validators.required]],
      location: [''],
      address: ['', [Validators.required]],
      description: [''],
      phonenumber: ['', [Validators.required, Validators.maxLength(10)]],
      districtname: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      village_name: ['', [Validators.required]],
      height: [''],
      color: [''],
      whealth: [''],
      types: [''],
      self: [''],
      // // term: ['', [Validators.required]],
      caste: ['', [Validators.required]],
      subcaste: [''],
      spirti: ['']
    })

    this.jobsadding = this.formBuilder.group({
      jobname: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      number1: ['', [Validators.required, Validators.minLength(10)]],
      number2: [''],
      districtname: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      village_name: ['', [Validators.required]],
      google_location: [''],
      image: [''],
      facebook: [''],
      youtube: [''],
      // // term: ['', [Validators.required]],
    })

    this.addsadding = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(10)]],
      // term: ['', [Validators.required]]
    })

    this.addingbusiness = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      description: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(10)]],
      denomation: [''],
      districtname: ['', [Validators.required]],
      constituencyname: ['', [Validators.required]],
      mandals: ['', [Validators.required]],
      village_name: ['', [Validators.required]],
      ministry_id: [''],
      ward: ['', [Validators.required]],
      // // term: ['', [Validators.required]],
    })

    this.attacksform = this.formBuilder.group({
      image: [''],
      videoa: [''],
      videob: [''],
      document: [''],
      address: ['', [Validators.required]],
      victim1num: [''],
      victim2num: [''],
      victim1name: [''],
      victim2name: [''],
      attacker1num: [''],
      attacker2num: [''],
      attacker1name: [''],
      attacker2name: [''],
      noteondescription: [''],
      audio: [''],
      district_id: ['', [Validators.required]],
      constituency_id: ['', [Validators.required]],
      mandal_id: ['', [Validators.required]],
      village_id: ['', [Validators.required]],
      // term: ['', [Validators.required]]
    })
  }

  get f() { return this.attacksform.controls; }
  get a() { return this.jobsadding.controls; }
  get m() { return this.addingmarriages.controls; }
  get i() { return this.addinginsututies.controls; }
  get c() { return this.addingchurchtimimngs.controls; }
  get t() { return this.addingmeetings.controls; }
  get r() { return this.addsadding.controls; }
  get j() { return this.addingbusiness.controls; }
  get e() { return this.addingmeetings.controls }

  people: any[] = [
    {
      "name": "Br Sateesh Kumar Calvary Temple"
    },
    {
      "name": "Br. John  Wesley,Hosanna Ministries"
    },
    {
      "name": "Br. Edward Williams Kuntam"
    },
    {
      "name": "Dr.John Wesley,Christ Worship Centre"
    },
    {
      "name": "Dr. L.K.Mruthyunjaya"
    },
    {
      "name": "Dr. Thomas,Dhahinchu Agni"
    },
    {
      "name": "P J Stephen Paul"
    }
  ];


  ngOnInit(): void {
    this.getservice();
    this.getdistric();
    this.getchurch();
    this.personaldata();
    this.getbelivers();
    this.getpastor();
    this.getdenomations();
    this.getbeliver();
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
getbelivers() {
    this.service.getbelivers().subscribe((res: any) => {
      this.bliversdata = res.data;
    })
  }

  getpastor() {
    this.service.getpastor().subscribe(res => {
      this.pastor = res.data;
    })
  }

  personaldata() {
    var data = {
      usr_id: sessionStorage.getItem('usr_id'),
      tableid: sessionStorage.getItem('category_id')
    }
    this.service.getpersonal(data).subscribe((res: any) => {
    })
  }

  postsignupform() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.loginform.value.password != this.loginform.value.retypepassword) {
      Swal.fire("Passwords are Unmatched")
    } else {
      this.categorys = this.loginform.value.category.split(',')
      var data = {
        name: this.loginform.value.name,
        mobilenumber: this.loginform.value.mobilenumber,
        mail: this.loginform.value.mail,
        password: this.loginform.value.password,
        retypepassword: this.loginform.value.retypepassword,
        categoryid: this.categorys[0],
        category: this.categorys[1]
      }
      this.service.postsignup(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.loginform.reset();
          this.submitted = false;
          this.showSpinner = false;
        } else {
          Swal.fire('server down')
        }
      },
        error => {
        })
    }
  }

  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  async useCurrentLocation(): Promise<void> {
    this.locationError = '';
    this.locationSuccess = '';
    this.locationName = '';
    this.locationSourceMessage = '';
    this.locationLoading = true;
    this.showSpinner = true;

    // Helper to reverse geocode lat/lng to human-readable address
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
      // 1. If Google Maps API key is configured
      if (this.googleMapsApiKey) {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsApiKey}`;
          const res = await fetch(geocodeUrl);
          const data = await res.json();
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            return data.results[0].formatted_address;
          }
        } catch (e) {
          console.warn('Google geocoding error:', e);
        }
      }

      // 2. BigDataCloud Client Reverse Geocoding (Free, CORS-friendly, no API key needed)
      try {
        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        const res = await fetch(bdcUrl);
        const data = await res.json();
        const parts = [
          data.locality || data.name || '',
          data.city || data.principalSubdivision || '',
          data.countryName || ''
        ].filter(p => !!p);
        if (parts.length > 0) {
          return parts.join(', ');
        }
      } catch (e) {
        console.warn('BigDataCloud geocoding error:', e);
      }

      // 3. OpenStreetMap Nominatim fallback
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(nominatimUrl);
        const data = await res.json();
        if (data && data.display_name) {
          return data.display_name;
        }
      } catch (e) {
        console.warn('Nominatim geocoding error:', e);
      }

      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    };

    // Helper to apply location safely inside NgZone
    const applyLocation = (lat: number, lng: number, place: string, source: string) => {
      this.ngZone.run(() => {
        const googleUrl = `https://maps.google.com/?q=${lat},${lng}`;
        this.addingmeetings.patchValue({
          location: googleUrl,
          address: place
        });
        this.addingmeetings.get('location')?.markAsDirty();
        this.addingmeetings.get('location')?.markAsTouched();
        this.addingmeetings.get('address')?.markAsDirty();
        this.addingmeetings.get('address')?.markAsTouched();

        this.locationName = place;
        this.locationSuccess = 'కరెంటు లొకేషన్ విజయవంతముగా నమోదు చేయబడింది.';
        this.locationSourceMessage = source;
        this.locationLoading = false;
        this.showSpinner = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'లొకేషన్ నమోదు అయ్యింది!',
          html: `<div style="text-align: left; font-size: 14px;">
                   <p><b>గూగుల్ లొకేషన్:</b> <br><a href="${googleUrl}" target="_blank" style="color: #0d6efd; word-break: break-all;">${googleUrl}</a></p>
                   <p><b>ప్రదేశం / అడ్రసు:</b> <br>${place}</p>
                 </div>`,
          confirmButtonText: 'సరే'
        });
      });
    };

    // Fallback: IP-based location
    const fallbackToIp = async (reasonMsg: string) => {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (ipData && ipData.latitude && ipData.longitude) {
          const lat = parseFloat(ipData.latitude);
          const lng = parseFloat(ipData.longitude);
          const parts = [ipData.city, ipData.region, ipData.country_name].filter(p => !!p);
          const place = parts.join(', ') || `${lat}, ${lng}`;
          applyLocation(lat, lng, place, 'నెట్‌వర్క్ (IP) ఆధారంగా లొకేషన్ నమోదు చేయబడింది.');
          return;
        }
      } catch (ipErr) {
        console.warn('IP location fallback failed:', ipErr);
      }

      this.ngZone.run(() => {
        this.locationLoading = false;
        this.showSpinner = false;
        this.locationError = reasonMsg;
        this.cdr.detectChanges();
        Swal.fire({
          icon: 'warning',
          title: 'లొకేషన్ లోపం',
          text: reasonMsg,
          confirmButtonText: 'సరే'
        });
      });
    };

    // Check if navigator.geolocation exists
    if (!navigator.geolocation) {
      await fallbackToIp('మీ బ్రౌజర్ లేదా డివైస్ లో GPS జియోలొకేషన్ సపోర్ట్ లేదు.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const place = await reverseGeocode(lat, lng);
        applyLocation(lat, lng, place, 'GPS ద్వారా లొకేషన్ విజయవంతముగా పొందబడింది.');
      },
      async (error) => {
        let msg = 'లొకేషన్ పొందడంలో సమస్య ఏర్పడింది.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'లొకేషన్ అనుమతి నిరాకరించబడింది (Permission Denied). దయచేసి బ్రౌజర్ లేదా మొబైల్ సెట్టింగ్స్ లో లొకేషన్ పర్మిషన్ ఆన్ చేయండి.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'లొకేషన్ రిక్వెస్ట్ టైమ్‌అవుట్ అయ్యింది.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'లొకేషన్ సిగ్నల్ అందుబాటులో లేదు.';
        }
        await fallbackToIp(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  formshow(id: any) {
    this.form_ind = id
  }

  getservice() {
    this.service.getservices().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.services = res.data;
      }
    }, error => {
    })
  }

  addNew(event: any, serviceadding: any) {
    if (event.target.value == 1) {
      this.modalService.open(serviceadding, { size: 'xl', centered: true });
    }
  }

  modalDismiss() {
    this.modalService.dismissAll()
  }

  addNewSubmit() {
    this.showSpinner = true;

    if (this.ProofValue == '') {
      this.service.errorMessageAlert('Please Fill The service type Value');
      this.showSpinner = false;
      return;
    }
    var data = {
      service_name: this.ProofValue
    }
    this.service.addNew(data).subscribe(res => {
      this.ProofValue = '';
      this.modalDismiss();
      this.getservice();
      this.showSpinner = false;
    }, error => {
      this.ProofValue = '';
      this.showSpinner = false;

    })
  }


  postchurchtimings() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addingchurchtimimngs.invalid) {
      Swal.fire(' * మార్క్ చేసిన వివరాలను తప్పనిసరిగా పూరించాలి');
    } else {
      var data = {
        service_name: this.addingchurchtimimngs.value.service_name,
        day: this.addingchurchtimimngs.value.day,
        time_start: this.addingchurchtimimngs.value.time_start,
        time_end: this.addingchurchtimimngs.value.time_end,
        description: this.addingchurchtimimngs.value.description,
        church: this.addingchurchtimimngs.value.church,
        usr_id: sessionStorage.getItem('usr_id'),
        mobile_number: sessionStorage.getItem('mobile_number'),
        name: sessionStorage.getItem('name'),
        district_id: this.addingchurchtimimngs.value.district_id,
        constituency_id: this.addingchurchtimimngs.value.constituency_id,
        // mandal_id: this.addingchurchtimimngs.value.mandal_id,
        // village_id: this.addingchurchtimimngs.value.village_id,
      }


      this.service.postchurchmeetings(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addingchurchtimimngs.reset();
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }

  postmeetings() {
    this.submitted = true;
    
    if (this.addingmeetings.invalid) {
      Swal.fire('* మార్క్ చేసిన వివరాలను తప్పనిసరిగా పూరించాలి');
    } else {
      this.showSpinner = true;
      var data = {
     
        mettingtype: this.addingmeetings.value.mettingtype,
        denomation: this.addingmeetings.value.denomation,
        speakerone: this.addingmeetings.value.speakerone,
        speakertwo: this.addingmeetings.value.speakertwo,
        speakerthree: this.addingmeetings.value.speakerthree,
        speakerfour: this.addingmeetings.value.speakerfour,
        meetsize:this.addingmeetings.value.meetsize,
        orgname: this.addingmeetings.value.orgname,
        orgphone: this.addingmeetings.value.orgphone,
        evntphone: this.addingmeetings.value.evntphone,
        fromdate: this.addingmeetings.value.fromdate,
        todate: this.addingmeetings.value.todate,
        districtname: this.addingmeetings.value.districtname,
        description: this.addingmeetings.value.description,
        constituencyname: this.addingmeetings.value.constituencyname,
        mandals: this.addingmeetings.value.mandals,
        village_name: this.addingmeetings.value.village_name,
        fromtime: this.addingmeetings.value.fromtime,
        totime: this.addingmeetings.value.totime,
      //  usr_id: sessionStorage.getItem('usr_id'),
      //  mobile_number: sessionStorage.getItem('mobile_number'),
       // name: sessionStorage.getItem('name'),
        location: this.addingmeetings.value.location,
        address: this.addingmeetings.value.address,
        facebook: this.addingmeetings.value.facebook,
        youtube: this.addingmeetings.value.youtube,
        ministry_id: this.addingmeetings.value.ministry_id,
        reviewImg: this.imagesData
      }
console.log(data);

      this.service.postsmeetings(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతం గా సబ్మిట్ చేసినారు')
          this.addingmeetings.reset();
          this.imagesData = [];
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
          this.showSpinner = false;
        }
      )
    }
   
  }

  getdenomations() {
    this.service.getdenomation().subscribe(res => {
      this.denomation = res.data;


    })
  }
  postjobs() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.jobsadding.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      var data = {
        jobname: this.jobsadding.value.jobname,
        qualification: this.jobsadding.value.qualification,
        experience: this.jobsadding.value.experience,
        salary: this.jobsadding.value.salary,
        location: this.jobsadding.value.location,
        description: this.jobsadding.value.description,
        number1: this.jobsadding.value.number1,
        number2: this.jobsadding.value.number2,
        districtname: this.jobsadding.value.districtname,
        constituencyname: this.jobsadding.value.constituencyname,
        mandals: this.jobsadding.value.mandals,
        village_name: this.jobsadding.value.village_name,
        google_location: this.jobsadding.value.google_location,
        usr_id: sessionStorage.getItem('usr_id'),
        mobile_number: sessionStorage.getItem('mobile_number'),
        name: sessionStorage.getItem('name'),
        reviewImg: this.imagesData
      }
      this.service.postjobs(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.jobsadding.reset();
          this.submitted = false;
          this.imagesData = [];
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }
  imagesDatains: any

  postadds() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addsadding.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      var data = {
        type: this.addsadding.value.type,
        title: this.addsadding.value.title,
        description: this.addsadding.value.description,
        number: this.addsadding.value.number,
        usr_id: sessionStorage.getItem('usr_id'),
        reviewImg: this.imagesData
      }
      this.service.postadds(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addsadding.reset();
          this.imagesData = [];
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }
  postbusiness() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addingbusiness.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      var data = {
        type: this.addingbusiness.value.type,
        title: this.addingbusiness.value.title,
        description: this.addingbusiness.value.description,
        number: this.addingbusiness.value.number,
        usr_id: sessionStorage.getItem('usr_id'),
        name: sessionStorage.getItem('name'),
        reviewImg: this.imagesData,
        denomation: this.addingbusiness.value.denomation,
        districtname: this.addingbusiness.value.districtname,
        constituencyname: this.addingbusiness.value.constituencyname,
        mandals: this.addingbusiness.value.mandals,
        village_name: this.addingbusiness.value.village_name,
        ministry_id: this.addingbusiness.value.ministry_id,
        ward: this.addingbusiness.value.ministry_id,
      }
      this.service.postbusiness(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addingbusiness.reset();
          this.imagesData = [];
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }



  onImageChangeins(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        this.imagesDatains = { reviewimg: imgFile, filetype: imgtype }
      };
    }
  }


  postinsututies() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addinginsututies.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      this.addinginsututies.value.image = this.imagesDatains
      this.addinginsututies.value.usr_id = sessionStorage.getItem('usr_id')
      this.addinginsututies.value.number = sessionStorage.getItem('mobile_number')
      this.service.postinsututies(this.addinginsututies.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addinginsututies.reset();
          this.imagesDatains = [];
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }

  postcolleges() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addingcolleges.invalid) {
      Swal.fire('* ఉన్న తప్పనిసరి  ఫీల్డ్స్ ఎంటర్ చేయండి');
    } else {
      var data = {
        collegename: this.addingcolleges.value.collegename,
        image: this.addingcolleges.value.image,
        location: this.addingcolleges.value.location,
        address: this.addingcolleges.value.address,
        phonenumber: this.addingcolleges.value.phonenumber,
        districtname: this.addingcolleges.value.districtname,
        constituencyname: this.addingcolleges.value.constituencyname,
        mandals: this.addingcolleges.value.mandals,
        village_name: this.addingcolleges.value.village_name,
        church: this.addingcolleges.value.church,
        usr_id: sessionStorage.getItem('usr_id'),
        mobile_number: sessionStorage.getItem('mobile_number'),
        name: sessionStorage.getItem('name'),
      }
      this.service.postcolleges(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addingcolleges.reset();
          this.submitted = false;
          this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }

  getdistric() {
    this.service.getdistrict().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.districts = res.data;
      }
    }, error => {
    })


  }
  getmandals(event: any) {
    this.showSpinner = true;
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
        this.showSpinner = false;
      } else if (res.status == 200) {
        this.mandals = res.data.filter((data: any) => data.const_id == id);
        this.showSpinner = false;
      }
    }, error => {
      this.showSpinner = false;
    })
  }

  getconstency(event: any) {
    this.showSpinner = true;
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {
      this.constituency = res.data.filter((data: any) => data.dstrct_id == id);
      this.showSpinner = false;
    });
  }

  gepanchayati(event: any) {
     this.showSpinner = true;
    var id = event.target.value;
    this.service.gepanchayatis().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
        this.showSpinner = false;
      } else if (res.status == 200) {
        this.panchayati = res.data.filter((data: any) => data.mndl_id == id);
        this.showSpinner = false;
      }
    }, error => {
       this.showSpinner = false;
    })
  }

  church: any;

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
  ///image code

  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {

        var imgFile = reader.result as string;

        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        this.imagesData = [];
        this.imagesData.push({ reviewimg: imgFile, filetype: imgtype })

      };
    }
  }

  onImageChange1(e: any) {
    if (this.imagesData.length == 3) {
      Swal.fire('You Have To Add 3 images Only');
      return;
    }
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        var imagedata = {
          reviewImg: imgFile,
          filetype: imgtype,
        }
        this.imagesData.push(imagedata);

      };
    }
  }
  deleteImage(index: any) {
    this.imagesData.splice(index, 1);
  }

  format: any;
  url: any;
  formatb: any;
  urlb: any;
  urldoc: any;
  urldoc2: any;

  documentarray: any = [];
  filenamearray: any = [];

  formataudio: any;
  urlaudio: any;

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  onSelectFileb(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.formatb = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.formatb = 'video';
      }
      reader.onload = (event) => {
        this.urlb = (<FileReader>event.target).result;

      }
    }
  }

  onSelectFiledoc(event: any) {
    const file = event.target.files && event.target.files[0];
    var name = event.target.files[0].name

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.urldoc = (<FileReader>event.target).result;
        this.documentarray.push({ reviewimg: this.urldoc, filetype: name });
        this.filenamearray.push({ name: name })
      }
    }
  }

  onSelectFileaudio(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.formataudio = 'image';
      } else if (file.type.indexOf('audio') > -1) {
        this.formataudio = 'audio';
      }
      reader.onload = (event) => {
        this.urlaudio = (<FileReader>event.target).result;
      }
    }
  }

  postattacks() {
    this.submitted = true;
    // this.showSpinner = true;
    if (this.attacksform.invalid) {
      Swal.fire('please fiil the details ');
    } else {
      this.attacksform.value.image = this.imagesData;
      this.attacksform.value.videoa = this.url;
      this.attacksform.value.videob = this.urlb;
      this.attacksform.value.document = this.documentarray;
      this.attacksform.value.audio = this.urlaudio
      this.attacksform.value.usr_id = sessionStorage.getItem('usr_id')
      this.attacksform.value.username = sessionStorage.getItem('name')
      this.attacksform.value.usernumber = sessionStorage.getItem('mobile_number')

      this.service.postattacks(this.attacksform.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.attacksform.reset();
          this.imagesData = [];
          this.url = [];
          this.urlb = [];
          this.documentarray = [];
          this.urlaudio = [];

          this.submitted = false;
          // this.showSpinner = false;
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
        }
      },
        error => {
        })
    }
    // this.showSpinner = false;
  }

  imagedata: any;
  onImageChangemarriage(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        this.imagedata = {
          reviewImg: imgFile,
          filetype: imgtype,
        }

      };
    }
  }

  postmarriages() {
    this.submitted = true;
    this.showSpinner = true
    if (this.addingmarriages.invalid) {
      alert('please fiil the details ');
    } else {
      var data = {
        description: this.addingmarriages.value.description,
        height: this.addingmarriages.value.height,
        color: this.addingmarriages.value.color,
        work: this.addingmarriages.value.work,
        status: this.addingmarriages.value.status,
        name: this.addingmarriages.value.name,
        dob: this.addingmarriages.value.dob,
        location: this.addingmarriages.value.location,
        address: this.addingmarriages.value.address,
        phonenumber: this.addingmarriages.value.phonenumber,
        districtname: this.addingmarriages.value.districtname,
        constituencyname: this.addingmarriages.value.constituencyname,
        mandals: this.addingmarriages.value.mandals,
        village_name: this.addingmarriages.value.village_name,
        gender: this.addingmarriages.value.gender,
        whealth: this.addingmarriages.value.whealth,
        types: this.addingmarriages.value.types,
        self: this.addingmarriages.value.self,
        reviewImg: this.imagesData,
        denomation_id: this.addingmarriages.value.denomation_id,
        ministry_id: this.addingmarriages.value.ministry_id,
        caste: this.addingmarriages.value.caste,
        subcaste: this.addingmarriages.value.subcaste,
        pastor_id: this.addingmarriages.value.pastor_id,
        believer_id: this.addingmarriages.value.believer_id,
        spirti: this.addingmarriages.value.spirti,
        usr_id: sessionStorage.getItem('usr_id'),
      }
      this.service.postingmarriages(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire('విజయవంతముగా నమోదు చేయబడింది, మీ ఫోన్ నెంబర్ మరియు పాస్వర్డ్ తో లాగిన్ అవగలరు')
          this.addingmarriages.reset();
          this.imagesData = [];
          this.submitted = false;
          this.showSpinner = false
        } else {
          alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')

        }
      },
        error => {
        })
    }
    this.showSpinner = false;
  }



  getbeliver() {
    this.service.getbeliversdata().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.ministryname = res.data;
      }
    }, error => {

    })
  }

  form: any;

  churchchange(event: any) {
    this.form = event.value
  }

  endtime: any;
  endtimea: any;
  timeset(event: any) {
    var time = event.target.value
    var [h, m] = time.split(':')
    this.endtime = (h % 12 ? h % 12 : 12) + ":" + m, h >= 12 ? 'PM' : 'AM';
    this.endtimea = h >= 12 ? 'PM' : 'AM';
  }

  starttime: any;
  starttimea: any;
  timeset1(event: any) {
    var time = event.target.value
    var [h, m] = time.split(':')
    this.starttime = (h % 12 ? h % 12 : 12) + ":" + m, h >= 12 ? 'PM' : 'AM';
    this.starttimea = h >= 12 ? 'PM' : 'AM';
  }

  minini: boolean = false;

  ministryad(event: any) {

    if (event.value == "Ministry") {
      this.minini = true;
    } else {
      this.minini = false;
    }
  }


  filterPastor(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastor = reportdata;
    } else if (val == "") {
      this.getpastor();
    }
  }
  filterPastor2(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastor = reportdata;
    } else if (val == "") {
      this.getpastor();
    }
  }
  filterPastor3(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastor = reportdata;
    } else if (val == "") {
      this.getpastor();
    }
  }


  filterPastor4(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.pastor.filter((item: any) => {
        return (item.pastorname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.pastor = reportdata;
    } else if (val == "") {
      this.getpastor();
    }
  }
  filterChurch(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.church.filter((item: any) => {
        return (item.church_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.church = reportdata;
    } else if (val == "") {
      this.getchurch();
    }
  }


  filterbelivers(inputValue: any) {
    let val = inputValue.value;
    if (val && val.trim() != '') {
      var reportdata = this.bliversdata.filter((item: any) => {
        return (item.fname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.bliversdata = reportdata;
    } else if (val == "") {
      this.getbelivers();
    }
  }
  getchurchstudentfilter: any;
  filterchurchdata() {
    if (this.addingchurchtimimngs.value.district_id == '' || this.addingchurchtimimngs.value.constituency_id == '') {
      alert("Please Fill the Districts & Constituency")
    } else {
      var data = {
        districts: this.addingchurchtimimngs.value.district_id,
        constituencyname: this.addingchurchtimimngs.value.constituency_id,
      }
      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchstudentfilter = res.data;

      })
    }
  }
  pastorfilter() {
    if (this.addinginsututies.value.district_id == '' || this.addinginsututies.value.constituency_id == '') {
      alert("Please Fill the Districts & Constituency")
    } else {
      var data = {
        districts: this.addinginsututies.value.district_id,
        constituencyname: this.addinginsututies.value.constituency_id,
      }

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getpastorassciationas = res.data;
      })
    }
  }

  getpastorassciationas: any;
  getpastoras: any;

  pastoras: any;
  pastorfilterdropdown() {
    var data = {
      districts: this.addingmarriages.value.districtname,
      constituencyname: this.addingmarriages.value.constituencyname,
    }
    console.log(data);
    this.service.getpastorsfilters(data).subscribe((res: any) => {
      this.pastoras = res.data;
    })
  }
  pastorspeakers() {
    if (this.addingmeetings.value.districtname == '' || this.addingmeetings.value.constituencyname == '' || this.addingmeetings.value.mandals == '') {
      alert("Please Fill the Districts & Constituency & Mandal")
    } else {
      var data = {
        districts: this.addingmeetings.value.districtname,
        constituencyname: this.addingmeetings.value.constituencyname,
        mandal_id: this.addingmeetings.value.mandals
      }

      console.log(data);

      this.service.getpastorsfilters(data).subscribe((res: any) => {
        this.getpastoras = res.data;
        console.log(this.getpastoras, 'king');

      })
    }
  }

  ///////////////////mobile view///////////////
  login: boolean = true;
  notlogin: boolean = false;
  ;
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


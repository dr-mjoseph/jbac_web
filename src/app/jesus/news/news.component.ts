import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  showSpinner: boolean = false;
  showFilters: boolean = false;
  showDateFilter: boolean = false;
  showCategoryFilter: boolean = false;
  filterDate: string = '';
  filterCategory: string = '';
  allnewsData: any[] = [];
  categories: string[] = [
    'క్రైస్తవుల మీద దాడులు',
    'గౌరవ వేతనం, ప్రభుత్వ పథకాలు సంబంధించిన న్యూస్',
    'క్రైస్తవులకు సంబంధించిన న్యూస్',
    'జనరల్ న్యూస్',
    'దళిత్ క్రిస్టియన్స్ షెడ్యూల్ కాస్ట్ స్టేటస్ న్యూస్',
    'చదువుకి సంబంధించి',
    'ట్రైనింగ్ కి సంబంధించి',
    'ఉద్యోగాలకు సంబంధించి',
    'ఆరోగ్యం కి సంబంధించి',
    'సమాజం లోని సమస్యలు కి సంబంధించి న్యూస్',
    'డా|| జోసెఫ్ గారి వార్తలు'
  ];

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters && !this.showDateFilter && !this.showCategoryFilter) {
      this.showDateFilter = true;
      this.showCategoryFilter = true;
    }
  }

  toggleDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  applyNewsFilters() {
    let filtered = [...this.allnewsData];
    if (this.filterDate) {
      filtered = filtered.filter(item => {
        if (!item.cts) return false;
        return item.cts.toString().startsWith(this.filterDate);
      });
    }
    if (this.filterCategory) {
      filtered = filtered.filter(item => {
        return item.news && item.news.toString().trim().toLowerCase().includes(this.filterCategory.trim().toLowerCase());
      });
    }
    this.searchnews = filtered;
    this.page = 1;
  }

  resetNewsFilters() {
    this.filterDate = '';
    this.filterCategory = '';
    this.searchnews = [...this.allnewsData];
    this.page = 1;
  }

  addingnews: FormGroup;
  imagesData: any = [];
  submitted: boolean = false;
  page: number = 1;
  imagesget: any;
  showFullDescription = false;

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/no.jpg';
  }
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private modalService: NgbModal , private router: Router) {

    this.addingnews = this.formBuilder.group({
      image: [''],
      description: [''],
      news: ['', [Validators.required]],
    })

    // if (sessionStorage.getItem("auth_ind")==''||sessionStorage.getItem("auth_ind")==null|| sessionStorage.getItem("auth_ind")==undefined){
    //   Swal.fire("Login Required")
    //   this.router.navigate(['/']);
    // }

  }
  ngOnInit(): void {
    this.showSpinner = true;
    this.getnews();
    this.getadds();
  }

  get h() { return this.addingnews.controls; }
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
  postnews() {
    if (this.showSpinner) {
      return;
    }
    this.submitted = true;
    this.showSpinner = true; // Start spinner
  
    if (this.addingnews.invalid) {
      alert('* మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి.');
      this.showSpinner = false; // Ensure spinner stops if validation fails
      return;
    }
  
    const data = {
      description: this.addingnews.value.description,
      news: this.addingnews.value.news,
      image: (this.imagesData && this.imagesData[0]) ? this.imagesData[0].reviewimg : '',
      reviewImg: this.imagesData
    };
  
    console.log('Posting news:', data);
  
    this.service.postupdatenews(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          Swal.fire('విజయవంతంగా నమోదు చేసారు'); // Success message
          this.addingnews.reset();
          this.imagesData = [];
          this.submitted = false;
          this.getnews();
        } else {
          alert('సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి..');
        }
      },
      error: (err) => {
        console.error('Error posting news:', err);
        alert('సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి..');
      },
      complete: () => {
        this.showSpinner = false; // Ensure spinner stops after API call
        console.log('Spinner stopped.');
      }
    });
  }
  

  // postnews() {
  //   this.submitted = true;
  //   this.showSpinner = true;
  
  //   if (this.addingnews.invalid) {
  //     alert('* మార్క్ వున్నా ఫీల్డ్స్ తప్పనిసరిగా ఎంటర్ చేయండి.');
  //     this.showSpinner = false;
  //     return;
  //   }
  
  //   const data = {
  //     description: this.addingnews.value.description,
  //     news: this.addingnews.value.news,
  //     reviewImg: this.imagesData
  //   };
  
  //   console.log(data);
  
  //   this.service.postupdatenews(data).subscribe({
  //     next: (res: any) => {
  //       if (res.status === 200) {
  //         Swal.fire('విజయవంతంగా నమోదు చేసారు'); // Success message in Telugu
  //         this.addingnews.reset();
  //         this.imagesData = [];
  //         this.submitted = false;
  //         this.showSpinner = false;

  //         this.getnews();
  //       } else {
  //         alert('సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి..');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error posting news:', err);
  //       alert('సర్వర్ లో సమస్య ఉంది. మరల ప్రయత్నించండి..');
  //     },
  //     complete: () => {
  //       this.showSpinner = false;
  //     }
  //   });
  // }
  

  // postnews() {
  //   this.submitted = true;
  //   this.showSpinner = true;
  //   if (this.addingnews.invalid) {
  //     alert('please fill the details ');
  //     this.showSpinner = false;
  //     return;
  //   } else {
  //     var data = {
  //       // usr_id: sessionStorage.getItem('usr_id'),
  //       // mobile_number: sessionStorage.getItem('mobile_number'),
  //       // name: sessionStorage.getItem('name'),
  //       description: this.addingnews.value.description,
  //       news: this.addingnews.value.news,
  //       reviewImg: this.imagesData
  //     }
  //     console.log(data);

  //     this.service.postupdatenews(data).subscribe((res: any) => {
  //       if (res.status == 200) {
  //         Swal.fire(' విజయవంతం గా నమోదు చేసారు')
  //         this.addingnews.reset();
  //         this.imagesData = [];
  //         this.submitted = false;
  //         this.getnews();
  //         this.showSpinner = false;
  //       } else {
  //         alert('సర్వర్ డౌన్ వుంది, దయచేసి తరువాత ప్రయత్నిచండి')
  //       }
  //       this.showSpinner = false;
  //     },
  //       error => {
  //         this.showSpinner = false;
  //       })
  //   }

  // }

  proofmodalDismis() {
    this.modalService.dismissAll()
  }
  searchnews: any;
  image: any;
  openimg(image: any, openmodel: any) {
    this.image = image;
    this.modalService.open(openmodel, { size: 'xl', centered: true });
  }


  getnews() {
    this.showSpinner = true;
    this.service.getupdatenews().subscribe({
      next: (res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.allnewsData = res.data || [];
          this.applyNewsFilters();
        }
      },
      error: (err: any) => {
        console.error('Error loading news:', err);
        this.showSpinner = false;
      },
      complete: () => {
        this.showSpinner = false;
      }
    });
  }

  adds: any;
  getadds() {
    this.service.getadds().subscribe(res => {
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.adds = res.data;
      }
      console.log(res.data), 'hhh';
    }, error => {
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


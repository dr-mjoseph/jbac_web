import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  // testApi = 'http://localhost:1430/dashboardapi/'

  testApi = 'https://jbac.in:9762/dashboardapi/'


  public loingstatus = new BehaviorSubject(0);
  getloginstatus = this.loingstatus.asObservable();
  constructor(private http: HttpClient) { }

  errorMessageAlert(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      timer: 1500
    })
  }
  statusChangeAlert(message: any) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }
  sucessAlert(message: any) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }

  errorAlert2() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Name already exist!',
      timer: 1500
    })
  }

  getlgstatus(data: any) {
    this.loingstatus.next(data)
  }

  getaboutcall() {
    var data = {}
    return this.http.post<any>(this.testApi + `getaboutwebsite`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  postsignup(data: any) {
    return this.http.post(this.testApi + 'postwebsitesignup', data)
  }


  passwordlogin(data: any) {
    return this.http.post(this.testApi + 'passwordwebsitelogin', data)
  }

  getevents() {
    var data = {}
    return this.http.post<any>(this.testApi + `getupdateevents`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  postbeliver(data: any) {
    return this.http.post(this.testApi + 'postbeliversignup', data)
  }

  getdenomation() {
    var data = {}
    return this.http.post<any>(this.testApi + `denomations`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getleaderlevel() {
    var data = {}
    return this.http.post<any>(this.testApi + `leaderlevels`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
    geteducational() {
    var data = {}
    return this.http.post<any>(this.testApi + `educationalq`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  institutes() {
    var data = {}
    return this.http.post<any>(this.testApi + `getinstitutes`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getpattern() {
    var data = {}
    return this.http.post<any>(this.testApi + `pattern`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  postministrysignup(data: any) {
    return this.http.post(this.testApi + 'postministrysignup', data)
  }
  postregform(data: any) {
    return this.http.post(this.testApi + 'postregform', data)
  }

postwishform(data: any) {
  console.log(data);
    return this.http.post(this.testApi + 'postwishform', data)
  }


  getdistrict() {
    var data = {}
    return this.http.post<any>(this.testApi + `getdistricts`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmdistrict() {
    var data = {}
    return this.http.post<any>(this.testApi + `getmdistricts`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmandals() {
    var data = {}
    return this.http.post<any>(this.testApi + `getmandals`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmmandals() {
    var data = {}
    return this.http.post<any>(this.testApi + `getmmandals`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  gepanchayatis() {
    var data = {}
    return this.http.post<any>(this.testApi + `gepanchayati`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  gempanchayatis() {
    var data = {}
    return this.http.post<any>(this.testApi + `gepanchayati`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getbelivers() {
    return this.http.post(this.testApi + 'getbelivers', [])
  }

  postindepedentorganisation(data: any) {
    return this.http.post(this.testApi + 'postindepedentorganisation', data)
  }

  postchurchregister(data: any) {
    return this.http.post(this.testApi + 'postchurchregister', data)
  }
  postpastorassociationss(data: any) {
    return this.http.post(this.testApi + 'postpastorassociations', data)
  }

  postrpastor(data: any) {
    return this.http.post(this.testApi + 'postpastor', data)
  }


  postindepedentchurch(data: any) {
    return this.http.post(this.testApi + 'postindepedentchurch', data)
  }

  getservices() {
    var data = {}
    return this.http.post<any>(this.testApi + `getservices`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  addNew(proofdata: any) {
    return this.http.post<any>(this.testApi + `addNew`, proofdata).pipe(map(res => {
      if (res.status == 300) {
        this.errorAlert2();
      }
      else {
        this.sucessAlert('Service Added Sucessfully')
        return res;
      }
    }));
  }


  getconsistencys() {
    var data = {}
    return this.http.post<any>(this.testApi + `getconsistencys`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmconsistencys() {
    var data = {}
    return this.http.post<any>(this.testApi + `getmconsistencys`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  poststudentsignup(data: any) {
    return this.http.post(this.testApi + 'studentsignup', data)
  }

  getchurch() {
    var data = {}
    return this.http.post<any>(this.testApi + `getchurch`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getbeliversdata() {
    var data = {}
    return this.http.post<any>(this.testApi + `getbeliversdata`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getpastor() {
    var data = {}
    return this.http.post<any>(this.testApi + `getpastor`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  postsmeetings(data: any) {
    console.log(data);
    return this.http.post(this.testApi + 'postmeetings', data)
  }

  getpersonal(data: any) {
    return this.http.post(this.testApi + 'getpersonal', data)
  }

  postchurchmeetings(data: any) {
    return this.http.post(this.testApi + 'postchuechmeetings', data);
  }
  postjobs(data: any) {
    return this.http.post(this.testApi + 'postjobs', data);
  }
  postadds(data: any) {
    return this.http.post(this.testApi + 'postadds', data);
  }
  postinsututies(data: any) {
    return this.http.post(this.testApi + 'postinsututies', data);
  }
  postcolleges(data: any) {
    return this.http.post(this.testApi + 'postcolleges', data);
  }
  postmarriages(data: any) {
    return this.http.post(this.testApi + 'postmarriages', data);
  }
  getrevival() {
    var data = {}
    return this.http.post<any>(this.testApi + `getrevival`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getyouth() {
    var data = {}
    return this.http.post<any>(this.testApi + `getyouth`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getwomen() {
    var data = {}
    return this.http.post<any>(this.testApi + `getwomen`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getpastormeeting() {
    var data = {}
    return this.http.post<any>(this.testApi + `getpastormeeting`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getchildern() {
    var data = {}
    return this.http.post<any>(this.testApi + `getchildern`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmusicals() {
    var data = {}
    return this.http.post<any>(this.testApi + `getmusical`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  searchingdata(data: any) {
    return this.http.post(this.testApi + 'searchingdata', data);
  }

  searchingdemonationdata(data: any) {
    return this.http.post(this.testApi + 'searchingdemonation', data);
  }

  searchingchurchdata(data: any) {
    return this.http.post(this.testApi + 'searchingchurchdata', data);
  }


  getchurches() {
    var data = {}
    return this.http.post<any>(this.testApi + `getchurches`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getwing() {
    return this.http.post(this.testApi + 'getwing', []);
  }


  postattacks(data: any) {
    return this.http.post<any>(this.testApi + 'postattacks', data);
  }

  getimages() {
    return this.http.post(this.testApi + 'getwebsitegallery', [])
  }

  getcatewebsitegallery() {
    return this.http.get(this.testApi + 'getcatewebsitegallery')
  }

  Searchinstitute(data: any) {
    return this.http.post(this.testApi + 'Searchinstitute', data)
  }

  postingmarriages(data: any) {
    return this.http.post(this.testApi + 'postingmarriages', data)
  }
  updateprofile(data: any) {
    return this.http.post(this.testApi + 'updateprofile', data)
  }
  updatebeliver(data: any) {
    return this.http.post(this.testApi + 'updatebeliver', data)
  }
  searchmarriages(data: any) {
    return this.http.post(this.testApi + 'Searchmarriages', data)
  }

  searchpastors(data: any) {
    return this.http.post(this.testApi + 'searchpastors', data)
  }
  searchorganization(data: any) {
    return this.http.post(this.testApi + 'searchorganization', data)
  }
  getadds() {
    var data = {}
    return this.http.post<any>(this.testApi + `getaddsdata`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getorganizations() {
    var data = {}
    return this.http.post<any>(this.testApi + `getorganizations`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  contact(data: any) {
    return this.http.post<any>(this.testApi + `contact`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getjobs(data: any) {
    return this.http.post(this.testApi + 'searchjob', data)
  }

  getuserprofilereport(data: any) {
    return this.http.post<any>(this.testApi + 'getuserprofilereport', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getdownloadsdata() {
    return this.http.get(this.testApi + 'getadocumentsdataa');
  }

  getLeaderswebsiteD(data: any) {
    // console.log(data);

    return this.http.post(this.testApi + 'getLeaderswebsiteData', data)
  }

  getLeaderswebsitewing(data: any) {
    return this.http.post(this.testApi + 'getLeaderswebsitewing', data)
  }

  getUserMainData(data: any) {
    return this.http.post(this.testApi + 'getUserMainData/', data)
  }

  deleteleaders(data: any) {
    return this.http.post<any>(this.testApi + `deleteboardmember`, data).pipe(map(res => {
      this.statusChangeAlert('Request Rejected Successfully')
      return res;
    }));
  }

  posthelping(data: any) {
    return this.http.post(this.testApi + 'posthelping', data)
  }

  gethelp() {
    var data = {}
    return this.http.post<any>(this.testApi + `gethelps`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  postupdatenews(data: any) {
    return this.http.post(this.testApi + 'postnews', data)
  }
  getupdatenews() {
    var data = {}
    return this.http.post<any>(this.testApi + `getnews`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }



  postbusiness(data: any) {
    return this.http.post(this.testApi + 'postbusiness', data);
  }

  // getbusiness(data:any) {
  //   return this.http.post<any>(this.testApi + `getbusiness`, data).pipe(map(res => {
  //     return res;
  //   }, (error: any) => {
  //     return error;
  //   }));
  // }
  getbusiness() {
    var data = {}
    return this.http.post<any>(this.testApi + `getbusiness`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  searchingbusiness(data: any) {
    return this.http.post(this.testApi + 'searchingbusiness', data);
  }


  updateconsistency(data: any) {
    return this.http.post<any>(this.testApi + `updateconsis/`, data).pipe(map(res => {
      this.statusChangeAlert('Request Accepted Successfully')
      return res;
    }));
  }


  getpastorassci() {
    var data = {}
    return this.http.post<any>(this.testApi + `getpastorassociation`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getvideourldatadetails() {
    return this.http.get<any>(this.testApi + `getvideourl`).pipe(map(res => {
      return res;
    }, (error: any) => {

      return error;
    }));
  }

  checknumber(data: any) {
    return this.http.post(this.testApi + 'checknumber', data);
  }

  checkotp(data: any) {
    return this.http.post(this.testApi + 'checkotp', data);
  }

  createfrgetpassword(data: any) {
    return this.http.post(this.testApi + 'createfrgetpassword', data);
  }

  updatedetails(data: any) {
    return this.http.post(this.testApi + 'updatedetails', data);

  }

  geteditdtails(data: any) {
    return this.http.post(this.testApi + 'geteditdtails', data);
  }

  editpastor(data: any) {
    return this.http.post(this.testApi + 'editpastor', data);
  }
  // editministry(data: any) {
  //   return this.http.post(this.testApi + 'editpastor', data);
  // }
  editchurch(data: any) {
    return this.http.post(this.testApi + 'editchurch', data);
  }
  editindependentorgainsation(data: any) {
    return this.http.post(this.testApi + 'editindependentorgainsation', data);
  }
  editpastororgainsation(data: any) {
    return this.http.post(this.testApi + 'editpastororgainsation', data);
  }
  editpastorsassociations(data: any) {
    return this.http.post(this.testApi + 'editpastorsassociations', data);
  }
  editbeliver(data: any) {
    return this.http.post(this.testApi + 'editbeliver', data).pipe(map(res => {
      console.log(data);

      return res;
    }, (error: any) => {
      return error;
    }));
  }
  editstudent(data: any) {
    return this.http.post(this.testApi + 'editstudent', data).pipe(map(res => {
      console.log(data);
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  editministry(data: any) {
    return this.http.post(this.testApi + 'editministry', data);
  }
  searchingmarriages(data: any) {
    return this.http.post(this.testApi + 'searchingmarriages', data);
  }
  searchinorganizations(data: any) {
    return this.http.post(this.testApi + 'searchinorganizations', data);
  }
  getjob() {
    return this.http.post(this.testApi + 'getjob', []);
  }

  searchjobswise(data: any) {
    return this.http.post(this.testApi + 'searchjobswise', data);
  }


  getatt() {
    return this.http.post(this.testApi + 'getatt', []);
  }
  /////////////////////////////////service page data////////////////////////////
  getpastorsfilters(data: any) {
    return this.http.post<any>(this.testApi + 'getpastorsfilters', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getchurchesdatafilters(data: any) {
    return this.http.post<any>(this.testApi + 'getchurchesdatafilters', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  viewupdates(data: any) {
    return this.http.post(this.testApi + 'viewupdates', data)
  }
    viewconstituencyname(data: any) {
    return this.http.post(this.testApi + 'viewconstituencyname', data)
  }

  viewpastorupdates(data: any) {
    return this.http.post(this.testApi + 'pastorviewupdates', data)
  }
}






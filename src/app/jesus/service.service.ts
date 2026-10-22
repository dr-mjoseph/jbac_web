import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { BehaviorSubject, of, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { FALLBACK_DROPDOWN_DATA } from './dropdown_fallback_data';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  testApi = environment.apiUrl;


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

  getFamilyMembers(phone: any): Observable<any> {
    const payload = typeof phone === 'object' ? phone : { mobile_number: phone };
    return this.http.post<any>(this.testApi + 'getfamilymembers', payload);
  }

  updateFamilyMemberPassword(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'updatefamilymemberpassword', data);
  }

  getevents() {
    var data = {}
    return this.http.post<any>(this.testApi + `getupdateevents`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getRibbonEvents(): Observable<any> {
    return this.http.post<any>(this.testApi + `getribbonevents`, {}).pipe(
      catchError(() => {
        return this.http.get<any>(this.testApi + `crud/events?d_in=1`).pipe(
          map(res => {
            if (Array.isArray(res)) return { status: 200, data: res };
            if (res && res.data) return { status: 200, data: res.data };
            return { status: 200, data: [] };
          }),
          catchError(() => of({ status: 200, data: [] }))
        );
      })
    );
  }

  postbeliver(data: any) {
    return this.http.post(this.testApi + 'postbeliversignup', data)
  }

  getdenomation(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `denomations`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.denominations , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.denominations , message: "Success" } as any))
    );
  }

  getleaderlevel(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `leaderlevels`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.leaderlevels , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.leaderlevels , message: "Success" } as any))
    );
  }
  geteducational(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `educationalq`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.educationalq , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.educationalq , message: "Success" } as any))
    );
  }
  institutes() {
    var data = {}
    return this.http.post<any>(this.testApi + `getinstitutes`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getpattern(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `pattern`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.pattern , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.pattern , message: "Success" } as any))
    );
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


  getstates(): Observable<any> {
    return this.http.post<any>(this.testApi + `getstates`, {}).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          const fallbackStates = (FALLBACK_DROPDOWN_DATA as any).states || [
            { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
            { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
          ];
          return { status: 200, data: fallbackStates, message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => {
        const fallbackStates = (FALLBACK_DROPDOWN_DATA as any).states || [
          { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
          { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
        ];
        return of({ status: 200, data: fallbackStates, message: "Success" } as any);
      })
    );
  }
  getmstates(): Observable<any> {
    return this.getstates();
  }

  getdistrict(stateId?: any): Observable<any> {
    var data: any = {};
    if (stateId !== undefined && stateId !== null && stateId !== '' && stateId !== 'all') {
      data = typeof stateId === 'object' && stateId !== null ? stateId : { state_id: stateId };
    }
    return this.http.post<any>(this.testApi + `getdistricts`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          let list = (FALLBACK_DROPDOWN_DATA as any).districts || [];
          const sid = data.state_id || (typeof stateId === 'number' || typeof stateId === 'string' ? stateId : null);
          if (sid && sid !== 'all') {
            list = list.filter((d: any) => d.state_id == sid || (!d.state_id && sid == 1));
          }
          return { status: 200, data: list , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => {
        let list = (FALLBACK_DROPDOWN_DATA as any).districts || [];
        const sid = data.state_id || (typeof stateId === 'number' || typeof stateId === 'string' ? stateId : null);
        if (sid && sid !== 'all') {
          list = list.filter((d: any) => d.state_id == sid || (!d.state_id && sid == 1));
        }
        return of({ status: 200, data: list , message: "Success" } as any);
      })
    );
  }
  getmdistrict(stateId?: any): Observable<any> {
    return this.getdistrict(stateId);
  }
  getmandals(constId?: any): Observable<any> {
    var data: any = {};
    if (constId !== undefined && constId !== null && constId !== '') {
      data = typeof constId === 'object' && constId !== null ? constId : { const_id: constId };
    }
    return this.http.post<any>(this.testApi + `getmandals`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          const cId = data && data.const_id;
          if (cId && (FALLBACK_DROPDOWN_DATA as any).mandals) {
            const filtered = (FALLBACK_DROPDOWN_DATA as any).mandals.filter((m: any) => String(m.const_id) === String(cId));
            return { status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).mandals , message: "Success" } as any;
          }
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).mandals , message: "Success" } as any;
        }
        const normalized = res.data.map((m: any) => ({
          ...m,
          mndl_nm: m.mndl_nm || m.mandalname || m.name || `మండలం #${m.id}`,
          mandalname: m.mandalname || m.mndl_nm || m.name || `మండలం #${m.id}`,
          name: m.name || m.mndl_nm || m.mandalname || `మండలం #${m.id}`,
          const_id: m.const_id !== undefined && m.const_id !== null ? Number(m.const_id) : m.const_id,
          dstrct_id: m.dstrct_id !== undefined && m.dstrct_id !== null ? Number(m.dstrct_id) : m.dstrct_id
        }));
        return { status: 200, data: normalized , message: "Success" } as any;
      }),
      catchError(() => {
        const cId = data && data.const_id;
        if (cId && (FALLBACK_DROPDOWN_DATA as any).mandals) {
          const filtered = (FALLBACK_DROPDOWN_DATA as any).mandals.filter((m: any) => String(m.const_id) === String(cId));
          return of({ status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).mandals , message: "Success" } as any);
        }
        return of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).mandals , message: "Success" } as any);
      })
    );
  }
  getmmandals(constId?: any): Observable<any> {
    return this.getmandals(constId);
  }
  gepanchayatis(mandalId?: any): Observable<any> {
    var data: any = {};
    if (mandalId !== undefined && mandalId !== null && mandalId !== '') {
      data = typeof mandalId === 'object' && mandalId !== null ? mandalId : { mandal_id: mandalId };
    }
    const numMandalId = (mandalId && typeof mandalId !== 'object') ? Number(mandalId) : (mandalId?.mandal_id ? Number(mandalId.mandal_id) : undefined);
    const getFallbackList = () => {
      return ((FALLBACK_DROPDOWN_DATA as any).panchayatis || []).map((p: any) => ({
        ...p,
        mndl_id: numMandalId !== undefined ? numMandalId : p.id
      }));
    };
    return this.http.post<any>(this.testApi + `gepanchayati`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          return { status: 200, data: getFallbackList(), message: "Success" } as any;
        }
        const normalized = res.data.map((p: any) => ({
          ...p,
          pnchyt_nm: p.pnchyt_nm || p.panchayatname || p.name || `గ్రామం / పంచాయతీ #${p.id}`,
          panchayatname: p.panchayatname || p.pnchyt_nm || p.name || `గ్రామం / పంచాయతీ #${p.id}`,
          name: p.name || p.pnchyt_nm || p.panchayatname || `గ్రామం / పంచాయతీ #${p.id}`,
          mndl_id: p.mndl_id !== undefined && p.mndl_id !== null ? Number(p.mndl_id) : (numMandalId !== undefined ? numMandalId : p.mndl_id)
        }));
        return { status: 200, data: normalized , message: "Success" } as any;
      }),
      catchError(() => of({ status: 200, data: getFallbackList(), message: "Success" } as any))
    );
  }
  gempanchayatis(mandalId?: any): Observable<any> {
    return this.gepanchayatis(mandalId);
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

  getservices(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `getservices`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).services , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).services , message: "Success" } as any))
    );
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


  getconsistencys(districtId?: any): Observable<any> {
    var data: any = {};
    if (districtId !== undefined && districtId !== null && districtId !== '') {
      data = typeof districtId === 'object' && districtId !== null ? districtId : { district_id: districtId };
    }
    return this.http.post<any>(this.testApi + `getconsistencys`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          const dId = data && data.district_id;
          if (dId && (FALLBACK_DROPDOWN_DATA as any).consistencies) {
            const filtered = (FALLBACK_DROPDOWN_DATA as any).consistencies.filter((c: any) => String(c.dstrct_id) === String(dId));
            return { status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).consistencies , message: "Success" } as any;
          }
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).consistencies , message: "Success" } as any;
        }
        const normalized = res.data.map((c: any) => ({
          ...c,
          const_nm: c.const_nm || c.constituencyname || c.name || `నియోజకవర్గం #${c.id}`,
          constituencyname: c.constituencyname || c.const_nm || c.name || `నియోజకవర్గం #${c.id}`,
          name: c.name || c.const_nm || c.constituencyname || `నియోజకవర్గం #${c.id}`,
          dstrct_id: c.dstrct_id !== undefined && c.dstrct_id !== null ? Number(c.dstrct_id) : c.dstrct_id
        }));
        return { status: 200, data: normalized , message: "Success" } as any;
      }),
      catchError(() => {
        const dId = data && data.district_id;
        if (dId && (FALLBACK_DROPDOWN_DATA as any).consistencies) {
          const filtered = (FALLBACK_DROPDOWN_DATA as any).consistencies.filter((c: any) => String(c.dstrct_id) === String(dId));
          return of({ status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).consistencies , message: "Success" } as any);
        }
        return of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).consistencies , message: "Success" } as any);
      })
    );
  }
  getmconsistencys(districtId?: any): Observable<any> {
    return this.getconsistencys(districtId);
  }

  poststudentsignup(data: any) {
    return this.http.post(this.testApi + 'studentsignup', data)
  }

  getchurch(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `getchurch`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.churches , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.churches , message: "Success" } as any))
    );
  }
  getministry(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `getministry`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.ministries , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.ministries , message: "Success" } as any))
    );
  }
  getbeliversdata(): Observable<any> {
    return this.getministry();
  }

  getpastor(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `getpastor`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.pastors , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.pastors , message: "Success" } as any))
    );
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

  getwing(): Observable<any> {
    return this.http.post<any>(this.testApi + 'getwing', []).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.wings , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.wings , message: "Success" } as any))
    );
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


  getpastorassci(): Observable<any> {
    var data = {}
    return this.http.post<any>(this.testApi + `getpastorassociation`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).pastors , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).pastors , message: "Success" } as any))
    );
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
    return this.http.post(this.testApi + 'editpastororgainsation', data);
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
  editdoctor(data: any) {
    return this.http.post(this.testApi + 'editdoctor', data);
  }
  editentry(data: any) {
    return this.http.post(this.testApi + 'editentry', data);
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
  getpastorsfilters(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'getpastorsfilters', data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          const dId = data && (data.districts || data.district_id);
          if (dId && FALLBACK_DROPDOWN_DATA.pastors) {
            const filtered = FALLBACK_DROPDOWN_DATA.pastors.filter((p: any) => p.district_id == dId);
            return { status: 200, data: filtered.length > 0 ? filtered : FALLBACK_DROPDOWN_DATA.pastors , message: "Success" } as any;
          }
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.pastors , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.pastors , message: "Success" } as any))
    );
  }
  getchurchesdatafilters(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'getchurchesdatafilters', data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          const dId = data && (data.districts || data.district_id);
          if (dId && FALLBACK_DROPDOWN_DATA.churches) {
            const filtered = FALLBACK_DROPDOWN_DATA.churches.filter((c: any) => c.district_id == dId);
            return { status: 200, data: filtered.length > 0 ? filtered : FALLBACK_DROPDOWN_DATA.churches , message: "Success" } as any;
          }
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.churches , message: "Success" } as any;
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.churches , message: "Success" } as any))
    );
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

  // Family Counselling & Doctor Appointment Services
  getcouncellingdoctors(filter: any = {}) {
    return this.http.post<any>(this.testApi + 'getcouncellingdoctors', filter).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  savecouncellingdoctor(data: any) {
    return this.http.post<any>(this.testApi + 'savecouncellingdoctor', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  deletecouncellingdoctor(id: any) {
    return this.http.post<any>(this.testApi + 'deletecouncellingdoctor', { id }).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getcouncellingappointments(filter: any = {}) {
    return this.http.post<any>(this.testApi + 'getcouncellingappointments', filter).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  bookcouncellingappointment(data: any) {
    return this.http.post<any>(this.testApi + 'bookcouncellingappointment', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  updateappointmentstatus(data: any) {
    return this.http.post<any>(this.testApi + 'updateappointmentstatus', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  registercouncellingdoctor(data: any) {
    return this.http.post<any>(this.testApi + 'registerdoctor', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  doctorvoicereply(data: any) {
    return this.http.post<any>(this.testApi + 'doctorvoicereply', data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  getcouncellingvoicemessages(appointmentId: any) {
    return this.http.post<any>(this.testApi + 'getcouncellingvoicemessages', { appointment_id: appointmentId }).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
}






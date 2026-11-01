import os

def update_mobile_wingcommand():
    mobile_dir = r"C:\Users\rajes\StudioProjects\jbac_app"
    ts_file = os.path.join(mobile_dir, "src", "pages", "wingcommand", "wingcommand.ts")
    html_file = os.path.join(mobile_dir, "src", "pages", "wingcommand", "wingcommand.html")

    new_ts_content = """import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-wingcommand',
  templateUrl: 'wingcommand.html',
})
export class WingcommandPage {
  leders_array: any;
  category_id: any;
  profiledata: any = [];
  belearr: any = [];
  studentarr: any = [];
  pastorarr: any = [];
  formshow: any = 1;
  selectedUserType: string = 'believer';
  general: any = '';
  generals: any = '';
  leaders: any = '';
  wingtypes: any = '';
  leaderid: any;
  myresdata: any;
  cachedUserRes: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: ServiceProvider, public alertCtrl: AlertController) {
    this.formshow = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WingcommandPage');
    this.category_id = localStorage.getItem("category_id");
    if (this.category_id === '4' || this.category_id === '3') {
      this.selectedUserType = 'pastor';
      this.formshow = 3;
    } else if (this.category_id === '2') {
      this.selectedUserType = 'student';
      this.formshow = 2;
    } else {
      this.selectedUserType = 'believer';
      this.formshow = 1;
    }
    this.getLeaderswebsiteData();
  }

  gotohome() {
    this.navCtrl.push('HomePage');
  }

  getLeaderswebsiteData(forceUserType?: string) {
    const storedCat = localStorage.getItem("category_id");
    const storedUsrId = localStorage.getItem("usr_id");

    var data = {
      "category": storedCat,
      "usr_id": storedUsrId
    };

    this.service.getUserMainData(data).subscribe((res: any) => {
      if (!res || !res.data || res.data.length == 0) {
        const confirm = this.alertCtrl.create({
          title: 'మీరు జనరల్ లీడర్ (లేదా) వింగ్ లీడర్ కాదు?',
          mode: 'ios',
          buttons: [{ text: 'OK', handler: () => {} }]
        });
        confirm.present();
        this.navCtrl.push('HomePage');
        return;
      }

      this.cachedUserRes = res.data[0];
      const userRole = res.data[0].role;

      if (forceUserType) {
        this.selectedUserType = forceUserType;
        if (forceUserType === 'pastor') this.formshow = 3;
        else if (forceUserType === 'student') this.formshow = 2;
        else this.formshow = 1;
      } else {
        if (userRole === 'pastor' || storedCat === '4' || storedCat === '3') {
          this.selectedUserType = 'pastor';
          this.formshow = 3;
        } else if (userRole === 'student' || storedCat === '2') {
          this.selectedUserType = 'student';
          this.formshow = 2;
        } else {
          this.selectedUserType = 'believer';
          this.formshow = 1;
        }
      }

      this.fetchSubordinateRequests();
    });
  }

  fetchSubordinateRequests() {
    if (!this.cachedUserRes) return;
    const u = this.cachedUserRes;
    this.leaderid = u.leadertype;

    if (u.leadertype == 1) {
      this.leaders = "Leader ";
    } else if (u.leadertype == 2) {
      this.leaders = "Wing ";
    }
    this.myresdata = u.generaltype;

    if (u.leadertype == 1) {
      if (u.generaltype == 0) {
        this.generals = "State";
        this.general = "District ";
      } else if (u.generaltype == 1) {
        this.generals = "District";
        this.general = "Constituency ";
      } else if (u.generaltype == 2) {
        this.generals = "Constituency";
        this.general = "Mandal ";
      } else if (u.generaltype == 3) {
        this.generals = "Mandal ";
        this.general = "Panchayat ";
      } else if (u.generaltype == 4) {
        this.generals = "Panchayat ";
        this.general = "Ward ";
      } else if (u.generaltype == 5 || u.generaltype == 6) {
        this.generals = "Ward ";
        this.general = "";
      }

      var data = {
        "usr_id": localStorage.getItem("usr_id"),
        "category_id": localStorage.getItem("category_id"),
        "user_type": this.selectedUserType,
        "leadertype": u.leadertype,
        "wingtypes": u.wingtypes,
        "generaltype": u.generaltype,
        state_id: u.state_id || 1,
        district_id: u.district_id,
        constituency_id: u.constituency_id,
        mandal_id: u.mandal_id,
        panchayat_id: u.village_id
      };

      this.service.getLeaderswebsiteD(data).subscribe((result: any) => {
        const rawBelievers = result.data[0] || [];
        const rawPastors = result.data[2] || [];
        const rawStudents = result.data[3] || [];

        if (this.selectedUserType === 'pastor') {
          this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.studentarr = [];
        } else if (this.selectedUserType === 'student') {
          this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.pastorarr = [];
        } else {
          this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.pastorarr = [];
          this.studentarr = [];
        }
      });
    } else if (u.leadertype == 2) {
      this.wingtypes = u.wing_name || u.wingtypes || "";
      if (u.generaltype == 0) {
        this.generals = "State";
        this.general = "District";
      } else if (u.generaltype == 1) {
        this.generals = "District";
        this.general = "Constituency";
      } else if (u.generaltype == 2) {
        this.generals = "Constituency";
        this.general = "Mandal";
      } else if (u.generaltype == 3) {
        this.generals = "Mandal";
        this.general = "Panchayat";
      } else if (u.generaltype == 4) {
        this.generals = "Panchayat";
        this.general = "Ward";
      } else if (u.generaltype == 5 || u.generaltype == 6) {
        this.generals = "Ward";
        this.general = "";
      }

      var data4 = {
        "usr_id": localStorage.getItem("usr_id"),
        "category_id": localStorage.getItem("category_id"),
        "user_type": this.selectedUserType,
        "leadertype": u.leadertype,
        "wingtypes": u.wingtypes,
        "generaltype": u.generaltype,
        wingtype: u.wingtype,
        state_id: u.state_id || 1,
        district_id: u.district_id,
        constituency_id: u.constituency_id,
        mandal_id: u.mandal_id,
        panchayat_id: u.village_id
      };

      this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {
        const rawBelievers = result.data[0] || [];
        const rawStudents = result.data[1] || [];
        const rawPastors = result.data[2] || [];

        if (this.selectedUserType === 'pastor') {
          this.pastorarr = rawPastors.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.studentarr = [];
        } else if (this.selectedUserType === 'student') {
          this.studentarr = rawStudents.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.belearr = [];
          this.pastorarr = [];
        } else {
          this.belearr = rawBelievers.filter((x: any) => Number(x?.approval_ind) !== 2);
          this.pastorarr = [];
          this.studentarr = [];
        }
      });
    }
  }

  deleteAlert(id: any, index: any) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure to reject?',
      mode: 'ios',
      buttons: [
        {
          text: 'అవును, తిరస్కరించండి!',
          handler: () => {
            this.deleteleader(id, index);
          }
        },
        { text: 'No', handler: () => {} }
      ]
    });
    confirm.present();
  }

  deleteleader(id: any, index: any) {
    var data = {
      tableid: id,
      id: index,
      leadertype: this.leaderid
    };
    this.service.deleteleaders(data).subscribe(res => {
      this.fetchSubordinateRequests();
    });
  }

  make(id: any) {
    this.formshow = id;
    if (id == 1) {
      this.selectedUserType = 'believer';
      this.pastorarr = [];
      this.studentarr = [];
    } else if (id == 3) {
      this.selectedUserType = 'pastor';
      this.belearr = [];
      this.studentarr = [];
    } else if (id == 2) {
      this.selectedUserType = 'student';
      this.belearr = [];
      this.pastorarr = [];
    }
    this.fetchSubordinateRequests();
  }

  confirm(id: any, index: any) {
    const confirm = this.alertCtrl.create({
      title: 'మీరు ఖచ్చితంగా నిర్ధారించాలనుకుంటున్నారా?',
      mode: 'ios',
      buttons: [
        {
          text: 'అవును, నిర్ధారించండి!',
          handler: () => {
            this.conformleader(id, index);
          }
        },
        { text: 'No', handler: () => {} }
      ]
    });
    confirm.present();
  }

  conformleader(id: any, index: any) {
    var data = {
      tableid: id,
      id: index,
      leadertype: this.leaderid
    };
    this.service.updateconsistency(data).subscribe(res => {
      this.fetchSubordinateRequests();
    });
  }

  getSubordinateSubtitle(): string {
    if (this.myresdata == 0) return 'జిల్లాల వారిగా (District-wise)';
    if (this.myresdata == 1) return 'నియోజకవర్గాల వారిగా (Constituency-wise)';
    if (this.myresdata == 2) return 'మండలాల వారిగా (Mandal-wise)';
    if (this.myresdata == 3) return 'పంచాయితీల వారిగా (Panchayat-wise)';
    if (this.myresdata == 4) return 'వార్డుల వారిగా (Ward-wise)';
    return 'సబార్డినేట్స్ వారిగా';
  }

  getDetailedLeaderStatus(x: any): string {
    if (!x) return 'లీడర్ (Leader)';
    const isWing = String(x.leadertype) === '2' || (x.wingtype && x.wingtype !== 'null' && String(x.wingtype).trim() !== '') || (x.wingtypes && x.wingtypes !== 'null' && String(x.wingtypes).trim() !== '');
    if (isWing) return (x.wing_name || 'వింగ్') + ' లీడర్';
    const gType = String(x.generaltype || '').trim();
    if (gType === '0') return 'రాష్ట్ర లీడర్';
    if (gType === '1') return 'జిల్లా లీడర్';
    if (gType === '2') return 'నియోజకవర్గ లీడర్';
    if (gType === '3') return 'మండల లీడర్';
    if (gType === '4') return 'గ్రామ / పంచాయితీ లీడర్';
    if (gType === '5' || gType === '6') return 'వార్డు లీడర్';
    return 'జనరల్ లీడర్';
  }

  isShowDiv = true;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  personaldata() {
    var data = {
      usr_id: localStorage.getItem('usr_id'),
      category_id: localStorage.getItem('category_id'),
    };
    this.service.getuserprofilereport(data).subscribe((res: any) => {
      this.profiledata = res.data[0];
    });
  }
}
"""

    new_html_content = """<ion-header>
  <ion-navbar>
    <ion-buttons end>
      <button ion-button icon-only (click)="gotohome()">
        <ion-icon style="font-size: 20px;" name="home"></ion-icon>
      </button>
    </ion-buttons>
    <ion-title style="text-align: center;"><b>నాయకత్వ అభ్యర్థనలు (Leaders)</b></ion-title>
  </ion-navbar>
</ion-header>

<ion-content class="pagecss">
  <p style="color: white; text-align: center; font-size: 1.1rem; margin-top: 10px;">
    <b>{{ generals }} {{ wingtypes }} {{ leaders }}</b>
  </p>

  <!-- Clean User Type Filter Buttons -->
  <ion-row style="padding: 0 5px;">
    <ion-col col-4 text-center (click)="make(1)">
      <button ion-button block [color]="formshow == 1 ? 'primary' : 'light'" style="font-size: 11px; font-weight: 600;">
        👥 విశ్వాసులు
      </button>
    </ion-col>
    <ion-col col-4 text-center (click)="make(3)">
      <button ion-button block [color]="formshow == 3 ? 'danger' : 'light'" style="font-size: 11px; font-weight: 600;">
        ✝️ పాస్టర్లు
      </button>
    </ion-col>
    <ion-col col-4 text-center (click)="make(2)">
      <button ion-button block [color]="formshow == 2 ? 'secondary' : 'light'" style="font-size: 11px; font-weight: 600;">
        🎓 విద్యార్థులు
      </button>
    </ion-col>
  </ion-row>

  <!-- Filter Indicator Badge -->
  <div style="text-align: center; margin: 8px 10px;">
    <span style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-size: 11px; font-weight: 600; background: #ffffff; color: #00548F; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
      📌 {{ formshow == 1 ? 'విశ్వాసులు (Believers)' : (formshow == 3 ? 'పాస్టర్లు (Pastors)' : 'విద్యార్థులు (Students)') }} రిక్వెస్ట్‌లు మాత్రమే
    </span>
  </div>

  <!-- Believers Requests Card -->
  <ion-card *ngIf="formshow == 1">
    <ion-card-header>
      <ion-card-title text-center style="font-size: 14px; color: #00548F;">
        {{ general != '' ? general + ' Level Believers Requests' : 'Believers Requests' }} ({{ getSubordinateSubtitle() }})
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div style="overflow: auto;">
        <table class="table" style="width: 100%;">
          <thead style="text-align: center;">
            <tr>
              <th>S.No</th>
              <th>పేరు (Name)</th>
              <th>స్థాయి</th>
              <th>నియోజకవర్గం</th>
              <th>మండలం</th>
              <th>నిర్ణయం</th>
              <th>కాల్</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let x of belearr; let i = index" style="text-align: center;">
              <td>{{ i + 1 }}</td>
              <td><b>{{ x.fname }} {{ x.lname || '' }}</b></td>
              <td><span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">{{ getDetailedLeaderStatus(x) }}</span></td>
              <td>{{ x.constituency_name || x.nativeplace || '--' }}</td>
              <td>{{ x.mandal_name || '--' }}</td>
              <td class="actions">
                <ion-label *ngIf="x.approval_ind == 1" style="color: green;"><b>✓ Accepted</b></ion-label>
                <div *ngIf="x.approval_ind == 0 || x.approval_ind == null">
                  <button ion-button small color="success" (click)="confirm(1, x.id)">Confirm</button>
                  <button ion-button small color="danger" (click)="deleteAlert(1, x.id)">Reject</button>
                </div>
              </td>
              <td class="contact">
                <a href="tel:+91{{ x.mobile_number }}">
                  <ion-icon name="call" style="font-size: 20px; color: green;"></ion-icon>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4 *ngIf="!belearr || belearr.length == 0" text-center style="color: #64748b; padding: 20px;">
        ఈ పరిధిలో ఎటువంటి విశ్వాసి అభ్యర్థనలు లేవు / No Believers Requests
      </h4>
    </ion-card-content>
  </ion-card>

  <!-- Pastors Requests Card -->
  <ion-card *ngIf="formshow == 3">
    <ion-card-header>
      <ion-card-title text-center style="font-size: 14px; color: #8b0000;">
        {{ general != '' ? general + ' Level Pastors Requests' : 'Pastors Requests' }} ({{ getSubordinateSubtitle() }})
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div style="overflow: auto;">
        <table class="table" style="width: 100%;">
          <thead style="text-align: center;">
            <tr>
              <th>S.No</th>
              <th>పాస్టర్ పేరు</th>
              <th>స్థాయి</th>
              <th>నియోజకవర్గం</th>
              <th>మండలం</th>
              <th>నిర్ణయం</th>
              <th>కాల్</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let x of pastorarr; let i = index" style="text-align: center;">
              <td>{{ i + 1 }}</td>
              <td><b>{{ x.pastorname }}</b></td>
              <td><span style="font-size: 10px; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">{{ getDetailedLeaderStatus(x) }}</span></td>
              <td>{{ x.constituency_name || x.nativeplace || '--' }}</td>
              <td>{{ x.mandal_name || '--' }}</td>
              <td class="actions">
                <ion-label *ngIf="x.approval_ind == 1" style="color: green;"><b>✓ Accepted</b></ion-label>
                <div *ngIf="x.approval_ind == 0 || x.approval_ind == null">
                  <button ion-button small color="success" (click)="confirm(3, x.id)">Confirm</button>
                  <button ion-button small color="danger" (click)="deleteAlert(3, x.id)">Reject</button>
                </div>
              </td>
              <td class="contact">
                <a href="tel:+91{{ x.phonenumber }}">
                  <ion-icon name="call" style="font-size: 20px; color: green;"></ion-icon>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4 *ngIf="!pastorarr || pastorarr.length == 0" text-center style="color: #64748b; padding: 20px;">
        ఈ పరిధిలో ఎటువంటి పాస్టర్ అభ్యర్థనలు లేవు / No Pastors Requests
      </h4>
    </ion-card-content>
  </ion-card>

  <!-- Students Requests Card -->
  <ion-card *ngIf="formshow == 2">
    <ion-card-header>
      <ion-card-title text-center style="font-size: 14px; color: #1e7e34;">
        {{ general != '' ? general + ' Level Students Requests' : 'Students Requests' }} ({{ getSubordinateSubtitle() }})
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div style="overflow: auto;">
        <table class="table" style="width: 100%;">
          <thead style="text-align: center;">
            <tr>
              <th>S.No</th>
              <th>విద్యార్థి పేరు</th>
              <th>స్థాయి</th>
              <th>నియోజకవర్గం</th>
              <th>మండలం</th>
              <th>నిర్ణయం</th>
              <th>కాల్</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let x of studentarr; let i = index" style="text-align: center;">
              <td>{{ i + 1 }}</td>
              <td><b>{{ x.studentname || x.fname }}</b></td>
              <td><span style="font-size: 10px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">{{ getDetailedLeaderStatus(x) }}</span></td>
              <td>{{ x.constituency_name || x.nativeplace || '--' }}</td>
              <td>{{ x.mandal_name || '--' }}</td>
              <td class="actions">
                <ion-label *ngIf="x.approval_ind == 1" style="color: green;"><b>✓ Accepted</b></ion-label>
                <div *ngIf="x.approval_ind == 0 || x.approval_ind == null">
                  <button ion-button small color="success" (click)="confirm(2, x.id)">Confirm</button>
                  <button ion-button small color="danger" (click)="deleteAlert(2, x.id)">Reject</button>
                </div>
              </td>
              <td class="contact">
                <a href="tel:+91{{ x.number || x.mobile_number }}">
                  <ion-icon name="call" style="font-size: 20px; color: green;"></ion-icon>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4 *ngIf="!studentarr || studentarr.length == 0" text-center style="color: #64748b; padding: 20px;">
        ఈ పరిధిలో ఎటువంటి విద్యార్థి అభ్యర్థనలు లేవు / No Students Requests
      </h4>
    </ion-card-content>
  </ion-card>
</ion-content>
"""

    with open(ts_file, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)
    print(f"[SUCCESS] Updated {ts_file}")

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_html_content)
    print(f"[SUCCESS] Updated {html_file}")

    # Also update mobile pastor.html to ensure State Leader (0) is present
    pastor_html = os.path.join(mobile_dir, "src", "pages", "pastor", "pastor.html")
    with open(pastor_html, 'r', encoding='utf-8') as f:
        p_content = f.read()
    if '<ion-option value="0">రాష్ట్ర నాయకుడు</ion-option>' not in p_content:
        p_content = p_content.replace(
            '<ion-option value="1">జిల్లా నాయకుడు</ion-option>',
            '<ion-option value="0">రాష్ట్ర నాయకుడు</ion-option>\n            <ion-option value="1">జిల్లా నాయకుడు</ion-option>'
        )
        with open(pastor_html, 'w', encoding='utf-8') as f:
            f.write(p_content)
        print(f"[SUCCESS] Added State Leader option to {pastor_html}")

update_mobile_wingcommand()


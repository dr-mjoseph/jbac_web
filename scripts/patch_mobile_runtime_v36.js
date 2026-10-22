const fs = require('fs');
const path = require('path');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

const files5js = [
  path.join(appRoot, 'www', 'build', '5.js'),
  path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', '5.js')
];

const files12js = [
  path.join(appRoot, 'www', 'build', '12.js'),
  path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', '12.js')
];

console.log('--- Patching 5.js (MeetingPage) ---');
const meetingMethods = `
    MeetingPage.prototype.formatDateString = function (dateVal) {
        if (!dateVal) return '';
        if (typeof dateVal === 'string') {
            var match = dateVal.trim().match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
            if (match) {
                return match[1] + '-' + match[2] + '-' + match[3];
            }
            var ddmmyyyy = dateVal.trim().match(/^(\\d{1,2})[\\/\\-](\\d{1,2})[\\/\\-](\\d{4})/);
            if (ddmmyyyy) {
                return ddmmyyyy[3] + '-' + ('0' + ddmmyyyy[2]).slice(-2) + '-' + ('0' + ddmmyyyy[1]).slice(-2);
            }
        }
        try {
            var d = new Date(dateVal);
            if (isNaN(d.getTime())) return '';
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + d.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        } catch (e) {
            return '';
        }
    };
    MeetingPage.prototype.isOldMeeting = function (event) {
        var today = this.formatDateString(new Date());
        if (!today || !event) return false;
        var end = this.formatDateString(event.enddate);
        var start = this.formatDateString(event.startdate || event.event_date);
        if (end) {
            return end < today;
        }
        if (start) {
            return start < today;
        }
        return false;
    };
    MeetingPage.prototype.sortEventsAscending = function (list) {
        var _this = this;
        var today = this.formatDateString(new Date());
        return list.sort(function (a, b) {
            var startA = _this.formatDateString(a.startdate || a.event_date);
            var startB = _this.formatDateString(b.startdate || b.event_date);
            var effA = (startA && startA < today) ? today : (startA || '9999-99-99');
            var effB = (startB && startB < today) ? today : (startB || '9999-99-99');
            if (effA !== effB) {
                return effA.localeCompare(effB);
            }
            if (startA !== startB) {
                return (startA || '').localeCompare(startB || '');
            }
            return Number(a.id || 0) - Number(b.id || 0);
        });
    };
    MeetingPage.prototype.setFilteredEvents = function (rawData) {
        var _this = this;
        if (!Array.isArray(rawData)) {
            this.searchevents = [];
            return;
        }
        var nonExpired = rawData
            .filter(function (item) { return item && !_this.isOldMeeting(item); })
            .map(function (item) { return (__assign({}, item, { showMore: false })); });
        this.searchevents = this.sortEventsAscending(nonExpired);
    };
`;

for (const f of files5js) {
  if (!fs.existsSync(f)) {
    console.warn('File not found: ' + f);
    continue;
  }
  let content = fs.readFileSync(f, 'utf8');

  // Insert helper methods before getdenomations
  if (!content.includes('MeetingPage.prototype.isOldMeeting')) {
    content = content.replace(
      'MeetingPage.prototype.getdenomations = function () {',
      meetingMethods + '\n    MeetingPage.prototype.getdenomations = function () {'
    );
  }

  // Replace _this.searchevents = res.data.map(...) with _this.setFilteredEvents(res.data)
  // Target each occurrence
  content = content.replace(
    /_this\.searchevents\s*=\s*res\.data\.map\(function\s*\(item\)\s*\{\s*return\s*\(__assign\(\{\},\s*item,\s*\{\s*showMore:\s*false\s*\}\)\);\s*\}\);/g,
    '_this.setFilteredEvents(res.data);'
  );

  fs.writeFileSync(f, content, 'utf8');
  console.log('Successfully patched: ' + f);
}

console.log('\n--- Patching 12.js (StudentPage) ---');
for (const f of files12js) {
  if (!fs.existsSync(f)) {
    console.warn('File not found: ' + f);
    continue;
  }
  let content = fs.readFileSync(f, 'utf8');

  // Add tmarks, mmarks, branch to studentform group if missing
  if (!content.includes("tmarks: ['']")) {
    content = content.replace(
      "talent: [''],",
      "talent: [''],\n            tmarks: [''],\n            mmarks: [''],\n            branch: [''],"
    );
  }

  // Update inline template for talent
  const oldTalentSnippet = `<ion-label stacked>ప్రతిభ</ion-label>\\s*<ion-select formControlName="talent">\\s*<ion-option value="" disabled selected>రకాన్ని ఎంచుకోండి</ion-option>\\s*<ion-option value="Speaker">వక్త</ion-option>\\s*<ion-option value="Writer">రచయిత</ion-option>\\s*<ion-option value="Singer">గాయకుడు</ion-option>\\s*<ion-option value="Others">ఇతరులు</ion-option>\\s*</ion-select>`;
  const newTalentSnippet = `<ion-label stacked>ప్రతిభ (Talent)</ion-label>
          <ion-select formControlName="talent" placeholder="మీ ప్రతిభను ఎంచుకోండి">
            <ion-option value="" disabled selected>మీ ప్రతిభను ఎంచుకోండి</ion-option>
            <ion-option value="Video editing">Video editing</ion-option>
            <ion-option value="Photo Graphy">Photo Graphy</ion-option>
            <ion-option value="Using Social Meadia">Social Meadia</ion-option>
            <ion-option value="Organiser">Organiser</ion-option>
            <ion-option value="Sound Management">Sound Management</ion-option>
            <ion-option value="Drumist">Drumist</ion-option>
            <ion-option value="Keyboard Player">Keyboard Player</ion-option>
            <ion-option value="Giving Gospel">Giving Gospel</ion-option>
            <ion-option value="Singer">Singer</ion-option>
            <ion-option value="Songs Writer">Songs Writer</ion-option>
            <ion-option value="Social Service">Social Service</ion-option>
            <ion-option value="Good in Studies">Good in Studies</ion-option>
            <ion-option value="Multy Talent">Multy Talent</ion-option>
            <ion-option value="Speaker">Speaker</ion-option>
            <ion-option value="Writer">Writer</ion-option>
            <ion-option value="Others">Others</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col col-12 col-md-6>
        <ion-item>
          <ion-label stacked>గ్రూప్ / బ్రాంచ్ (Group / Branch)</ion-label>
          <ion-input type="text" formControlName="branch" placeholder="ఉదా: MPC, BiPC, CSE, ECE"></ion-input>
        </ion-item>
      </ion-col>
      <ion-col col-12 col-md-6>
        <ion-item>
          <ion-label stacked>పరీక్షలో మీరు సాధించిన మార్కులు (Total Marks Secured)</ion-label>
          <ion-input type="text" formControlName="tmarks" placeholder="సాధించిన మార్కులు" (keypress)="numericOnly($event)"></ion-input>
        </ion-item>
      </ion-col>
      <ion-col col-12>
        <ion-item>
          <ion-label stacked>బోర్డు / యూనివర్సిటీ గరిష్ట మార్కులు (Maximum Marks Conducted)</ion-label>
          <ion-input type="text" formControlName="mmarks" placeholder="గరిష్ట మార్కులు" (keypress)="numericOnly($event)"></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col col-12>
        <ion-item style="display:none;">`;

  const talentRegex = new RegExp(oldTalentSnippet);
  if (talentRegex.test(content)) {
    content = content.replace(talentRegex, newTalentSnippet.replace(/\\/g, '\\\\').replace(/\n/g, '\\n'));
    console.log('Talent and marks snippet replaced in ' + f);
  } else {
    console.log('Talent regex did not match directly, checking if already updated');
  }

  // Update generaltype leadership options
  const oldLeadershipSnippet = `<ion-select formControlName="generaltype">\\s*<ion-option value="">జనరల్ నాయకత్వం ఎంచుకోండి</ion-option>\\s*<ion-option value="1">జిల్లా</ion-option>\\s*<ion-option value="2">సంవిధానం</ion-option>\\s*<ion-option value="3">మండలం</ion-option>\\s*<ion-option value="4">గ్రామం</ion-option>\\s*</ion-select>`;
  const newLeadershipSnippet = `<ion-select formControlName="generaltype" placeholder="జనరల్ నాయకత్వం ఎంచుకోండి">
            <ion-option value="" selected disabled>జనరల్ నాయకత్వం ఎంచుకోండి</ion-option>
            <ion-option value="State Level">రాష్ట్ర స్థాయి (State Level)</ion-option>
            <ion-option value="District Level">జిల్లా స్థాయి (District Level)</ion-option>
            <ion-option value="Constituency Level">నియోజకవర్గ స్థాయి (Constituency Level)</ion-option>
            <ion-option value="Mandal Level">మండల స్థాయి (Mandal Level)</ion-option>
            <ion-option value="Ward / Panchayati Level">వార్డు / పంచాయతీ స్థాయి (Ward / Panchayati Level)</ion-option>
            <ion-option value="Church Level">చర్చి స్థాయి (Church Level)</ion-option>
            <ion-option value="College Level">కాలేజీ స్థాయి (College Level)</ion-option>
            <ion-option value="Branch Level">బ్రాంచ్ స్థాయి (Branch Level)</ion-option>
            <ion-option value="Branch / Group Level">బ్రాంచ్ / గ్రూప్ స్థాయి (Branch / Group Level)</ion-option>
            <ion-option value="Branch / Group Year Level">బ్రాంచ్ / గ్రూప్ ఇయర్ స్థాయి (Branch / Group Year Level)</ion-option>
            <ion-option value="Section / Class Level">సెక్షన్ / క్లాస్ స్థాయి (Section / Class Level)</ion-option>
          </ion-select>`;

  const leadRegex = new RegExp(oldLeadershipSnippet);
  if (leadRegex.test(content)) {
    content = content.replace(leadRegex, newLeadershipSnippet.replace(/\\/g, '\\\\').replace(/\n/g, '\\n'));
    console.log('Leadership snippet replaced in ' + f);
  }

  fs.writeFileSync(f, content, 'utf8');
  console.log('Successfully patched: ' + f);
}

console.log('\n--- Done Patching Mobile Bundles ---');

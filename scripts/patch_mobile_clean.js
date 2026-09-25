const fs = require('fs');
const path = require('path');

const mobileRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
console.log('Patching mobile app (clean UTF-8) at:', mobileRoot);

// 1. Patch src/providers/service/service.ts
const serviceFile = path.join(mobileRoot, 'src', 'providers', 'service', 'service.ts');
if (fs.existsSync(serviceFile)) {
  let content = fs.readFileSync(serviceFile, 'utf8');
  if (content.includes("this.http.post(this.testApi + 'editpastorsassociations', data)")) {
    content = content.replace(
      "this.http.post(this.testApi + 'editpastorsassociations', data)",
      "this.http.post(this.testApi + 'editpastororgainsation', data)"
    );
    fs.writeFileSync(serviceFile, content, 'utf8');
    console.log('[SUCCESS] Updated editpastorsassociations in service.ts');
  } else {
    console.log('[INFO] service.ts already points to editpastororgainsation');
  }
}

// 2. Patch src/pages/profile/profile.ts
const profileFile = path.join(mobileRoot, 'src', 'pages', 'profile', 'profile.ts');
if (fs.existsSync(profileFile)) {
  let content = fs.readFileSync(profileFile, 'utf8');
  const startTarget = '  editbeliver() {';
  const endTarget = '\n}';
  const startIdx = content.indexOf(startTarget);
  const endIdx = content.lastIndexOf(endTarget);

  if (startIdx !== -1 && endIdx > startIdx) {
    const newMethods = `  editbeliver() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.beliverform.value, { usr_id });
    this.service.editbeliver(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  editstudent() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.studentform.value, { usr_id });
    this.service.editstudent(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  postministryupdate() {
    const usr_id = localStorage.getItem('usr_id');
    const sourceData = this.updateprofileministry ? this.updateprofileministry.value : this.ministryform.value;
    const data = Object.assign({}, this.ministryform ? this.ministryform.value : {}, sourceData, { usr_id });
    this.service.editministry(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  editchurch() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.churchregsiterform.value, { usr_id });
    this.service.editchurch(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  editpastor() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.pastorform.value, { usr_id });
    this.service.editpastor(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతముగా సబ్మిట్ అయింది / Submitted Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  editindependentorgainsation() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.independentorgainsationform.value, { usr_id });
    this.service.editindependentorgainsation(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }

  editassciation() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.pastorsassociations.value, { usr_id });
    this.service.editpastororgainsation(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేయబడింది / Updated Successfully');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి / Server error, please try again');
    });
  }
`;
    content = content.substring(0, startIdx) + newMethods + content.substring(endIdx);
    fs.writeFileSync(profileFile, content, 'utf8');
    console.log('[SUCCESS] Updated profile.ts update methods');
  } else {
    console.warn('[WARN] Could not find editbeliver() in profile.ts');
  }
}

// 3. Patch src/pages/addmeetings/addmeetings.ts
const meetingsFile = path.join(mobileRoot, 'src', 'pages', 'addmeetings', 'addmeetings.ts');
if (fs.existsSync(meetingsFile)) {
  let content = fs.readFileSync(meetingsFile, 'utf8');

  // A. Fix postmeetings payload
  const oldPayload = `      var data = {
        mettingtype: this.form.value.mettingtype,            //
        denomation: this.form.value.denomation,              //
        speakerone: this.form.value.speakerone,
        speakertwo: this.form.value.speakertwo,
        speakerthree: this.form.value.speakerthree,
        speakerfour: this.form.value.speakerfour,
        fromdate: this.form.value.fromdate,                   //
        todate: this.form.value.todate,                       //
        districtname: this.form.value.districtname,           //
        description: this.form.value.description,             //
        constituencyname: this.form.value.constituencyname,   //
        mandals: this.form.value.mandals,                     //
        village_name: this.form.value.village_name,           //
        fromtime: this.form.value.fromtime,
        totime: this.form.value.totime,
        location: this.form.value.location,             //
        address: this.form.value.address,             //
        facebook: this.form.value.facebook,             //
        youtube: this.form.value.youtube,             //
        ministry_id: this.form.value.ministry_id,
        reviewImg: this.imagesData,
        orgphone: this.form.value.orgphone,
        evntphone: this.form.value.evntphone,
        peoplecount : this.form.value.peoplecount
      }`;

  const newPayload = `      var usr_id = localStorage.getItem('usr_id') || sessionStorage.getItem('usr_id');
      var name = localStorage.getItem('name') || sessionStorage.getItem('name');
      var mobile_number = localStorage.getItem('mobile_number') || sessionStorage.getItem('mobile_number');

      var data = {
        usr_id: usr_id,
        name: name,
        mobile_number: mobile_number,
        phone: this.form.value.orgphone,
        eventcontactnumber: this.form.value.evntphone,
        meetsize: this.form.value.peoplecount,
        mettingtype: this.form.value.mettingtype,
        denomation: this.form.value.denomation,
        speakerone: this.form.value.speakerone,
        speakertwo: this.form.value.speakertwo,
        speakerthree: this.form.value.speakerthree,
        speakerfour: this.form.value.speakerfour,
        fromdate: this.form.value.fromdate,
        todate: this.form.value.todate,
        districtname: this.form.value.districtname,
        description: this.form.value.description,
        constituencyname: this.form.value.constituencyname,
        mandals: this.form.value.mandals,
        village_name: this.form.value.village_name,
        fromtime: this.form.value.fromtime,
        totime: this.form.value.totime,
        location: this.form.value.location,
        address: this.form.value.address,
        facebook: this.form.value.facebook,
        youtube: this.form.value.youtube,
        ministry_id: this.form.value.ministry_id,
        reviewImg: this.imagesData || [],
        orgphone: this.form.value.orgphone,
        evntphone: this.form.value.evntphone,
        peoplecount: this.form.value.peoplecount
      };`;

  if (content.includes(oldPayload)) {
    content = content.replace(oldPayload, newPayload);
    console.log('[SUCCESS] Replaced postmeetings payload in addmeetings.ts');
  }

  // B. Replace useCurrentLocation method
  let locStart = content.indexOf('  async useCurrentLocation(): Promise<void> {');
  if (locStart === -1) {
    locStart = content.indexOf('  useCurrentLocation(): void {');
  }
  const openphotoStart = content.indexOf('  async openphoto() {');
  if (locStart !== -1 && openphotoStart > locStart) {
    const newLocCode = `  useCurrentLocation(): void {
    const confirm = this.alertctrl.create({
      mode: 'ios',
      title: 'లొకేషన్ అనుమతి (Location Permission)',
      message: 'మీ ప్రస్తుత GPS లొకేషన్ మరియు అడ్రసును ఫారమ్‌లో నమోదు చేయడానికి అనుమతిస్తున్నారా?',
      buttons: [
        {
          text: 'రద్దు (Cancel)',
          role: 'cancel'
        },
        {
          text: 'అనుమతించు (Allow)',
          handler: () => {
            this.executeGetCurrentLocation();
          }
        }
      ]
    });
    confirm.present();
  }

  async executeGetCurrentLocation(): Promise<void> {
    this.locationError = '';
    this.locationSuccess = '';
    this.locationName = '';
    this.locationSourceMessage = '';
    this.locationLoading = true;
    if (this.cdr) {
      this.cdr.detectChanges();
    }

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
      // 1. OpenStreetMap Nominatim with addressdetails=1 for full street-level address
      try {
        const nominatimUrl = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng + '&addressdetails=1';
        const resNom = await fetch(nominatimUrl, { headers: { 'Accept': 'application/json' } });
        const dataNom = await resNom.json();
        if (dataNom) {
          if (dataNom.display_name && dataNom.display_name.trim().length > 0) {
            return dataNom.display_name.trim();
          }
          if (dataNom.address) {
            const a = dataNom.address;
            const parts = [
              a.house_number || a.building || a.amenity || '',
              a.road || a.street || '',
              a.neighbourhood || a.suburb || '',
              a.village || a.town || a.city || '',
              a.county || a.mandal || '',
              a.state_district || a.district || '',
              a.state || '',
              a.postcode || '',
              a.country || ''
            ].filter((p: string) => !!p && p.trim().length > 0);
            if (parts.length > 0) {
              return parts.join(', ');
            }
          }
        }
      } catch (e) {
        console.warn('Nominatim geocoding error:', e);
      }

      // 2. BigDataCloud full structured address fallback
      try {
        const bdcUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lng + '&localityLanguage=en';
        const res = await fetch(bdcUrl);
        const data = await res.json();
        const parts = [
          data.locality || data.name || '',
          data.city || '',
          data.principalSubdivision || '',
          data.postcode || '',
          data.countryName || ''
        ].filter((p: any) => !!p && p.trim().length > 0);
        if (parts.length > 0) {
          return parts.join(', ');
        }
      } catch (e) {
        console.warn('BigDataCloud geocoding error:', e);
      }

      return lat.toFixed(6) + ', ' + lng.toFixed(6);
    };

    const applyLocation = (lat: number, lng: number, place: string, source: string) => {
      const updateFn = () => {
        const googleUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
        this.form.patchValue({
          location: googleUrl,
          address: place
        });
        if (this.form.controls['location']) {
          this.form.controls['location'].markAsDirty();
          this.form.controls['location'].markAsTouched();
        }
        if (this.form.controls['address']) {
          this.form.controls['address'].markAsDirty();
          this.form.controls['address'].markAsTouched();
        }

        this.locationName = place;
        this.locationSuccess = 'కరెంటు లొకేషన్ విజయవంతముగా నమోదు చేయబడింది.';
        this.locationSourceMessage = source;
        this.locationLoading = false;
        if (this.cdr) {
          this.cdr.detectChanges();
        }

        const alertSuccess = this.alertctrl.create({
          mode: 'ios',
          title: 'లొకేషన్ నమోదు అయ్యింది!',
          subTitle: 'కూటములు జరిగే ప్రదేశం: ' + place,
          message: 'గూగుల్ లొకేషన్: ' + googleUrl,
          buttons: ['సరే']
        });
        alertSuccess.present();
      };

      if (this.zone) {
        this.zone.run(updateFn);
      } else {
        updateFn();
      }
    };

    const handleFailure = (reasonMsg: string) => {
      const errorFn = () => {
        this.locationLoading = false;
        this.locationError = reasonMsg;
        if (this.cdr) {
          this.cdr.detectChanges();
        }

        const alertErr = this.alertctrl.create({
          mode: 'ios',
          title: 'లొకేషన్ లోపం',
          message: reasonMsg,
          buttons: ['సరే']
        });
        alertErr.present();
      };

      if (this.zone) {
        this.zone.run(errorFn);
      } else {
        errorFn();
      }
    };

    if (!navigator.geolocation) {
      handleFailure('మీ డివైస్ లేదా బ్రౌజర్ లో GPS జియోలొకేషన్ సపోర్ట్ లేదు.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const place = await reverseGeocode(lat, lng);
        applyLocation(lat, lng, place, 'డివైస్ GPS ద్వారా ఖచ్చితమైన లొకేషన్ పొందబడింది.');
      },
      (error) => {
        let msg = 'GPS లొకేషన్ పొందడంలో సమస్య ఏర్పడింది.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'లొకేషన్ అనుమతి నిరాకరించబడింది. దయచేసి మొబైల్ లేదా బ్రౌజర్ సెట్టింగ్స్ లో లొకేషన్ ఆన్ చేసి పర్మిషన్ Allow చేయండి.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'లొకేషన్ శోధించడానికి సమయం మించిపోయింది. దయచేసి డివైస్ GPS ఆన్ లో ఉందో లేదో సరిచూసుకోండి.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS సిగ్నల్ అందుబాటులో లేదు. దయచేసి డివైస్ లో GPS లొకేషన్ ఆన్ చేయండి.';
        }
        handleFailure(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

`;
    content = content.substring(0, locStart) + newLocCode + content.substring(openphotoStart);
    console.log('[SUCCESS] Replaced useCurrentLocation method in addmeetings.ts');
  }

  fs.writeFileSync(meetingsFile, content, 'utf8');
}

// 4. Patch Network Security Config
const netConfigs = [
  path.join(mobileRoot, 'resources', 'android', 'xml', 'network_security_config.xml'),
  path.join(mobileRoot, 'platforms', 'android', 'app', 'src', 'main', 'res', 'xml', 'network_security_config.xml')
];

const netXml = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">jbac.in</domain>
        <domain includeSubdomains="true">nominatim.openstreetmap.org</domain>
        <domain includeSubdomains="true">api.bigdatacloud.net</domain>
        <domain includeSubdomains="true">ipapi.co</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
`;

for (const nc of netConfigs) {
  if (fs.existsSync(nc)) {
    fs.writeFileSync(nc, netXml, 'utf8');
    console.log('[SUCCESS] Updated network security config at', nc);
  }
}

// 5. Patch 39.js build chunks if they exist
const chunkMethodCode = fs.readFileSync(path.join(__dirname, 'patch_chunk_method.txt'), 'utf8');
const chunkFiles = [
  path.join(mobileRoot, 'www', 'build', '39.js'),
  path.join(mobileRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', '39.js')
];

for (const cf of chunkFiles) {
  if (fs.existsSync(cf)) {
    let c = fs.readFileSync(cf, 'utf8');

    // Replace useCurrentLocation implementation
    const locIdx = c.indexOf('    AddmeetingsPage.prototype.useCurrentLocation = function () {');
    const photoIdx = c.indexOf('    AddmeetingsPage.prototype.openphoto = function () {');
    if (locIdx !== -1 && photoIdx > locIdx) {
      c = c.substring(0, locIdx) + chunkMethodCode + '\n' + c.substring(photoIdx);
      console.log('[SUCCESS] Updated useCurrentLocation in chunk', cf);
    }

    // Update postmeetings payload in chunk
    const oldChunkPayload = `        else {
            var data = {
                mettingtype: this.form.value.mettingtype,
                denomation: this.form.value.denomation,
                speakerone: this.form.value.speakerone,
                speakertwo: this.form.value.speakertwo,
                speakerthree: this.form.value.speakerthree,
                speakerfour: this.form.value.speakerfour,
                fromdate: this.form.value.fromdate,
                todate: this.form.value.todate,
                districtname: this.form.value.districtname,
                description: this.form.value.description,
                constituencyname: this.form.value.constituencyname,
                mandals: this.form.value.mandals,
                village_name: this.form.value.village_name,
                fromtime: this.form.value.fromtime,
                totime: this.form.value.totime,
                location: this.form.value.location,
                address: this.form.value.address,
                facebook: this.form.value.facebook,
                youtube: this.form.value.youtube,
                ministry_id: this.form.value.ministry_id,
                reviewImg: this.imagesData,
                orgphone: this.form.value.orgphone,
                evntphone: this.form.value.evntphone,
                peoplecount: this.form.value.peoplecount
            };`;

    const newChunkPayload = `        else {
            var usr_id = localStorage.getItem('usr_id') || sessionStorage.getItem('usr_id');
            var name = localStorage.getItem('name') || sessionStorage.getItem('name');
            var mobile_number = localStorage.getItem('mobile_number') || sessionStorage.getItem('mobile_number');
            var data = {
                usr_id: usr_id,
                name: name,
                mobile_number: mobile_number,
                phone: this.form.value.orgphone,
                eventcontactnumber: this.form.value.evntphone,
                meetsize: this.form.value.peoplecount,
                mettingtype: this.form.value.mettingtype,
                denomation: this.form.value.denomation,
                speakerone: this.form.value.speakerone,
                speakertwo: this.form.value.speakertwo,
                speakerthree: this.form.value.speakerthree,
                speakerfour: this.form.value.speakerfour,
                fromdate: this.form.value.fromdate,
                todate: this.form.value.todate,
                districtname: this.form.value.districtname,
                description: this.form.value.description,
                constituencyname: this.form.value.constituencyname,
                mandals: this.form.value.mandals,
                village_name: this.form.value.village_name,
                fromtime: this.form.value.fromtime,
                totime: this.form.value.totime,
                location: this.form.value.location,
                address: this.form.value.address,
                facebook: this.form.value.facebook,
                youtube: this.form.value.youtube,
                ministry_id: this.form.value.ministry_id,
                reviewImg: this.imagesData || [],
                orgphone: this.form.value.orgphone,
                evntphone: this.form.value.evntphone,
                peoplecount: this.form.value.peoplecount
            };`;

    if (c.includes(oldChunkPayload)) {
      c = c.replace(oldChunkPayload, newChunkPayload);
      console.log('[SUCCESS] Updated postmeetings payload in chunk', cf);
    }

    fs.writeFileSync(cf, c, 'utf8');
  }
}

console.log('Mobile patching (clean UTF-8) finished successfully!');


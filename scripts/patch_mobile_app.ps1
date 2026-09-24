# PowerShell script to patch mobile app (jbac_app)
$ErrorActionPreference = "Stop"

$noBom = New-Object System.Text.UTF8Encoding($false)
$mobileRoot = "C:\Users\rajes\StudioProjects\jbac_app"
Write-Host "Patching mobile app at: $mobileRoot"

# 1. Patch src/providers/service/service.ts
$serviceFile = Join-Path $mobileRoot "src\providers\service\service.ts"
if (Test-Path $serviceFile) {
    $serviceContent = [System.IO.File]::ReadAllText($serviceFile, $noBom)
    if ($serviceContent.Contains("this.http.post(this.testApi + 'editpastorsassociations', data)")) {
        $serviceContent = $serviceContent.Replace(
            "this.http.post(this.testApi + 'editpastorsassociations', data)",
            "this.http.post(this.testApi + 'editpastororgainsation', data)"
        )
    }
    # Also strip any leading BOM if present
    $serviceContent = $serviceContent.TrimStart([char]0xFEFF)
    [System.IO.File]::WriteAllText($serviceFile, $serviceContent, $noBom)
    Write-Host "[SUCCESS] Updated editpastorsassociations in service.ts"
}

# 2. Patch src/pages/profile/profile.ts
$profileFile = Join-Path $mobileRoot "src\pages\profile\profile.ts"
if (Test-Path $profileFile) {
    $profileContent = [System.IO.File]::ReadAllText($profileFile, $noBom)
    $normProfile = $profileContent.Replace("`r`n", "`n")

    $oldMethods = @"
  editbeliver() {
    this.beliverform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editbeliver(this.beliverform.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }

  // Accept Input As a Number Only
  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  editstudent() {
    this.studentform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editstudent(this.studentform.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }

  postministryupdate() {
    this.ministryform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editministry(this.ministryform.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }

  editchurch() {
    this.churchregsiterform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editchurch(this.churchregsiterform.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }

  editpastor() {
    this.pastorform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editpastor(this.pastorform.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°®à± à°—à°¾ à°¸à°¬à± à°®à°¿à°Ÿà±  à°…à°¯à°¿à°‚à°¦à°¿')
      } else {
        alert('server down')
      }
    })
  }

  editindependentorgainsation() {
    this.independentorgainsationform.value.usr_id = localStorage.getItem('usr_id');
    this.service.editindependentorgainsation(this.independentorgainsationform.value).subscribe((res: any) => {


      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }

  editassciation() {
    this.pastorsassociations.value.usr_id = localStorage.getItem('usr_id');
    this.service.editpastorsassociations(this.pastorsassociations.value).subscribe((res: any) => {
      if (res.status == 200) {
        alert('à°µà°¿à°œà°¯à°µà°‚à°¤à°‚ à°—à°¾ à°…à°ªà±  à°¡à±‡à°Ÿà±  à°šà±‡à°¸à°¿à°¨à°¾à°°à± ')
      } else {
        alert('server down')
      }
    })
  }
"@.Replace("`r`n", "`n")

    $newMethods = @"
  editbeliver() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.beliverform.value, { usr_id });
    this.service.editbeliver(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
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
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }

  postministryupdate() {
    const usr_id = localStorage.getItem('usr_id');
    const sourceData = this.updateprofileministry ? this.updateprofileministry.value : this.ministryform.value;
    const data = Object.assign({}, this.ministryform ? this.ministryform.value : {}, sourceData, { usr_id });
    this.service.editministry(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }

  editchurch() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.churchregsiterform.value, { usr_id });
    this.service.editchurch(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }

  editpastor() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.pastorform.value, { usr_id });
    this.service.editpastor(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతముగా సబ్మిట్ అయింది');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }

  editindependentorgainsation() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.independentorgainsationform.value, { usr_id });
    this.service.editindependentorgainsation(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }

  editassciation() {
    const usr_id = localStorage.getItem('usr_id');
    const data = Object.assign({}, this.pastorsassociations.value, { usr_id });
    this.service.editpastororgainsation(data).subscribe((res: any) => {
      if (res.status == 200) {
        alert('విజయవంతంగా అప్డేట్ చేసినారు');
      } else {
        alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
      }
    }, () => {
      alert('సర్వర్ లో సమస్య ఉంది, దయచేసి తర్వాత ప్రయత్నించండి');
    });
  }
"@.Replace("`r`n", "`n")

    $idxStart = $normProfile.IndexOf("  editbeliver() {")
    $idxEnd = $normProfile.LastIndexOf("`n}")
    if ($idxStart -ge 0 -and $idxEnd -gt $idxStart) {
        $normProfile = $normProfile.Substring(0, $idxStart) + $newMethods + "`n}"
        [System.IO.File]::WriteAllText($profileFile, $normProfile.Replace("`n", "`r`n"), $noBom)
        Write-Host "[SUCCESS] Updated update methods in profile.ts"
    } else {
        Write-Host "[WARN] Could not find editbeliver() start or class end in profile.ts"
    }
}

# 3. Patch src/pages/addmeetings/addmeetings.ts
$meetingsFile = Join-Path $mobileRoot "src\pages\addmeetings\addmeetings.ts"
if (Test-Path $meetingsFile) {
    $ts = [System.IO.File]::ReadAllText($meetingsFile, $noBom)
    $normTs = $ts.Replace("`r`n", "`n")

    # Patch postmeetings payload
    $oldPayload = @"
      var data = {
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
      }
"@.Replace("`r`n", "`n")

    $newPayload = @"
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
      };
"@.Replace("`r`n", "`n")

    if ($normTs.Contains($oldPayload)) {
        $normTs = $normTs.Replace($oldPayload, $newPayload)
        Write-Host "[SUCCESS] Updated postmeetings payload in addmeetings.ts"
    }

    # Replace useCurrentLocation method with permission confirmation + Nominatim full address
    $oldLocMethodStart = "  async useCurrentLocation(): Promise<void> {"
    $openphotoStart = "  async openphoto() {"
    if ($normTs.Contains($oldLocMethodStart) -and $normTs.Contains($openphotoStart)) {
        $locIdx = $normTs.IndexOf($oldLocMethodStart)
        $photoIdx = $normTs.IndexOf($openphotoStart)
        if ($locIdx -ge 0 -and $photoIdx -gt $locIdx) {
            $newLocMethod = @"
  useCurrentLocation(): void {
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
        applyLocation(lat, lng, place, 'GPS ద్వారా ఖచ్చితమైన లొకేషన్ పొందబడింది.');
      },
      (error) => {
        let msg = 'లొకేషన్ పొందడంలో సమస్య ఏర్పడింది.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'లొకేషన్ అనుమతి నిరాకరించబడింది. దయచేసి మొబైల్ సెట్టింగ్స్ లో లొకేషన్ ఆన్ చేసి పర్మిషన్ అనుమతించండి.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'లొకేషన్ శోధించడానికి సమయం మించిపోయింది. దయచేసి డివైస్ GPS ఆన్ లో ఉందో లేదో సరిచూసుకోండి.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS సిగ్నల్ అందుబాటులో లేదు. దయచేసి లొకేషన్ ఆన్ చేయండి.';
        }
        handleFailure(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }

"@.Replace("`r`n", "`n")

            $normTs = $normTs.Substring(0, $locIdx) + $newLocMethod + $normTs.Substring($photoIdx)
            Write-Host "[SUCCESS] Replaced useCurrentLocation method in addmeetings.ts"
        }
    }

    [System.IO.File]::WriteAllText($meetingsFile, $normTs.Replace("`n", "`r`n"), $noBom)
}

# 4. Patch Network Security Config
$netConfigs = @(
    (Join-Path $mobileRoot "resources\android\xml\network_security_config.xml"),
    (Join-Path $mobileRoot "platforms\android\app\src\main\res\xml\network_security_config.xml")
)

$netXml = @"
<?xml version="1.0" encoding="utf-8"?>
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
"@.Trim()

foreach ($nc in $netConfigs) {
    if (Test-Path $nc) {
        [System.IO.File]::WriteAllText($nc, $netXml, $noBom)
        Write-Host "[SUCCESS] Updated network security config at $nc"
    }
}

Write-Host "Mobile patching finished successfully!"

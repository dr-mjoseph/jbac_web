$ErrorActionPreference = "Stop"

$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$srcDir = "$appRoot\src"
$wwwBuild = "$appRoot\www\build"
$assetsBuild = "$appRoot\platforms\android\app\src\main\assets\www\build"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Patching Mobile App for 'Select State' Cascading Support " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

function Patch-BuildFile ($fileName, [scriptblock]$transform) {
    $paths = @("$wwwBuild\$fileName", "$assetsBuild\$fileName")
    foreach ($p in $paths) {
        if (-not (Test-Path $p)) {
            Write-Warning "File not found: $p"
            continue
        }
        $content = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
        $newContent = & $transform $content
        if ($newContent -ne $content) {
            [System.IO.File]::WriteAllText($p, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "  [OK] Patched $p" -ForegroundColor Green
        } else {
            Write-Host "  [SKIP/ALREADY PATCHED] $p" -ForegroundColor DarkGray
        }
    }
}

# -----------------------------------------------------------------------------
# 1. Patch main.js (ServiceProvider.getdistrict & ServiceProvider.getstates)
# -----------------------------------------------------------------------------
Write-Host "`n[1/13] Patching main.js (ServiceProvider)..." -ForegroundColor Yellow
Patch-BuildFile "main.js" {
    param($c)
    $target = "ServiceProvider.prototype.getdistrict = function () {`r`n        return this.http.post(this.testApi + 'getdistricts', []);`r`n    };"
    $targetLF = "ServiceProvider.prototype.getdistrict = function () {`n        return this.http.post(this.testApi + 'getdistricts', []);`n    };"
    
    $replacement = @'
ServiceProvider.prototype.getstates = function () {
        return this.http.post(this.testApi + 'getstates', {});
    };
    ServiceProvider.prototype.getdistrict = function (stateId) {
        var payload = (stateId !== undefined && stateId !== null && stateId !== '' && stateId !== 'all') ? { state_id: stateId } : {};
        return this.http.post(this.testApi + 'getdistricts', payload);
    };
'@
    if ($c.Contains($target)) {
        return $c.Replace($target, $replacement)
    } elseif ($c.Contains($targetLF)) {
        return $c.Replace($targetLF, $replacement)
    } else {
        return [regex]::Replace($c, 'ServiceProvider\.prototype\.getdistrict\s*=\s*function\s*\(\)\s*\{[\s\S]*?getdistricts[\s\S]*?\};', $replacement)
    }
}

# -----------------------------------------------------------------------------
# 2. Patch JobsPage (23.js and src/pages/jobs/)
# -----------------------------------------------------------------------------
Write-Host "`n[2/13] Patching JobsPage (chunk 23.js)..." -ForegroundColor Yellow
$jobsHtmlPath = "$srcDir\pages\jobs\jobs.html"
$jobsHtml = [System.IO.File]::ReadAllText($jobsHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $jobsHtml.Contains("state_id")) {
    $pattern = '(<ion-row>[\s\r\n]*)(<ion-col col-12 col-md-3>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
$1<ion-col col-12 col-md-3>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State</ion-label>
            <ion-select formControlName="state_id" interface="popover" style="width: 273px;"
              (ionChange)="onStateChange($event)">
              <ion-option value="">అన్నీ (All States)</ion-option>
              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
              <ion-option value="2">తెలంగాణ (TG)</option>
            </ion-select>
          </ion-item>
        </ion-col>
        $2
'@
    $jobsHtml = [regex]::Replace($jobsHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($jobsHtmlPath, $jobsHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $jobsHtmlPath" -ForegroundColor Green
}

$jobsTsPath = "$srcDir\pages\jobs\jobs.ts"
$jobsTs = [System.IO.File]::ReadAllText($jobsTsPath, [System.Text.Encoding]::UTF8)
if (-not $jobsTs.Contains("onStateChange")) {
    $jobsTs = $jobsTs.Replace("jobtile: ['', [Validators.required]],", "state_id: [''],`r`n      jobtile: ['', [Validators.required]],")
    $jobsTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.searchdist = '';
    this.searchconts = '';
    this.form.patchValue({
      state_id: stateId,
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    }, (error: any) => {
      console.log(error);
    });
    if (stateId) {
      this.service.searchjobswise({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.jobs = res.data;
        }
      });
    } else {
      this.getjobs();
    }
  }

'@
    $jobsTs = $jobsTs.Replace("gotohome() {", $jobsTsMethod + "  gotohome() {")
    [System.IO.File]::WriteAllText($jobsTsPath, $jobsTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $jobsTsPath" -ForegroundColor Green
}

Patch-BuildFile "23.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12 col-md-3>\\n\\n          <ion-item>\\n\\n            <ion-label stacked>[^<]*</ion-label>\\n\\n            <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12 col-md-3>\n\n          <ion-item>\n\n            <ion-label stacked>రాష్ట్రం / State</ion-label>\n\n            <ion-select formControlName=\"state_id\" interface=\"popover\" style=\"width: 273px;\" (ionChange)=\"onStateChange($event)\">\n\n              <ion-option value=\"\">అన్నీ (All States)</ion-option>\n\n              <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = $c.Replace("jobtile: ['', [", "state_id: [''],\n            jobtile: ['', [")
    $protoMethod = @'
JobsPage.prototype.onStateChange = function (event) { var stateId = event; this.searchdist = ''; this.searchconts = ''; this.form.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }, function (error) { console.log(error); }); if (stateId) { this.service.searchjobswise({ state_id: stateId }).subscribe(function (res) { if (res && res.status == 200 && Array.isArray(res.data)) { _this.jobs = res.data; } }); } else { this.getjobs(); } };
    
'@
    $c = $c.Replace("JobsPage.prototype.gotohome = function () {", $protoMethod + "JobsPage.prototype.gotohome = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 3. Patch SearchorganisationPage (13.js and src/pages/searchorganisation/)
# -----------------------------------------------------------------------------
Write-Host "`n[3/13] Patching SearchorganisationPage (chunk 13.js)..." -ForegroundColor Yellow
$soHtmlPath = "$srcDir\pages\searchorganisation\searchorganisation.html"
$soHtml = [System.IO.File]::ReadAllText($soHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $soHtml.Contains("state_id")) {
    $pattern = '(<ion-row>[\s\r\n]*)(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
$1<ion-col col-12>
            <ion-item>
               <ion-label stacked>రాష్ట్రం / State</ion-label>
                <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
                    <ion-option value="">అన్నీ (All States)</ion-option>
                    <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
                    <ion-option value="2">తెలంగాణ (TG)</option>
                </ion-select>
            </ion-item>
        </ion-col>
        $2
'@
    $soHtml = [regex]::Replace($soHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($soHtmlPath, $soHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $soHtmlPath" -ForegroundColor Green
}

$soTsPath = "$srcDir\pages\searchorganisation\searchorganisation.ts"
$soTs = [System.IO.File]::ReadAllText($soTsPath, [System.Text.Encoding]::UTF8)
if (-not $soTs.Contains("onStateChange")) {
    $soTs = $soTs.Replace("denomation_id: [''],", "state_id: [''],`r`n      denomation_id: [''],")
    $soTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.serachMeetingform.patchValue({
      state_id: stateId,
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
    if (stateId) {
      this.service.getorganizations({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.marriagedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    } else {
      this.defaultdata();
    }
  }

'@
    $soTs = $soTs.Replace("defaultdata() {", $soTsMethod + "  defaultdata() {")
    [System.IO.File]::WriteAllText($soTsPath, $soTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $soTsPath" -ForegroundColor Green
}

Patch-BuildFile "13.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n            <ion-item>\\n\\n               <ion-label stacked>[^<]*</ion-label>\\n\\n                <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n            <ion-item>\n\n               <ion-label stacked>రాష్ట్రం / State</ion-label>\n\n                <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n                    <ion-option value=\"\">అన్నీ (All States)</ion-option>\n\n                    <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n                    <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n                </ion-select>\n\n            </ion-item>\n\n        </ion-col>\n\n        $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = $c.Replace("denomation_id: [''],", "state_id: [''],\n            denomation_id: [''],")
    $protoMethod = @'
SearchorganisationPage.prototype.onStateChange = function (event) { var stateId = event; this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); if (stateId) { this.service.getorganizations({ state_id: stateId }).subscribe(function (res) { if (res && res.status == 200 && Array.isArray(res.data)) { _this.marriagedata = res.data.map(function (item) { return Object.assign({}, item, { showMore: false }); }); } }); } else { this.defaultdata(); } };
    
'@
    $c = $c.Replace("SearchorganisationPage.prototype.defaultdata = function () {", $protoMethod + "SearchorganisationPage.prototype.defaultdata = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 4. Patch OrganisationPage (18.js and src/pages/organisation/)
# -----------------------------------------------------------------------------
Write-Host "`n[4/13] Patching OrganisationPage (chunk 18.js)..." -ForegroundColor Yellow
$orgHtmlPath = "$srcDir\pages\organisation\organisation.html"
$orgHtml = [System.IO.File]::ReadAllText($orgHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $orgHtml.Contains("state_id")) {
    $pattern = '(<ion-card>[\s\r\n]*<p>[^<]*</p>[\s\r\n]*<ion-row>[\s\r\n]*)(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="districts")'
    $replacementHtml = @'
$1<ion-col col-12>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
              <ion-option value="2">తెలంగాణ (TG)</option>
            </ion-select>
          </ion-item>
        </ion-col>
        $2
'@
    $orgHtml = [regex]::Replace($orgHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($orgHtmlPath, $orgHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $orgHtmlPath" -ForegroundColor Green
}

$orgTsPath = "$srcDir\pages\organisation\organisation.ts"
$orgTs = [System.IO.File]::ReadAllText($orgTsPath, [System.Text.Encoding]::UTF8)
if (-not $orgTs.Contains("onStateChange")) {
    $orgTs = $orgTs.Replace("districts: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      districts: ['', [Validators.required]],")
    $orgTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      districts: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $orgTs = $orgTs.Replace("getorgnaziationpstorsget() {", $orgTsMethod + "  getorgnaziationpstorsget() {")
    [System.IO.File]::WriteAllText($orgTsPath, $orgTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $orgTsPath" -ForegroundColor Green
}

Patch-BuildFile "18.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n          <ion-item>\\n\\n            <ion-label stacked>[^<]*</ion-label>\\n\\n            <ion-select formControlName=\\"districts\\")'
    $tplInject = @'
<ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n            <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n              <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'districts:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1'', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],\n            districts: ['''', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
OrganisationPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, districts: '', constituencyname: '', mandals: '', panchayati: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("OrganisationPage.prototype.getorgnaziationpstorsget = function () {", $protoMethod + "OrganisationPage.prototype.getorgnaziationpstorsget = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 5. Patch PastorPage (16.js and src/pages/pastor/)
# -----------------------------------------------------------------------------
Write-Host "`n[5/13] Patching PastorPage (chunk 16.js)..." -ForegroundColor Yellow
$pastorHtmlPath = "$srcDir\pages\pastor\pastor.html"
$pastorHtml = [System.IO.File]::ReadAllText($pastorHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $pastorHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
<ion-col col-12>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
              <ion-option value="2">తెలంగాణ (TG)</option>
            </ion-select>
          </ion-item>
        </ion-col>
        $1
'@
    $pastorHtml = [regex]::Replace($pastorHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($pastorHtmlPath, $pastorHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $pastorHtmlPath" -ForegroundColor Green
}

$pastorTsPath = "$srcDir\pages\pastor\pastor.ts"
$pastorTs = [System.IO.File]::ReadAllText($pastorTsPath, [System.Text.Encoding]::UTF8)
if (-not $pastorTs.Contains("onStateChange")) {
    $pastorTs = $pastorTs.Replace("district_id: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      district_id: ['', [Validators.required]],")
    $pastorTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayat_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $pastorTs = $pastorTs.Replace("ionViewDidLoad() {", $pastorTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($pastorTsPath, $pastorTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $pastorTsPath" -ForegroundColor Green
}

Patch-BuildFile "16.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n          <ion-item>\\n\\n            <ion-label stacked>[^<]*</ion-label>\\n\\n            <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n            <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n              <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1'', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
PastorPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '', panchayat_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("PastorPage.prototype.ionViewDidLoad = function () {", $protoMethod + "PastorPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 6. Patch ChurchPage (35.js and src/pages/church/)
# -----------------------------------------------------------------------------
Write-Host "`n[6/13] Patching ChurchPage (chunk 35.js)..." -ForegroundColor Yellow
$churchHtmlPath = "$srcDir\pages\church\church.html"
$churchHtml = [System.IO.File]::ReadAllText($churchHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $churchHtml.Contains("state_id")) {
    $pattern = '(<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
<ion-item>
          <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
        $1
'@
    $churchHtml = [regex]::Replace($churchHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($churchHtmlPath, $churchHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $churchHtmlPath" -ForegroundColor Green
}

$churchTsPath = "$srcDir\pages\church\church.ts"
$churchTs = [System.IO.File]::ReadAllText($churchTsPath, [System.Text.Encoding]::UTF8)
if (-not $churchTs.Contains("onStateChange")) {
    $churchTs = $churchTs.Replace("district_id: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      district_id: ['', [Validators.required]],")
    $churchTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $churchTs = $churchTs.Replace("ionViewDidLoad() {", $churchTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($churchTsPath, $churchTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $churchTsPath" -ForegroundColor Green
}

Patch-BuildFile "35.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n        $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1'', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
ChurchPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '', panchayati_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("ChurchPage.prototype.ionViewDidLoad = function () {", $protoMethod + "ChurchPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 7. Patch AssociationPage (38.js and src/pages/association/)
# -----------------------------------------------------------------------------
Write-Host "`n[7/13] Patching AssociationPage (chunk 38.js)..." -ForegroundColor Yellow
$assocHtmlPath = "$srcDir\pages\association\association.html"
$assocHtml = [System.IO.File]::ReadAllText($assocHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $assocHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
<ion-col col-12>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
      </ion-col>
      $1
'@
    $assocHtml = [regex]::Replace($assocHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($assocHtmlPath, $assocHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $assocHtmlPath" -ForegroundColor Green
}

$assocTsPath = "$srcDir\pages\association\association.ts"
$assocTs = [System.IO.File]::ReadAllText($assocTsPath, [System.Text.Encoding]::UTF8)
if (-not $assocTs.Contains("onStateChange")) {
    $assocTs = $assocTs.Replace("district_id: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      district_id: ['', [Validators.required]],")
    $assocTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      district_id: '',
      constituency_id: '',
      mandal_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $assocTs = $assocTs.Replace("ionViewDidLoad() {", $assocTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($assocTsPath, $assocTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $assocTsPath" -ForegroundColor Green
}

Patch-BuildFile "38.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1'', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
AssociationPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("AssociationPage.prototype.ionViewDidLoad = function () {", $protoMethod + "AssociationPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 8. Patch SearchhousePage (14.js and src/pages/searchhouse/)
# -----------------------------------------------------------------------------
Write-Host "`n[8/13] Patching SearchhousePage (chunk 14.js)..." -ForegroundColor Yellow
$shHtmlPath = "$srcDir\pages\searchhouse\searchhouse.html"
$shHtml = [System.IO.File]::ReadAllText($shHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $shHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
<ion-col col-12>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State</ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="">అన్నీ (All States)</ion-option>
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
      </ion-col>
      $1
'@
    $shHtml = [regex]::Replace($shHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($shHtmlPath, $shHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $shHtmlPath" -ForegroundColor Green
}

$shTsPath = "$srcDir\pages\searchhouse\searchhouse.ts"
$shTs = [System.IO.File]::ReadAllText($shTsPath, [System.Text.Encoding]::UTF8)
if (-not $shTs.Contains("onStateChange")) {
    $shTs = $shTs.Replace("district_id: ['', [Validators.required]],", "state_id: [''],`r`n      district_id: ['', [Validators.required]],")
    $shTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.serachMeetingform.patchValue({
      state_id: stateId,
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $shTs = $shTs.Replace("ionViewDidLoad() {", $shTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($shTsPath, $shTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $shTsPath" -ForegroundColor Green
}

Patch-BuildFile "14.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State</ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"\">అన్నీ (All States)</ion-option>\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''''],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
SearchhousePage.prototype.onStateChange = function (event) { var stateId = event; this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("SearchhousePage.prototype.ionViewDidLoad = function () {", $protoMethod + "SearchhousePage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 9. Patch MarriagePage (22.js and src/pages/marriage/)
# -----------------------------------------------------------------------------
Write-Host "`n[9/13] Patching MarriagePage (chunk 22.js)..." -ForegroundColor Yellow
$mrgHtmlPath = "$srcDir\pages\marriage\marriage.html"
$mrgHtml = [System.IO.File]::ReadAllText($mrgHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $mrgHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="district_id")'
    $replacementHtml = @'
<ion-col col-12>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State</ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="">అన్నీ (All States)</ion-option>
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
      </ion-col>
      $1
'@
    $mrgHtml = [regex]::Replace($mrgHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($mrgHtmlPath, $mrgHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $mrgHtmlPath" -ForegroundColor Green
}

$mrgTsPath = "$srcDir\pages\marriage\marriage.ts"
$mrgTs = [System.IO.File]::ReadAllText($mrgTsPath, [System.Text.Encoding]::UTF8)
if (-not $mrgTs.Contains("onStateChange")) {
    $mrgTs = $mrgTs.Replace("district_id: ['', [Validators.required]],", "state_id: [''],`r`n      district_id: ['', [Validators.required]],")
    $mrgTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      district_id: '',
      constenncy_id: '',
      mandal_id: '',
      panchayati_id: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $mrgTs = $mrgTs.Replace("ionViewDidLoad() {", $mrgTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($mrgTsPath, $mrgTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $mrgTsPath" -ForegroundColor Green
}

Patch-BuildFile "22.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State</ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"\">అన్నీ (All States)</ion-option>\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''''],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
MarriagePage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("MarriagePage.prototype.ionViewDidLoad = function () {", $protoMethod + "MarriagePage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 10. Patch AddjobsPage (41.js and src/pages/addjobs/)
# -----------------------------------------------------------------------------
Write-Host "`n[10/13] Patching AddjobsPage (chunk 41.js)..." -ForegroundColor Yellow
$addjHtmlPath = "$srcDir\pages\addjobs\addjobs.html"
$addjHtml = [System.IO.File]::ReadAllText($addjHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $addjHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="districtname")'
    $replacementHtml = @'
<ion-col col-12>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
      </ion-col>
      $1
'@
    $addjHtml = [regex]::Replace($addjHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($addjHtmlPath, $addjHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $addjHtmlPath" -ForegroundColor Green
}

$addjTsPath = "$srcDir\pages\addjobs\addjobs.ts"
$addjTs = [System.IO.File]::ReadAllText($addjTsPath, [System.Text.Encoding]::UTF8)
if (-not $addjTs.Contains("onStateChange")) {
    $addjTs = $addjTs.Replace("districtname: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      districtname: ['', [Validators.required]],")
    $addjTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.jobsadding.patchValue({
      state_id: stateId,
      districtname: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $addjTs = $addjTs.Replace("ionViewDidLoad() {", $addjTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($addjTsPath, $addjTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $addjTsPath" -ForegroundColor Green
}

Patch-BuildFile "41.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"districtname\\")'
    $tplInject = @'
<ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'districtname:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1'', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],\n            districtname: ['''', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
AddjobsPage.prototype.onStateChange = function (event) { var stateId = event; this.jobsadding.patchValue({ state_id: stateId, districtname: '', constituencyname: '', mandals: '', panchayati: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("AddjobsPage.prototype.ionViewDidLoad = function () {", $protoMethod + "AddjobsPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 11. Patch BelieverPage (37.js and src/pages/believer/)
# -----------------------------------------------------------------------------
Write-Host "`n[11/13] Patching BelieverPage (chunk 37.js)..." -ForegroundColor Yellow
$belHtmlPath = "$srcDir\pages\believer\believer.html"
$belHtml = [System.IO.File]::ReadAllText($belHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $belHtml.Contains("state_id")) {
    $pattern = '(<ion-col col-12 col-md-6>[\s\r\n]*<ion-item>[\s\r\n]*<ion-label stacked>[^<]*</ion-label>[\s\r\n]*<ion-select formControlName="districts")'
    $replacementHtml = @'
<ion-col col-12 col-md-6>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
      </ion-col>
      $1
'@
    $belHtml = [regex]::Replace($belHtml, $pattern, $replacementHtml)
    [System.IO.File]::WriteAllText($belHtmlPath, $belHtml, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $belHtmlPath" -ForegroundColor Green
}

$belTsPath = "$srcDir\pages\believer\believer.ts"
$belTs = [System.IO.File]::ReadAllText($belTsPath, [System.Text.Encoding]::UTF8)
if (-not $belTs.Contains("onStateChange")) {
    $belTs = $belTs.Replace("districts: ['', Validators.required],", "state_id: ['1', Validators.required],`r`n      districts: ['', Validators.required],")
    $belTsMethod = @'

  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      districts: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getdistrict(stateId).subscribe((res: any) => {
      if (res && res.status == 200) {
        this.districts = res.data;
      }
    });
  }

'@
    $belTs = $belTs.Replace("ionViewDidLoad() {", $belTsMethod + "  ionViewDidLoad() {")
    [System.IO.File]::WriteAllText($belTsPath, $belTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Patched $belTsPath" -ForegroundColor Green
}

Patch-BuildFile "37.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12 col-md-6>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"districts\\")'
    $tplInject = @'
<ion-col col-12 col-md-6>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'districts:\s*\[\s*[''"]{2}\s*,\s*__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /\* Validators \*/]\.required\]', 'state_id: [''1'', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required],\n            districts: ['''', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]')
    $protoMethod = @'
BelieverPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, districts: '', constituencyname: '', mandals: '', panchayati: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("BelieverPage.prototype.ionViewDidLoad = function () {", $protoMethod + "BelieverPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 12. Patch StudentPage (12.js)
# -----------------------------------------------------------------------------
Write-Host "`n[12/13] Patching StudentPage (chunk 12.js)..." -ForegroundColor Yellow
Patch-BuildFile "12.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n        <ion-item>\\n          <ion-label stacked>[^<]*</ion-label>\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n        <ion-item>\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n          </ion-select>\n        </ion-item>\n      </ion-col>\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /\* Validators \*/]\.required\]\]', 'state_id: [''1''],\n            district_id: ['''', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]]')
    $protoMethod = @'
StudentPage.prototype.onStateChange = function (event) { var stateId = event; this.studentform.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '', panchayat_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("StudentPage.prototype.ionViewDidLoad = function () {", $protoMethod + "StudentPage.prototype.ionViewDidLoad = function () {")
    return $c
}

# -----------------------------------------------------------------------------
# 13. Patch EntryFormPage (32.js)
# -----------------------------------------------------------------------------
Write-Host "`n[13/13] Patching EntryFormPage (chunk 32.js)..." -ForegroundColor Yellow
Patch-BuildFile "32.js" {
    param($c)
    if ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"')) {
        return $c
    }
    $tplTarget = '(<ion-col col-12>\\n\\n        <ion-item>\\n\\n          <ion-label stacked>[^<]*</ion-label>\\n\\n          <ion-select formControlName=\\"district_id\\")'
    $tplInject = @'
<ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State <span style=\"color:red;\">*</span></ion-label>\n\n          <ion-select formControlName=\"state_id\" (ionChange)=\"onStateChange($event)\">\n\n            <ion-option value=\"1\">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n            <ion-option value=\"2\">తెలంగాణ (TG)</option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      $1
'@
    $c = [regex]::Replace($c, $tplTarget, $tplInject)
    $c = [regex]::Replace($c, 'district_id:\s*\[\s*[''"]{2}\s*,\s*__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /\* Validators \*/]\.required\]', 'state_id: [''1'', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],\n            district_id: ['''', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]')
    $protoMethod = @'
EntryFormPage.prototype.onStateChange = function (event) { var stateId = event; this.form.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '', panchayat_id: '' }); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };
    
'@
    $c = $c.Replace("EntryFormPage.prototype.ionViewDidLoad = function () {", $protoMethod + "EntryFormPage.prototype.ionViewDidLoad = function () {")
    return $c
}

Write-Host "`nAll patches applied successfully!" -ForegroundColor Green

$ErrorActionPreference = "Stop"

$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$srcDir = "$appRoot\src"
$locs = @(
    "$appRoot\www\build",
    "$appRoot\platforms\android\app\src\main\assets\www\build"
)

# Telugu Unicode strings
$rashtram = [regex]::Unescape("\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02")
$anni = [regex]::Unescape("\u0C05\u0C28\u0C4D\u0C28\u0C40")
$ap = [regex]::Unescape("\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D")
$tg = [regex]::Unescape("\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23")

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Applying Clean Patches for 'Select State' Support       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# -----------------------------------------------------------------------------
# 1. Patch main.js (ServiceProvider)
# -----------------------------------------------------------------------------
Write-Host "`n[1] Updating ServiceProvider in main.js..." -ForegroundColor Yellow
$mainTarget = "ServiceProvider.prototype.getdistrict = function () {`n        return this.http.post(this.testApi + 'getdistricts', []);`n    };"
$mainTargetCRLF = "ServiceProvider.prototype.getdistrict = function () {`r`n        return this.http.post(this.testApi + 'getdistricts', []);`r`n    };"

$mainReplacement = @"
ServiceProvider.prototype.getstates = function () {
        return this.http.post(this.testApi + 'getstates', {});
    };
    ServiceProvider.prototype.getdistrict = function (stateId) {
        var payload = (stateId !== undefined && stateId !== null && stateId !== '' && stateId !== 'all') ? { state_id: stateId } : {};
        return this.http.post(this.testApi + 'getdistricts', payload);
    };
"@

foreach ($loc in $locs) {
    $p = "$loc\main.js"
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    if (-not $c.Contains("state_id: stateId")) {
        if ($c.Contains($mainTargetCRLF)) {
            $c = $c.Replace($mainTargetCRLF, $mainReplacement)
        } elseif ($c.Contains($mainTarget)) {
            $c = $c.Replace($mainTarget, $mainReplacement)
        } else {
            $c = [regex]::Replace($c, 'ServiceProvider\.prototype\.getdistrict\s*=\s*function\s*\(\)\s*\{[\s\S]*?getdistricts[\s\S]*?\};', $mainReplacement)
        }
        [System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
        Write-Host "  [OK] Updated $p" -ForegroundColor Green
    } else {
        Write-Host "  [ALREADY UPDATED] $p" -ForegroundColor DarkGray
    }
}

# -----------------------------------------------------------------------------
# Helper function to patch a chunk
# -----------------------------------------------------------------------------
function Patch-Chunk ($chunkFile, $className, $distField, $isSearch, $colClass) {
    Write-Host "  Patching $className ($chunkFile)..." -ForegroundColor Yellow
    
    foreach ($loc in $locs) {
        $p = "$loc\$chunkFile"
        if (-not (Test-Path $p)) { continue }
        $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
        
        # 1. Template Patch
        if (-not $c.Contains('formControlName="state_id"')) {
            $searchStr = 'formControlName="' + $distField + '"'
            $idxSelect = $c.IndexOf($searchStr)
            if ($idxSelect -gt 0) {
                $idxCol = $c.LastIndexOf('<ion-col', $idxSelect)
                $idxItem = $c.LastIndexOf('<ion-item', $idxSelect)
                
                # If there is intervening content like a heading/list (35.js, 32.js), use item level
                $useItemLevel = ($chunkFile -eq "35.js" -or $chunkFile -eq "32.js")
                $insertPos = if ($useItemLevel) { $idxItem } else { $idxCol }
                
                $options = if ($isSearch) {
                    '\n\n              <ion-option value="">' + $anni + ' (All States)</ion-option>\n\n              <ion-option value="1">' + $ap + ' (AP)</ion-option>\n\n              <ion-option value="2">' + $tg + ' (TG)</ion-option>'
                } else {
                    '\n\n              <ion-option value="1">' + $ap + ' (AP)</ion-option>\n\n              <ion-option value="2">' + $tg + ' (TG)</ion-option>'
                }
                
                $reqStar = if ($isSearch) { '' } else { ' <span style="color:red; ">*</span>' }
                
                $stateHtml = if ($useItemLevel) {
                    '<ion-item>\n\n          <ion-label stacked>' + $rashtram + ' / State' + $reqStar + '</ion-label>\n\n          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + $options + '\n\n          </ion-select>\n\n        </ion-item>\n\n        '
                } else {
                    '<' + $colClass + '>\n\n          <ion-item>\n\n            <ion-label stacked>' + $rashtram + ' / State' + $reqStar + '</ion-label>\n\n            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + $options + '\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        '
                }
                
                $c = $c.Substring(0, $insertPos) + $stateHtml + $c.Substring($insertPos)
            }
        }
        
        # 2. FormBuilder Patch
        if (-not ($c.Contains("state_id: ['") -or $c.Contains("state_id: ["))) {
            $m = [regex]::Match($c, "$($distField)\s*:\s*\[")
            if ($m.Success) {
                $idxDistForm = $m.Index
                $defaultVal = if ($isSearch) { "['']" } else { "['1']" }
                $formInject = 'state_id: ' + $defaultVal + ",\n            "
                $c = $c.Substring(0, $idxDistForm) + $formInject + $c.Substring($idxDistForm)
            }
        }
        
        # 3. Prototype Patch
        if (-not $c.Contains($className + '.prototype.onStateChange')) {
            $protoSearch = $className + '.prototype.'
            $idxProto = $c.IndexOf($protoSearch)
            if ($idxProto -gt 0) {
                $protoMethod = $className + '.prototype.onStateChange = function (event) {
        var stateId = event;
        if (this.searchdist !== undefined) this.searchdist = "";
        if (this.searchconts !== undefined) this.searchconts = "";
        var patchObj = { state_id: stateId };
        patchObj["' + $distField + '"] = "";
        if (this.form) this.form.patchValue(patchObj);
        if (this.serachMeetingform) this.serachMeetingform.patchValue(patchObj);
        if (this.jobsadding) this.jobsadding.patchValue(patchObj);
        if (this.studentform) this.studentform.patchValue(patchObj);
        this.districts = [];
        this.constituency = [];
        this.mandals = [];
        this.panchayati = [];
        var _this = this;
        this.service.getdistrict(stateId).subscribe(function (res) {
            if (res && res.status == 200) {
                _this.districts = res.data;
            }
        }, function (error) {
            console.log(error);
        });
        if (this.getjobs) {
            if (stateId && this.service.searchjobswise) {
                this.service.searchjobswise({ state_id: stateId }).subscribe(function (res) {
                    if (res && res.status == 200 && Array.isArray(res.data)) {
                        _this.jobs = res.data;
                    }
                });
            } else {
                this.getjobs();
            }
        }
        if (this.defaultdata) {
            if (stateId && this.service.getorganizations) {
                this.service.getorganizations({ state_id: stateId }).subscribe(function (res) {
                    if (res && res.status == 200 && Array.isArray(res.data)) {
                        _this.marriagedata = res.data.map(function (item) { return Object.assign({}, item, { showMore: false }); });
                    }
                });
            } else {
                this.defaultdata();
            }
        }
    };
    '
                $c = $c.Substring(0, $idxProto) + $protoMethod + $c.Substring($idxProto)
            }
        }
        
        [System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
        Write-Host "    [OK] Updated $p" -ForegroundColor Green
    }
}

# -----------------------------------------------------------------------------
# 2. Patch all target chunks
# -----------------------------------------------------------------------------
Write-Host "`n[2] Updating Chunks..." -ForegroundColor Yellow
Patch-Chunk "23.js" "JobsPage" "district_id" $true "ion-col col-12 col-md-3"
Patch-Chunk "13.js" "SearchorganisationPage" "district_id" $true "ion-col col-12"
Patch-Chunk "18.js" "OrganisationPage" "districts" $false "ion-col col-12"
Patch-Chunk "16.js" "PastorPage" "district_id" $false "ion-col col-12"
Patch-Chunk "35.js" "ChurchPage" "district_id" $false "ion-col col-12"
Patch-Chunk "38.js" "AssociationPage" "district_id" $false "ion-col col-12"
Patch-Chunk "14.js" "SearchhousePage" "district_id" $true "ion-col col-12"
Patch-Chunk "22.js" "MarriagePage" "district_id" $true "ion-col col-12"
Patch-Chunk "41.js" "AddjobsPage" "districtname" $false "ion-col col-12"
Patch-Chunk "37.js" "BelieverPage" "districts" $false "ion-col col-12 col-md-6"
Patch-Chunk "12.js" "StudentPage" "district_id" $false "ion-col col-12"
Patch-Chunk "32.js" "EntryFormPage" "district_id" $false "ion-col col-12"

# -----------------------------------------------------------------------------
# 3. Patch Source HTML & TS for Jobs, Searchorganisation, Organisation
# -----------------------------------------------------------------------------
Write-Host "`n[3] Updating Source files..." -ForegroundColor Yellow

# Jobs HTML & TS
$jobsHtmlPath = "$srcDir\pages\jobs\jobs.html"
$jHtml = [System.IO.File]::ReadAllText($jobsHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $jHtml.Contains('formControlName="state_id"')) {
    $idx = $jHtml.IndexOf('formControlName="district_id"')
    if ($idx -gt 0) {
        $idxCol = $jHtml.LastIndexOf('<ion-col', $idx)
        $stateSnippet = '<ion-col col-12 col-md-3>
          <ion-item>
            <ion-label stacked>' + $rashtram + ' / State</ion-label>
            <ion-select formControlName="state_id" interface="popover" style="width: 273px;"
              (ionChange)="onStateChange($event)">
              <ion-option value="">' + $anni + ' (All States)</ion-option>
              <ion-option value="1">' + $ap + ' (AP)</ion-option>
              <ion-option value="2">' + $tg + ' (TG)</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
        '
        $jHtml = $jHtml.Substring(0, $idxCol) + $stateSnippet + $jHtml.Substring($idxCol)
        [System.IO.File]::WriteAllText($jobsHtmlPath, $jHtml, [System.Text.Encoding]::UTF8)
        Write-Host "  [OK] Source $jobsHtmlPath" -ForegroundColor Green
    }
}

$jobsTsPath = "$srcDir\pages\jobs\jobs.ts"
$jTs = [System.IO.File]::ReadAllText($jobsTsPath, [System.Text.Encoding]::UTF8)
if (-not $jTs.Contains("onStateChange")) {
    $jTs = $jTs.Replace("jobtile: ['', [Validators.required]],", "state_id: [''],`r`n      jobtile: ['', [Validators.required]],")
    $jTsMethod = '
  onStateChange(event: any) {
    var stateId = event;
    this.searchdist = "";
    this.searchconts = "";
    this.form.patchValue({
      state_id: stateId,
      district_id: "",
      constenncy_id: "",
      mandal_id: "",
      panchayati_id: ""
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
'
    $jTs = $jTs.Replace("gotohome() {", $jTsMethod + "`r`n  gotohome() {")
    [System.IO.File]::WriteAllText($jobsTsPath, $jTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Source $jobsTsPath" -ForegroundColor Green
}

# Searchorganisation HTML & TS
$soHtmlPath = "$srcDir\pages\searchorganisation\searchorganisation.html"
$soHtml = [System.IO.File]::ReadAllText($soHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $soHtml.Contains('formControlName="state_id"')) {
    $idx = $soHtml.IndexOf('formControlName="district_id"')
    if ($idx -gt 0) {
        $idxCol = $soHtml.LastIndexOf('<ion-col', $idx)
        $stateSnippet = '<ion-col col-12>
            <ion-item>
               <ion-label stacked>' + $rashtram + ' / State</ion-label>
                <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
                    <ion-option value="">' + $anni + ' (All States)</ion-option>
                    <ion-option value="1">' + $ap + ' (AP)</ion-option>
                    <ion-option value="2">' + $tg + ' (TG)</ion-option>
                </ion-select>
            </ion-item>
        </ion-col>
        '
        $soHtml = $soHtml.Substring(0, $idxCol) + $stateSnippet + $soHtml.Substring($idxCol)
        [System.IO.File]::WriteAllText($soHtmlPath, $soHtml, [System.Text.Encoding]::UTF8)
        Write-Host "  [OK] Source $soHtmlPath" -ForegroundColor Green
    }
}

$soTsPath = "$srcDir\pages\searchorganisation\searchorganisation.ts"
$soTs = [System.IO.File]::ReadAllText($soTsPath, [System.Text.Encoding]::UTF8)
if (-not $soTs.Contains("onStateChange")) {
    $soTs = $soTs.Replace("denomation_id: [''],", "state_id: [''],`r`n      denomation_id: [''],")
    $soTsMethod = '
  onStateChange(event: any) {
    var stateId = event;
    this.serachMeetingform.patchValue({
      state_id: stateId,
      district_id: "",
      constenncy_id: "",
      mandal_id: "",
      panchayati_id: ""
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
'
    $soTs = $soTs.Replace("defaultdata() {", $soTsMethod + "`r`n  defaultdata() {")
    [System.IO.File]::WriteAllText($soTsPath, $soTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Source $soTsPath" -ForegroundColor Green
}

# Organisation HTML & TS
$orgHtmlPath = "$srcDir\pages\organisation\organisation.html"
$orgHtml = [System.IO.File]::ReadAllText($orgHtmlPath, [System.Text.Encoding]::UTF8)
if (-not $orgHtml.Contains('formControlName="state_id"')) {
    $idx = $orgHtml.IndexOf('formControlName="districts"')
    if ($idx -gt 0) {
        $idxCol = $orgHtml.LastIndexOf('<ion-col', $idx)
        $stateSnippet = '<ion-col col-12>
          <ion-item>
            <ion-label stacked>' + $rashtram + ' / State <span style="color:red; ">*</span></ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option value="1">' + $ap + ' (AP)</ion-option>
              <ion-option value="2">' + $tg + ' (TG)</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
        '
        $orgHtml = $orgHtml.Substring(0, $idxCol) + $stateSnippet + $orgHtml.Substring($idxCol)
        [System.IO.File]::WriteAllText($orgHtmlPath, $orgHtml, [System.Text.Encoding]::UTF8)
        Write-Host "  [OK] Source $orgHtmlPath" -ForegroundColor Green
    }
}

$orgTsPath = "$srcDir\pages\organisation\organisation.ts"
$orgTs = [System.IO.File]::ReadAllText($orgTsPath, [System.Text.Encoding]::UTF8)
if (-not $orgTs.Contains("onStateChange")) {
    $orgTs = $orgTs.Replace("districts: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],`r`n      districts: ['', [Validators.required]],")
    $orgTsMethod = '
  onStateChange(event: any) {
    var stateId = event;
    this.form.patchValue({
      state_id: stateId,
      districts: "",
      constituencyname: "",
      mandals: "",
      panchayati: ""
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
'
    $orgTs = $orgTs.Replace("getorgnaziationpstorsget() {", $orgTsMethod + "`r`n  getorgnaziationpstorsget() {")
    [System.IO.File]::WriteAllText($orgTsPath, $orgTs, [System.Text.Encoding]::UTF8)
    Write-Host "  [OK] Source $orgTsPath" -ForegroundColor Green
}

Write-Host "`nAll clean patches applied successfully!" -ForegroundColor Green

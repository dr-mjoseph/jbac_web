function Patch-ChunkFile ($filePath, $className, $distField, $isSearch) {
    $c = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    
    # Check if already patched
    if ($c.Contains('formControlName="state_id"') -or $c.Contains("onStateChange = function")) {
        Write-Host "Already patched: $filePath" -ForegroundColor DarkGray
        return
    }

    # 1. Patch Template: find formControlName="$distField"
    $searchStr = 'formControlName="' + $distField + '"'
    $idxSelect = $c.IndexOf($searchStr)
    if ($idxSelect -lt 0) {
        Write-Error "Could not find $searchStr in $filePath"
        return
    }
    
    # Find nearest preceding <ion-col or <ion-item
    $idxCol = $c.LastIndexOf('<ion-col', $idxSelect)
    $idxItem = $c.LastIndexOf('<ion-item', $idxSelect)
    $insertPos = if ($idxCol -gt 0 -and $idxCol -gt ($idxSelect - 500)) { $idxCol } else { $idxItem }
    
    $optionsHtml = if ($isSearch) {
        '\n\n              <ion-option value="">అన్నీ (All States)</ion-option>\n\n              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value="2">తెలంగాణ (TG)</option>'
    } else {
        '\n\n              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value="2">తెలంగాణ (TG)</option>'
    }
    
    $reqStar = if ($isSearch) { '' } else { ' <span style="color:red; ">*</span>' }
    
    $stateCol = if ($insertPos -eq $idxCol) {
        '<ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>రాష్ట్రం / State' + $reqStar + '</ion-label>\n\n            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + $optionsHtml + '\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        '
    } else {
        '<ion-item>\n\n          <ion-label stacked>రాష్ట్రం / State' + $reqStar + '</ion-label>\n\n          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + $optionsHtml + '\n\n          </ion-select>\n\n        </ion-item>\n\n        '
    }
    
    $c = $c.Substring(0, $insertPos) + $stateCol + $c.Substring($insertPos)
    
    # 2. Patch FormBuilder group: find $distField + ":"
    $idxDistForm = $c.IndexOf($distField + ":")
    if ($idxDistForm -gt 0) {
        $defaultVal = if ($isSearch) { "['']" } else { "['1']" }
        $formInject = "state_id: $defaultVal,\n            "
        $c = $c.Substring(0, $idxDistForm) + $formInject + $c.Substring($idxDistForm)
    }
    
    # 3. Patch Prototype method
    $protoSearch = $className + '.prototype.'
    $idxProto = $c.IndexOf($protoSearch)
    if ($idxProto -gt 0) {
        $protoMethod = $className + '.prototype.onStateChange = function (event) { var stateId = event; if (this.searchdist !== undefined) this.searchdist = ""; if (this.searchconts !== undefined) this.searchconts = ""; var patchObj = { state_id: stateId }; patchObj["' + $distField + '"] = ""; if (this.form) this.form.patchValue(patchObj); if (this.serachMeetingform) this.serachMeetingform.patchValue(patchObj); if (this.jobsadding) this.jobsadding.patchValue(patchObj); if (this.studentform) this.studentform.patchValue(patchObj); this.districts = []; this.constituency = []; this.mandals = []; this.panchayati = []; var _this = this; this.service.getdistrict(stateId).subscribe(function (res) { if (res && res.status == 200) { _this.districts = res.data; } }); };\n    '
        $c = $c.Substring(0, $idxProto) + $protoMethod + $c.Substring($idxProto)
    }
    
    [System.IO.File]::WriteAllText($filePath, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully patched: $filePath" -ForegroundColor Green
}

# Test on 18.js
Patch-ChunkFile "C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js" "OrganisationPage" "districts" $false

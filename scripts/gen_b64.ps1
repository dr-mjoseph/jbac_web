$searchStr = @'
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
        
'@

$regStr = @'
<ion-col col-12>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
              <ion-option value="2">తెలంగాణ (TG)</option>
            </ion-select>
          </ion-item>
        </ion-col>
        
'@

$itemStr = @'
<ion-item>
          <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>
            <ion-option value="2">తెలంగాణ (TG)</option>
          </ion-select>
        </ion-item>
        
'@

$chunkSearch = $searchStr.Replace("`r`n", "\n\n").Replace("`n", "\n\n")
$chunkReg = $regStr.Replace("`r`n", "\n\n").Replace("`n", "\n\n")
$chunkItem = $itemStr.Replace("`r`n", "\n\n").Replace("`n", "\n\n")

function To-B64 ($s) {
    return [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($s))
}

Write-Host "B64_CHUNK_SEARCH:" (To-B64 $chunkSearch)
Write-Host "B64_CHUNK_REG:" (To-B64 $chunkReg)
Write-Host "B64_CHUNK_ITEM:" (To-B64 $chunkItem)

Write-Host "B64_HTML_SEARCH:" (To-B64 $searchStr)
Write-Host "B64_HTML_REG:" (To-B64 $regStr)
Write-Host "B64_HTML_ITEM:" (To-B64 $itemStr)

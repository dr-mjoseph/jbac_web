$workflowPath = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$content = @"
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '14'
        cache: npm

    - name: Use compatible npm
      run: npm install -g npm@6

    - name: Install Global Dependencies
      run: npm install -g ionic@5.4.16 cordova@11.1.0

    - name: Install Project Dependencies
      run: |
        npm config set production false
        npm install --production=false
        npm ls @ionic/app-scripts typescript

    - name: Accept Android SDK Licenses
      run: yes | sdkmanager --licenses || true

    - name: Add Android Platform
      run: cordova platform add android --no-interactive

    - name: Build Web Assets (AoT Production)
      run: npm run build -- --prod

    - name: Build Android Release APK
      run: cordova build android --release -- --packageType=apk

    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: app-release-unsigned.apk
        path: platforms/android/app/build/outputs/apk/release/*.apk
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($workflowPath, $content.TrimStart([char]0xFEFF), $utf8NoBom)
Write-Output "Successfully updated build-apk.yml to clean two-stage build"

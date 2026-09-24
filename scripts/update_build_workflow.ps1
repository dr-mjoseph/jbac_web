$workflowPath = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$content = @"
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '11'

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@v4
      with:
        gradle-version: '7.1.1'

    - name: Install Android Build Tools 30.0.3
      run: |
        curl -fsSL https://dl.google.com/android/repository/build-tools_r30.0.3-linux.zip -o /tmp/build-tools.zip
        unzip -q /tmp/build-tools.zip -d /tmp/build-tools
        sudo mkdir -p /usr/local/lib/android/sdk/build-tools/30.0.3
        sudo cp -r /tmp/build-tools/android-11/* /usr/local/lib/android/sdk/build-tools/30.0.3/
        sudo chmod -R a+rx /usr/local/lib/android/sdk/build-tools/30.0.3
        echo "=== Installed Build Tools ==="
        ls -la /usr/local/lib/android/sdk/build-tools/30.0.3/aapt

    - name: Verify Toolchain
      run: |
        java -version
        gradle -v
        ls -la /usr/local/lib/android/sdk/build-tools/30.0.3/

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
        if [ -f node_modules/cordova-android/framework/cordova.gradle ]; then
          grep -q "import groovy.xml.XmlParser" node_modules/cordova-android/framework/cordova.gradle || sed -i '1s/^/import groovy.xml.XmlParser\n/' node_modules/cordova-android/framework/cordova.gradle
        fi

    - name: Add Android Platform
      run: |
        cordova platform add android --no-interactive
        if [ -f platforms/android/CordovaLib/cordova.gradle ]; then
          grep -q "import groovy.xml.XmlParser" platforms/android/CordovaLib/cordova.gradle || sed -i '1s/^/import groovy.xml.XmlParser\n/' platforms/android/CordovaLib/cordova.gradle
        fi
        if [ -f platforms/android/cdv-gradle-config.json ]; then
          node -e '
            const fs = require("fs");
            const file = "platforms/android/cdv-gradle-config.json";
            const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
            cfg.BUILD_TOOLS_VERSION = "30.0.3";
            fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
            console.log("Updated cdv-gradle-config.json:", cfg);
          ' || true
        fi

    - name: Build Android Release Package
      env:
        CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL: "https://services.gradle.org/distributions/gradle-7.1.1-all.zip"
      run: |
        set -o pipefail
        cordova build android --release --verbose -- --packageType=apk --gradleArg=-PcdvBuildToolsVersion=30.0.3 2>&1 | tee cordova_build.log || {
          echo "Build failed, pushing log to build-log-branch..."
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout -B build-log-branch
          git add -f cordova_build.log
          git commit -m "ci: capture cordova build error log"
          git push origin build-log-branch --force
          cat cordova_build.log | tail -n 100
          exit 1
        }

    - name: Sign Android Release APK
      run: |
        ALIGN="/usr/local/lib/android/sdk/build-tools/30.0.3/zipalign"
        SIGNER="/usr/local/lib/android/sdk/build-tools/30.0.3/apksigner"
        UNSIGNED="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
        ALIGNED="platforms/android/app/build/outputs/apk/release/app-release-aligned.apk"
        SIGNED="platforms/android/app/build/outputs/apk/release/app-release.apk"

        echo "Aligning APK..."
        `$ALIGN -f -p 4 "`$UNSIGNED" "`$ALIGNED"

        echo "Signing APK with Jbac.keystore..."
        `$SIGNER sign --ks Jbac.keystore --ks-pass pass:123456 --ks-key-alias jbac --key-pass pass:123456 --out "`$SIGNED" "`$ALIGNED"

        echo "Verifying signature..."
        `$SIGNER verify --verbose "`$SIGNED"
        ls -la "`$SIGNED"

    - name: List Build Outputs
      run: find platforms/android/app/build/outputs/ -type f || true

    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: app-release.apk
        path: platforms/android/app/build/outputs/apk/release/app-release.apk
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($workflowPath, $content.TrimStart([char]0xFEFF), $utf8NoBom)
Write-Output "Successfully updated build-apk.yml with automated APK signing"

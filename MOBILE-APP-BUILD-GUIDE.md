# CentralVault Mobile App - Android Build Guide

## 📱 Professional Android App Setup

This guide will help you build a professional Android app for CentralVault using Capacitor.

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js** installed (v18 or higher)
2. **Android Studio** installed ([Download here](https://developer.android.com/studio))
3. **Java JDK 17** (comes with Android Studio, or download separately from [Adoptium](https://adoptium.net/))
4. **Android SDK** (installed via Android Studio)
5. **JAVA_HOME environment variable** set to your JDK installation path

### Java Setup Verification

After installing Java, verify the setup:

```bash
java -version
```

Should output something like:
```
openjdk version "17.0.9" 2023-10-17
OpenJDK Runtime Environment Temurin-17.0.9+9 (build 17.0.9+9)
OpenJDK 64-Bit Server VM Temurin-17.0.9+9 (build 17.0.9+9, mixed mode, sharing)
```

And check JAVA_HOME:

```bash
echo $JAVA_HOME
```

Should point to your JDK directory.

---

## Step 1: Build the Web App

First, build the static export of your Next.js app:

```bash
npm run build
```

This creates the `out` directory with your static website files.

---

## Step 2: Sync with Capacitor

Copy the web assets to the Android project:

```bash
npx cap sync android
```

This command:
- Copies files from `out/` to `android/app/src/main/assets/public/`
- Updates native dependencies
- Prepares the Android project

---

## Step 3: Add App Icons

### Option A: Use Provided Icons (Recommended)

I've generated professional app icons for you. Copy them to:

1. **App Icon**: Save the app icon image to `android/app/src/main/res/`
   - Create folders: `mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`
   - Resize and save as `ic_launcher.png` in each folder:
     - mdpi: 48x48px
     - hdpi: 72x72px
     - xhdpi: 96x96px
     - xxhdpi: 144x144px
     - xxxhdpi: 192x192px

2. **Splash Screen**: Save to `android/app/src/main/res/drawable/splash.png`

### Option B: Use Capacitor Assets Generator (Automated)

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --android
```

---

## Step 4: Open in Android Studio

```bash
npx cap open android
```

This opens the project in Android Studio.

---

## Step 5: Configure App Details

In Android Studio, update:

### `android/app/build.gradle`

```gradle
android {
    namespace "com.centralvault.app"
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.centralvault.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "4.0.0"
    }
}
```

### `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">CentralVault</string>
    <string name="title_activity_main">CentralVault</string>
    <string name="package_name">com.centralvault.app</string>
    <string name="custom_url_scheme">com.centralvault.app</string>
</resources>
```

---

## Step 6: Build the APK

### Debug Build (for testing)

In Android Studio:
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. Find the APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for distribution)

1. **Generate Signing Key** (first time only):

```bash
keytool -genkey -v -keystore centralvault-release-key.keystore -alias centralvault -keyalg RSA -keysize 2048 -validity 10000
```

2. **Create `android/key.properties`**:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=centralvault
storeFile=../centralvault-release-key.keystore
```

3. **Update `android/app/build.gradle`**:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

4. **Build Release APK**:

```bash
cd android
./gradlew assembleRelease
```

Find the APK at: `android/app/build/outputs/apk/release/app-release.apk`

---

## Step 7: Test the App

### On Emulator

1. In Android Studio, click **Run** → **Run 'app'**
2. Select an emulator or create a new one
3. The app will install and launch

### On Physical Device

1. Enable **Developer Options** on your Android phone
2. Enable **USB Debugging**
3. Connect your phone via USB
4. In Android Studio, select your device and click **Run**

---

## Step 8: Distribute the App

### Option A: Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Upload the signed release APK
3. Fill in app details, screenshots, description
4. Submit for review

### Option B: Direct Distribution

1. Share the APK file directly
2. Users need to enable "Install from Unknown Sources"
3. They can install by opening the APK file

---

## 🎨 App Assets Created

I've generated professional assets for your app:

1. **App Icon**: Modern vault design with purple-to-blue gradient
2. **Splash Screen**: Branded loading screen with logo and app name

Both match your website's design system perfectly!

---

## 🔧 Troubleshooting

### "SDK location not found"

Create `android/local.properties`:

```properties
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### "Gradle build failed"

```bash
cd android
./gradlew clean
./gradlew build
```

### "App crashes on launch"

Check Android Studio Logcat for errors. Common fixes:
- Ensure `webDir: 'out'` in `capacitor.config.ts`
- Run `npx cap sync android` again
- Clear app data and reinstall

---

## 📦 Quick Commands Reference

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Update native code
npx cap update android

# Clean and rebuild
cd android && ./gradlew clean && cd ..
npx cap sync android
```

---

## 🚀 CI/CD with GitHub Actions

This project includes automated Android builds using GitHub Actions. Every push to main/master triggers:

- Next.js build
- Capacitor sync
- Android APK generation
- Artifact upload for download

### Accessing Build Artifacts

1. Go to your repository's **Actions** tab
2. Click on the latest workflow run
3. Download the `android-apk` artifact
4. Install the APK on your Android device

### Local vs CI Builds

- **Local**: Use Android Studio for development and debugging
- **CI**: Automated builds for distribution and testing

---

## ✅ Next Steps

1. Build the debug APK and test on your device
2. Once tested, create a release build
3. Optionally publish to Google Play Store
4. Share the APK with users for direct installation

Your mobile app ecosystem is now complete! 🎉

# ESTIM-APP - Build Guide

## 📋 Prerequisites

### Required Software
- Node.js v22+ (installed via NVM for Windows)
- Android SDK (see installation below)
- Java Development Kit (JDK) 17+

### Android SDK Installation

#### Option 1: Using Android Studio (Recommended)
1. Download Android Studio from https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
4. Install SDK Platform 34 and Android SDK Build Tools 34.0.0

#### Option 2: Command Line (sdkmanager)
```bash
# After Android Studio installation, run:
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

#### Option 3: Using Gradle Auto-Download
Gradle can attempt to download the SDK, but it's recommended to install manually first.

## 🚀 Building the Application

### Complete Build (All Steps)

#### On Windows (PowerShell):
```powershell
# Using PowerShell script
.\build-complete.ps1

# Or using Batch script
.\build-complete.bat
```

#### On Linux/macOS:
```bash
chmod +x build-complete.sh
./build-complete.sh
```

### Individual Build Steps

#### Step 1: Build Web Assets
```bash
npm run build
# Output: dist/
```

#### Step 2: Sync with Capacitor
```bash
npx capacitor sync android
# Output: Copies web assets and generates Capacitor configuration
```

#### Step 3: Build Android APK
```bash
cd android
.\gradlew.bat assembleDebug --no-daemon  # Windows
# or
./gradlew assembleDebug --no-daemon      # Linux/macOS
```

## 📦 Output

### Web Build Output
- Location: `dist/`
- Contains: bundled web assets (HTML, CSS, JS)

### Android APK Output
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk` (requires signing)

## 🔧 Configuration Files

### local.properties
**Location:** `android/local.properties`
```properties
sdk.dir=C:\\Users\\plame\\AppData\\Local\\Android\\Sdk
```
Update the path to match your Android SDK installation location.

### capacitor.config.ts
**Location:** `capacitor.config.ts`
```typescript
const config: CapacitorConfig = {
  appId: 'estim.app',
  appName: 'estim-app',
  webDir: 'dist'
};
```

## 🐛 Troubleshooting

### Error: "SDK location not found"
**Solution:** Create/update `android/local.properties` with correct SDK path
```properties
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### Error: "Could not find capacitor.settings.gradle"
**Solution:** Run `npx capacitor sync android`

### Build hangs during dependency download
**Solution:**
1. Check internet connection
2. Increase timeout in `android/gradle/wrapper/gradle-wrapper.properties`:
```properties
networkTimeout=300000  # 5 minutes
```

### Gradle wrapper timeout
**Solution:** The networkTimeout has been set to 120000ms (2 minutes) in gradle-wrapper.properties

## 📱 Testing the APK

### Using Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator @<emulator-name>

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Launch app
adb shell am start -n estim.app/.MainActivity
```

### Using Physical Device
1. Enable USB Debugging on device
2. Connect device to computer
3. Run: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

## 📚 Documentation

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Ionic React Documentation](https://ionicframework.com/docs/react)
- [Gradle Documentation](https://docs.gradle.org/)
- [Android Developer Guide](https://developer.android.com/docs)

## 🔗 Environment Variables (Optional)

For convenience, add to your system PATH:
```
ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

---

**Last Updated:** March 22, 2026
**Project:** ESTIM-APP v0.0.0

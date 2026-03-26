# ANDROID SDK INSTALLATION GUIDE

## Important: Android SDK is REQUIRED for building the APK

The Android SDK is **mandatory** and cannot be auto-downloaded reliably. Follow these steps:

## 🔧 Installation Options

### Option 1: Android Studio (RECOMMENDED)

**Step 1:** Download Android Studio
- Visit: https://developer.android.com/studio
- Download for Windows
- Run the installer

**Step 2:** Open Android Studio
- Launch Android Studio after installation
- Click "Next" through the setup wizard

**Step 3:** Install SDK Components
- Go to: Settings → Appearance & Behavior → System Settings → Android SDK
- Under "SDK Platforms" tab:
  ✓ Check "Android 14 (API Level 34)"
  
- Under "SDK Tools" tab:
  ✓ Check "Android SDK Build Tools 34.0.0"
  ✓ Check "Android Emulator" (optional, for testing)
  
- Click "Apply" and wait for installation

**Step 4:** Verify Installation
- The SDK should be at: `C:\Users\<USERNAME>\AppData\Local\Android\Sdk`
- The `local.properties` file should reference this path

### Option 2: Command Line Installation (After Android Studio)

```bash
# Set environment variable (add to Windows system environment)
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"

# Verify installation
echo %ANDROID_HOME%
```

### Option 3: Manually Configure local.properties

If Android Studio is already installed but not at the expected location:

1. Open `android/local.properties`
2. Update the path to your Android SDK location:
   ```properties
   sdk.dir=C:\\path\\to\\your\\Android\\Sdk
   ```

## 🚨 Common Issues

### "SDK location not found" Error
**Cause:** `local.properties` is missing or has incorrect path  
**Fix:** 
1. Create file `android/local.properties`
2. Add: `sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk`

### "Platform android-34 not installed" Error
**Cause:** Missing SDK Platform  
**Fix:**
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install Android 14 (API 34)

### Build takes very long on first run
**Cause:** Gradle downloading dependencies  
**Solution:** This is normal! First build can take 10-30 minutes.

## ✅ Verification

After installation, run the verification script:
```bash
.\verify-dependencies.bat
```

Should show:
```
✓ Node.js v22.x.x found
✓ npm x.x.x found
✓ Java found
✓ Android SDK found at C:\Users\...\AppData\Local\Android\Sdk
✓ Gradle wrapper found
```

## 🔗 Next Steps

Once Android SDK is installed:

1. Run dependency verification:
   ```bash
   .\verify-dependencies.bat
   ```

2. Build the complete application:
   ```bash
   .\build-complete.bat
   ```

3. The APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## 📚 Additional Resources

- [Android Studio Download](https://developer.android.com/studio)
- [Android SDK Documentation](https://developer.android.com/studio/intro)
- [Gradle & Android Build System](https://developer.android.com/studio/build/)

---

**Note:** The build cannot proceed without Android SDK. If you have any issues installing it, see the troubleshooting section in BUILD_GUIDE.md

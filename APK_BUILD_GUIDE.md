# دليل تحويل اللعبة إلى APK

## الطريقة الأولى: استخدام Apache Cordova (الأسهل)

### المتطلبات:
- Node.js مثبت على جهازك
- Android Studio أو Android SDK
- Java Development Kit (JDK)

### الخطوات:

1. **تثبيت Cordova:**
```bash
npm install -g cordova
```

2. **إنشاء مشروع Cordova:**
```bash
cordova create ShadowCityApp com.shadowcity.game "Shadow City"
cd ShadowCityApp
```

3. **إضافة منصة Android:**
```bash
cordova platform add android
```

4. **نسخ ملفات اللعبة:**
- انسخ جميع ملفات اللعبة (HTML, CSS, JS, assets) إلى مجلد `www`
- احذف الملفات الافتراضية في `www`

5. **تحديث config.xml:**
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.shadowcity.game" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>Shadow City</name>
    <description>Simulator of Streets</description>
    <author email="dev@shadowcity.game" href="https://shadowcity.game">
        Shadow City Team
    </author>
    <content src="index.html" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <allow-intent href="market:*" />
        <preference name="Orientation" value="portrait" />
        <preference name="Fullscreen" value="true" />
    </platform>
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="33" />
</widget>
```

6. **بناء APK:**
```bash
cordova build android
```

7. **العثور على APK:**
- المسار: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

## الطريقة الثانية: استخدام Capacitor (حديث)

### الخطوات:

1. **تثبيت Capacitor:**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Shadow City" "com.shadowcity.game"
```

2. **إضافة منصة Android:**
```bash
npm install @capacitor/android
npx cap add android
```

3. **نسخ الملفات وبناء التطبيق:**
```bash
npx cap copy android
npx cap open android
```

## الطريقة الثالثة: استخدام خدمات أونلاين

### 1. PhoneGap Build (مجاني جزئياً):
- ارفع ملفات اللعبة إلى GitHub
- اذهب إلى build.phonegap.com
- اربط المستودع وابني APK

### 2. Monaca (مجاني مع قيود):
- اذهب إلى monaca.io
- أنشئ مشروع جديد
- ارفع ملفات اللعبة
- ابني APK

## إعدادات إضافية للعبة

### 1. تحسين الأداء للموبايل:
```javascript
// إضافة هذا الكود في بداية game.js
document.addEventListener('deviceready', function() {
    // تعطيل التمرير المطاطي
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
    
    // تحسين الأداء
    if (window.StatusBar) {
        StatusBar.hide();
    }
}, false);
```

### 2. إضافة أيقونات التطبيق:
- أنشئ مجلد `res/icon/android/`
- أضف أيقونات بأحجام مختلفة:
  - `icon-36-ldpi.png` (36x36)
  - `icon-48-mdpi.png` (48x48)
  - `icon-72-hdpi.png` (72x72)
  - `icon-96-xhdpi.png` (96x96)
  - `icon-144-xxhdpi.png` (144x144)
  - `icon-192-xxxhdpi.png` (192x192)

### 3. إضافة Splash Screen:
```xml
<!-- في config.xml -->
<platform name="android">
    <splash src="res/screen/android/splash-land-hdpi.png" density="land-hdpi"/>
    <splash src="res/screen/android/splash-land-ldpi.png" density="land-ldpi"/>
    <splash src="res/screen/android/splash-port-hdpi.png" density="port-hdpi"/>
    <splash src="res/screen/android/splash-port-ldpi.png" density="port-ldpi"/>
</platform>
```

## إعدادات الأذونات

### في config.xml أضف:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## نصائح مهمة:

### 1. اختبار APK:
- اختبر على أجهزة مختلفة
- تأكد من عمل جميع الوظائف
- اختبر الأداء والسرعة

### 2. تحسين الحجم:
- ضغط الصور
- تصغير ملفات CSS و JS
- إزالة الملفات غير المستخدمة

### 3. الأمان:
- لا تضع مفاتيح API حساسة في الكود
- استخدم HTTPS للاتصالات
- فعل ProGuard لحماية الكود

## استكشاف الأخطاء:

### مشاكل شائعة:
1. **خطأ في بناء APK:** تحقق من إعدادات Android SDK
2. **التطبيق لا يعمل:** تحقق من وحدة التحكم في المتصفح
3. **مشاكل الأذونات:** تأكد من إضافة جميع الأذونات المطلوبة

### حلول:
- استخدم `cordova requirements` للتحقق من المتطلبات
- راجع ملفات السجل في `platforms/android/`
- اختبر في المتصفح أولاً قبل بناء APK

## البديل السريع: PWA (Progressive Web App)

إذا كانت عملية بناء APK معقدة، يمكنك تحويل اللعبة إلى PWA:

1. **إضافة Service Worker**
2. **تحديث manifest.json**
3. **تحسين للموبايل**

المستخدمون يمكنهم "تثبيت" اللعبة من المتصفح كتطبيق!


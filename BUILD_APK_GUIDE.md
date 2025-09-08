# دليل تحويل Shadow City إلى تطبيق APK

## الطريقة الأولى: استخدام Apache Cordova/PhoneGap

### 1. تثبيت Node.js و Cordova
```bash
# تثبيت Node.js (إذا لم يكن مثبتاً)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت Cordova
npm install -g cordova
```

### 2. إنشاء مشروع Cordova
```bash
# إنشاء مشروع جديد
cordova create ShadowCityApp com.shadowcity.app ShadowCity

# الانتقال إلى مجلد المشروع
cd ShadowCityApp

# إضافة منصة Android
cordova platform add android
```

### 3. نسخ ملفات اللعبة
```bash
# نسخ جميع ملفات اللعبة إلى مجلد www
cp -r ../Game/* www/

# التأكد من وجود ملف index.html في المجلد الصحيح
ls www/
```

### 4. تكوين config.xml
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.shadowcity.app" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Shadow City</name>
    <description>Simulator of Streets - لعبة محاكاة الشوارع</description>
    <author email="dev@shadowcity.com" href="https://shadowcity.com">Shadow City Team</author>
    
    <content src="index.html" />
    
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="33" />
    
    <platform name="android">
        <allow-intent href="market:*" />
        <icon density="ldpi" src="www/res/icon/android/drawable-ldpi-icon.png" />
        <icon density="mdpi" src="www/res/icon/android/drawable-mdpi-icon.png" />
        <icon density="hdpi" src="www/res/icon/android/drawable-hdpi-icon.png" />
        <icon density="xhdpi" src="www/res/icon/android/drawable-xhdpi-icon.png" />
        <icon density="xxhdpi" src="www/res/icon/android/drawable-xxhdpi-icon.png" />
        <icon density="xxxhdpi" src="www/res/icon/android/drawable-xxxhdpi-icon.png" />
    </platform>
    
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
</widget>
```

### 5. بناء التطبيق
```bash
# بناء التطبيق للإصدار التجريبي
cordova build android

# بناء التطبيق للإصدار النهائي
cordova build android --release
```

### 6. العثور على ملف APK
```bash
# مسار ملف APK التجريبي
ls platforms/android/app/build/outputs/apk/debug/

# مسار ملف APK النهائي
ls platforms/android/app/build/outputs/apk/release/
```

## الطريقة الثانية: استخدام Capacitor (الأحدث)

### 1. تثبيت Capacitor
```bash
npm install -g @capacitor/cli
npm install -g @capacitor/core @capacitor/android
```

### 2. إنشاء مشروع Capacitor
```bash
# إنشاء مشروع جديد
npx cap init ShadowCity com.shadowcity.app

# إضافة منصة Android
npx cap add android
```

### 3. نسخ ملفات اللعبة
```bash
# نسخ ملفات اللعبة إلى مجلد www
cp -r ../Game/* www/

# مزامنة الملفات
npx cap sync
```

### 4. فتح المشروع في Android Studio
```bash
npx cap open android
```

### 5. بناء APK من Android Studio
1. افتح Android Studio
2. اختر Build > Build Bundle(s) / APK(s) > Build APK(s)
3. انتظر حتى اكتمال البناء
4. ستجد ملف APK في مجلد `app/build/outputs/apk/`

## الطريقة الثالثة: استخدام PWA Builder (الأسهل)

### 1. زيارة موقع PWA Builder
اذهب إلى: https://www.pwabuilder.com/

### 2. إدخال رابط اللعبة
- أدخل رابط اللعبة المنشورة على الإنترنت
- انقر على "Start"

### 3. تحليل التطبيق
- سيقوم الموقع بتحليل اللعبة تلقائياً
- سيعرض التحسينات المطلوبة

### 4. تحميل APK
- اختر "Android" من الخيارات
- انقر على "Download Package"
- ستحصل على ملف APK جاهز

## متطلبات النظام

### لـ Cordova/Capacitor:
- Node.js 14 أو أحدث
- Android Studio
- Java Development Kit (JDK) 8 أو أحدث
- Android SDK

### تثبيت Android Studio:
```bash
# تحميل Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz

# استخراج الملفات
tar -xzf android-studio-*.tar.gz

# تشغيل Android Studio
cd android-studio/bin
./studio.sh
```

## نصائح مهمة

### 1. تحسين الأداء للموبايل
- تأكد من أن جميع الصور محسّنة
- استخدم CSS media queries للشاشات المختلفة
- اختبر على أجهزة مختلفة

### 2. الأذونات المطلوبة
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### 3. إعدادات الأمان
```xml
<allow-navigation href="https://*/*" />
<allow-navigation href="http://*/*" />
<allow-navigation href="data:*" />
```

### 4. تحسين حجم APK
- ضغط الصور والأصوات
- إزالة الملفات غير المستخدمة
- استخدام ProGuard للتصغير

## استكشاف الأخطاء

### مشكلة: فشل في البناء
```bash
# تنظيف المشروع
cordova clean android
cordova build android
```

### مشكلة: مشاكل في الأذونات
```bash
# التأكد من إعدادات SDK
cordova requirements android
```

### مشكلة: التطبيق لا يعمل على الهاتف
- تأكد من تفعيل "مصادر غير معروفة" في إعدادات الأندرويد
- تحقق من سجلات الأخطاء باستخدام `adb logcat`

## الخطوات السريعة (ملخص)

```bash
# 1. تثبيت الأدوات
npm install -g cordova

# 2. إنشاء المشروع
cordova create ShadowCityApp com.shadowcity.app ShadowCity
cd ShadowCityApp
cordova platform add android

# 3. نسخ الملفات
cp -r ../Game/* www/

# 4. البناء
cordova build android

# 5. العثور على APK
ls platforms/android/app/build/outputs/apk/debug/
```

## معلومات إضافية

- **حجم APK المتوقع**: 10-20 ميجابايت
- **الحد الأدنى لإصدار الأندرويد**: 5.1 (API 22)
- **الأذونات المطلوبة**: الإنترنت، حالة الشبكة
- **وقت البناء المتوقع**: 5-10 دقائق

للحصول على مساعدة إضافية، راجع الوثائق الرسمية:
- Cordova: https://cordova.apache.org/docs/
- Capacitor: https://capacitorjs.com/docs/
- PWA Builder: https://docs.pwabuilder.com/


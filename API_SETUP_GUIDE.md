# دليل إعداد APIs للعبة Shadow City

## 1. إعداد Google OAuth API

### الخطوات:

1. **انتقل إلى Google Cloud Console:**
   - اذهب إلى: https://console.cloud.google.com/

2. **إنشاء مشروع جديد أو اختيار مشروع موجود:**
   - انقر على "Select a project" في الأعلى
   - انقر على "New Project" لإنشاء مشروع جديد
   - أدخل اسم المشروع (مثل: "Shadow City Game")

3. **تفعيل Google Sign-In API:**
   - في القائمة الجانبية، اذهب إلى "APIs & Services" > "Library"
   - ابحث عن "Google Sign-In API" أو "Google Identity"
   - انقر على "Enable"

4. **إنشاء OAuth 2.0 Client ID:**
   - اذهب إلى "APIs & Services" > "Credentials"
   - انقر على "Create Credentials" > "OAuth 2.0 Client ID"
   - اختر "Web application"
   - أضف domain اللعبة في "Authorized JavaScript origins"
   - مثال: `http://localhost:8000` للتطوير المحلي

5. **نسخ Client ID:**
   - انسخ الـ Client ID الذي تم إنشاؤه
   - استبدل `YOUR_GOOGLE_CLIENT_ID` في ملف `game.js` بهذا المعرف

## 2. إعداد EmailJS لإرسال الإيميلات

### الخطوات:

1. **إنشاء حساب EmailJS:**
   - اذهب إلى: https://www.emailjs.com/
   - انقر على "Sign Up" وأنشئ حساب جديد

2. **إضافة خدمة إيميل:**
   - في لوحة التحكم، انقر على "Email Services"
   - انقر على "Add New Service"
   - اختر مزود الإيميل (Gmail, Outlook, إلخ)
   - اتبع التعليمات لربط حسابك

3. **إنشاء Email Template:**
   - انقر على "Email Templates"
   - انقر على "Create New Template"
   - استخدم هذا القالب للترحيب:

```html
مرحباً {{to_name}}!

{{welcome_message}}

تفاصيل حسابك:
- اسم اللعبة: {{game_name}}
- رابط اللعبة: {{game_url}}

{{tips}}

إذا كان لديك أي استفسار، تواصل معنا على: {{support_email}}

مع تحيات فريق Shadow City
```

4. **الحصول على المفاتيح:**
   - **Service ID:** من صفحة "Email Services"
   - **Template ID:** من صفحة "Email Templates"
   - **Public Key:** من صفحة "Account" > "General"

5. **تحديث الكود:**
   - استبدل المتغيرات التالية في `game.js`:
   - `YOUR_EMAILJS_SERVICE_ID`
   - `YOUR_EMAILJS_TEMPLATE_ID`
   - `YOUR_EMAILJS_PUBLIC_KEY`

## 3. إعداد إضافي للإنتاج

### للنشر على الإنترنت:
1. قم بتحديث "Authorized JavaScript origins" في Google Console
2. أضف domain الموقع الحقيقي
3. تأكد من أن جميع المفاتيح محدثة في الكود

### للأمان:
- لا تشارك المفاتيح الخاصة علناً
- استخدم متغيرات البيئة في الإنتاج
- قم بتقييد استخدام المفاتيح حسب النطاق

## 4. اختبار الإعداد

1. شغل اللعبة محلياً
2. جرب تسجيل الدخول بـ Google
3. جرب إنشاء حساب جديد والتحقق من وصول الإيميل
4. تأكد من عمل جميع الوظائف بشكل صحيح

## ملاحظات مهمة:

- **Google OAuth:** مجاني للاستخدام الأساسي
- **EmailJS:** يوفر 200 إيميل مجاناً شهرياً
- **الأمان:** تأكد من تقييد استخدام المفاتيح
- **الاختبار:** اختبر جميع الوظائف قبل النشر

## استكشاف الأخطاء:

### إذا لم يعمل Google Sign-In:
- تحقق من صحة Client ID
- تأكد من إضافة النطاق الصحيح
- تحقق من وحدة التحكم في المتصفح للأخطاء

### إذا لم تصل الإيميلات:
- تحقق من صحة المفاتيح
- تأكد من تفعيل الخدمة في EmailJS
- تحقق من مجلد الرسائل غير المرغوب فيها


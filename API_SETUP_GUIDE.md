# دليل إعداد API لـ EmailJS (لإرسال رسائل الترحيب)

EmailJS هي خدمة تسمح لك بإرسال رسائل بريد إلكتروني مباشرة من JavaScript دون الحاجة إلى خادم خلفي.

### الخطوات:

1.  **انتقل إلى موقع EmailJS:**
    [https://www.emailjs.com/](https://www.emailjs.com/)

2.  **إنشاء حساب وتسجيل الدخول:**
    -   إذا لم يكن لديك حساب، قم بإنشاء حساب جديد.
    -   سجل الدخول إلى لوحة التحكم الخاصة بك.

3.  **إضافة خدمة بريد إلكتروني (Email Service):**
    -   من لوحة التحكم، اذهب إلى "Email Services".
    -   انقر على "Add New Service".
    -   اختر خدمة البريد الإلكتروني التي تستخدمها (مثال: Gmail، Outlook، إلخ). اتبع التعليمات لربط حسابك. قد تحتاج إلى تفعيل "Less secure app access" في إعدادات Gmail إذا كنت تستخدمه.
    -   بعد الربط، ستحصل على "Service ID". **احتفظ به، ستحتاجه في ملف `game.js`.**

4.  **إنشاء قالب بريد إلكتروني (Email Template):**
    -   من لوحة التحكم، اذهب إلى "Email Templates".
    -   انقر على "Create New Template".
    -   صمم قالب البريد الإلكتروني الترحيبي الخاص بك. يمكنك استخدام متغيرات مثل `{{username}}` و `{{game_name}}` و `{{login_url}}` و `{{tips}}`.
    -   مثال على محتوى القالب:

        ```html
        مرحباً {{username}}،

        شكراً لتسجيلك في {{game_name}}!

        نحن متحمسون جداً لوجودك معنا في شوارع Shadow City.

        للبدء، قم بتسجيل الدخول إلى اللعبة من هنا: {{login_url}}

        نصائح سريعة للبدء: {{tips}}

        نتمنى لك وقتاً ممتعاً!
        فريق Shadow City
        ```

    -   احفظ القالب. ستحصل على "Template ID". **احتفظ به، ستحتاجه في ملف `game.js`.**

5.  **تحديث ملف `game.js`:**
    -   ابحث عن المتغيرات `EMAILJS_SERVICE_ID` و `EMAILJS_TEMPLATE_ID` في ملف `game.js`.
    -   استبدل القيم الموجودة بـ `Service ID` و `Template ID` التي حصلت عليها من EmailJS.

```javascript
// في game.js
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
```

## 2. تحديث ملف `index.html`

تأكد من تضمين مكتبة EmailJS في ملف `index.html`:

```html
<!-- في قسم <head> أو قبل إغلاق </body> -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
   (function(){
      emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // هذا هو Public Key الخاص بك
   })();
</script>
```

-   ابحث عن `YOUR_EMAILJS_PUBLIC_KEY` في ملف `index.html` واستبدله بـ `Public Key` الخاص بك من EmailJS (يمكنك العثور عليه في لوحة تحكم EmailJS ضمن "Account" > "API Keys").

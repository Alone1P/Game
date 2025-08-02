// Shadow City: Simulator of Streets
// Game Logic and State Management

class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('shadowCityUsers')) || {};
    }
    
    register(username, password) {
        if (this.users[username]) {
            return { success: false, message: 'اسم المستخدم موجود بالفعل' };
        }
        
        if (username.length < 3) {
            return { success: false, message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' };
        }
        
        if (password.length < 4) {
            return { success: false, message: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل' };
        }
        
        this.users[username] = {
            password: password,
            createdAt: new Date().toISOString(),
            gameData: null
        };
        
        this.saveUsers();
        return { success: true, message: 'تم إنشاء الحساب بنجاح' };
    }
    
    login(username, password) {
        if (!this.users[username]) {
            return { success: false, message: 'اسم المستخدم غير موجود' };
        }
        
        if (this.users[username].password !== password) {
            return { success: false, message: 'كلمة المرور غير صحيحة' };
        }
        
        this.currentUser = username;
        localStorage.setItem('shadowCityCurrentUser', username);
        return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('shadowCityCurrentUser');
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    saveGameData(gameData) {
        if (this.currentUser) {
            this.users[this.currentUser].gameData = gameData;
            this.saveUsers();
        }
    }
    
    loadGameData() {
        if (this.currentUser && this.users[this.currentUser].gameData) {
            return this.users[this.currentUser].gameData;
        }
        return null;
    }
    
    saveUsers() {
        localStorage.setItem('shadowCityUsers', JSON.stringify(this.users));
    }
    
    autoLogin() {
        const savedUser = localStorage.getItem('shadowCityCurrentUser');
        if (savedUser && this.users[savedUser]) {
            this.currentUser = savedUser;
            return true;
        }
        return false;
    }
}

class GameState {
    constructor() {
        this.player = {
            name: '',
            background: '',
            level: 1,
            money: 0,
            xp: 0,
            reputation: 0,
            shadowCoins: 0,
            skills: {
                speed: 1,
                persuasion: 1,
                stamina: 1,
                charisma: 1
            },
            inventory: [],
            currentLocation: 'downtown',
            energy: 100,
            health: 100
        };
        
        this.gameTime = {
            hour: 8,
            day: 1,
            period: 'morning' // morning, afternoon, evening, night
        };
        
        this.weather = 'sunny'; // sunny, rainy, cloudy
        
        this.locations = {
            downtown: {
                name: 'الحي الشعبي',
                description: 'حي بسيط في أطراف المدينة، مليء بالفرص للمبتدئين.',
                jobs: ['delivery', 'flyers', 'carwash', 'streetvendor'],
                shops: ['tools', 'clothes'],
                unlocked: true
            },
            business: {
                name: 'الحي التجاري',
                description: 'منطقة الأعمال والمكاتب، حيث الفرص الأكبر والمخاطر أعلى.',
                jobs: ['office', 'sales', 'security'],
                shops: ['electronics', 'suits'],
                unlocked: false,
                requirements: { reputation: 50 }
            },
            uptown: {
                name: 'الحي الراقي',
                description: 'منطقة الأثرياء والنخبة، حيث المال الحقيقي.',
                jobs: ['valet', 'butler', 'driver'],
                shops: ['luxury', 'blackmarket'],
                unlocked: false,
                requirements: { reputation: 150, money: 5000 }
            },
            underground: {
                name: 'العالم السفلي',
                description: 'منطقة مظلمة مليئة بالأسرار والمخاطر العالية.',
                jobs: ['smuggling', 'hacking'],
                shops: ['blackmarket', 'weapons'],
                unlocked: false,
                requirements: { reputation: 300, level: 10 }
            }
        };
        
        this.jobs = {
            // وظائف الحي الشعبي
            delivery: {
                name: 'توصيل الطلبات',
                description: 'توصيل الطعام والطلبات للزبائن في المنطقة',
                requirements: { level: 1 },
                rewards: { money: [20, 40], xp: 5, reputation: 1 },
                duration: 30,
                energy: 15,
                skills: ['speed'],
                riskLevel: 'low',
                timeBonus: { morning: 1.2, afternoon: 1.0, evening: 1.3, night: 0.8 }
            },
            flyers: {
                name: 'توزيع المنشورات',
                description: 'توزيع الإعلانات والمنشورات في الشوارع',
                requirements: { level: 1 },
                rewards: { money: [15, 25], xp: 3, reputation: 1 },
                duration: 45,
                energy: 10,
                skills: ['stamina'],
                riskLevel: 'low',
                timeBonus: { morning: 1.3, afternoon: 1.0, evening: 0.9, night: 0.7 }
            },
            carwash: {
                name: 'غسيل السيارات',
                description: 'تنظيف وغسيل السيارات في الشارع',
                requirements: { level: 1 },
                rewards: { money: [25, 45], xp: 7, reputation: 2 },
                duration: 60,
                energy: 20,
                skills: ['stamina'],
                riskLevel: 'low',
                timeBonus: { morning: 1.1, afternoon: 1.2, evening: 1.0, night: 0.6 }
            },
            streetvendor: {
                name: 'بائع متجول',
                description: 'بيع الوجبات الخفيفة والمشروبات في الشارع',
                requirements: { level: 2, money: 50 },
                rewards: { money: [30, 60], xp: 8, reputation: 2 },
                duration: 90,
                energy: 25,
                skills: ['charisma'],
                riskLevel: 'medium',
                timeBonus: { morning: 0.8, afternoon: 1.1, evening: 1.4, night: 1.2 }
            },
            
            // وظائف الحي التجاري
            office: {
                name: 'عمل مكتبي',
                description: 'أعمال إدارية بسيطة في المكاتب',
                requirements: { level: 3, reputation: 25 },
                rewards: { money: [60, 100], xp: 15, reputation: 3 },
                duration: 120,
                energy: 25,
                skills: ['persuasion'],
                riskLevel: 'low',
                timeBonus: { morning: 1.2, afternoon: 1.3, evening: 0.8, night: 0.5 }
            },
            sales: {
                name: 'مندوب مبيعات',
                description: 'بيع المنتجات للزبائن وإقناعهم بالشراء',
                requirements: { level: 4, charisma: 3 },
                rewards: { money: [80, 150], xp: 20, reputation: 4 },
                duration: 90,
                energy: 30,
                skills: ['charisma', 'persuasion'],
                riskLevel: 'medium',
                timeBonus: { morning: 1.1, afternoon: 1.3, evening: 1.2, night: 0.7 }
            },
            security: {
                name: 'حارس أمن',
                description: 'حراسة المحلات والمباني التجارية',
                requirements: { level: 3, stamina: 3 },
                rewards: { money: [70, 120], xp: 12, reputation: 3 },
                duration: 180,
                energy: 35,
                skills: ['stamina'],
                riskLevel: 'medium',
                timeBonus: { morning: 0.9, afternoon: 1.0, evening: 1.2, night: 1.4 }
            },
            
            // وظائف الحي الراقي
            valet: {
                name: 'خدمة السيارات',
                description: 'خدمة ركن السيارات في الفنادق الفاخرة',
                requirements: { level: 5, reputation: 100, charisma: 4 },
                rewards: { money: [120, 200], xp: 25, reputation: 5 },
                duration: 120,
                energy: 30,
                skills: ['speed', 'charisma'],
                riskLevel: 'low',
                timeBonus: { morning: 1.0, afternoon: 1.1, evening: 1.3, night: 1.2 }
            },
            butler: {
                name: 'خادم شخصي',
                description: 'خدمة الأثرياء في منازلهم الفاخرة',
                requirements: { level: 6, reputation: 150, persuasion: 4 },
                rewards: { money: [150, 250], xp: 30, reputation: 6 },
                duration: 240,
                energy: 40,
                skills: ['persuasion', 'charisma'],
                riskLevel: 'low',
                timeBonus: { morning: 1.2, afternoon: 1.3, evening: 1.1, night: 0.9 }
            },
            driver: {
                name: 'سائق خاص',
                description: 'قيادة السيارات الفاخرة لكبار الشخصيات',
                requirements: { level: 5, reputation: 120, speed: 4 },
                rewards: { money: [100, 180], xp: 22, reputation: 5 },
                duration: 150,
                energy: 25,
                skills: ['speed'],
                riskLevel: 'medium',
                timeBonus: { morning: 1.3, afternoon: 1.2, evening: 1.1, night: 1.0 }
            },
            
            // وظائف خاصة ومخاطر عالية
            smuggling: {
                name: 'تهريب البضائع',
                description: 'نقل البضائع المشبوهة عبر المدينة (خطر عالي)',
                requirements: { level: 7, reputation: 200, speed: 5 },
                rewards: { money: [200, 400], xp: 40, reputation: 10, shadowCoins: 2 },
                duration: 180,
                energy: 50,
                skills: ['speed', 'stamina'],
                riskLevel: 'high',
                timeBonus: { morning: 0.7, afternoon: 0.8, evening: 1.2, night: 1.5 }
            },
            hacking: {
                name: 'قرصنة إلكترونية',
                description: 'اختراق الأنظمة الإلكترونية للشركات (خطر عالي)',
                requirements: { level: 8, reputation: 250, persuasion: 6 },
                rewards: { money: [300, 500], xp: 50, reputation: 15, shadowCoins: 3 },
                duration: 240,
                energy: 60,
                skills: ['persuasion'],
                riskLevel: 'high',
                timeBonus: { morning: 0.8, afternoon: 0.9, evening: 1.1, night: 1.3 }
            }
        };
        
        this.shops = {
            tools: {
                name: 'متجر الأدوات',
                description: 'أدوات تساعدك في العمل والحياة اليومية',
                items: {
                    backpack: { name: 'حقيبة ظهر', price: 100, effect: { speed: 1 }, description: 'تزيد من سرعة التنقل' },
                    phone: { name: 'هاتف ذكي', price: 300, effect: { efficiency: 1.2 }, description: 'يحسن من كفاءة العمل' },
                    bicycle: { name: 'دراجة هوائية', price: 500, effect: { speed: 2 }, description: 'تزيد من سرعة التوصيل' }
                }
            },
            clothes: {
                name: 'متجر الملابس',
                description: 'ملابس تحسن من مظهرك وكاريزمتك',
                items: {
                    casual: { name: 'ملابس عادية', price: 80, effect: { charisma: 1 }, description: 'تحسن من مظهرك العام' },
                    business: { name: 'بدلة عمل', price: 400, effect: { charisma: 2, persuasion: 1 }, description: 'مناسبة للأعمال الرسمية' },
                    street: { name: 'ملابس الشارع', price: 150, effect: { reputation: 5 }, description: 'تكسبك احترام أهل الحي' }
                }
            }
        };
        
        this.npcs = [
            {
                name: 'أبو أحمد',
                type: 'shop_owner',
                location: 'downtown',
                dialogue: ['أهلاً وسهلاً يا ولد!', 'عندي أفضل الأدوات في الحي', 'تحتاج أي حاجة؟'],
                relationship: 0
            },
            {
                name: 'فاطمة',
                type: 'customer',
                location: 'downtown',
                dialogue: ['محتاجة حد يوصلي الطلب', 'أنت شاطر في الشغل', 'شكراً لك'],
                relationship: 0
            }
        ];
        
        this.quests = [];
        this.achievements = [];
        this.settings = {
            language: 'ar',
            sound: true,
            music: true,
            graphics: 'medium',
            autoSave: true
        };
    }
    
    // حفظ حالة اللعبة
    save() {
        localStorage.setItem('shadowCityGame', JSON.stringify(this));
        showNotification('تم حفظ اللعبة بنجاح!');
    }
    
    // تحميل حالة اللعبة
    load() {
        const saved = localStorage.getItem('shadowCityGame');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
            return true;
        }
        return false;
    }
    
    // تحديث الوقت
    updateTime(minutes = 30) {
        this.gameTime.hour += minutes / 60;
        if (this.gameTime.hour >= 24) {
            this.gameTime.hour = 0;
            this.gameTime.day++;
        }
        
        // تحديث فترة اليوم
        if (this.gameTime.hour >= 6 && this.gameTime.hour < 12) {
            this.gameTime.period = 'morning';
        } else if (this.gameTime.hour >= 12 && this.gameTime.hour < 18) {
            this.gameTime.period = 'afternoon';
        } else if (this.gameTime.hour >= 18 && this.gameTime.hour < 22) {
            this.gameTime.period = 'evening';
        } else {
            this.gameTime.period = 'night';
        }
        
        // تحديث الطقس عشوائياً
        if (Math.random() < 0.1) {
            const weathers = ['sunny', 'cloudy', 'rainy'];
            this.weather = weathers[Math.floor(Math.random() * weathers.length)];
        }
    }
    
    // تحديث مستوى اللاعب
    updateLevel() {
        const xpNeeded = this.player.level * 100;
        if (this.player.xp >= xpNeeded) {
            this.player.level++;
            this.player.xp -= xpNeeded;
            showNotification(`تهانينا! وصلت للمستوى ${this.player.level}!`);
            return true;
        }
        return false;
    }
    
    // إضافة مال
    addMoney(amount) {
        this.player.money += amount;
        updateUI();
    }
    
    // إضافة خبرة
    addXP(amount) {
        this.player.xp += amount;
        this.updateLevel();
        updateUI();
    }
    
    // إضافة سمعة
    addReputation(amount) {
        this.player.reputation += amount;
        updateUI();
    }
    
    // التحقق من متطلبات العمل
    canDoJob(jobId) {
        const job = this.jobs[jobId];
        const player = this.player;
        
        if (job.requirements.level && player.level < job.requirements.level) {
            return { can: false, reason: `تحتاج للمستوى ${job.requirements.level}` };
        }
        
        if (job.requirements.reputation && player.reputation < job.requirements.reputation) {
            return { can: false, reason: `تحتاج لسمعة ${job.requirements.reputation}` };
        }
        
        if (player.energy < job.energy) {
            return { can: false, reason: 'ليس لديك طاقة كافية' };
        }
        
        return { can: true };
    }
    
    // تنفيذ عمل
    doJob(jobId) {
        const job = this.jobs[jobId];
        const check = this.canDoJob(jobId);
        
        if (!check.can) {
            showNotification(check.reason);
            return false;
        }
        
        // تقليل الطاقة
        this.player.energy -= job.energy;
        
        // حساب المكافآت الأساسية
        const baseMoneyReward = Math.floor(Math.random() * (job.rewards.money[1] - job.rewards.money[0] + 1)) + job.rewards.money[0];
        
        // تطبيق مكافأة الوقت
        const timeMultiplier = job.timeBonus ? job.timeBonus[this.gameTime.period] || 1.0 : 1.0;
        
        // تطبيق تأثير المهارات
        let skillMultiplier = 1.0;
        job.skills.forEach(skill => {
            if (this.player.skills[skill] > 1) {
                skillMultiplier += (this.player.skills[skill] - 1) * 0.15;
            }
        });
        
        // تطبيق تأثير الطقس
        let weatherMultiplier = 1.0;
        if (this.weather === 'rainy' && job.skills.includes('stamina')) {
            weatherMultiplier = 0.8; // المطر يقلل الكفاءة للأعمال البدنية
        } else if (this.weather === 'sunny' && job.skills.includes('charisma')) {
            weatherMultiplier = 1.1; // الطقس المشمس يحسن التفاعل الاجتماعي
        }
        
        // حساب المكافآت النهائية
        let finalMoney = Math.floor(baseMoneyReward * timeMultiplier * skillMultiplier * weatherMultiplier);
        let finalXP = job.rewards.xp;
        let finalReputation = job.rewards.reputation;
        
        // التعامل مع المخاطر
        let riskEvent = this.handleJobRisk(job);
        if (riskEvent.failed) {
            finalMoney = Math.floor(finalMoney * 0.3); // خسارة معظم المال
            finalXP = Math.floor(finalXP * 0.5);
            finalReputation = Math.floor(finalReputation * 0.5);
            showEvent(riskEvent.message);
        } else if (riskEvent.bonus) {
            finalMoney = Math.floor(finalMoney * 1.5); // مكافأة إضافية
            finalXP = Math.floor(finalXP * 1.2);
            showEvent(riskEvent.message);
        }
        
        // إضافة المكافآت
        this.addMoney(finalMoney);
        this.addXP(finalXP);
        this.addReputation(finalReputation);
        
        // إضافة عملات الظل للوظائف عالية المخاطر
        if (job.rewards.shadowCoins && !riskEvent.failed) {
            this.player.shadowCoins += job.rewards.shadowCoins;
        }
        
        // تحديث الوقت
        this.updateTime(job.duration);
        
        // تحديث الطاقة تدريجياً بناءً على نوع العمل
        if (job.skills.includes('stamina')) {
            this.player.skills.stamina += 0.01; // تحسن تدريجي في التحمل
        }
        
        // حفظ تلقائي
        if (this.settings.autoSave) {
            this.save();
        }
        
        return {
            money: finalMoney,
            xp: finalXP,
            reputation: finalReputation,
            shadowCoins: job.rewards.shadowCoins || 0,
            riskEvent: riskEvent
        };
    }
    
    // التعامل مع مخاطر العمل
    handleJobRisk(job) {
        const riskChance = Math.random();
        
        switch (job.riskLevel) {
            case 'low':
                if (riskChance < 0.05) { // 5% فرصة مشكلة بسيطة
                    return { failed: false, bonus: false, message: 'واجهت مشكلة بسيطة لكنك تعاملت معها بحكمة.' };
                } else if (riskChance > 0.95) { // 5% فرصة مكافأة
                    return { failed: false, bonus: true, message: 'أعجب الزبون بعملك وأعطاك مكافأة إضافية!' };
                }
                break;
                
            case 'medium':
                if (riskChance < 0.15) { // 15% فرصة مشكلة
                    return { failed: true, bonus: false, message: 'حدثت مشكلة أثناء العمل وخسرت معظم أرباحك.' };
                } else if (riskChance > 0.85) { // 15% فرصة مكافأة
                    return { failed: false, bonus: true, message: 'نجحت في إقناع عميل إضافي وحصلت على مكافأة!' };
                }
                break;
                
            case 'high':
                if (riskChance < 0.25) { // 25% فرصة فشل
                    const penalties = [
                        'تم القبض عليك من قبل الشرطة وفقدت معظم أرباحك!',
                        'خانك شريكك في العملية وهرب بالمال!',
                        'اكتشف أحدهم هويتك وتعرضت للتهديد!',
                        'فشلت العملية وتعرضت لخسائر كبيرة!'
                    ];
                    return { 
                        failed: true, 
                        bonus: false, 
                        message: penalties[Math.floor(Math.random() * penalties.length)]
                    };
                } else if (riskChance > 0.80) { // 20% فرصة نجاح كبير
                    const bonuses = [
                        'نجحت العملية بشكل مثالي وحصلت على مكافأة ضخمة!',
                        'وجدت معلومات قيمة إضافية وبعتها بسعر عالي!',
                        'أعجب الزبون بمهارتك وأعطاك عملاً إضافياً!',
                        'تمكنت من إنجاز المهمة بسرعة قياسية!'
                    ];
                    return { 
                        failed: false, 
                        bonus: true, 
                        message: bonuses[Math.floor(Math.random() * bonuses.length)]
                    };
                }
                break;
        }
        
        return { failed: false, bonus: false, message: null };
    }
}

// متغيرات عامة
let gameState = new GameState();
let currentScreen = 'loading';

// بدء اللعبة
window.addEventListener('load', function() {
    initGame();
});

function initGame() {
    // محاكاة التحميل
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                showScreen('main-menu');
                checkSavedGame();
            }, 500);
        }
        
        document.getElementById('loading-progress').style.width = progress + '%';
        document.getElementById('loading-text').textContent = 
            progress < 30 ? 'جاري تحميل الموارد...' :
            progress < 60 ? 'جاري إعداد المدينة...' :
            progress < 90 ? 'جاري تحضير المغامرة...' : 'مكتمل!';
    }, 100);
}

function checkSavedGame() {
    if (localStorage.getItem('shadowCityGame')) {
        document.getElementById('load-btn').disabled = false;
    }
}

function showScreen(screenId) {
    // إخفاء جميع الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // إظهار الشاشة المطلوبة
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function startNewGame() {
    showScreen('character-creation');
    setupCharacterCreation();
}

function loadGame() {
    if (gameState.load()) {
        showScreen('game-screen');
        updateUI();
        updateGameDisplay();
        showNotification('تم تحميل اللعبة بنجاح!');
    } else {
        showNotification('لا توجد لعبة محفوظة!');
    }
}

function setupCharacterCreation() {
    const nameInput = document.getElementById('player-name');
    const backgroundOptions = document.querySelectorAll('.background-option');
    const createBtn = document.querySelector('.create-btn');
    
    let selectedBackground = null;
    
    // معالج اختيار الخلفية
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            backgroundOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedBackground = this.dataset.background;
            checkCreateButton();
        });
    });
    
    // معالج إدخال الاسم
    nameInput.addEventListener('input', checkCreateButton);
    
    function checkCreateButton() {
        const name = nameInput.value.trim();
        if (name && selectedBackground) {
            createBtn.disabled = false;
        } else {
            createBtn.disabled = true;
        }
    }
}

function createCharacter() {
    const name = document.getElementById('player-name').value.trim();
    const selectedOption = document.querySelector('.background-option.selected');
    
    if (!name || !selectedOption) {
        showNotification('يرجى ملء جميع البيانات!');
        return;
    }
    
    const background = selectedOption.dataset.background;
    
    // إعداد الشخصية
    gameState.player.name = name;
    gameState.player.background = background;
    
    // تطبيق مكافآت الخلفية
    switch (background) {
        case 'student':
            gameState.player.money = 500;
            gameState.player.skills.persuasion = 2;
            break;
        case 'worker':
            gameState.player.money = 300;
            gameState.player.skills.stamina = 2;
            break;
        case 'street':
            gameState.player.money = 200;
            gameState.player.skills.charisma = 2;
            break;
    }
    
    // بدء اللعبة
    showScreen('game-screen');
    updateUI();
    updateGameDisplay();
    
    // رسالة ترحيب
    showEvent(`مرحباً ${name}! مرحباً بك في Shadow City. رحلتك نحو السيطرة على المدينة تبدأ الآن...`);
    
    // حفظ اللعبة
    gameState.save();
}

function updateUI() {
    document.getElementById('money').textContent = gameState.player.money;
    document.getElementById('xp').textContent = gameState.player.xp;
    document.getElementById('reputation').textContent = gameState.player.reputation;
    document.getElementById('level').textContent = gameState.player.level;
    
    // إضافة عرض عملات الظل إذا كان اللاعب يمتلك أي منها
    if (gameState.player.shadowCoins > 0) {
        let shadowCoinsElement = document.getElementById('shadow-coins');
        if (!shadowCoinsElement) {
            // إنشاء عنصر عملات الظل إذا لم يكن موجوداً
            const statusBar = document.querySelector('.status-bar');
            const shadowCoinsDiv = document.createElement('div');
            shadowCoinsDiv.className = 'status-item';
            shadowCoinsDiv.innerHTML = `
                <span class="status-label">عملات الظل:</span>
                <span class="status-value" id="shadow-coins" style="color: #ff6b6b;">${gameState.player.shadowCoins}</span>
            `;
            statusBar.appendChild(shadowCoinsDiv);
        } else {
            shadowCoinsElement.textContent = gameState.player.shadowCoins;
        }
    }
}

function updateGameDisplay() {
    const location = gameState.locations[gameState.player.currentLocation];
    document.getElementById('current-location').textContent = location.name;
    document.getElementById('location-description').textContent = location.description;
    
    // تحديث الوقت والطقس
    const timeText = getTimeText(gameState.gameTime.period);
    const weatherText = getWeatherText(gameState.weather);
    document.getElementById('game-time').textContent = timeText;
    document.getElementById('game-weather').textContent = weatherText;
}

function getTimeText(period) {
    switch (period) {
        case 'morning': return 'الصباح';
        case 'afternoon': return 'بعد الظهر';
        case 'evening': return 'المساء';
        case 'night': return 'الليل';
        default: return 'الصباح';
    }
}

function getWeatherText(weather) {
    switch (weather) {
        case 'sunny': return 'مشمس';
        case 'cloudy': return 'غائم';
        case 'rainy': return 'ممطر';
        default: return 'مشمس';
    }
}

function showEvent(text) {
    document.getElementById('event-text').textContent = text;
    document.querySelector('.event-area').classList.add('fade-in');
    setTimeout(() => {
        document.querySelector('.event-area').classList.remove('fade-in');
    }, 500);
}

function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // إخفاء الإشعار
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showModal(title, content) {
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="close-btn" onclick="hideModal()">×</button>
        </div>
        <div class="modal-body">
            ${content}
        </div>
    `;
    
    overlay.classList.add('active');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// وظائف الأفعال
function showJobsModal() {
    const location = gameState.locations[gameState.player.currentLocation];
    const availableJobs = location.jobs;
    
    let jobsHTML = '';
    availableJobs.forEach(jobId => {
        const job = gameState.jobs[jobId];
        const canDo = gameState.canDoJob(jobId);
        
        // تحديد لون المخاطر
        let riskColor = '#4ecdc4'; // منخفض
        if (job.riskLevel === 'medium') riskColor = '#ffa726';
        if (job.riskLevel === 'high') riskColor = '#ff6b6b';
        
        // تحديد مكافأة الوقت الحالية
        const timeMultiplier = job.timeBonus ? job.timeBonus[gameState.gameTime.period] || 1.0 : 1.0;
        const timeBonus = timeMultiplier > 1.0 ? `(+${Math.round((timeMultiplier - 1) * 100)}%)` : 
                         timeMultiplier < 1.0 ? `(${Math.round((timeMultiplier - 1) * 100)}%)` : '';
        
        jobsHTML += `
            <div class="job-card ${canDo.can ? 'available' : 'locked'}" 
                 onclick="${canDo.can ? `doJobAction('${jobId}')` : ''}"
                 style="border-left: 4px solid ${riskColor}">
                <div class="job-header">
                    <h4>${job.name}</h4>
                    <div class="job-risk" style="color: ${riskColor}">
                        ${job.riskLevel === 'low' ? '🟢 آمن' : 
                          job.riskLevel === 'medium' ? '🟡 متوسط' : '🔴 خطر عالي'}
                    </div>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-details">
                    <div class="job-rewards">
                        <span>💰 المال: ${job.rewards.money[0]}-${job.rewards.money[1]} ${timeBonus}</span>
                        <span>⭐ الخبرة: ${job.rewards.xp}</span>
                        <span>👑 السمعة: ${job.rewards.reputation}</span>
                        ${job.rewards.shadowCoins ? `<span style="color: #ff6b6b">🔮 عملات الظل: ${job.rewards.shadowCoins}</span>` : ''}
                    </div>
                    <div class="job-requirements">
                        <span>⚡ الطاقة: ${job.energy}</span>
                        <span>⏱️ المدة: ${job.duration} دقيقة</span>
                        ${job.skills.length > 0 ? `<span>🎯 المهارات: ${job.skills.map(s => getSkillName(s)).join(', ')}</span>` : ''}
                    </div>
                </div>
                ${!canDo.can ? `<div class="job-locked">${canDo.reason}</div>` : ''}
            </div>
        `;
    });
    
    showModal('الوظائف المتاحة', `
        <div class="jobs-container">
            ${jobsHTML}
        </div>
    `);
}

function getSkillName(skillId) {
    const skillNames = {
        'speed': 'السرعة',
        'stamina': 'التحمل', 
        'charisma': 'الكاريزما',
        'persuasion': 'الإقناع'
    };
    return skillNames[skillId] || skillId;
}

function doJobAction(jobId) {
    const result = gameState.doJob(jobId);
    if (result) {
        hideModal();
        
        let message = `أنهيت العمل بنجاح! حصلت على ${result.money} جنيه و ${result.xp} خبرة و ${result.reputation} سمعة.`;
        
        if (result.shadowCoins > 0) {
            message += ` وحصلت على ${result.shadowCoins} عملة ظل!`;
        }
        
        if (result.riskEvent && result.riskEvent.message) {
            message += `\n\n${result.riskEvent.message}`;
        }
        
        showNotification(message);
        updateUI();
        updateGameDisplay();
    }
}

function showShops() {
    const location = gameState.locations[gameState.player.currentLocation];
    let shopsHTML = '<div class="shop-list">';
    
    location.shops.forEach(shopId => {
        const shop = gameState.shops[shopId];
        shopsHTML += `
            <div class="shop-item" onclick="showShopItems('${shopId}')">
                <div class="item-title">${shop.name}</div>
                <div class="item-description">${shop.description}</div>
            </div>
        `;
    });
    
    shopsHTML += '</div>';
    showModal('المتاجر المتاحة', shopsHTML);
}

function showShopItems(shopId) {
    const shop = gameState.shops[shopId];
    let itemsHTML = `<h3>${shop.name}</h3><div class="shop-list">`;
    
    Object.keys(shop.items).forEach(itemId => {
        const item = shop.items[itemId];
        const canBuy = gameState.player.money >= item.price;
        
        itemsHTML += `
            <div class="shop-item ${canBuy ? '' : 'disabled'}" onclick="${canBuy ? `buyItem('${shopId}', '${itemId}')` : ''}">
                <div class="item-title">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-stats">
                    <span>السعر: ${item.price} جنيه</span>
                </div>
                ${!canBuy ? '<div style="color: #ff6b6b; font-size: 0.8rem;">ليس لديك مال كافي</div>' : ''}
            </div>
        `;
    });
    
    itemsHTML += '</div>';
    showModal('عناصر المتجر', itemsHTML);
}

function buyItem(shopId, itemId) {
    const item = gameState.shops[shopId].items[itemId];
    
    if (gameState.player.money >= item.price) {
        gameState.player.money -= item.price;
        gameState.player.inventory.push({ ...item, id: itemId });
        
        // تطبيق تأثيرات العنصر
        if (item.effect) {
            Object.keys(item.effect).forEach(stat => {
                if (gameState.player.skills[stat]) {
                    gameState.player.skills[stat] += item.effect[stat];
                }
            });
        }
        
        hideModal();
        showNotification(`اشتريت ${item.name} بنجاح!`);
        updateUI();
        gameState.save();
    }
}

function showSkills() {
    const skills = gameState.player.skills;
    let skillsHTML = '<div class="skill-list">';
    
    Object.keys(skills).forEach(skillId => {
        const skillLevel = skills[skillId];
        const upgradeCost = skillLevel * 50;
        const canUpgrade = gameState.player.money >= upgradeCost;
        
        const skillNames = {
            speed: 'السرعة',
            persuasion: 'الإقناع',
            stamina: 'التحمل',
            charisma: 'الكاريزما'
        };
        
        skillsHTML += `
            <div class="skill-item">
                <div class="item-title">${skillNames[skillId]}</div>
                <div class="item-description">المستوى الحالي: ${skillLevel}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(skillLevel * 20, 100)}%"></div>
                </div>
                <div class="item-stats">
                    <span>تكلفة التطوير: ${upgradeCost} جنيه</span>
                    <button class="action-btn" onclick="upgradeSkill('${skillId}')" ${!canUpgrade ? 'disabled' : ''}>
                        طور المهارة
                    </button>
                </div>
            </div>
        `;
    });
    
    skillsHTML += '</div>';
    showModal('المهارات', skillsHTML);
}

function upgradeSkill(skillId) {
    const currentLevel = gameState.player.skills[skillId];
    const cost = currentLevel * 50;
    
    if (gameState.player.money >= cost) {
        gameState.player.money -= cost;
        gameState.player.skills[skillId]++;
        
        hideModal();
        showNotification(`تم تطوير المهارة بنجاح!`);
        updateUI();
        gameState.save();
        
        // إعادة فتح نافذة المهارات لإظهار التحديث
        setTimeout(() => showSkills(), 500);
    }
}

function showInventory() {
    let inventoryHTML = '<div class="inventory-grid">';
    
    // إظهار العناصر الموجودة
    gameState.player.inventory.forEach((item, index) => {
        inventoryHTML += `
            <div class="inventory-slot" onclick="useItem(${index})">
                <div class="slot-icon">📦</div>
                <div class="slot-name">${item.name}</div>
            </div>
        `;
    });
    
    // إضافة فتحات فارغة
    for (let i = gameState.player.inventory.length; i < 20; i++) {
        inventoryHTML += `
            <div class="inventory-slot empty">
                <div class="slot-icon">📦</div>
                <div class="slot-name">فارغ</div>
            </div>
        `;
    }
    
    inventoryHTML += '</div>';
    showModal('الحقيبة', inventoryHTML);
}

function useItem(index) {
    const item = gameState.player.inventory[index];
    showNotification(`استخدمت ${item.name}`);
    // يمكن إضافة منطق استخدام العناصر هنا
}

// وظائف القائمة السفلية
function showMap() {
    let mapHTML = '<div class="location-list">';
    
    Object.keys(gameState.locations).forEach(locationId => {
        const location = gameState.locations[locationId];
        const isUnlocked = location.unlocked || checkLocationRequirements(locationId);
        const isCurrent = locationId === gameState.player.currentLocation;
        
        mapHTML += `
            <div class="location-item ${isUnlocked ? '' : 'locked'} ${isCurrent ? 'current' : ''}" 
                 onclick="${isUnlocked && !isCurrent ? `moveToLocation('${locationId}')` : ''}">
                <div class="item-title">${location.name}</div>
                <div class="item-description">${location.description}</div>
                ${!isUnlocked ? '<div style="color: #ff6b6b;">مقفل - تحتاج لمتطلبات خاصة</div>' : ''}
                ${isCurrent ? '<div style="color: #4ecdc4;">الموقع الحالي</div>' : ''}
            </div>
        `;
    });
    
    mapHTML += '</div>';
    showModal('خريطة المدينة', mapHTML);
}

function checkLocationRequirements(locationId) {
    const location = gameState.locations[locationId];
    if (!location.requirements) return true;
    
    const req = location.requirements;
    const player = gameState.player;
    
    if (req.reputation && player.reputation < req.reputation) return false;
    if (req.money && player.money < req.money) return false;
    if (req.level && player.level < req.level) return false;
    
    return true;
}

function moveToLocation(locationId) {
    gameState.player.currentLocation = locationId;
    gameState.locations[locationId].unlocked = true;
    
    hideModal();
    updateGameDisplay();
    showEvent(`انتقلت إلى ${gameState.locations[locationId].name}`);
    gameState.save();
}

function showQuests() {
    let questsHTML = '<div class="quest-list">';
    
    if (gameState.quests.length === 0) {
        questsHTML += '<p>لا توجد مهمات متاحة حالياً. تحقق لاحقاً!</p>';
    } else {
        gameState.quests.forEach(quest => {
            questsHTML += `
                <div class="quest-item">
                    <div class="item-title">${quest.name}</div>
                    <div class="item-description">${quest.description}</div>
                    <div class="item-stats">
                        <span>المكافأة: ${quest.reward}</span>
                    </div>
                </div>
            `;
        });
    }
    
    questsHTML += '</div>';
    showModal('المهمات', questsHTML);
}

function showStats() {
    const player = gameState.player;
    const statsHTML = `
        <div class="stats-container">
            <h3>إحصائيات اللاعب</h3>
            <div class="stat-row">
                <span>الاسم:</span>
                <span>${player.name}</span>
            </div>
            <div class="stat-row">
                <span>الخلفية:</span>
                <span>${getBackgroundName(player.background)}</span>
            </div>
            <div class="stat-row">
                <span>المستوى:</span>
                <span>${player.level}</span>
            </div>
            <div class="stat-row">
                <span>المال:</span>
                <span>${player.money} جنيه</span>
            </div>
            <div class="stat-row">
                <span>الخبرة:</span>
                <span>${player.xp}</span>
            </div>
            <div class="stat-row">
                <span>السمعة:</span>
                <span>${player.reputation}</span>
            </div>
            <div class="stat-row">
                <span>الطاقة:</span>
                <span>${player.energy}/100</span>
            </div>
            <div class="stat-row">
                <span>الصحة:</span>
                <span>${player.health}/100</span>
            </div>
            <div class="stat-row">
                <span>العناصر:</span>
                <span>${player.inventory.length}/20</span>
            </div>
            <div class="stat-row">
                <span>الأيام المنقضية:</span>
                <span>${gameState.gameTime.day}</span>
            </div>
        </div>
    `;
    
    showModal('الإحصائيات', statsHTML);
}

function getBackgroundName(background) {
    switch (background) {
        case 'student': return 'طالب جامعي';
        case 'worker': return 'عامل بسيط';
        case 'street': return 'شاب الشارع';
        default: return 'غير محدد';
    }
}

function showSettings() {
    const settings = gameState.settings;
    const settingsHTML = `
        <div class="settings-container">
            <h3>الإعدادات</h3>
            <div class="setting-group">
                <label>اللغة:</label>
                <select id="language-select" onchange="changeSetting('language', this.value)">
                    <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
            <div class="setting-group">
                <label>
                    <input type="checkbox" ${settings.sound ? 'checked' : ''} 
                           onchange="changeSetting('sound', this.checked)">
                    الأصوات
                </label>
            </div>
            <div class="setting-group">
                <label>
                    <input type="checkbox" ${settings.music ? 'checked' : ''} 
                           onchange="changeSetting('music', this.checked)">
                    الموسيقى
                </label>
            </div>
            <div class="setting-group">
                <label>
                    <input type="checkbox" ${settings.autoSave ? 'checked' : ''} 
                           onchange="changeSetting('autoSave', this.checked)">
                    الحفظ التلقائي
                </label>
            </div>
            <div class="setting-group">
                <button class="action-btn" onclick="saveGame()">حفظ اللعبة</button>
                <button class="action-btn" onclick="resetGame()">إعادة تعيين اللعبة</button>
            </div>
        </div>
    `;
    
    showModal('الإعدادات', settingsHTML);
}

function changeSetting(key, value) {
    gameState.settings[key] = value;
    gameState.save();
    showNotification('تم حفظ الإعدادات');
}

function saveGame() {
    gameState.save();
    hideModal();
}

function resetGame() {
    if (confirm('هل أنت متأكد من إعادة تعيين اللعبة؟ سيتم فقدان جميع البيانات!')) {
        localStorage.removeItem('shadowCityGame');
        location.reload();
    }
}

function showCredits() {
    const creditsHTML = `
        <div class="credits-container">
            <h3>Shadow City: Simulator of Streets</h3>
            <p><strong>الإصدار:</strong> 1.0.0</p>
            <p><strong>المطور:</strong> Manus AI</p>
            <p><strong>النوع:</strong> محاكي حياة نصي</p>
            <br>
            <p>لعبة محاكاة حياة تفاعلية حيث تبدأ من الصفر وتسعى للسيطرة على المدينة.</p>
            <br>
            <p><strong>الميزات:</strong></p>
            <ul>
                <li>نظام وظائف متنوع</li>
                <li>متاجر وتطويرات</li>
                <li>نظام مهارات قابل للتطوير</li>
                <li>أحداث عشوائية</li>
                <li>دورة ليل ونهار</li>
                <li>شخصيات غير لاعبة</li>
            </ul>
            <br>
            <p>شكراً لك على اللعب!</p>
        </div>
    `;
    
    showModal('حول اللعبة', creditsHTML);
}

// تحديث الطاقة تلقائياً
setInterval(() => {
    if (gameState.player.energy < 100) {
        gameState.player.energy = Math.min(100, gameState.player.energy + 1);
        updateUI();
    }
}, 60000); // كل دقيقة

// إضافة مستمع للنقر خارج النافذة المنبثقة لإغلاقها
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        hideModal();
    }
});



// نظام المتاجر المتقدم
function showShops() {
    const location = gameState.locations[gameState.player.currentLocation];
    const availableShops = location.shops || [];
    
    let shopsHTML = '<div class="shops-container">';
    
    availableShops.forEach(shopId => {
        const shop = gameState.shops[shopId];
        if (shop) {
            shopsHTML += `
                <div class="shop-card" onclick="openShop('${shopId}')">
                    <div class="shop-header">
                        <h3>${shop.name}</h3>
                        <span class="shop-type">${shop.type}</span>
                    </div>
                    <p class="shop-description">${shop.description}</p>
                    <div class="shop-items-preview">
                        ${shop.items.slice(0, 3).map(itemId => {
                            const item = gameState.items[itemId];
                            return item ? `<span class="item-preview">${item.name}</span>` : '';
                        }).join('')}
                        ${shop.items.length > 3 ? `<span class="more-items">+${shop.items.length - 3} المزيد</span>` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    shopsHTML += '</div>';
    
    showModal('المتاجر المتاحة', shopsHTML);
}

function openShop(shopId) {
    const shop = gameState.shops[shopId];
    if (!shop) return;
    
    let shopHTML = `
        <div class="shop-interface">
            <div class="shop-header">
                <h2>${shop.name}</h2>
                <p>${shop.description}</p>
            </div>
            <div class="shop-items">
    `;
    
    shop.items.forEach(itemId => {
        const item = gameState.items[itemId];
        if (item) {
            const canAfford = gameState.player.money >= item.price;
            const hasItem = gameState.player.inventory.some(invItem => invItem.id === itemId);
            
            shopHTML += `
                <div class="shop-item ${canAfford ? 'affordable' : 'expensive'} ${hasItem ? 'owned' : ''}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="item-effects">
                            ${item.effects ? Object.entries(item.effects).map(([effect, value]) => 
                                `<span class="effect">+${value} ${getEffectName(effect)}</span>`
                            ).join('') : ''}
                        </div>
                    </div>
                    <div class="item-purchase">
                        <div class="item-price">${item.price} جنيه</div>
                        ${hasItem ? 
                            '<button class="owned-btn" disabled>مملوك</button>' :
                            `<button class="buy-btn" onclick="buyItem('${itemId}')" ${!canAfford ? 'disabled' : ''}>
                                ${canAfford ? 'شراء' : 'لا يمكن الشراء'}
                            </button>`
                        }
                    </div>
                </div>
            `;
        }
    });
    
    shopHTML += '</div></div>';
    
    showModal(shop.name, shopHTML);
}

function getEffectName(effect) {
    const effectNames = {
        'speed': 'السرعة',
        'stamina': 'التحمل',
        'charisma': 'الكاريزما',
        'persuasion': 'الإقناع',
        'energy': 'الطاقة',
        'moneyMultiplier': 'مضاعف المال'
    };
    return effectNames[effect] || effect;
}

function buyItem(itemId) {
    const item = gameState.items[itemId];
    if (!item || gameState.player.money < item.price) {
        showNotification('لا تملك مالاً كافياً لشراء هذا العنصر!');
        return;
    }
    
    // التحقق من عدم امتلاك العنصر مسبقاً
    if (gameState.player.inventory.some(invItem => invItem.id === itemId)) {
        showNotification('تملك هذا العنصر بالفعل!');
        return;
    }
    
    // خصم المال
    gameState.player.money -= item.price;
    
    // إضافة العنصر للمخزون
    gameState.player.inventory.push({
        id: itemId,
        name: item.name,
        type: item.type,
        effects: item.effects,
        equipped: false
    });
    
    // تطبيق التأثيرات إذا كان العنصر قابل للارتداء
    if (item.type === 'equipment') {
        equipItem(itemId);
    }
    
    showNotification(`تم شراء ${item.name} بنجاح!`);
    gameState.save();
    updateUI();
    
    // إعادة فتح المتجر لتحديث العرض
    setTimeout(() => {
        const shopId = Object.keys(gameState.shops).find(id => 
            gameState.shops[id].items.includes(itemId)
        );
        if (shopId) openShop(shopId);
    }, 1000);
}

function equipItem(itemId) {
    const inventoryItem = gameState.player.inventory.find(item => item.id === itemId);
    if (!inventoryItem) return;
    
    // إلغاء تجهيز العناصر الأخرى من نفس النوع
    gameState.player.inventory.forEach(item => {
        if (item.type === inventoryItem.type && item.id !== itemId) {
            item.equipped = false;
        }
    });
    
    // تجهيز العنصر الجديد
    inventoryItem.equipped = true;
    
    showNotification(`تم تجهيز ${inventoryItem.name}!`);
}

// نظام المهارات المتقدم
function showSkills() {
    const skills = gameState.player.skills;
    const availablePoints = gameState.player.skillPoints;
    
    let skillsHTML = `
        <div class="skills-interface">
            <div class="skills-header">
                <h2>المهارات</h2>
                <div class="skill-points">نقاط المهارة المتاحة: <span class="points-count">${availablePoints}</span></div>
            </div>
            <div class="skills-grid">
    `;
    
    Object.entries(skills).forEach(([skillId, level]) => {
        const skillInfo = getSkillInfo(skillId);
        const maxLevel = 10;
        const canUpgrade = level < maxLevel && availablePoints > 0;
        const upgradeCost = level + 1;
        
        skillsHTML += `
            <div class="skill-card">
                <div class="skill-header">
                    <h3>${skillInfo.name}</h3>
                    <div class="skill-level">المستوى ${level}/${maxLevel}</div>
                </div>
                <p class="skill-description">${skillInfo.description}</p>
                <div class="skill-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(level / maxLevel) * 100}%"></div>
                    </div>
                </div>
                <div class="skill-effects">
                    <div class="current-effect">التأثير الحالي: ${skillInfo.getCurrentEffect(level)}</div>
                    ${level < maxLevel ? 
                        `<div class="next-effect">التأثير التالي: ${skillInfo.getCurrentEffect(level + 1)}</div>` : 
                        '<div class="max-level">وصلت للحد الأقصى!</div>'
                    }
                </div>
                ${canUpgrade && availablePoints >= upgradeCost ? 
                    `<button class="upgrade-btn" onclick="upgradeSkill('${skillId}')">
                        ترقية (${upgradeCost} نقطة)
                    </button>` :
                    `<button class="upgrade-btn" disabled>
                        ${level >= maxLevel ? 'الحد الأقصى' : `يحتاج ${upgradeCost} نقطة`}
                    </button>`
                }
            </div>
        `;
    });
    
    skillsHTML += '</div></div>';
    
    showModal('المهارات', skillsHTML);
}

function getSkillInfo(skillId) {
    const skillsInfo = {
        'speed': {
            name: 'السرعة',
            description: 'تزيد من سرعة إنجاز المهام وتقلل الوقت المطلوب للوظائف',
            getCurrentEffect: (level) => `تقليل الوقت بنسبة ${level * 5}%`
        },
        'stamina': {
            name: 'التحمل',
            description: 'تزيد من الطاقة القصوى وتقلل استنزاف الطاقة',
            getCurrentEffect: (level) => `+${level * 10} طاقة قصوى، تقليل الاستنزاف ${level * 3}%`
        },
        'charisma': {
            name: 'الكاريزما',
            description: 'تحسن التفاعل مع الشخصيات وتزيد الأرباح من الوظائف الاجتماعية',
            getCurrentEffect: (level) => `+${level * 8}% أرباح الوظائف الاجتماعية`
        },
        'persuasion': {
            name: 'الإقناع',
            description: 'تزيد من فرص النجاح في المفاوضات والمهام الصعبة',
            getCurrentEffect: (level) => `+${level * 6}% فرصة نجاح المهام الصعبة`
        }
    };
    
    return skillsInfo[skillId] || {
        name: skillId,
        description: 'مهارة غير معروفة',
        getCurrentEffect: () => 'غير محدد'
    };
}

function upgradeSkill(skillId) {
    const currentLevel = gameState.player.skills[skillId];
    const upgradeCost = currentLevel + 1;
    
    if (gameState.player.skillPoints < upgradeCost) {
        showNotification('لا تملك نقاط مهارة كافية!');
        return;
    }
    
    if (currentLevel >= 10) {
        showNotification('هذه المهارة وصلت للحد الأقصى!');
        return;
    }
    
    // ترقية المهارة
    gameState.player.skills[skillId]++;
    gameState.player.skillPoints -= upgradeCost;
    
    const skillInfo = getSkillInfo(skillId);
    showNotification(`تم ترقية ${skillInfo.name} إلى المستوى ${gameState.player.skills[skillId]}!`);
    
    gameState.save();
    updateUI();
    
    // إعادة فتح نافذة المهارات
    setTimeout(() => showSkills(), 1000);
}

// نظام الحقيبة/المخزون
function showInventory() {
    const inventory = gameState.player.inventory;
    
    let inventoryHTML = `
        <div class="inventory-interface">
            <div class="inventory-header">
                <h2>الحقيبة</h2>
                <div class="inventory-stats">
                    <span>العناصر: ${inventory.length}</span>
                    <span>المال: ${gameState.player.money} جنيه</span>
                </div>
            </div>
            <div class="inventory-grid">
    `;
    
    if (inventory.length === 0) {
        inventoryHTML += '<div class="empty-inventory">الحقيبة فارغة</div>';
    } else {
        inventory.forEach((item, index) => {
            inventoryHTML += `
                <div class="inventory-item ${item.equipped ? 'equipped' : ''}">
                    <div class="item-header">
                        <h4>${item.name}</h4>
                        ${item.equipped ? '<span class="equipped-badge">مُجهز</span>' : ''}
                    </div>
                    <div class="item-type">${getItemTypeName(item.type)}</div>
                    ${item.effects ? `
                        <div class="item-effects">
                            ${Object.entries(item.effects).map(([effect, value]) => 
                                `<span class="effect">+${value} ${getEffectName(effect)}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    <div class="item-actions">
                        ${item.type === 'equipment' && !item.equipped ? 
                            `<button onclick="equipItem('${item.id}')">تجهيز</button>` : ''
                        }
                        ${item.equipped ? 
                            `<button onclick="unequipItem('${item.id}')">إلغاء التجهيز</button>` : ''
                        }
                    </div>
                </div>
            `;
        });
    }
    
    inventoryHTML += '</div></div>';
    
    showModal('الحقيبة', inventoryHTML);
}

function getItemTypeName(type) {
    const typeNames = {
        'equipment': 'معدات',
        'consumable': 'مستهلك',
        'tool': 'أداة',
        'clothing': 'ملابس'
    };
    return typeNames[type] || type;
}

function unequipItem(itemId) {
    const inventoryItem = gameState.player.inventory.find(item => item.id === itemId);
    if (inventoryItem) {
        inventoryItem.equipped = false;
        showNotification(`تم إلغاء تجهيز ${inventoryItem.name}!`);
        gameState.save();
        
        // إعادة فتح المخزون
        setTimeout(() => showInventory(), 1000);
    }
}


// إدارة المستخدمين والشاشات
let userManager = new UserManager();
let gameState = new GameState();

// وظائف تسجيل الدخول والتسجيل
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('يرجى ملء جميع الحقول');
        return;
    }
    
    const result = userManager.login(username, password);
    showNotification(result.message);
    
    if (result.success) {
        // تحميل بيانات اللعبة إذا كانت موجودة
        const savedGameData = userManager.loadGameData();
        if (savedGameData) {
            gameState.load(savedGameData);
            showMainMenu();
        } else {
            showCharacterCreation();
        }
    }
}

function register() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!username || !password || !confirmPassword) {
        showNotification('يرجى ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('كلمات المرور غير متطابقة');
        return;
    }
    
    const result = userManager.register(username, password);
    showNotification(result.message);
    
    if (result.success) {
        // تسجيل دخول تلقائي بعد التسجيل
        userManager.login(username, password);
        showCharacterCreation();
    }
}

function logout() {
    userManager.logout();
    gameState = new GameState(); // إعادة تعيين حالة اللعبة
    showLogin();
}

function showLogin() {
    hideAllScreens();
    document.getElementById('login-screen').classList.add('active');
    
    // مسح الحقول
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showRegister() {
    hideAllScreens();
    document.getElementById('register-screen').classList.add('active');
    
    // مسح الحقول
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function showCharacterCreation() {
    hideAllScreens();
    document.getElementById('character-creation').classList.add('active');
    
    // مسح الحقول
    document.getElementById('player-name').value = '';
    
    // إعادة تعيين اختيار الخلفية
    document.querySelectorAll('.background-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector('.create-btn').disabled = true;
}

function showMainMenu() {
    hideAllScreens();
    document.getElementById('main-menu').classList.add('active');
    
    // تحديث معلومات اللاعب في القائمة
    const currentUser = userManager.getCurrentUser();
    if (currentUser) {
        document.getElementById('current-player-name').textContent = gameState.player.name || currentUser;
        document.getElementById('menu-level').textContent = gameState.player.level;
        document.getElementById('menu-money').textContent = gameState.player.money;
    }
}

function startGame() {
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
    updateUI();
}

function returnToMenu() {
    // حفظ اللعبة قبل العودة للقائمة
    gameState.save();
    userManager.saveGameData(gameState.getState());
    showMainMenu();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// تحسين وظيفة showCredits مع إغلاق تلقائي
function showCredits() {
    const creditsHTML = `
        <div class="credits-content">
            <h2>حول اللعبة</h2>
            <div class="credits-info">
                <h3>Shadow City: Simulator of Streets</h3>
                <p><strong>الإصدار:</strong> 1.0</p>
                <p><strong>المطور:</strong> Manus AI</p>
                <p><strong>النوع:</strong> محاكي حياة / RPG</p>
                <br>
                <h4>الوصف:</h4>
                <p>ابدأ رحلتك من الصفر في مدينة Shadow City الغامضة. اعمل، اكسب المال، طور مهاراتك، وارتقِ في سلم المجتمع حتى تصل إلى قمة المدينة.</p>
                <br>
                <h4>الميزات:</h4>
                <ul>
                    <li>أكثر من 15 وظيفة مختلفة</li>
                    <li>نظام مهارات متقدم</li>
                    <li>4 مناطق قابلة للاستكشاف</li>
                    <li>نظام اقتصادي متطور</li>
                    <li>أحداث عشوائية مثيرة</li>
                </ul>
                <br>
                <p class="auto-close-notice">ستُغلق هذه النافذة تلقائياً خلال <span id="countdown">3</span> ثوانٍ...</p>
            </div>
        </div>
    `;
    
    showModal('حول اللعبة', creditsHTML);
    
    // العد التنازلي والإغلاق التلقائي
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            hideModal();
        }
    }, 1000);
}

// تحسين وظيفة بدء اللعبة الجديدة
function startNewGame() {
    showCharacterCreation();
}

// تحديث وظيفة إنشاء الشخصية
function createCharacter() {
    const playerName = document.getElementById('player-name').value.trim();
    const selectedBackground = document.querySelector('.background-option.selected');
    
    if (!playerName) {
        showNotification('يرجى إدخال اسم الشخصية');
        return;
    }
    
    if (!selectedBackground) {
        showNotification('يرجى اختيار خلفية للشخصية');
        return;
    }
    
    const backgroundType = selectedBackground.dataset.background;
    
    // إنشاء الشخصية
    gameState.createCharacter(playerName, backgroundType);
    
    // حفظ البيانات
    gameState.save();
    userManager.saveGameData(gameState.getState());
    
    showNotification(`مرحباً ${playerName}! تم إنشاء شخصيتك بنجاح.`);
    
    // الانتقال للقائمة الرئيسية
    setTimeout(() => {
        showMainMenu();
    }, 2000);
}

// تحديث وظيفة التحميل الأولي
function initGame() {
    // محاولة تسجيل دخول تلقائي
    if (userManager.autoLogin()) {
        const savedGameData = userManager.loadGameData();
        if (savedGameData) {
            gameState.load(savedGameData);
            
            // التحقق من وجود شخصية
            if (gameState.player.name) {
                showMainMenu();
            } else {
                showCharacterCreation();
            }
        } else {
            showCharacterCreation();
        }
    } else {
        showLogin();
    }
}

// تحديث وظيفة بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // شاشة التحميل
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        initGame();
    }, 2000);
    
    // إعداد أحداث اختيار الخلفية
    document.querySelectorAll('.background-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.background-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.querySelector('.create-btn').disabled = false;
        });
    });
    
    // تحديث شريط التحميل
    let progress = 0;
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress < 30) {
            loadingText.textContent = 'تحميل الأصول...';
        } else if (progress < 60) {
            loadingText.textContent = 'إعداد اللعبة...';
        } else if (progress < 90) {
            loadingText.textContent = 'تحضير الواجهة...';
        } else {
            loadingText.textContent = 'اكتمل التحميل!';
            clearInterval(loadingInterval);
        }
    }, 200);
});


// ربط الأحداث للأزرار
function setupEventListeners() {
    // أزرار تسجيل الدخول
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('register-btn').addEventListener('click', showRegister);
    
    // أزرار التسجيل
    document.getElementById('register-submit-btn').addEventListener('click', register);
    document.getElementById('back-to-login-btn').addEventListener('click', showLogin);
    
    // زر إنشاء الشخصية
    document.getElementById('create-character-btn').addEventListener('click', createCharacter);
    
    // أزرار القائمة الرئيسية
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('change-character-btn').addEventListener('click', showCharacterCreation);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('about-btn').addEventListener('click', showAbout);
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // إعداد أحداث اختيار الخلفية
    document.querySelectorAll('.background-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.background-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('create-character-btn').disabled = false;
        });
    });
}

// تحديث وظيفة بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // إعداد ربط الأحداث
    setupEventListeners();
    
    // شاشة التحميل
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        initGame();
    }, 2000);
    
    // تحديث شريط التحميل
    let progress = 0;
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress < 30) {
            loadingText.textContent = 'تحميل الأصول...';
        } else if (progress < 60) {
            loadingText.textContent = 'إعداد اللعبة...';
        } else if (progress < 90) {
            loadingText.textContent = 'تحضير الواجهة...';
        } else {
            loadingText.textContent = 'اكتمل التحميل!';
            clearInterval(loadingInterval);
        }
    }, 200);
});

// إصلاح وظيفة showAbout مع العد التنازلي
function showAbout() {
    const aboutHTML = `
        <div class="credits-content">
            <div class="credits-info">
                <h3>🎮 Shadow City: Simulator of Streets</h3>
                <p><strong>الإصدار:</strong> 1.0</p>
                <p><strong>المطور:</strong> Manus AI</p>
                <p><strong>النوع:</strong> محاكي حياة نصي</p>
                
                <h4>📋 الميزات:</h4>
                <ul>
                    <li>نظام وظائف متطور مع أكثر من 15 وظيفة</li>
                    <li>4 مناطق مختلفة للاستكشاف</li>
                    <li>نظام مهارات قابل للترقية</li>
                    <li>متاجر متنوعة للتسوق</li>
                    <li>أحداث عشوائية ومخاطر</li>
                    <li>دورة الليل والنهار</li>
                    <li>نظام حفظ تلقائي</li>
                </ul>
                
                <h4>🎯 الهدف:</h4>
                <p>ابدأ من الصفر واعمل طريقك للسيطرة على مدينة Shadow City من خلال العمل، كسب المال، تطوير المهارات، وبناء سمعتك.</p>
                
                <h4>🎮 كيفية اللعب:</h4>
                <ul>
                    <li>ابحث عن وظائف في المناطق المختلفة</li>
                    <li>اكسب المال والخبرة</li>
                    <li>طور مهاراتك لتحسين أدائك</li>
                    <li>اشتر العناصر من المتاجر</li>
                    <li>افتح مناطق جديدة بتحسين سمعتك</li>
                </ul>
                
                <div class="auto-close-notice">
                    <p>ستُغلق هذه النافذة تلقائياً خلال <span id="countdown">3</span> ثوانٍ</p>
                </div>
            </div>
        </div>
    `;
    
    showModal('حول اللعبة', aboutHTML);
    
    // العد التنازلي لإغلاق النافذة
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            hideModal();
        }
    }, 1000);
}


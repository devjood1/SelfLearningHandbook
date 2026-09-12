// Single Page App Logic for Self Learning Handbook

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    const landingPage = document.getElementById('landing-page');
    const btnStart = document.getElementById('btn-start');
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Mobile Drawer Handlers
    function toggleMobileMenu(show) {
        if (show) {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Hide Landing on Start
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            landingPage.style.animation = 'fadeIn 0.4s reverse forwards';
            setTimeout(() => {
                landingPage.style.display = 'none';
            }, 400);
            renderView('monthly-planner');
        });
    }

    // Sidebar navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const targetView = item.getAttribute('data-target');
            renderView(targetView);
            // Close drawer on mobile item tap
            toggleMobileMenu(false);
        });
    });

    // Auto expand textareas on input
    document.addEventListener('input', (e) => {
        if (e.target.tagName && e.target.tagName.toLowerCase() === 'textarea') {
            autoResizeTextarea(e.target);
        }
    });

    // Default View
    renderView('monthly-planner');
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
}

// Router to render views
function renderView(viewName) {
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    container.className = 'animate-fade-in';

    switch(viewName) {
        case 'monthly-planner':
            renderMonthlyPlanner(container);
            break;
        case 'weekly-planner':
            renderWeeklyPlanner(container);
            break;
        case 'daily-planner':
            renderDailyPlanner(container);
            break;
        case 'exercise-1':
            renderExercise1(container);
            break;
        case 'exercise-2':
            renderExercise2(container);
            break;
        case 'exercise-3':
            renderExercise3(container);
            break;
        case 'exercise-4':
            renderExercise4(container);
            break;
        default:
            renderMonthlyPlanner(container);
    }
}

// Helper to download planner HTML element as PNG image using html2canvas
function downloadPlannerAsImage(elementId, fileName) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Show visual indicator/loading
    const originalBtn = event ? event.currentTarget : null;
    let originalText = '';
    if (originalBtn) {
        originalText = originalBtn.innerHTML;
        originalBtn.innerHTML = '⌛ جاري التجهيز...';
        originalBtn.disabled = true;
    }

    // Replace inputs/textareas with styled divs temporarily for exact multiline rendering in html2canvas
    const tempReplacements = [];
    const inputsAndTextareas = element.querySelectorAll('input, textarea');

    inputsAndTextareas.forEach(input => {
        const div = document.createElement('div');
        div.className = input.className;
        const val = input.value || input.placeholder || '';
        
        // Preserve line breaks
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordBreak = 'break-word';
        div.style.minHeight = input.offsetHeight + 'px';
        div.style.height = 'auto';
        div.style.background = getComputedStyle(input).background;
        div.style.border = getComputedStyle(input).border;
        div.style.borderRadius = getComputedStyle(input).borderRadius;
        div.style.padding = getComputedStyle(input).padding;
        div.style.fontSize = getComputedStyle(input).fontSize;
        div.style.color = input.value ? getComputedStyle(input).color : 'rgba(255, 255, 255, 0.4)';
        div.style.fontFamily = getComputedStyle(input).fontFamily;
        div.style.fontWeight = getComputedStyle(input).fontWeight;

        div.textContent = val;

        input.style.display = 'none';
        input.parentNode.insertBefore(div, input.nextSibling);
        tempReplacements.push({ input, div });
    });

    html2canvas(element, {
        backgroundColor: '#0B0F19',
        scale: 2, // High DPI
        useCORS: true,
        windowWidth: element.scrollWidth
    }).then(canvas => {
        // Restore original inputs/textareas
        tempReplacements.forEach(({ input, div }) => {
            input.style.display = '';
            div.remove();
        });

        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (originalBtn) {
            originalBtn.innerHTML = originalText;
            originalBtn.disabled = false;
        }
    }).catch(err => {
        console.error('Error downloading image:', err);
        // Restore original inputs in case of error
        tempReplacements.forEach(({ input, div }) => {
            input.style.display = '';
            div.remove();
        });
        alert('حدث خطأ أثناء تنزيل الصورة، يرجى المحاولة مرة أخرى.');
        if (originalBtn) {
            originalBtn.innerHTML = originalText;
            originalBtn.disabled = false;
        }
    });
}

// ----------------------------------------------------
// 1. MONTHLY PLANNER
// ----------------------------------------------------
function renderMonthlyPlanner(container) {
    const daysInMonth = 30;
    let daysHTML = '';

    for (let i = 1; i <= daysInMonth; i++) {
        daysHTML += `
            <div class="glass-card" style="padding: 0.8rem; margin: 0; min-height: 110px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">يوم ${i}</div>
                <textarea class="form-control" placeholder="هدف/ملاحظة..." style="background: transparent; border: none; font-size: 0.8rem; padding: 4px; min-height: 60px; color: var(--text-main); font-weight: 600; overflow:hidden;"></textarea>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">📅 جدول الشهر (Monthly Planner)</h1>
                <p class="page-description">صمم رؤيتك وأهدافك للشهر القادم وقم بتنزيل الجدول كصورة جاهزة للاستخدام</p>
            </div>
            <button onclick="downloadPlannerAsImage('export-monthly-planner', 'جدول_الشهر_المتعلم_الذاتي')" class="btn btn-accent">
                📥 تنزيل الجدول كصورة (PNG)
            </button>
        </div>

        <div id="export-monthly-planner" class="planner-export-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h2 style="font-size: 1.4rem; color: var(--text-main); font-weight: 800;">خطة الشهر التعليمية</h2>
                <div style="color: var(--text-dim); font-size: 0.85rem;">كتيب المتعلم الذاتي • GDG Mustaqbal</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(7, minmax(130px, 1fr)); gap: 10px; margin-bottom: 10px; text-align: center; font-weight: 700; color: var(--text-muted); font-size: 0.85rem;">
                <div>الأحد</div><div>الإثنين</div><div>الثلاثاء</div><div>الأربعاء</div><div>الخميس</div><div>الجمعة</div><div>السبت</div>
            </div>

            <div class="grid-7">
                ${daysHTML}
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// 2. WEEKLY PLANNER
// ----------------------------------------------------
function renderWeeklyPlanner(container) {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    let daysHTML = '';

    days.forEach((day, idx) => {
        daysHTML += `
            <div class="glass-card" style="padding: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 10px; height: auto;">
                <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent); border-bottom: 2px solid var(--border-color); padding-bottom: 6px;">
                    ${day}
                </div>
                <div class="form-group" style="margin:0;">
                    <label class="form-label" style="font-size:0.75rem; color:var(--text-dim);">الهدف الرئيسي اليومي:</label>
                    <input type="text" class="form-control" style="font-size:0.85rem; padding:6px 10px;" placeholder="ما هو الإنجاز الأهم اليوم؟">
                </div>
                <div style="margin-top: 5px;">
                    <label class="form-label" style="font-size:0.75rem; color:var(--text-dim);">المهام اليومية:</label>
                    <textarea class="form-control" style="font-size:0.85rem; min-height:120px; overflow:hidden;" placeholder="• مهمة ١&#10;• مهمة ٢&#10;• مهمة ٣"></textarea>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">📆 جدول الأسبوع (Weekly Planner)</h1>
                <p class="page-description">وزّع مهامك على أيام الأسبوع بوضوح وحمّل الجدول كصورة</p>
            </div>
            <button onclick="downloadPlannerAsImage('export-weekly-planner', 'جدول_الأسبوع_المتعلم_الذاتي')" class="btn btn-accent">
                📥 تنزيل الجدول كصورة (PNG)
            </button>
        </div>

        <div id="export-weekly-planner" class="planner-export-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h2 style="font-size: 1.4rem; color: var(--text-main); font-weight: 800;">الخطة الأسبوعية</h2>
                <div style="color: var(--text-dim); font-size: 0.85rem;">كتيب المتعلم الذاتي</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 15px; align-items: start;">
                ${daysHTML}
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// 3. DAILY PLANNER
// ----------------------------------------------------
function renderDailyPlanner(container) {
    const hours = [
        '06:00 ص', '07:00 ص', '08:00 ص', '09:00 ص', '10:00 ص', '11:00 ص',
        '12:00 م', '01:00 م', '02:00 م', '03:00 م', '04:00 م', '05:00 م',
        '06:00 م', '07:00 م', '08:00 م', '09:00 م', '10:00 م', '11:00 م'
    ];

    let hoursHTML = '';
    hours.forEach(hour => {
        hoursHTML += `
            <div style="display: flex; align-items: center; gap: 12px; background: rgba(18, 26, 43, 0.5); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="width: 75px; font-weight: 700; color: var(--primary); font-size: 0.85rem; flex-shrink: 0;">${hour}</div>
                <input type="text" class="form-control" style="border: none; background: transparent; padding: 4px; font-size: 0.85rem;" placeholder="النشاط المخطط له في هذه الساعة...">
            </div>
        `;
    });

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">⏱️ جدول اليوم (Daily Schedule)</h1>
                <p class="page-description">خطط ساعات يومك بالتفصيل واستخرج صورتها بسهولة</p>
            </div>
            <button onclick="downloadPlannerAsImage('export-daily-planner', 'جدول_اليوم_المتعلم_الذاتي')" class="btn btn-accent">
                📥 تنزيل الجدول كصورة (PNG)
            </button>
        </div>

        <div id="export-daily-planner" class="planner-export-container" style="max-width: 850px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div>
                    <h2 style="font-size: 1.4rem; color: var(--text-main); font-weight: 800;">جدول اليوم التفصيلي</h2>
                    <input type="text" class="form-control" style="background:transparent; border:none; color:var(--text-muted); padding:0; margin-top:2px;" placeholder="اكتب تاريخ اليوم أو عنوانه هنا...">
                </div>
                <div style="color: var(--text-dim); font-size: 0.85rem;">كتيب المتعلم الذاتي</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${hoursHTML}
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// EXERCISE 1: TIME AUDIT (3 DAYS)
// ----------------------------------------------------
function renderExercise1(container) {
    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">📊 تمرين ١: تدقيق الوقت (Time Audit)</h1>
                <p class="page-description">سجّل أنشطتك وقارن تركيزك على مدى ٣ أيام متتالية للتعرف على عاداتك</p>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1rem; color: var(--gold);">📝 الخطوة الأولى: تسجيل الأنشطة لمدة ٣ أيام</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 15px; margin-bottom: 1.5rem;">
                <div style="background: rgba(11,15,25,0.6); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <h4 style="color:var(--primary); margin-bottom:8px;">اليوم الأول</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
                <div style="background: rgba(11,15,25,0.6); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <h4 style="color:var(--primary); margin-bottom:8px;">اليوم الثاني</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
                <div style="background: rgba(11,15,25,0.6); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <h4 style="color:var(--primary); margin-bottom:8px;">اليوم الثالث</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1.2rem; color: var(--accent);">🤔 الخطوة الثانية: أسئلة التأمل الذاتي (بعد 3 أيام)</h3>
            <form onsubmit="event.preventDefault(); alert('تم حفظ إجابات التقييم الذاتي بنجاح!');">
                <div class="form-group">
                    <label class="form-label">١- كم ساعة مضت في الأنشطة والتعلم؟</label>
                    <input type="text" class="form-control" placeholder="مثال: مضت ٩ ساعات تعلم حقيقي ومشتتات ٥ ساعات...">
                </div>
                <div class="form-group">
                    <label class="form-label">٢- متى أكون أكثر تركيزاً؟</label>
                    <input type="text" class="form-control" placeholder="مثال: في الصباح الباكر من ٦ إلى ٩ صباحاً...">
                </div>
                <div class="form-group">
                    <label class="form-label">٣- ما أكثر شيء يقطع وقت التعلم؟</label>
                    <input type="text" class="form-control" placeholder="مثال: إشعارات الجوال، التصفح العشوائي، المقاطعات العائلية...">
                </div>
                <div class="form-group">
                    <label class="form-label">٤- ما الوقت الواقعي الذي أستطيع تخصيصه للتعلم يومياً؟</label>
                    <input type="text" class="form-control" placeholder="مثال: ساعتان متواصلتان بدون ملهيات...">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top: 10px;">حفظ نتائج التأمل 💾</button>
            </form>
        </div>
    `;
}

// ----------------------------------------------------
// EXERCISE 2: PRIORITY MATRIX (EISENHOWER)
// ----------------------------------------------------
function renderExercise2(container) {
    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">🎯 تمرين ٢: ترتيب الأولويات (Eisenhower Matrix)</h1>
                <p class="page-description">حدد هدفك النهائي ورتب خطواتك ووزع مهامك بحسب الأهمية والاستعجال</p>
            </div>
        </div>

        <div class="glass-card">
            <div class="form-group">
                <label class="form-label" style="font-size: 1.05rem; color: var(--accent);">🎯 اكتب الهدف النهائي:</label>
                <input type="text" class="form-control" style="font-size: 1rem; padding: 0.8rem;" placeholder="مثال: تعلم أساسيات برمجة الويب بلغة JavaScript وخوض أول مشروع...">
            </div>

            <div class="form-group" style="margin-top: 1.5rem;">
                <label class="form-label" style="font-size: 1.05rem; color: var(--gold);">❓ ما الذي يجب أن أفعله أو أتعلمه لأصل لهذا الهدف؟</label>
                <textarea class="form-control" style="min-height: 100px;" placeholder="اكتب جميع المهام والخطوات التي تخطر ببالك لتصل لهدفك..."></textarea>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1.2rem; color: var(--primary);">📥 تصنيف المهام إلى مصفوفة الأولويات</h3>
            
            <div class="grid-matrix">
                <div class="matrix-box urgent-important">
                    <h4 style="color: var(--danger); margin-bottom: 10px;">🔴 مهمة وعاجلة (افعلها فوراً)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• مهام حاسمة ذات مواعيد نهائية..."></textarea>
                </div>
                <div class="matrix-box not-urgent-important">
                    <h4 style="color: var(--gold); margin-bottom: 10px;">🟡 مهمة وغير عاجلة (خطط لها)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• التعلم الذاتي، التطوير الشخصي، التخطيط..."></textarea>
                </div>
                <div class="matrix-box urgent-not-important">
                    <h4 style="color: var(--info); margin-bottom: 10px;">🔵 غير مهمة وعاجلة (تفويض/تقليل)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• مقاطعات، بعض الرسائل والمكالمات..."></textarea>
                </div>
                <div class="matrix-box not-urgent-not-important">
                    <h4 style="color: var(--text-dim); margin-bottom: 10px;">⚫ غير مهمة وغير عاجلة (احذفها)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• ملهيات، تصفح بلا هدف..."></textarea>
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// EXERCISE 3: ACTIVE RECALL
// ----------------------------------------------------
function renderExercise3(container) {
    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">🧠 تمرين ٣: هل أتذكر فعلاً؟ (Active Recall Test)</h1>
                <p class="page-description">اختبر مدى استيعابك الحقيقي للمعلومة بعد القراءة والتعلم</p>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1rem; color: var(--primary);">📖 ١- إعداد جلسة القراءة</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                <div class="form-group">
                    <label class="form-label">موضوع التعلم:</label>
                    <input type="text" class="form-control" placeholder="مثال: مفهوم Async/Await في JS">
                </div>
                <div class="form-group">
                    <label class="form-label">المصدر (كتاب/مقال/فيديو):</label>
                    <input type="text" class="form-control" placeholder="مثال: الفصل الثالث من كتاب X">
                </div>
                <div class="form-group">
                    <label class="form-label">مدة القراءة المركزة (دقائق):</label>
                    <input type="number" class="form-control" value="15">
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1rem; color: var(--accent);">✍️ ٢- الاسترجاع النشط (اغلق المصدر واكتب ما تتذكره)</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
                بعد الانتهاء من القراءة، اغلق المصدر تماماً واكتب هنا كل التفاصيل والمفاهيم التي بقيت في ذاكرتك بدون النظر للإجابات!
            </p>
            <textarea class="form-control" style="min-height: 160px; font-size: 0.95rem;" placeholder="اكتب هنا جميع النقاط التي تتذكرها الآن..."></textarea>

            <div style="margin-top: 1.5rem; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="document.getElementById('recall-check').style.display='block';">
                    🔍 افتح المصدر وستعرض النتيجة
                </button>
            </div>
        </div>

        <div id="recall-check" class="glass-card" style="display: none; border-color: var(--success);">
            <h3 style="margin-bottom: 1rem; color: var(--success);">✅ ٣- مراجعة الإجابات والتقييم الذاتي</h3>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">افتح المصدر الآن وقارن ما كتبته بما هو موجود في المصدر الأصلي:</p>
            
            <div class="form-group">
                <label class="form-label">ما النقاط الرئيسية التي نسيتها أو احتجت لتأكيدها؟</label>
                <textarea class="form-control" placeholder="سجل المفاهيم الضائعة لتركز عليها في المراجعة القادمة..."></textarea>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// EXERCISE 4: WHEN THE PLAN FAILS
// ----------------------------------------------------
function renderExercise4(container) {
    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">🔄 تمرين ٤: ماذا أفعل عندما تفشل الخطة؟</h1>
                <p class="page-description">مراجعة نهاية الأسبوع لتشخيص المشاكل وتعديل المسار باستمرار</p>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1rem; color: var(--gold);">📊 ١- مقارنة خطة الأسبوع بما تم إنجازه</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">في نهاية الأسبوع، راجع خطتك وقارن بين المخطط والمتحقق.</p>
            <textarea class="form-control" style="min-height: 100px;" placeholder="ما هي المهام التي تم إنجازها وما المهام التي لم تكتمل؟"></textarea>
        </div>

        <div class="glass-card" style="border-color: rgba(239, 68, 68, 0.3);">
            <h3 style="margin-bottom: 1.2rem; color: var(--danger);">❓ ٢- أسئلة التشخيص والتعديل (عند وجود قصور في الخطة)</h3>
            
            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-main);">١- ماذا حدث بالضبط؟</label>
                <textarea class="form-control" placeholder="وصف حيادي لما تم تنفيذه ولماذا توقفت الخطة..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-main);">٢- ما سبب المشكلة؟</label>
                <textarea class="form-control" placeholder="هل التقدير الزمني غير واقعي؟ هل ظهرت ملهيات طارئة؟ أم كان الهدف أكبر من اللازم؟"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-main);">٣- كيف أعدل الخطة للأسبوع القادم؟</label>
                <textarea class="form-control" placeholder="ضع خطوات تصحيحية محددة (مثال: تقليل عدد الساعات، تقسيم المهام إلى قطع أصغر، تغيير وقت التعلم)..."></textarea>
            </div>

            <button class="btn btn-accent" style="margin-top: 10px;" onclick="alert('تم حفظ خطة التعديل بنجاح! جاهز للأسبوع الجديد 💪');">
                🚀 اعتماد الخطة المعدّلة للأسبوع القادم
            </button>
        </div>
    `;
}

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

    // Google Mode Switcher: Crisp White vs Dark Gray
    const modeWhiteBtn = document.getElementById('mode-white-btn');
    const modeDarkGrayBtn = document.getElementById('mode-darkgray-btn');

    if (modeWhiteBtn && modeDarkGrayBtn) {
        modeWhiteBtn.addEventListener('click', () => {
            document.body.classList.remove('dark-gray-mode');
            modeWhiteBtn.classList.add('active');
            modeDarkGrayBtn.classList.remove('active');
        });

        modeDarkGrayBtn.addEventListener('click', () => {
            document.body.classList.add('dark-gray-mode');
            modeDarkGrayBtn.classList.add('active');
            modeWhiteBtn.classList.remove('active');
        });
    }

    // Text Color Dropdown Menu Feature
    const textColorSelect = document.getElementById('text-color-select');
    if (textColorSelect) {
        textColorSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'default') {
                document.body.classList.remove('custom-text-color');
                document.body.style.removeProperty('--user-chosen-text-color');
            } else {
                document.body.classList.add('custom-text-color');
                document.body.style.setProperty('--user-chosen-text-color', val);
            }
        });
    }

    // Google Accent Colors (Blue, Red, Yellow, Green)
    const accentDots = document.querySelectorAll('#accent-dots-wrapper .accent-dot');
    accentDots.forEach(dot => {
        dot.addEventListener('click', () => {
            accentDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            const chosenAccent = dot.getAttribute('data-accent');
            document.documentElement.style.setProperty('--primary-color', chosenAccent);
        });
    });

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

    const originalBtn = event ? event.currentTarget : null;
    let originalText = '';
    if (originalBtn) {
        originalText = originalBtn.innerHTML;
        originalBtn.innerHTML = '⌛ جاري التجهيز...';
        originalBtn.disabled = true;
    }

    // Replace inputs/textareas with styled divs temporarily for exact multiline rendering in html2canvas
    const tempReplacements = [];
    const inputsAndTextareas = element.querySelectorAll('input, textarea, select');

    inputsAndTextareas.forEach(input => {
        const div = document.createElement('div');
        div.className = input.className;
        let val = input.value || input.placeholder || '';

        if (input.tagName.toLowerCase() === 'select') {
            val = input.options[input.selectedIndex].text;
        }

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
        div.style.color = input.value ? getComputedStyle(input).color : getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary');
        div.style.fontFamily = getComputedStyle(input).fontFamily;
        div.style.fontWeight = getComputedStyle(input).fontWeight;

        div.textContent = val;

        input.style.display = 'none';
        input.parentNode.insertBefore(div, input.nextSibling);
        tempReplacements.push({ input, div });
    });

    const isDarkMode = document.body.classList.contains('dark-gray-mode');

    html2canvas(element, {
        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
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
// 1. MONTHLY PLANNER (2026 Months Selection)
// ----------------------------------------------------
function renderMonthlyPlanner(container) {
    const months2026 = [
        { id: 0, name: 'يناير 2026', days: 31, startDay: 4 },
        { id: 1, name: 'فبراير 2026', days: 28, startDay: 0 },
        { id: 2, name: 'مارس 2026', days: 31, startDay: 0 },
        { id: 3, name: 'أبريل 2026', days: 30, startDay: 3 },
        { id: 4, name: 'مايو 2026', days: 31, startDay: 5 },
        { id: 5, name: 'يونيو 2026', days: 30, startDay: 1 },
        { id: 6, name: 'يوليو 2026', days: 31, startDay: 3 },
        { id: 7, name: 'أغسطس 2026', days: 31, startDay: 6 },
        { id: 8, name: 'سبتمبر 2026', days: 30, startDay: 2 },
        { id: 9, name: 'أكتوبر 2026', days: 31, startDay: 4 },
        { id: 10, name: 'نوفمبر 2026', days: 30, startDay: 0 },
        { id: 11, name: 'ديسمبر 2026', days: 31, startDay: 2 }
    ];

    let selectedMonthIdx = 8; // September 2026

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">📅 جدول الشهر (Monthly Planner)</h1>
                <p class="page-description">اختر الشهر المناسب من عام 2026 وخطط لأهدافك ورؤيتك الشاملة ثم نزلها كصورة</p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; width: 100%; max-width: 480px;">
                <select id="month-select-2026" class="google-select" style="flex: 1; min-width: 170px; font-weight: 700; border-color: var(--primary-color);">
                    ${months2026.map(m => `<option value="${m.id}" ${m.id === selectedMonthIdx ? 'selected' : ''}>${m.name}</option>`).join('')}
                </select>
                <button onclick="downloadPlannerAsImage('export-monthly-planner', 'جدول_الشهر_المتعلم_الذاتي')" class="btn btn-primary" style="flex: 1; min-width: 190px;">
                    📥 تنزيل الجدول كصورة (PNG)
                </button>
            </div>
        </div>

        <div id="export-monthly-planner" class="planner-export-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.4rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.9rem; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="google-mini-dots">
                        <span class="dot dot-blue"></span>
                        <span class="dot dot-red"></span>
                        <span class="dot dot-yellow"></span>
                        <span class="dot dot-green"></span>
                    </div>
                    <h2 id="current-month-display" style="font-size: 1.4rem; color: var(--text-primary); font-weight: 800;">خطة شهر ${months2026[selectedMonthIdx].name}</h2>
                </div>
                <div style="color: var(--text-tertiary); font-size: 0.88rem; font-weight: 600;">كتيب المتعلم الذاتي &bull; GDG Mustaqbal</div>
            </div>

            <div class="month-grid-wrapper">
                <div class="month-days-header">
                    <div>الأحد</div><div>الإثنين</div><div>الثلاثاء</div><div>الأربعاء</div><div>الخميس</div><div>الجمعة</div><div>السبت</div>
                </div>

                <div id="month-days-grid" class="grid-7"></div>
            </div>
        </div>
    `;

    function buildMonthGrid(monthIdx) {
        const month = months2026[monthIdx];
        const gridContainer = document.getElementById('month-days-grid');
        const monthTitle = document.getElementById('current-month-display');
        
        if (monthTitle) monthTitle.textContent = `خطة شهر ${month.name}`;
        
        let html = '';

        for (let p = 0; p < month.startDay; p++) {
            html += `<div class="glass-card day-box empty-day" style="opacity: 0.25; padding: 0.8rem; margin: 0; min-height: 100px; background: var(--bg-subtle);"></div>`;
        }

        for (let i = 1; i <= month.days; i++) {
            html += `
                <div class="glass-card day-box" style="padding: 0.75rem; margin: 0; min-height: 110px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary-color); border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;">يوم ${i}</div>
                    <textarea class="form-control" placeholder="هدف / ملاحظة..." style="background: transparent; border: none; font-size: 0.85rem; padding: 4px; min-height: 60px; color: var(--text-primary); font-weight: 600; overflow:hidden;"></textarea>
                </div>
            `;
        }

        gridContainer.innerHTML = html;
    }

    buildMonthGrid(selectedMonthIdx);

    const selectEl = document.getElementById('month-select-2026');
    if (selectEl) {
        selectEl.addEventListener('change', (e) => {
            buildMonthGrid(parseInt(e.target.value));
        });
    }
}

// ----------------------------------------------------
// 2. WEEKLY PLANNER
// ----------------------------------------------------
function renderWeeklyPlanner(container) {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    let daysHTML = '';

    days.forEach((day, idx) => {
        daysHTML += `
            <div class="glass-card" style="padding: 1.3rem; margin: 0; display: flex; flex-direction: column; gap: 10px; height: auto;">
                <div style="font-weight: 800; font-size: 1.15rem; color: var(--primary-color); border-bottom: 2px solid var(--border-subtle); padding-bottom: 6px;">
                    ${day}
                </div>
                <div class="form-group" style="margin:0;">
                    <label class="form-label" style="font-size:0.8rem; color:var(--text-tertiary);">الهدف الأهم لهذا اليوم:</label>
                    <input type="text" class="form-control" style="font-size:0.9rem; padding:8px 12px;" placeholder="ما هو أهم إنجاز تسعى إليه؟">
                </div>
                <div style="margin-top: 5px;">
                    <label class="form-label" style="font-size:0.8rem; color:var(--text-tertiary);">قائمة المهام اليومية:</label>
                    <textarea class="form-control" style="font-size:0.9rem; min-height:120px; overflow:hidden;" placeholder="• مهمة ١&#10;• مهمة ٢&#10;• مهمة ٣"></textarea>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">📆 جدول الأسبوع (Weekly Planner)</h1>
                <p class="page-description">قسّم إنجازاتك بتركيز على مدار الأيام السبعة مع إمكانية التمدد التلقائي والتنزيل كصورة</p>
            </div>
            <button onclick="downloadPlannerAsImage('export-weekly-planner', 'جدول_الأسبوع_المتعلم_الذاتي')" class="btn btn-primary">
                📥 تنزيل الجدول كصورة (PNG)
            </button>
        </div>

        <div id="export-weekly-planner" class="planner-export-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="google-mini-dots">
                        <span class="dot dot-blue"></span>
                        <span class="dot dot-red"></span>
                        <span class="dot dot-yellow"></span>
                        <span class="dot dot-green"></span>
                    </div>
                    <h2 style="font-size: 1.4rem; color: var(--text-primary); font-weight: 800;">الخطة الأسبوعية الذكية</h2>
                </div>
                <div style="color: var(--text-tertiary); font-size: 0.88rem; font-weight: 600;">كتيب المتعلم الذاتي</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; align-items: start;">
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
            <div style="display: flex; align-items: center; gap: 14px; background: var(--bg-subtle); padding: 8px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div style="width: 80px; font-weight: 700; color: var(--primary-color); font-size: 0.9rem; flex-shrink: 0;">${hour}</div>
                <input type="text" class="form-control" style="border: none; background: transparent; padding: 4px; font-size: 0.92rem;" placeholder="النشاط المخطط له في هذه الساعة...">
            </div>
        `;
    });

    container.innerHTML = `
        <div class="page-header">
            <div>
                <h1 class="page-title">⏱️ جدول اليوم (Daily Schedule)</h1>
                <p class="page-description">خطط ساعات يومك من الصباح الباكر حتى المساء واستخرج جدولك كصورة فورية</p>
            </div>
            <button onclick="downloadPlannerAsImage('export-daily-planner', 'جدول_اليوم_المتعلم_الذاتي')" class="btn btn-primary">
                📥 تنزيل الجدول كصورة (PNG)
            </button>
        </div>

        <div id="export-daily-planner" class="planner-export-container" style="max-width: 880px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
                <div>
                    <h2 style="font-size: 1.4rem; color: var(--text-primary); font-weight: 800;">جدول اليوم التفصيلي</h2>
                    <input type="text" class="form-control" style="background:transparent; border:none; color:var(--text-secondary); padding:0; margin-top:3px; font-weight:600;" placeholder="اكتب تاريخ اليوم أو عنوان النشاط هنا...">
                </div>
                <div style="color: var(--text-tertiary); font-size: 0.88rem; font-weight: 600;">كتيب المتعلم الذاتي</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 9px;">
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
            <h3 style="margin-bottom: 1.2rem; color: var(--google-yellow); display: flex; align-items: center; gap: 8px;">
                <span>📝 الخطوة الأولى: تسجيل الأنشطة لمدة ٣ أيام</span>
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 1.5rem;">
                <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <h4 style="color:var(--primary-color); margin-bottom:8px;">اليوم الأول</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
                <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <h4 style="color:var(--primary-color); margin-bottom:8px;">اليوم الثاني</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
                <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <h4 style="color:var(--primary-color); margin-bottom:8px;">اليوم الثالث</h4>
                    <textarea class="form-control" style="min-height:120px;" placeholder="سجل الأنشطة التي قمت بها ووقتها بالتفصيل..."></textarea>
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1.2rem; color: var(--primary-color);">🤔 الخطوة الثانية: أسئلة التأمل الذاتي (بعد 3 أيام)</h3>
            <form onsubmit="event.preventDefault(); alert('تم حفظ إجابات التقييم الذاتي بنجاح! 🌟');">
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
                <label class="form-label" style="font-size: 1.1rem; color: var(--primary-color);">🎯 اكتب الهدف النهائي:</label>
                <input type="text" class="form-control" style="font-size: 1rem; padding: 0.9rem;" placeholder="مثال: بناء أول تطبيق ويب متكامل ونشره على الإنترنت...">
            </div>

            <div class="form-group" style="margin-top: 1.5rem;">
                <label class="form-label" style="font-size: 1.1rem; color: var(--google-yellow);">❓ ما الذي يجب أن أفعله أو أتعلمه لأصل لهذا الهدف؟</label>
                <textarea class="form-control" style="min-height: 100px;" placeholder="اكتب جميع المهام والخطوات التي تخطر ببالك لتصل لهدفك..."></textarea>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1.2rem; color: var(--primary-color);">📥 تصنيف المهام إلى مصفوفة الأولويات</h3>
            
            <div class="grid-matrix">
                <div class="matrix-box urgent-important">
                    <h4 style="color: var(--google-red); margin-bottom: 10px;">🔴 مهمة وعاجلة (افعلها فوراً)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• مهام حاسمة ذات مواعيد نهائية..."></textarea>
                </div>
                <div class="matrix-box not-urgent-important">
                    <h4 style="color: var(--google-yellow); margin-bottom: 10px;">🟡 مهمة وغير عاجلة (خطط لها)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• التعلم الذاتي، التطوير الشخصي، التخطيط..."></textarea>
                </div>
                <div class="matrix-box urgent-not-important">
                    <h4 style="color: var(--google-blue); margin-bottom: 10px;">🔵 غير مهمة وعاجلة (تفويض/تقليل)</h4>
                    <textarea class="form-control" style="background: transparent; border: none; min-height: 120px;" placeholder="• مقاطعات، بعض الرسائل والمكالمات..."></textarea>
                </div>
                <div class="matrix-box not-urgent-not-important">
                    <h4 style="color: var(--text-tertiary); margin-bottom: 10px;">⚫ غير مهمة وغير عاجلة (احذفها)</h4>
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
            <h3 style="margin-bottom: 1.2rem; color: var(--primary-color);">📖 ١- إعداد جلسة القراءة</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                <div class="form-group">
                    <label class="form-label">موضوع التعلم:</label>
                    <input type="text" class="form-control" placeholder="مثال: مفهوم Functions & Scope">
                </div>
                <div class="form-group">
                    <label class="form-label">المصدر (كتاب/مقال/فيديو):</label>
                    <input type="text" class="form-control" placeholder="مثال: كتاب JavaScript الحديث">
                </div>
                <div class="form-group">
                    <label class="form-label">مدة القراءة المركزة (دقائق):</label>
                    <input type="number" class="form-control" value="15">
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom: 1rem; color: var(--google-red);">✍️ ٢- الاسترجاع النشط (اغلق المصدر واكتب ما تتذكره)</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.2rem;">
                بعد الانتهاء من القراءة، اغلق المصدر تماماً واكتب هنا كل التفاصيل والمفاهيم التي بقيت في ذاكرتك دون النظر للإجابات!
            </p>
            <textarea class="form-control" style="min-height: 160px; font-size: 0.98rem;" placeholder="اكتب هنا جميع النقاط التي تتذكرها الآن..."></textarea>

            <div style="margin-top: 1.5rem; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="document.getElementById('recall-check').style.display='block';">
                    🔍 افتح المصدر وستعرض النتيجة
                </button>
            </div>
        </div>

        <div id="recall-check" class="glass-card" style="display: none; border-color: var(--google-green);">
            <h3 style="margin-bottom: 1rem; color: var(--google-green);">✅ ٣- مراجعة الإجابات والتقييم الذاتي</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">افتح المصدر الآن وقارن ما كتبته بما هو موجود في المصدر الأصلي:</p>
            
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
            <h3 style="margin-bottom: 1rem; color: var(--google-yellow);">📊 ١- مقارنة خطة الأسبوع بما تم إنجازه</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.2rem;">في نهاية الأسبوع، راجع خطتك وقارن بين المخطط والمتحقق.</p>
            <textarea class="form-control" style="min-height: 100px;" placeholder="ما هي المهام التي تم إنجازها وما المهام التي لم تكتمل؟"></textarea>
        </div>

        <div class="glass-card" style="border-top: 4px solid var(--google-red);">
            <h3 style="margin-bottom: 1.2rem; color: var(--google-red);">❓ ٢- أسئلة التشخيص والتعديل (عند وجود قصور في الخطة)</h3>
            
            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-primary);">١- ماذا حدث بالضبط؟</label>
                <textarea class="form-control" placeholder="وصف حيادي لما تم تنفيذه ولماذا توقفت الخطة..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-primary);">٢- ما سبب المشكلة؟</label>
                <textarea class="form-control" placeholder="هل التقدير الزمني غير واقعي؟ هل ظهرت ملهيات طارئة؟ أم كان الهدف أكبر من اللازم؟"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" style="font-size: 0.95rem; color: var(--text-primary);">٣- كيف أعدل الخطة للأسبوع القادم؟</label>
                <textarea class="form-control" placeholder="ضع خطوات تصحيحية محددة (مثال: تقليل عدد الساعات، تقسيم المهام إلى قطع أصغر، تغيير وقت التعلم)..."></textarea>
            </div>

            <button class="btn btn-accent" style="margin-top: 10px;" onclick="alert('تم حفظ خطة التعديل بنجاح! جاهز للأسبوع الجديد 💪');">
                🚀 اعتماد الخطة المعدّلة للأسبوع القادم
            </button>
        </div>
    `;
}

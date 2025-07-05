document.addEventListener('DOMContentLoaded', () => {
    // --- عناصر التنقل والقائمة الرئيسية (Hamburger Menu) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // تبديل فئة 'active' لإظهار/إخفاء القائمة
        });

        // إخفاء القائمة عند النقر خارجها على الشاشات الصغيرة
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    }

    // --- وظيفة التحكم في إظهار/إخفاء أقسام الملف الطبي ---
    const dashboardSection = document.getElementById('medical-file-dashboard');
    const detailedSections = document.querySelectorAll('.hidden-section');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const backToDashboardButtons = document.querySelectorAll('.back-to-dashboard-btn');

    // وظيفة لإخفاء كل الأقسام التفصيلية وإظهار لوحة التحكم
    const showDashboard = () => {
        dashboardSection.style.display = 'block';
        detailedSections.forEach(section => {
            section.style.display = 'none';
        });
    };

    // وظيفة لإخفاء لوحة التحكم وإظهار قسم معين
    const showDetailedSection = (sectionId) => {
        dashboardSection.style.display = 'none';
        detailedSections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // التمرير لأعلى الصفحة
    };

    // إضافة مستمعي الأحداث لأزرار "عرض التفاصيل"
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionId = event.target.dataset.section; // الحصول على الـ ID من خاصية data-section
            if (sectionId) {
                showDetailedSection(sectionId);
            }
        });
    });

    // إضافة مستمعي الأحداث لأزرار "العودة للوحة التحكم"
    backToDashboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            showDashboard();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // التمرير لأعلى الصفحة
        });
    });

    // إظهار لوحة التحكم عند تحميل الصفحة لأول مرة
    showDashboard();

    // --- تحديث معلومات المستخدم ديناميكياً (مثال) ---
    // يمكنك جلب هذه البيانات من قاعدة بيانات أو API
    const userName = "جواد بن علي";
    const userGreetingNameElement = document.getElementById('user-greeting-name');
    if (userGreetingNameElement) {
        userGreetingNameElement.textContent = userName;
    }

    // مثال لتحديث بيانات على لوحة التحكم (يمكن استبدالها ببيانات حقيقية)
    document.getElementById('last-updated').textContent = new Date().toLocaleDateString('ar-DZ');
    document.getElementById('upcoming-appointments').textContent = 'موعد أسنان (10/07/2025)';
    document.getElementById('current-meds').textContent = 'فيتامين د، مسكن آلام';
    document.getElementById('overall-status').textContent = 'جيدة جداً';
    document.getElementById('overall-status').className = 'status healthy'; // تحديث الفئة بناءً على الحالة

    document.getElementById('next-med').textContent = 'مضاد حيوي';
    document.getElementById('next-med-time').textContent = 'اليوم 21:00';

    document.getElementById('next-appointment').textContent = 'موعد مع أخصائي التغذية (18/07/2025)';
    document.getElementById('next-appointment-location').textContent = 'عيادة الصحة المتكاملة';

    // --- التعامل مع روابط التنقل في الهيدر (للتمرير السلس) ---
    document.querySelectorAll('.main-nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault(); // منع السلوك الافتراضي للانتقال المباشر

                const targetId = href.substring(1); // إزالة '#'
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // إذا كان الهدف هو لوحة التحكم، أظهرها وأخفي الأقسام الأخرى
                    if (targetId === 'medical-file-dashboard') {
                        showDashboard();
                    } else {
                        // وإلا، أظهر القسم المحدد وأخفي لوحة التحكم والأقسام الأخرى
                        showDetailedSection(targetId);
                    }
                    // التمرير السلس إلى العنصر المستهدف
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
             // إخفاء قائمة الهامبرغر بعد النقر على الرابط
             if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });
});
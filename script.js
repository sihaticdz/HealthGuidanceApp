// ملف script.js
// --- وظائف عامة (ليست داخل DOMContentLoaded لأنها تُستدعى مباشرة من HTML أو تستخدم على مستوى عام) ---

const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm'); // تم تغيير المحدد ليكون بالـ ID الجديد
const loginForm = document.getElementById('loginForm'); // تم إضافة ID لنموذج تسجيل الدخول الجديد
const modalTitle = document.getElementById('modalTitle');

// وظيفة لفتح المودال وتحديد النموذج المراد عرضه (تسجيل أو دخول)
function openModal(type) {
    if (registrationModal) {
        registrationModal.style.display = 'flex'; // استخدام flex لتوسيط المودال
        if (type === 'registration') {
            if (registrationForm) registrationForm.style.display = 'block';
            if (loginForm) loginForm.style.display = 'none';
            if (modalTitle) modalTitle.textContent = 'سجل الآن مجانًا';
        } else if (type === 'login') {
            if (registrationForm) registrationForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
            if (modalTitle) modalTitle.textContent = 'تسجيل الدخول';
        }
    } else {
        console.warn("Registration modal not found. Cannot open.");
    }
}

// وظيفة مختصرة لفتح مودال التسجيل مباشرة
function openRegistrationModal() {
    openModal('registration');
}

// وظيفة لإظهار نموذج التسجيل داخل المودال (عند النقر على "سجل الآن" من نموذج الدخول)
function showRegistrationForm() {
    openModal('registration');
}

// وظيفة لإظهار نموذج تسجيل الدخول داخل المودال (عند النقر على "سجل الدخول" من نموذج التسجيل)
function showLoginForm() {
    openModal('login');
}

function closeRegistrationModal() {
    if (registrationModal) {
        registrationModal.style.display = 'none';
    }
}

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (event) => {
    if (registrationModal && event.target === registrationModal) {
        closeRegistrationModal();
    }
});

// ملء قائمة الولايات (يمكن استدعاء هذه الوظيفة عند تحميل الصفحة)
function populateWilayas() {
    const wilayas = [
        "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
        "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
        "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر",
        "ورقلة", "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت",
        "الوادي", "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية",
        "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس", "عين صالح", "عين قزام", "تقرت",
        "جانت", "المغير", "المنيعة"
    ];
    // بما أننا أضفنا ID لـ <select> في HTML، سنستخدمه
    const wilayaSelect = document.getElementById('registrationWilaya');
    if (wilayaSelect) {
        wilayas.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya;
            option.textContent = wilaya;
            wilayaSelect.appendChild(option);
        });
    } else {
        console.warn("Element with ID 'registrationWilaya' not found. Wilayas dropdown may not be populated.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. JavaScript لتفعيل قائمة التنقل المتجاوبة (Hamburger Menu) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // إغلاق قائمة التنقل عند النقر على رابط (لتحسين تجربة المستخدم على الجوال)
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // --- 2. JavaScript لملء قائمة الولايات ---
    populateWilayas(); // استدعاء الوظيفة بعد التأكد من تحميل DOM

    // --- 3. معالجة نماذج تسجيل الدخول / التسجيل / الاتصال ---

    // معالجة نموذج تسجيل الدخول داخل المودال
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع الإرسال الافتراضي للصفحة

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');

            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message + ' توكن: ' + data.token);
                    localStorage.setItem('userToken', data.token);
                    closeRegistrationModal(); // إغلاق المودال
                    window.location.href = 'medical-file.html'; // توجيه لصفحة الملف الطبي
                } else {
                    alert('خطأ في تسجيل الدخول: ' + data.message);
                }
            } catch (error) {
                console.error('خطأ في الاتصال بالخادم:', error);
                alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    // معالجة نموذج التسجيل داخل المودال
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // تأكد من أن حقول الإدخال في الـ modal لديها IDs مناسبة
            const firstName = document.getElementById('registrationFirstName') ? document.getElementById('registrationFirstName').value : '';
            const lastName = document.getElementById('registrationLastName') ? document.getElementById('registrationLastName').value : '';
            const dob = document.getElementById('registrationDOB') ? document.getElementById('registrationDOB').value : '';
            const wilaya = document.getElementById('registrationWilaya') ? document.getElementById('registrationWilaya').value : '';
            const regEmail = document.getElementById('registrationEmail') ? document.getElementById('registrationEmail').value : '';
            const regPassword = document.getElementById('registrationPassword') ? document.getElementById('registrationPassword').value : '';

            try {
                const response = await fetch('/api/register', { // افترض أن لديك نقطة نهاية تسجيل
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, dob, wilaya, email: regEmail, password: regPassword })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('تم التسجيل بنجاح! ' + data.message);
                    closeRegistrationModal(); // أغلق المودال بعد التسجيل الناجح
                    // يمكنك توجيه المستخدم لصفحة تسجيل الدخول أو ملفه الشخصي
                    window.location.href = 'medical-file.html';
                } else {
                    alert('خطأ في التسجيل: ' + data.message);
                }
            } catch (error) {
                console.error('خطأ في الاتصال بالخادم:', error);
                alert('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    // معالجة نموذج الاتصال
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const contactName = document.getElementById('contactName') ? document.getElementById('contactName').value : '';
            const contactEmail = document.getElementById('contactEmail') ? document.getElementById('contactEmail').value : '';
            const contactMessage = document.getElementById('contactMessage') ? document.getElementById('contactMessage').value : '';

            // هنا يمكنك إرسال بيانات نموذج الاتصال إلى الـ Backend
            try {
                const response = await fetch('/api/contact', { // افترض أن لديك نقطة نهاية لنموذج الاتصال
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('تم إرسال رسالتك بنجاح! ' + data.message);
                    contactForm.reset(); // مسح النموذج بعد الإرسال الناجح
                } else {
                    alert('خطأ في إرسال الرسالة: ' + data.message);
                }
            } catch (error) {
                console.error('خطأ في الاتصال بالخادم:', error);
                alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
            }
        });
    }


    // --- 4. إدارة الملفات الطبية (وظائف لوحة التحكم) ---
    // هذه الأكواد تفترض أنك على صفحة medical-file.html ولديك هذه العناصر
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const backToDashboardButtons = document.querySelectorAll('.back-to-dashboard-btn');
    const dashboardSection = document.getElementById('medical-file-dashboard');
    const detailedSections = document.querySelectorAll('.hidden-section');

    const showSection = (sectionId) => {
        if (dashboardSection) {
            dashboardSection.style.display = 'none';
        }
        detailedSections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                section.style.display = 'none';
            }
        });
    };

    const showDashboard = () => {
        if (dashboardSection) {
            dashboardSection.style.display = 'block';
        }
        detailedSections.forEach(section => {
            section.style.display = 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetSectionId = event.target.dataset.section + '-details';
            showSection(targetSectionId);
        });
    });

    backToDashboardButtons.forEach(button => {
        button.addEventListener('click', showDashboard);
    });

    // تحديث بيانات المستخدم بشكل ديناميكي
    const updateUserData = () => {
        const userName = "جواد بن علي";
        const lastUpdated = "04 يوليو 2025";
        const userDob = "01/01/1985";
        const userWilaya = "الجزائر العاصمة";

        if (document.getElementById('last-updated')) document.getElementById('last-updated').textContent = lastUpdated;
        if (document.getElementById('user-full-name')) document.getElementById('user-full-name').textContent = userName;
        if (document.getElementById('user-dob')) document.getElementById('user-dob').textContent = userDob;
        if (document.getElementById('user-wilaya')) document.getElementById('user-wilaya').textContent = userWilaya;

        if (document.getElementById('detail-full-name')) document.getElementById('detail-full-name').textContent = userName;
        if (document.getElementById('detail-dob')) document.getElementById('detail-dob').textContent = userDob;
        if (document.getElementById('detail-wilaya')) document.getElementById('detail-wilaya').textContent = userWilaya;

        const randomAppointment = Math.random() > 0.5 ? "15 يوليو 2025 (متابعة)" : "لا يوجد";
        const randomMeds = Math.random() > 0.5 ? "باراسيتامول، فيتامين د" : "لا يوجد";

        if (document.getElementById('upcoming-appointments')) document.getElementById('upcoming-appointments').textContent = randomAppointment;
        if (document.getElementById('current-meds')) document.getElementById('current-meds').textContent = randomMeds;
    };

    // استدعاء تحديث بيانات المستخدم فقط إذا كنا في صفحة الملف الطبي
    if (window.location.pathname.includes('medical-file.html')) {
        updateUserData();
    }
});


// --- تكامل خرائط جوجل (يتطلب مفتاح API وتضمين في HTML) ---
/*
// هذه الوظيفة تُستدعى بواسطة Google Maps API بشكل مباشر، لا تحتاج لـ DOMContentLoaded
function initMap() {
    const algeriaCenter = { lat: 28.0339, lng: 1.6596 }; // مركز الجزائر
    const mapContainer = document.getElementById('map-container'); // تأكد من أن لديك هذا الـ ID في HTML
    if (mapContainer) {
        const map = new google.maps.Map(mapContainer, {
            zoom: 5,
            center: algeriaCenter,
        });
        // يمكنك إضافة علامات للمستشفيات والعيادات هنا
    } else {
        console.warn("Map container with ID 'map-container' not found. Google Map cannot be initialized.");
    }
}
*/

// --- تسجيل Service Worker for PWA capabilities ---
// تم نقل هذا الجزء بالكامل إلى هنا فقط، وإزالته من HTML
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
// backend/backend/server.js

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// هذا السطر يخدم جميع الملفات الثابتة (HTML, CSS, JS) من مجلد الواجهة الأمامية
app.use(express.static(path.join(__dirname, '..')));
// هذا السطر يرسل ملف index.html عندما يزور المستخدم الجذر
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// نقطة نهاية (API endpoint) لتسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'test@example.com' && password === 'password123') {
        res.status(200).json({ message: 'Login successful!', token: 'dummy_jwt_token_for_user' });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
});

// نقطة نهاية (API endpoint) لإنشاء حساب جديد (مثال توضيحي)
app.post('/api/register', (req, res) => {
    const { firstName, lastName, dob, state, email, password } = req.body;

    if (email && password) {
        res.status(201).json({ message: 'Account created successfully!', user: { email, firstName } });
    } else {
        res.status(400).json({ message: 'Missing required registration data.' });
    }
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Frontend served from: ${path.join(__dirname, '..', '..')}`);
});
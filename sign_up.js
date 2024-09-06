// เริ่มต้นการทำงานของ LIFF
liff.init({
    liffId: "2006013145-xKj494ap" // ใส่ LIFF ID ของคุณ
}).then(() => {
    // ตรวจสอบว่าเข้าสู่ระบบหรือยัง
    if (!liff.isLoggedIn()) {
        liff.login(); // ถ้ายังไม่ได้เข้าสู่ระบบ จะบังคับเข้าสู่การล็อกอิน
    } else {
        getUserProfile(); // ถ้าเข้าสู่ระบบแล้ว ให้ดึงข้อมูลผู้ใช้
    }
}).catch(err => console.error('LIFF initialization failed ', err));

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
function getUserProfile() {
    liff.getProfile()
        .then(profile => {
            const userId = profile.userId; // ดึง userId จากโปรไฟล์
            document.getElementById('UserId').value = userId; // นำค่า userId ใส่ในฟิลด์
            showContent(); // แสดงฟอร์มเมื่อดึงข้อมูลสำเร็จ
        })
        .catch(err => console.error('Error getting profile: ', err));
}

// แสดงเนื้อหาหลังจากดึงข้อมูลสำเร็จ
function showContent() {
    const contentSection = document.querySelector('.container');
    if (contentSection) {
        contentSection.style.display = 'block';
    } else {
        console.error('Content section not found');
    }
}

// ฟังก์ชันสำหรับส่งฟอร์มไปยัง Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbwfWExmSXx2cxQmPhrrN9kW5gkqshakOGxX8bsINx4IR38qgHhN8_F03z8MLsa57mJF8w/exec'; // ใส่ URL ที่ได้จาก Google Apps Script
const form = document.getElementById('dataForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    // ส่งข้อมูลไปยัง Google Apps Script
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.text())
    .then(result => alert(result))
    .catch(error => console.error('Error!', error.message));
});

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

function submitForm() {
    var userId = document.getElementById('UserId').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var password = document.getElementById('password').value;

    fetch('https://script.google.com/macros/s/AKfycbyhkWdsQM6eqv8FY4MQwaMl1VB3SmguyQn85E5Mq9Ay8a3ksyxEwuXIrwuv2hg84D86/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UserId: userId,
        fname: fname,
        lname: lname,
        password: password
      })
    })
    .then(response => response.text())
    .then(data => {
      alert(data); // แสดงข้อความตอบกลับ
      document.getElementById('myForm').reset(); // ล้างฟอร์ม
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
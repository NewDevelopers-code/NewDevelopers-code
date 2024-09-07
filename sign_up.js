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

// -----------------------------ส่วนของการบันทึกข้อมูล---------------------------------------//

// ฟังก์ชันสร้างรหัสสมาชิกอัตโนมัติ
function generateMemberCode(currentYear, totalUsers) {
  return `${currentYear}${totalUsers.toString().padStart(4, '0')}`;
}

async function submitForm() {
  // รับข้อมูลจากฟอร์ม
  const userId = document.getElementById('UserId').value;
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;

  // รับวันที่และเวลา
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const timestamp = currentDate.toISOString();

  try {
      // นับจำนวนสมาชิกที่มีใน Firestore เพื่อสร้างรหัสสมาชิก
      const snapshot = await db.collection('users').get();
      const totalUsers = snapshot.size + 1;

      // สร้างรหัสสมาชิก
      const memberCode = generateMemberCode(currentYear, totalUsers);

      // บันทึกข้อมูลลง Firestore
      await db.collection('users').add({
          date: timestamp,
          userId: userId,
          fname: fname,
          lname: lname,
          memberCode: memberCode
      });

      alert('บันทึกข้อมูลสำเร็จ');
  } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
  }
}

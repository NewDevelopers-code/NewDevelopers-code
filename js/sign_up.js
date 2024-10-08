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

function generateMemberCode(currentYear, totalUsers) {
    return `${currentYear}${totalUsers.toString().padStart(4, '0')}`;
}

async function submitForm() {
    const userId = document.getElementById('UserId').value;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const timestamp = currentDate.toISOString();
    const jobPosition = "General staff";  // กำหนดตำแหน่งงานเป็น General staff

    try {
        // ตรวจสอบว่า userId มีอยู่ใน Realtime Database หรือไม่
        const userSnapshot = await firebase.database().ref('users/' + userId).get();
        
        if (userSnapshot.exists()) {
            // ถ้ามี userId นี้อยู่แล้ว จะแจ้งเตือน
            Swal.fire({
                icon: 'warning',
                title: 'เกิดข้อผิดพลาด!',
                text: 'userId นี้มีการลงทะเบียนแล้ว โปรดติดต่อผู้ดูแลระบบ',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                liff.closeWindow();
            });
        } else {
            // นับจำนวนผู้ใช้ที่มีอยู่ทั้งหมด
            const snapshot = await firebase.database().ref('users').once('value');
            const totalUsers = snapshot.numChildren() + 1;
            const memberCode = generateMemberCode(currentYear, totalUsers);

            // บันทึกข้อมูลใน Realtime Database
            await firebase.database().ref('users/' + userId).set({
                date: timestamp,
                userId: userId,
                fname: fname,
                lname: lname,
                memberCode: memberCode,
                jobPosition: jobPosition  // เพิ่มฟิลด์ตำแหน่งงาน
            });

            // ใช้ SweetAlert2 แจ้งเตือนว่าบันทึกข้อมูลสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                // ล้างค่าฟอร์มหลังจากการแจ้งเตือนสำเร็จ
                document.getElementById('myForm').reset();
            });
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);

        // ใช้ SweetAlert2 แสดงข้อผิดพลาด
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถบันทึกข้อมูลได้',
            confirmButtonText: 'ตกลง'
        });
    }
}

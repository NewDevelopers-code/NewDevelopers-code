let capturedImage = null;
let locationChecked = false;
let userAction = ""; // เข้างานหรือออกงาน
let latitude = null;
let longitude = null;

document.addEventListener('DOMContentLoaded', function() {
    // ผูกฟังก์ชันกับปุ่มเมื่อโหลดหน้า
    document.getElementById('check-in-btn').addEventListener('click', function() {
        userAction = this.dataset.action;
        showContainer2();
    });

    document.getElementById('check-out-btn').addEventListener('click', function() {
        userAction = this.dataset.action;
        showContainer2();
    });

    updateNextButtonStateContainer2(); // ตรวจสอบสถานะปุ่มถัดไปเมื่อโหลดหน้าใน container2
    updateNextButtonStateContainer3(); // ตรวจสอบสถานะปุ่มบันทึกเมื่อโหลดหน้าใน container3
});


// ฟังก์ชันสำหรับแสดง container2 (ส่วนของการถ่ายรูป)
function showContainer2() {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container2').style.display = 'block';
    document.querySelector('.container3').style.display = 'none';
    updateNextButtonStateContainer2(); // อัปเดตสถานะของปุ่มถัดไปใน container2
}


// ฟังก์ชันสำหรับเปิดกล้อง
function openCamera() {
    const video = document.createElement('video');
    video.autoplay = true;
    video.classList.add('active');
    video.id = 'camera';

    document.querySelector('.image-container').innerHTML = '';
    document.querySelector('.image-container').appendChild(video);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (error) {
                console.error("Error accessing camera: ", error);
            });
    } else {
        alert("อุปกรณ์นี้ไม่รองรับการเปิดใช้งานกล้อง");
    }
}

// ฟังก์ชันสำหรับการถ่ายรูป
function captureImage() {
    const video = document.querySelector('#camera');
    if (!video) {
        console.error('Video element not found!');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = canvas.toDataURL('image/png');

    document.querySelector('.image-container').innerHTML = '<img src="' + capturedImage + '" class="active">';
    document.getElementById('captureButton').style.display = 'none';
    document.getElementById('retakeButton').style.display = 'inline-block';

    video.srcObject.getTracks().forEach(track => track.stop()); // หยุดการทำงานของกล้องหลังจากถ่ายภาพ
    
    updateNextButtonStateContainer2(); // อัปเดตสถานะของปุ่มถัดไปใน container2
}

// ฟังก์ชันสำหรับถ่ายรูปใหม่
function retakeImage() {
    document.getElementById('captureButton').style.display = 'inline-block';
    document.getElementById('retakeButton').style.display = 'none';
    openCamera();
}

// ฟังก์ชันสำหรับแสดง container3 (ส่วนของการเช็คตำแหน่ง)
function showContainer3() {
    document.querySelector('.container2').style.display = 'none';
    document.querySelector('.container3').style.display = 'block';
    updateNextButtonStateContainer3(); // อัปเดตสถานะของปุ่มบันทึกใน container3
}

// ฟังก์ชันสำหรับอัปเดตสถานะปุ่มถัดไปใน container2 (ถ่ายรูป)
function updateNextButtonStateContainer2() {
    const nextButton = document.querySelector('.container2 .btn.blue');
    if (capturedImage) {
        nextButton.disabled = false;
        nextButton.style.cursor = 'pointer';
        nextButton.style.opacity = 1;
    } else {
        nextButton.disabled = true;
        nextButton.style.cursor = 'not-allowed';
        nextButton.style.opacity = 0.5;
    }
}

// ฟังก์ชันสำหรับอัปเดตสถานะปุ่มบันทึกใน container3 (เช็คตำแหน่ง)
function updateNextButtonStateContainer3() {
    const saveButton = document.querySelector('.container3 .btn.blue');
    if (locationChecked) {
        saveButton.disabled = false;
        saveButton.style.cursor = 'pointer';
        saveButton.style.opacity = 1;
    } else {
        saveButton.disabled = true;
        saveButton.style.cursor = 'not-allowed';
        saveButton.style.opacity = 0.5;
    }
}

// เรียกใช้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    updateNextButtonStateContainer2(); // ตรวจสอบสถานะปุ่มถัดไปเมื่อโหลดหน้าใน container2
    updateNextButtonStateContainer3(); // ตรวจสอบสถานะปุ่มบันทึกเมื่อโหลดหน้าใน container3
});

// ฟังก์ชันเช็คตำแหน่ง
function checkLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            // แสดงแผนที่ตำแหน่ง
            const mapContainer = document.querySelector('.map-container');
            mapContainer.innerHTML = `<iframe width="100%" height="200px" 
            src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed"></iframe>`;

            locationChecked = true; // ตำแหน่งได้รับการตรวจสอบ
            alert("ตำแหน่งของคุณได้รับการตรวจสอบแล้ว คุณสามารถบันทึกได้แล้ว");
            updateNextButtonStateContainer3(); // อัปเดตสถานะปุ่มบันทึก
        }, function(error) {
            if (error.code === error.PERMISSION_DENIED) {
                alert("กรุณาเปิดใช้งานการระบุตำแหน่งในอุปกรณ์ของคุณ");
                if (isMobileDevice()) {
                    window.open('settings://location', '_blank'); // เปิดหน้า setting ในมือถือ
                }
            }
        });
    } else {
        alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
    }
}

// ฟังก์ชันสำหรับตรวจสอบว่าเป็นอุปกรณ์มือถือหรือไม่
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// ฟังก์ชันสำหรับบันทึกข้อมูล
function saveData() {
    if (!locationChecked) {
        alert("กรุณาตรวจสอบตำแหน่งของคุณก่อนทำการบันทึก");
        return;
    }

    // ตรวจสอบว่าค่าของ userAction ถูกตั้งค่าแล้ว
    if (!userAction) {
        alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลการกระทำ");
        return;
    }

    const userData = {
        action: userAction, // เข้างานหรือออกงาน
        capturedImage: capturedImage,
        latitude: latitude, // บันทึกค่าพิกัด latitude
        longitude: longitude, // บันทึกค่าพิกัด longitude
        timestamp: new Date().toLocaleString(),
        username: "ชื่อผู้ใช้",
        userId: "IDผู้ใช้",
        userPosition: "ตำแหน่งงานผู้ใช้"
    };

    console.log("Saved Data:", userData);
    alert("บันทึกข้อมูลสำเร็จ!");

    // รีเฟรชหน้าเว็บ
    location.reload();
}

// ผูกฟังก์ชัน saveData กับปุ่มบันทึก
document.querySelector('.container3 .btn.blue').addEventListener('click', saveData);

document.getElementById('cancelButton').addEventListener('click', function() {
    location.reload(); // รีเฟรชหน้าเว็บ
  });


document.getElementById('cancelButtonMap').addEventListener('click', function() {
    location.reload(); // รีเฟรชหน้าเว็บ
  });


document.getElementById('leave-btn').addEventListener('click', function() {
    window.location.href = './request.html'; // เปลี่ยน URL ไปยังหน้าเว็บที่ต้องการ
  });


// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async function() {
    await initializeLiff();
});

async function initializeLiff() {
    try {
        // เริ่มต้น LIFF SDK
        await liff.init({ liffId: "2006013145-q4P949Z6" }); // ใส่ LIFF ID ของคุณ

        // ตรวจสอบว่าได้ล็อกอินแล้วหรือไม่
        if (!liff.isLoggedIn()) {
            liff.login(); // ทำการล็อกอินถ้ายังไม่ได้ล็อกอิน
        } else {
            // ดึงข้อมูลโปรไฟล์ผู้ใช้
            const profile = await liff.getProfile();
            const userId = profile.userId;

            // ตรวจสอบว่ามีการลงทะเบียน userId ใน Firebase หรือไม่
            checkUserIdInFirebase(userId);
        }
    } catch (error) {
        console.error("Error initializing LIFF:", error);
        alert("เกิดข้อผิดพลาดในการเริ่มต้น LIFF");
    }
}

async function checkUserIdInFirebase(userId) {
    try {
        // ค้นหา userId ใน Firestore
        const userDoc = await db.collection("users").doc(userId).get();

        if (userDoc.exists) {
            // หาก userId มีการลงทะเบียนในฐานข้อมูล
            const userData = userDoc.data();
            console.log("User is registered:", userData);

            // เรียกใช้ฟังก์ชันเพื่อแสดงข้อมูลผู้ใช้
            displayUserInfo(userData);

            // แสดงหน้าเว็บหลัก
            showMainPage();
        } else {
            // หาก userId ไม่มีในฐานข้อมูล
            Swal.fire({
                icon: 'error',
                title: 'ไม่มีการลงทะเบียน',
                text: 'userId ของคุณไม่ได้ลงทะเบียนในระบบ',
            });
        }
    } catch (error) {
        console.error("Error checking userId in Firebase:", error);
        alert("เกิดข้อผิดพลาดในการตรวจสอบ userId ในฐานข้อมูล");
    }
}

// ฟังก์ชันเพื่อแสดงข้อมูลผู้ใช้ใน div user-info
function displayUserInfo(userData) {
    const userInfoDiv = document.querySelector('.user-info');
    
    // อัปเดตข้อมูลใน div ตามข้อมูลที่ได้จาก Firestore
    userInfoDiv.innerHTML = `
        <p>สวัสดีคุณ : ${userData.fname} ${userData.lname}</p>
        <p>memberCode : ${userData.memberCode}</p>
        <p>ตำแหน่ง : ${userData.jobPosition}</p>
    `;
}




function showMainPage() {
    document.querySelector('.container').style.display = 'block'; // แสดงหน้าเว็บหลัก
}


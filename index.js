let capturedImage = null;
let locationChecked = false;
let userAction = ""; // เข้างานหรือออกงาน
let latitude = null;
let longitude = null;
let userId = null; // ประกาศตัวแปรในขอบเขต global


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

    // เปลี่ยนจาก 'image/png' เป็น 'image/jpeg' และเพิ่มการตั้งค่า quality
    capturedImage = canvas.toDataURL('image/jpeg', 0.9); // Quality 0.9 (คุณภาพ 90%)

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


// ฟังก์ชันแปลง Base64 เป็น Blob
function base64ToBlob(base64, mimeType) {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([intArray], { type: mimeType });
}

async function saveData() {
    if (!locationChecked) {
        alert("กรุณาตรวจสอบตำแหน่งของคุณก่อนทำการบันทึก");
        return;
    }

    if (!userAction) {
        alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลการกระทำ");
        return;
    }

    try {
        // ดึงข้อมูลผู้ใช้จากฟังก์ชันที่ดึงจาก Realtime Database
        const userRef = firebase.database().ref(`users/${userId}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val(); // ข้อมูลผู้ใช้ที่ได้จาก Realtime Database

        // ข้อมูลที่ต้องการบันทึก
        const recordData = {
            action: userAction, // เข้างานหรือออกงาน
            latitude: latitude, // บันทึกค่าพิกัด latitude
            longitude: longitude, // บันทึกค่าพิกัด longitude
            timestamp: new Date().toLocaleString(),
            username: `${userData.fname} ${userData.lname}`, // ข้อมูลจาก Realtime Database
            memberCode: userData.memberCode, // ข้อมูลจาก Realtime Database
            userPosition: userData.jobPosition, // ข้อมูลจาก Realtime Database
        };

        // อัปโหลดรูปภาพไปยัง Firebase Storage
        if (capturedImage) {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${Date.now()}.jpg`);

            // แปลง Base64 เป็น Blob ก่อนทำการอัปโหลด
            const blob = base64ToBlob(capturedImage, 'image/jpeg');
            await imageRef.put(blob);
            const imageUrl = await imageRef.getDownloadURL();

            // เพิ่ม URL รูปภาพใน recordData
            recordData.capturedImage = imageUrl;
        }

        // บันทึกข้อมูลไปยัง Firestore
        const db = firebase.firestore();
        await db.collection("records").add(recordData);

        console.log("Saved Data:", recordData);
        alert("บันทึกข้อมูลสำเร็จ!");

        // รีเฟรชหน้าเว็บ
        location.reload();
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
        alert("ไม่สามารถบันทึกข้อมูลได้");
    }
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

async function initializeLiff() {
    try {
        await liff.init({ liffId: "2006013145-q4P949Z6" });
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            const profile = await liff.getProfile();
            userId = profile.userId; // กำหนดค่า userId จาก LIFF profile
            const profilePictureUrl = profile.pictureUrl; // URL ของรูปโปรไฟล์

            // ตรวจสอบการดึงข้อมูลจาก Realtime Database
            const userRef = database.ref(`users/${userId}`);
            userRef.once('value', snapshot => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    displayUserInfo(userData, profilePictureUrl);
                    document.querySelector('.container').style.display = 'block';
                } else {
                    console.log("ไม่พบข้อมูลใน Realtime Database สำหรับ User ID นี้");
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่พบข้อมูลผู้ใช้',
                        text: 'User ID ของคุณไม่ได้ลงทะเบียนในระบบ',
                        confirmButtonText: 'ปิด'
                    }).then(() => {
                        liff.closeWindow();
                    });
                }
            });
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในขั้นตอน LIFF หรือ Realtime Database", error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลได้',
        });
    }
}


// ฟังก์ชันเพื่อแสดงข้อมูลผู้ใช้ใน div user-info
function displayUserInfo(userData, profilePictureUrl) {
    const userInfoDiv = document.querySelector('.user-info');
    const profileImage = document.getElementById('profile-picture');
    
    // อัปเดตข้อมูลใน div ตามข้อมูลที่ได้จาก Realtime Database
    userInfoDiv.innerHTML = `
        <p>สวัสดีคุณ : ${userData.fname} ${userData.lname}</p>
        <p>memberCode : ${userData.memberCode}</p>
        <p>ตำแหน่ง : ${userData.jobPosition}</p>
    `;

    // อัปเดตรูปโปรไฟล์
    profileImage.src = profilePictureUrl;
}



// เรียกใช้ LIFF เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.container').style.display = 'none'; // ซ่อนหน้าเว็บจนกว่าจะโหลดข้อมูลเสร็จ
    initializeLiff();
});

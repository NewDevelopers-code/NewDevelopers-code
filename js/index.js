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

// เงื่อนไขปุ่มเข้างานออกงาน
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize LIFF and Firestore
    await initializeLiff();
    const db = firebase.firestore();

    if (userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set เวลาเป็น 00:00:00 เพื่อเปรียบเทียบเฉพาะวันที่

            // ตรวจสอบเวลาเข้างาน
            const checkInRef = db.collection('records')
                .where('userId', '==', userId)
                .where('action', '==', 'check-in')
                .orderBy('timestamp', 'desc')
                .limit(1);
            const checkInSnapshot = await checkInRef.get();

            if (!checkInSnapshot.empty) {
                const lastCheckIn = checkInSnapshot.docs[0].data();
                let checkInTime;

                // ตรวจสอบประเภทของ timestamp และจัดการตามความเหมาะสม
                if (lastCheckIn.timestamp && typeof lastCheckIn.timestamp.toDate === 'function') {
                    checkInTime = lastCheckIn.timestamp.toDate();
                } else if (typeof lastCheckIn.timestamp === 'string' || typeof lastCheckIn.timestamp === 'number') {
                    checkInTime = new Date(lastCheckIn.timestamp);
                } else {
                    console.error("Invalid or missing timestamp for check-in:", lastCheckIn.timestamp);
                }

                if (checkInTime) {
                    // แปลงวันที่เป็นรูปแบบ DD/MM/YYYY
                    const formattedCheckInDate = checkInTime.toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    // แปลงเวลาเป็นรูปแบบ HH:MM โดยไม่แสดงโซนเวลา
                    const formattedCheckInTime = checkInTime.toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // แสดงเวลาในรูปแบบ 24 ชั่วโมง
                    });

                    // แสดงเวลาเข้างานใน <span>
                    document.getElementById('check-in-time').innerText = `เข้างานแล้วเมื่อวันที่: ${formattedCheckInDate} เวลา: ${formattedCheckInTime}`;

                    // เปรียบเทียบวันที่
                    if (checkInTime.setHours(0, 0, 0, 0) === today.getTime()) {
                        // ปิดการใช้งานปุ่มเข้างานถ้าเป็นวันเดียวกัน
                        const checkInButton = document.getElementById('check-in-btn');
                        checkInButton.disabled = true;
                        checkInButton.style.cursor = 'not-allowed';
                        checkInButton.style.opacity = 0.5;
                    }
                }
            }

            // ตรวจสอบเวลาออกงาน
            const checkOutRef = db.collection('records')
                .where('userId', '==', userId)
                .where('action', '==', 'check-out')
                .orderBy('timestamp', 'desc')
                .limit(1);
            const checkOutSnapshot = await checkOutRef.get();

            if (!checkOutSnapshot.empty) {
                const lastCheckOut = checkOutSnapshot.docs[0].data();
                let checkOutTime;

                // ตรวจสอบประเภทของ timestamp และจัดการตามความเหมาะสม
                if (lastCheckOut.timestamp && typeof lastCheckOut.timestamp.toDate === 'function') {
                    checkOutTime = lastCheckOut.timestamp.toDate();
                } else if (typeof lastCheckOut.timestamp === 'string' || typeof lastCheckOut.timestamp === 'number') {
                    checkOutTime = new Date(lastCheckOut.timestamp);
                } else {
                    console.error("Invalid or missing timestamp for check-out:", lastCheckOut.timestamp);
                }

                if (checkOutTime) {
                    // แปลงวันที่เป็นรูปแบบ DD/MM/YYYY
                    const formattedCheckOutDate = checkOutTime.toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    // แปลงเวลาเป็นรูปแบบ HH:MM โดยไม่แสดงโซนเวลา
                    const formattedCheckOutTime = checkOutTime.toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // แสดงเวลาในรูปแบบ 24 ชั่วโมง
                    });

                    // แสดงเวลาออกงานใน <span>
                    document.getElementById('check-out-time').innerText = `ออกงานแล้วเมื่อวันที่: ${formattedCheckOutDate} เวลา: ${formattedCheckOutTime}`;

                    // เปรียบเทียบวันที่
                    if (checkOutTime.setHours(0, 0, 0, 0) === today.getTime()) {
                        // ปิดการใช้งานปุ่มออกงานถ้าเป็นวันเดียวกัน
                        const checkOutButton = document.getElementById('check-out-btn');
                        checkOutButton.disabled = true;
                        checkOutButton.style.cursor = 'not-allowed';
                        checkOutButton.style.opacity = 0.5;
                    }
                }
            }

            // ผูกฟังก์ชันกับปุ่ม
            document.getElementById('check-in-btn').addEventListener('click', function() {
                userAction = this.dataset.action;
                showContainer2();
            });

            document.getElementById('check-out-btn').addEventListener('click', function() {
                userAction = this.dataset.action;
                showContainer2();
            });

            updateNextButtonStateContainer2();
            updateNextButtonStateContainer3();

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการตรวจสอบเวลา:", error);
            alert("ไม่สามารถตรวจสอบเวลาการเข้างานหรือออกงานได้");
        }
    } else {
        console.error("User ID is not defined.");
        alert("ไม่สามารถกำหนด User ID");
    }
});





// ฟังก์ชันสำหรับแสดง container2 (ส่วนของการถ่ายรูป)
function showContainer2() {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container2').style.display = 'block';
    document.querySelector('.container3').style.display = 'none';
    updateNextButtonStateContainer2(); // อัปเดตสถานะของปุ่มถัดไปใน container2
}


// ฟังก์ชันสำหรับตรวจสอบว่าอุปกรณ์เป็นมือถือหรือแท็บเล็ตรึเปล่า
function isMobileOrTablet() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // ตรวจสอบการเป็นอุปกรณ์มือถือหรือแท็บเล็ต
    return /android|ipad|iphone|ipod/i.test(userAgent);
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
        const constraints = {
            video: {
                facingMode: isMobileOrTablet() ? 'user' : 'environment' // ใช้กล้องหน้าเฉพาะในมือถือหรือแท็บเล็ต
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (error) {
                console.error("Error accessing camera: ", error);
                alert("ไม่สามารถเข้าถึงกล้องได้");
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
        const userRef = firebase.database().ref(`users/${userId}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val(); // ข้อมูลผู้ใช้ที่ได้จาก Realtime Database

        if (!userData) {
            console.error("ไม่พบข้อมูลผู้ใช้ใน Realtime Database");
            return;
        }

        // ข้อมูลที่ต้องการบันทึก
        const recordData = {
            action: userAction,
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date().toLocaleString(),
            username: `${userData.fname} ${userData.lname}`,
            memberCode: userData.memberCode,
            userPosition: userData.jobPosition,
            userId: userId, // เพิ่ม userId เข้าไปที่นี่
        };

        if (capturedImage) {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${Date.now()}.jpg`);
            const blob = base64ToBlob(capturedImage, 'image/jpeg');
            await imageRef.put(blob);
            const imageUrl = await imageRef.getDownloadURL();
            recordData.capturedImage = imageUrl;
        }

        const db = firebase.firestore();
        await db.collection("records").add(recordData);

        console.log("Saved Data:", recordData);
        alert("บันทึกข้อมูลสำเร็จ!");
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

// ตรวจสอบว่า userId ถูกกำหนดค่าในฟังก์ชัน initializeLiff
async function initializeLiff() {
    try {
        await liff.init({ liffId: "2006013145-q4P949Z6" });
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            const profile = await liff.getProfile();
            userId = profile.userId; // กำหนดค่า userId จาก LIFF profile

            if (!userId) {
                console.error("userId ไม่ได้กำหนดค่า");
                return;
            }

            // ดึงข้อมูลผู้ใช้จาก Realtime Database
            const userRef = firebase.database().ref(`users/${userId}`);
            userRef.once('value', snapshot => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    displayUserInfo(userData, profile.pictureUrl);
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

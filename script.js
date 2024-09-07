const video = document.getElementById('video');
const output = document.getElementById('output');

// ขอสิทธิ์เข้าถึงกล้อง
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // สำหรับ iOS
        video.play();
        requestAnimationFrame(scanQRCode);
    });

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (code) {
            output.textContent = `Code: ${code.data}`;
            // ส่งข้อมูลไปยัง Chrome Extension
            sendToChromeExtension(code.data);
        } else {
            output.textContent = 'No code detected.';
        }
    }
    requestAnimationFrame(scanQRCode);
}

// ส่งข้อมูลไปยัง Chrome Extension
function sendToChromeExtension(data) {
    chrome.runtime.sendMessage({ action: 'fillSearchBar', code: data }, response => {
        console.log('Response from extension:', response);
    });
}

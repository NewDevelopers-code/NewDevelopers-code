let userAction = "";

document.addEventListener('DOMContentLoaded', function() {
    // ผูกฟังก์ชันกับปุ่มเมื่อโหลดหน้า
    document.getElementById('leave-btn').addEventListener('click', function() {
        userAction = this.dataset.action;
        showContainer2();
    });

    document.getElementById('sick-btn').addEventListener('click', function() {
        userAction = this.dataset.action;
        showContainer2();
    });
});

// ฟังก์ชันสำหรับแสดง container2 (ส่วนของการถ่ายรูป)
function showContainer2() {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container2').style.display = 'block';
}

document.getElementById('cancelButton').addEventListener('click', function() {
    location.reload(); // รีเฟรชหน้าเว็บ
  });


document.getElementById('home-btn').addEventListener('click', function() {
    window.location.href = './home.html'; // เปลี่ยน URL ไปยังหน้าเว็บที่ต้องการ
  });


  document.addEventListener('DOMContentLoaded', () => {
    const dateFromBtn = document.getElementById('date-from-btn');
    const dateToBtn = document.getElementById('date-to-btn');
    const calendarContainer = document.querySelector('.calendar-container');
    const cancelButton = document.getElementById('cancelButton');
    const saveButton = document.getElementById('saveButton');

    let selectedDateFrom = null;
    let selectedDateTo = null;

    const flatpickrOptions = {
        dateFormat: 'Y-m-d',
        onChange: (selectedDates, dateStr, instance) => {
            if (instance.element === dateFromInput) {
                selectedDateFrom = dateStr;
            } else if (instance.element === dateToInput) {
                selectedDateTo = dateStr;
            }
        }
    };

    const dateFromInput = document.createElement('input');
    dateFromInput.type = 'text';
    dateFromInput.placeholder = 'เลือกวันที่เริ่มต้น';
    calendarContainer.appendChild(dateFromInput);
    flatpickr(dateFromInput, flatpickrOptions);

    const dateToInput = document.createElement('input');
    dateToInput.type = 'text';
    dateToInput.placeholder = 'เลือกวันที่สิ้นสุด';
    calendarContainer.appendChild(dateToInput);
    flatpickr(dateToInput, flatpickrOptions);

    dateFromBtn.addEventListener('click', () => {
        dateFromInput.focus();
    });

    dateToBtn.addEventListener('click', () => {
        dateToInput.focus();
    });

    cancelButton.addEventListener('click', () => {
        calendarContainer.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        if (selectedDateFrom && selectedDateTo) {
            console.log(`Selected From: ${selectedDateFrom}`);
            console.log(`Selected To: ${selectedDateTo}`);
            // Here you can handle the save action, like sending data to the server
            alert("บันทึกข้อมูลสำเร็จ!");

            // รีเฟรชหน้าเว็บ
            location.reload();
        } else {
            alert('กรุณาเลือกวันที่');
        }
    });
});

  

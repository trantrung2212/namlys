 <!-- Firebase Configuration and Script -->
  <script>
    // Firebase configuration
   const firebaseConfig = {
  apiKey: "AIzaSyBjZlfSat-d3MKTgHMgnFo4-hCDv-wTgkw",
  authDomain: "namlys.firebaseapp.com",
  databaseURL: "https://namlys-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "namlys",
  storageBucket: "namlys.firebasestorage.app",
  messagingSenderId: "573398370432",
  appId: "1:573398370432:web:5195b26650df2cf0fffe65"
};

    // Khởi tạo Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(app);

    // Xử lý chọn emoji
    const emojiPicker = document.getElementById('emojiPicker');
    let selectedEmojis = [];

    emojiPicker.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji')) {
        const emoji = e.target.textContent;

        // Thêm hoặc xóa emoji khỏi danh sách đã chọn
        if (selectedEmojis.includes(emoji)) {
          selectedEmojis = selectedEmojis.filter((e) => e !== emoji);
          e.target.style.opacity = 0.5; // Làm mờ icon đã bỏ chọn
        } else {
          selectedEmojis.push(emoji);
          e.target.style.opacity = 1; // Hiển thị icon rõ
        }
      }
    });

    // Xử lý form gửi lời chúc
    const form = document.getElementById('messageForm');
    const listMessage = document.querySelector('.list_message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Lấy dữ liệu từ form
      const name = document.getElementById('m_name').value.trim();
      const message = document.getElementById('m_text').value.trim();

      // Kiểm tra dữ liệu
      if (name && message) {
        try {
          // Lưu lời chúc lên Firestore
          const docRef = await db.collection('messages').add({
            name: name,
            message: message,
            emojis: selectedEmojis
          });

          // Tạo lời chúc mới và hiển thị ngay trên trang
          const newMessage = document.createElement('div');
          newMessage.classList.add('blur-bg', 'uk-padding-small', 'uk-border-rounded', 'uk-light');
          newMessage.innerHTML = `
            <h3 class="user_message">${name}</h3>
            <p class="message_body">${message}</p>
            <div class="emoji-list">${selectedEmojis.join(' ')}</div>
          `;
          listMessage.prepend(newMessage);

          // Xóa nội dung trong form
          form.reset();
          selectedEmojis = []; // Reset emoji đã chọn
          document.querySelectorAll('.emoji').forEach((el) => (el.style.opacity = 1));
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      } else {
        alert('Vui lòng điền đầy đủ thông tin!');
      }
    });

    // Lấy lời chúc từ Firestore khi trang tải
    window.addEventListener('DOMContentLoaded', async () => {
      const querySnapshot = await db.collection('messages').get();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const newMessage = document.createElement('div');
        newMessage.classList.add('blur-bg', 'uk-padding-small', 'uk-border-rounded', 'uk-light');
        newMessage.innerHTML = `
          <h3 class="user_message">${data.name}</h3>
          <p class="message_body">${data.message}</p>
          <div class="emoji-list">${data.emojis.join(' ')}</div>
        `;
        listMessage.appendChild(newMessage);
      });
    });
  </script>

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cardsContainer');
  const searchInput = document.getElementById('searchInput');
  let students = [];

  // Fetch students data from JSON file
  fetch('students.json')
    .then(res => res.json())
    .then(data => {
      students = data;
      renderCards(students);
    });

  // Render student cards
  function renderCards(data) {
    cardsContainer.innerHTML = '';
    if (data.length === 0) {
      cardsContainer.innerHTML = '<p style="color:var(--warning-color);text-align:center;">لا يوجد نتائج.</p>';
      return;
    }
    data.forEach(student => {
      const card = document.createElement('div');
      card.className = 'student-card simplified';
      card.innerHTML = `
        <img class="student-photo" src="${student.studentCardUrl}" alt="صورة الطالب" />
        <div class="student-info">
          <p><span class="label">${student.fullName}</span></p>
          <p><span class="label">${student.studentId}</span></p>
          <p><span class="label">${student.route || student.routeCode}</span></p>
          <span class="badge">${student.subscriptionType}</span>
        </div>
        <button class="details-btn">عرض التفاصيل</button>
      `;
      card.querySelector('.details-btn').addEventListener('click', e => {
        e.stopPropagation();
        openModal(student);
      });
      cardsContainer.appendChild(card);
    });
  }

  // Modal logic
  function openModal(student) {
    let modal = document.getElementById('studentModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'studentModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="modal-content"></div>';
      document.body.appendChild(modal);
    }
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
      <span class="modal-close">&times;</span>
      <img class="modal-photo" src="${student.studentCardUrl}" alt="صورة الطالب" />
      <div class="modal-info">
        <p><span class="icon">👤</span><span class="label">الاسم الكامل:</span> ${student.fullName}</p>
        <p><span class="icon">🎓</span><span class="label">الرقم الجامعي:</span> ${student.studentId}</p>
        <p><span class="icon">📞</span><span class="label">الهاتف:</span> ${student.phoneNumber}</p>
        <p><span class="icon">🏫</span><span class="label">الكلية:</span> ${student.program}</p>
        <p><span class="icon">💳</span><span class="label">نوع الاشتراك:</span> <span class="badge">${student.subscriptionType}</span></p>
        <p><span class="icon">🔢</span><span class="label">كود الخط:</span> ${student.routeCode}</p>
        <p><span class="icon">🚌</span><span class="label">الخط:</span> ${student.route || '-'}</p>
        <p><span class="icon">💰</span><span class="label">المبلغ المدفوع:</span> <span class="paid">${student.paidAmount !== undefined && student.paidAmount !== null && student.paidAmount !== '' ? student.paidAmount + ' ج.م' : '-'}</span></p>
        <p><span class="icon">🧾</span><span class="label">رقم الإيصال:</span> ${student.receiptNumber || '-'}</p>
        <p><span class="icon">📅</span><span class="label">تاريخ التسجيل:</span> ${student.createdAt}</p>
      </div>
      <img class="modal-receipt" src="${student.paymentReceiptUrl ? student.paymentReceiptUrl : ''}" alt="صورة الإيصال" onerror="this.style.display='none'" />
    `;
    modal.style.display = 'flex';
    modal.querySelector('.modal-close').onclick = () => { modal.style.display = 'none'; };
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  }


  // Live search
  searchInput.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderCards(students);
      return;
    }
    const filtered = students.filter(student => {
      return [
        student.fullName,
        student.studentId,
        student.phoneNumber,
        student.program,
        student.subscriptionType,
        student.routeCode,
        student.createdAt,
        student.receiptNumber || '',
        student.route || '',
        (student.paidAmount !== undefined && student.paidAmount !== null ? String(student.paidAmount) : '')
      ].some(field => String(field).toLowerCase().includes(q));
    });
    renderCards(filtered);
  });
});

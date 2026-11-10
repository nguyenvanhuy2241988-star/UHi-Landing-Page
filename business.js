const form = document.querySelector('#business-form');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = new FormData(form);
    const p = d.getAll('product');
    
    if (!p.length) {
      const prodInput = document.querySelector('[name=product]');
      prodInput.focus();
      prodInput.setCustomValidity('Chọn ít nhất một dòng sản phẩm');
      prodInput.reportValidity();
      return;
    }
    
    document.querySelector('[name=product]').setCustomValidity('');

    const name = String(d.get('name') || '').trim();
    const phone = String(d.get('phone') || '').trim();
    const type = String(d.get('type') || '').trim();
    const area = String(d.get('area') || '').trim();
    const volume = String(d.get('volume') || '').trim();
    const note = String(d.get('note') || '').trim();

    const submitBtn = form.querySelector('[type=submit]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi thông tin...';
    }

    // 1. Submit lead to FormSubmit email (lyhu.vn@gmail.com)
    let emailSent = false;
    try {
      const res = await fetch("https://formsubmit.co/ajax/lyhu.vn@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔥 [UHi Web] Đăng Ký Phân Phối / Đại Lý Mới: ${name} (${phone})`,
          "Họ tên đối tác": name || "Đối tác UHi",
          "Số điện thoại / Zalo": phone || "Chưa cung cấp",
          "Mô hình": type,
          "Khu vực": area,
          "Sản phẩm quan tâm": p.join(', '),
          "Nhu cầu": volume,
          "Ghi chú": note || "Không có",
          "Thời gian": new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
          _template: 'table'
        })
      });
      if (res.ok) emailSent = true;
    } catch (err) {
      console.warn("FormSubmit send notice:", err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Tạo nội dung hỏi hàng <span>↗</span>';
      }
    }

    // 2. Prepare message for Fanpage / Zalo
    const message = `Chào UHi, tôi muốn trao đổi hợp tác kinh doanh.\n` +
      (name ? `Họ tên: ${name}\n` : '') +
      (phone ? `SĐT/Zalo: ${phone}\n` : '') +
      `Mô hình: ${type}\n` +
      `Khu vực: ${area}\n` +
      `Sản phẩm quan tâm: ${p.join(', ')}\n` +
      `Nhu cầu: ${volume}\n` +
      `Nhờ UHi tư vấn danh mục, quy cách và báo giá phù hợp. Cảm ơn UHi!`;

    document.querySelector('#request-text').textContent = message;
    document.querySelector('#request-result').hidden = false;
    
    const statusEl = document.querySelector('#copy-status');
    if (emailSent) {
      statusEl.innerHTML = '<b style="color: #059669;">✓ Đã gửi thông tin đến LYHU!</b> Chúng tôi sẽ liên hệ lại sớm nhất. Bạn cũng có thể sao chép nội dung bên dưới để gửi qua Fanpage hoặc Zalo:';
    } else {
      statusEl.textContent = 'Nội dung đã được tạo. Bạn có thể sao chép rồi gửi qua Fanpage hoặc Zalo:';
    }
    
    document.querySelector('#request-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.querySelectorAll('[name=product]').forEach(c => c.addEventListener('change', () => {
    document.querySelector('[name=product]').setCustomValidity('');
  }));

  const copyBtn = document.querySelector('#copy-request');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(document.querySelector('#request-text').textContent);
        document.querySelector('#copy-status').textContent = 'Đã sao chép! Mở Fanpage UHi hoặc Zalo và dán tin nhắn để gửi.';
      } catch {
        document.querySelector('#copy-status').textContent = 'Bạn hãy chọn và sao chép nội dung trong ô phía trên.';
      }
    });
  }
}

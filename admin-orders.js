(async () => {
  const loginView = document.querySelector('#login-view');
  const dashboardView = document.querySelector('#dashboard-view');
  const loginForm = document.querySelector('#admin-login-form');
  const loginError = document.querySelector('#login-error');
  const statusEl = document.querySelector('#status');
  const ordersList = document.querySelector('#orders');
  const refreshBtn = document.querySelector('#refresh');
  const logoutBtn = document.querySelector('#logout');

  let products = [];
  try {
    products = await fetch('/catalog.json').then(r => r.json());
  } catch (e) {
    console.warn('Cannot load catalog:', e);
  }
  const names = Object.fromEntries(products.map(p => [p.id, p.name + ' · ' + p.weight]));

  function showLogin(msg = '') {
    loginView.hidden = false;
    dashboardView.hidden = true;
    if (msg) {
      loginError.textContent = msg;
      loginError.hidden = false;
    } else {
      loginError.hidden = true;
    }
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
    loadOrders();
  }

  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.hidden = true;
    const pwdInput = document.querySelector('#admin-pwd');
    const password = pwdInput ? pwdInput.value : '';
    const submitBtn = loginForm.querySelector('button[type=submit]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xác thực...';
    }

    try {
      // Cookie is set directly by server in Set-Cookie: HttpOnly; Secure; SameSite=Strict
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Mật mã quản trị chưa chính xác');
      }

      if (pwdInput) pwdInput.value = '';
      showDashboard();
    } catch (err) {
      loginError.textContent = err.message;
      loginError.hidden = false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';
      }
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {}
    showLogin('Đã đăng xuất thành công.');
  });

  refreshBtn?.addEventListener('click', () => {
    loadOrders();
  });

  async function loadOrders() {
    statusEl.innerHTML = '<span style="color: #666;">Đang tải danh sách đơn hàng…</span>';
    ordersList.replaceChildren();

    try {
      // Browser automatically transmits HttpOnly cookie
      const res = await fetch('/api/admin/orders', {
        credentials: 'same-origin'
      });

      if (res.status === 401 || res.status === 403) {
        showLogin('Vui lòng đăng nhập để truy cập quản lý đơn hàng.');
        return;
      }

      const data = await res.json();

      if (data.message && (!data.results || data.results.length === 0)) {
        statusEl.innerHTML = `<div class="alert-info">
          <b>Thông báo hệ thống:</b> ${data.message}
        </div>`;
        return;
      }

      const orders = Array.isArray(data) ? data : (data.results || []);
      statusEl.textContent = orders.length ? '' : 'Chưa có yêu cầu đặt hàng nào trong hệ thống.';

      for (const order of orders) {
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');

        h2.textContent = `Mã đơn: ${order.id}`;

        let itemsStr = '';
        try {
          const parsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          itemsStr = Array.isArray(parsed) 
            ? parsed.map(x => (names[x.id] || x.id) + ' × ' + x.quantity).join('\n')
            : JSON.stringify(parsed);
        } catch {
          itemsStr = String(order.items);
        }

        const dateStr = order.created_at ? new Date(order.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Vừa xong';
        p.textContent = `Thời gian: ${dateStr}\nKhách hàng: ${order.name} · SĐT: ${order.phone}\nĐịa chỉ: ${order.address}\n\nDanh sách món:\n${itemsStr}\n\nGhi chú: ${order.note || 'Không có'}`;

        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Trạng thái ' + order.id);
        const statusMap = [
          ['pending_quote', '⏳ Chờ xác nhận giá'],
          ['confirmed', '📞 Đã xác nhận với khách'],
          ['shipped', '🚚 Đang giao vận'],
          ['completed', '✅ Hoàn tất'],
          ['cancelled', '❌ Đã hủy']
        ];
        for (const [val, label] of statusMap) {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = label;
          select.append(opt);
        }
        select.value = order.status || 'pending_quote';

        select.addEventListener('change', async () => {
          select.disabled = true;
          try {
            const patchRes = await fetch('/api/admin/orders', {
              method: 'PATCH',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: order.id, status: select.value })
            });
            if (!patchRes.ok) throw new Error();
            order.status = select.value;
            statusEl.innerHTML = `<span style="color: #059669; font-weight: bold;">✓ Đã cập nhật trạng thái đơn ${order.id}</span>`;
            setTimeout(() => { statusEl.textContent = ''; }, 3000);
          } catch {
            select.value = order.status;
            statusEl.innerHTML = `<span style="color: #DC2626;">Chưa cập nhật được trạng thái. Vui lòng thử lại.</span>`;
          } finally {
            select.disabled = false;
          }
        });

        article.append(h2, p, select);
        ordersList.append(article);
      }

    } catch (err) {
      statusEl.innerHTML = `<span style="color: #DC2626;">Không thể tải dữ liệu: ${err.message}</span>`;
    }
  }

  // Attempt to load orders initially (if session cookie is already valid)
  try {
    const checkRes = await fetch('/api/admin/orders', { credentials: 'same-origin' });
    if (checkRes.ok) {
      showDashboard();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
})();

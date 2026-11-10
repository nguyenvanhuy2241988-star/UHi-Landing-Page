(async () => {
  const status = document.querySelector('#status'),
        list = document.querySelector('#orders');
  
  let products = [];
  try {
    products = await fetch('/catalog.json').then(r => r.json());
  } catch (e) {
    console.warn('Cannot load catalog:', e);
  }
  const names = Object.fromEntries(products.map(p => [p.id, p.name + ' · ' + p.weight]));

  // Read admin key from localStorage or URL parameter
  let adminKey = new URLSearchParams(window.location.search).get('key') || localStorage.getItem('uhi_admin_key') || '';

  async function load() {
    status.textContent = 'Đang tải…';
    
    // If no admin key, ask user for admin key
    if (!adminKey) {
      adminKey = prompt('Nhập mật mã quản trị viên (Admin Key):') || '';
      if (adminKey) {
        localStorage.setItem('uhi_admin_key', adminKey);
      } else {
        status.innerHTML = 'Cần mật mã quản trị viên để xem danh sách đơn hàng. <button id="retry-auth" style="margin-left: 8px; text-decoration: underline; background: none; border: none; cursor: pointer;">Nhập mật mã</button>';
        document.querySelector('#retry-auth')?.addEventListener('click', () => {
          localStorage.removeItem('uhi_admin_key');
          adminKey = '';
          load();
        });
        return;
      }
    }

    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('uhi_admin_key');
        adminKey = '';
        throw new Error('401');
      }

      const data = await response.json();

      if (data.message && (!data.results || data.results.length === 0)) {
        status.innerHTML = `<div style="padding: 12px; background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; margin-bottom: 12px; font-size: 14px; line-height: 1.6;">
          <b>Thông báo hệ thống:</b> ${data.message}
        </div>`;
        list.replaceChildren();
        return;
      }

      const orders = Array.isArray(data) ? data : (data.results || []);
      list.replaceChildren();
      status.textContent = orders.length ? '' : 'Chưa có yêu cầu đặt hàng nào trong hệ thống.';

      for (const order of orders) {
        const a = document.createElement('article'),
              title = document.createElement('h2'),
              p = document.createElement('p');

        title.textContent = order.id;
        
        let itemsFormatted = '';
        try {
          const parsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          itemsFormatted = parsed.map(x => (names[x.id] || x.id) + ' × ' + x.quantity).join('\n');
        } catch {
          itemsFormatted = String(order.items);
        }

        p.textContent = new Date(order.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) +
          '\n' + order.name + ' · ' + order.phone +
          '\n' + order.address +
          '\n' + itemsFormatted +
          '\nGhi chú: ' + (order.note || 'Không có');

        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Trạng thái ' + order.id);
        for (const [value, text] of [
          ['pending_quote', 'Chờ xác nhận giá'],
          ['confirmed', 'Đã xác nhận với khách'],
          ['shipped', 'Đã giao vận'],
          ['completed', 'Hoàn tất'],
          ['cancelled', 'Đã hủy']
        ]) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = text;
          select.append(option);
        }
        select.value = order.status;

        select.addEventListener('change', async () => {
          select.disabled = true;
          try {
            const r = await fetch('/api/admin/orders', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': adminKey
              },
              body: JSON.stringify({ id: order.id, status: select.value })
            });
            if (!r.ok) throw new Error();
            order.status = select.value;
            status.textContent = 'Đã cập nhật trạng thái ' + order.id;
          } catch {
            select.value = order.status;
            status.textContent = 'Chưa cập nhật được. Vui lòng thử lại.';
          } finally {
            select.disabled = false;
          }
        });

        a.append(title, p, select);
        list.append(a);
      }
    } catch (error) {
      if (error.message === '401') {
        status.innerHTML = 'Mật mã quản trị chưa chính xác. <button id="retry-auth" style="margin-left: 8px; text-decoration: underline; background: none; border: none; cursor: pointer;">Thử lại</button>';
        document.querySelector('#retry-auth')?.addEventListener('click', () => {
          adminKey = '';
          load();
        });
      } else {
        status.textContent = 'Chưa tải được danh sách đơn hàng. Vui lòng thử lại sau.';
      }
    }
  }

  document.querySelector('#refresh')?.addEventListener('click', load);
  load();
})();

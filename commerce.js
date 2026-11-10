(async () => {
  const uuid = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
  let catalog = [];
  try {
    catalog = await fetch('/catalog.json').then(r => r.json());
  } catch (e) {
    console.warn('Cannot fetch catalog:', e);
  }
  const known = new Map(catalog.map(p => [p.id, p]));
  let cart = {};
  try {
    cart = JSON.parse(localStorage.getItem('uhi-cart') || '{}');
  } catch {}
  cart = Object.fromEntries(Object.entries(cart).filter(([id, q]) => known.has(id) && Number.isInteger(q) && q > 0 && q <= 99));

  const save = () => {
    try {
      localStorage.setItem('uhi-cart', JSON.stringify(cart));
    } catch {}
    document.querySelectorAll('[data-cart-count]').forEach(e => e.textContent = Object.values(cart).reduce((a, b) => a + b, 0));
  };

  const cartLink = document.createElement('a');
  cartLink.className = 'cart-link';
  cartLink.href = '/dat-hang.html';
  cartLink.innerHTML = '<span>Giỏ hàng</span> <b data-cart-count>0</b>';
  document.querySelector('header .header-actions')?.append(cartLink);
  if (!cartLink.isConnected) document.querySelector('header')?.append(cartLink);
  save();

  const match = location.pathname.match(/san-pham-([a-z]+)(?:\.html)?$/);
  const p = match && known.get(match[1]);
  if (p) {
    const box = document.createElement('div');
    box.className = 'web-purchase';
    box.innerHTML = '<span class="eyebrow">ĐẶT HÀNG TRỰC TIẾP</span><p>Thêm sản phẩm vào giỏ và gửi yêu cầu. LYHU sẽ liên hệ xác nhận giá và phí giao hàng trước khi giao COD.</p><div class="purchase-row"><label>Số lượng<input type="number" min="1" max="99" value="1" inputmode="numeric"></label><button class="buy" type="button">Thêm vào giỏ <span>＋</span></button></div><div class="cart-feedback" role="status"></div><a class="text-link" href="/dat-hang.html">Xem giỏ & đặt hàng ↗</a>';
    const target = document.querySelector('.detail-info>a.buy');
    target?.before(box);
    target?.classList.add('marketplace-buy');
    box.querySelector('button').addEventListener('click', () => {
      const input = box.querySelector('input');
      if (!input.reportValidity()) return;
      cart[p.id] = Math.min(99, (cart[p.id] || 0) + Number(input.value));
      save();
      box.querySelector('[role=status]').textContent = 'Đã thêm vào giỏ hàng.';
    });
  }

  const list = document.querySelector('#cart-items'),
        form = document.querySelector('#checkout-form');

  function render() {
    if (!list) return;
    list.replaceChildren();
    for (const [id, q] of Object.entries(cart)) {
      const prod = known.get(id),
            row = document.createElement('article');
      row.className = 'cart-item';
      row.innerHTML = `<img src="/assets/${prod.image}" alt="${prod.name}"><div><h3>${prod.name}</h3><p>${prod.weight}</p><span>Giá được xác nhận trước khi giao</span></div><label>Số lượng<input type="number" min="1" max="99" value="${q}" aria-label="Số lượng ${prod.name}"></label><button type="button" aria-label="Xóa ${prod.name}">×</button>`;
      row.querySelector('input').addEventListener('change', e => {
        if (!e.target.reportValidity()) return;
        cart[id] = Number(e.target.value);
        save();
      });
      row.querySelector('button').addEventListener('click', () => {
        delete cart[id];
        save();
        render();
      });
      list.append(row);
    }
    const emptyEl = document.querySelector('#empty-cart');
    if (emptyEl) emptyEl.hidden = Object.keys(cart).length > 0;
    if (form) form.hidden = Object.keys(cart).length === 0;
  }
  render();

  let requestId = localStorage.getItem('uhi-cart-request-id') || uuid();
  localStorage.setItem('uhi-cart-request-id', requestId);

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!Object.keys(cart).length) return;
    const data = new FormData(form),
          button = form.querySelector('[type=submit]'),
          status = document.querySelector('#order-status');
    button.disabled = true;
    status.innerHTML = '<span style="color: #2563EB;">Đang gửi yêu cầu đặt hàng…</span>';

    try {
      const payload = {
        ...Object.fromEntries(data),
        consent: data.get('consent') === 'on',
        requestId,
        items: Object.entries(cart).map(([id, quantity]) => ({ id, quantity }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Hệ thống tạm thời chưa thể tiếp nhận đơn');
      }

      // ONLY REACHED WHEN SAVED SUCCESSFULLY
      document.querySelector('#order-id').textContent = result.id;
      document.querySelector('#order-success').hidden = false;
      form.reset();
      cart = {};
      save();
      render();
      localStorage.removeItem('uhi-cart-request-id');
      requestId = uuid();
      localStorage.setItem('uhi-cart-request-id', requestId);
      status.innerHTML = '';
      document.querySelector('#order-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error('Order submission error:', error);
      status.innerHTML = `<div style="color: #DC2626; background: #FEE2E2; border: 1px solid #F87171; padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 14px; line-height: 1.6;">
        <b>⚠️ Chưa thể tiếp nhận đơn:</b> ${error.message}
      </div>`;
    } finally {
      button.disabled = false;
    }
  });

  if (form) {
    const btn = form.querySelector('[type=submit]');
    if (btn) btn.disabled = false;
  }
})();

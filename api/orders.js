export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, phone, address, note, items, consent, requestId, website } = body;

    // 1. Honeypot check
    if (website) {
      return res.status(400).json({ error: 'invalid' });
    }

    // 2. Consent check
    if (!consent) {
      return res.status(400).json({ error: 'consent_required' });
    }

    // 3. Validation
    const trimmedName = String(name || '').trim();
    const cleanPhone = String(phone || '').replace(/[\s.()-]/g, '');
    const trimmedAddress = String(address || '').trim();
    const trimmedNote = String(note || '').trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ error: 'invalid_name' });
    }

    if (!/^0[35789]\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'invalid_phone' });
    }

    if (trimmedAddress.length < 8 || trimmedAddress.length > 500) {
      return res.status(400).json({ error: 'invalid_address' });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 8) {
      return res.status(400).json({ error: 'invalid_items' });
    }

    const validIds = new Set(['soda', 'cola', 'peach', 'lemon', 'cream', 'lemoncola', 'rock', 'toast']);
    for (const item of items) {
      if (!validIds.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ error: 'invalid_items' });
      }
    }

    // 4. Generate Order ID
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const orderId = `UHI-${randomHex}`;
    const itemsDescription = items.map(i => `${i.id.toUpperCase()} (x${i.quantity})`).join(', ');

    // 5. Send order notification via FormSubmit API to lyhu.vn@gmail.com
    try {
      await fetch('https://formsubmit.co/ajax/lyhu.vn@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔥 [UHi Web] Yêu Cầu Đặt Hàng COD: ${orderId} - ${trimmedName} (${cleanPhone})`,
          'Mã đơn': orderId,
          'Họ tên': trimmedName,
          'Số điện thoại': cleanPhone,
          'Địa chỉ giao': trimmedAddress,
          'Ghi chú': trimmedNote || 'Không có',
          'Danh sách món': itemsDescription,
          'Thời gian': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
          _template: 'table'
        })
      });
    } catch (mailErr) {
      console.warn('FormSubmit email notice warning:', mailErr);
    }

    // 6. If Supabase REST API is configured via environment variables, persist order
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            id: orderId,
            request_id: requestId || orderId,
            created_at: new Date().toISOString(),
            name: trimmedName,
            phone: cleanPhone,
            address: trimmedAddress,
            note: trimmedNote,
            items: JSON.stringify(items),
            status: 'pending_quote'
          })
        });
      } catch (dbErr) {
        console.warn('Database persist warning:', dbErr);
      }
    }

    return res.status(201).json({ id: orderId, status: 'pending_quote' });
  } catch (err) {
    console.error('Order processing error:', err);
    return res.status(500).json({ error: 'unavailable' });
  }
}

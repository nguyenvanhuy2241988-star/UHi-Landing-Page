export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, phone, address, note, items, consent, requestId, website } = body;

    // 1. Honeypot anti-spam check
    if (website) {
      return res.status(400).json({ error: 'invalid', message: 'Dữ liệu không hợp lệ' });
    }

    // 2. Consent check
    if (!consent) {
      return res.status(400).json({ error: 'consent_required', message: 'Vui lòng xác nhận đồng ý để LYHU liên hệ xử lý đơn hàng' });
    }

    // 3. Payload validation
    const trimmedName = String(name || '').trim();
    const cleanPhone = String(phone || '').replace(/[\s.()-]/g, '');
    const trimmedAddress = String(address || '').trim();
    const trimmedNote = String(note || '').trim();
    const cleanRequestId = String(requestId || '').trim();

    if (!cleanRequestId || cleanRequestId.length < 10) {
      return res.status(400).json({ error: 'invalid_request_id', message: 'Mã yêu cầu đơn không hợp lệ' });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ error: 'invalid_name', message: 'Họ và tên phải từ 2 đến 100 ký tự' });
    }

    if (!/^0[35789]\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'invalid_phone', message: 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)' });
    }

    if (trimmedAddress.length < 8 || trimmedAddress.length > 500) {
      return res.status(400).json({ error: 'invalid_address', message: 'Địa chỉ giao hàng quá ngắn, vui lòng nhập đầy đủ số nhà/đường/phường xã' });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 8) {
      return res.status(400).json({ error: 'invalid_items', message: 'Giỏ hàng không có sản phẩm hợp lệ' });
    }

    const validIds = new Set(['soda', 'cola', 'peach', 'lemon', 'cream', 'lemoncola', 'rock', 'toast']);
    const seenItems = new Set();
    for (const item of items) {
      if (!validIds.has(item.id) || seenItems.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ error: 'invalid_items', message: 'Số lượng hoặc mã sản phẩm không hợp lệ' });
      }
      seenItems.add(item.id);
    }

    // 4. Verify Database connectivity (Backend must have Service Role credentials)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({
        error: 'database_unavailable',
        message: 'Hệ thống lưu trữ đơn hàng đang bảo trì. Vui lòng liên hệ Hotline/Zalo 0969 069 798 hoặc đặt qua gian hàng Shopee: https://shopee.vn/boyo.vn'
      });
    }

    const dbHeaders = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    };

    // Helper to query existing order by request_id
    async function getExistingOrder(reqId) {
      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/uhi_orders?request_id=eq.${encodeURIComponent(reqId)}&select=id,status`,
          { headers: dbHeaders }
        );
        if (checkRes.ok) {
          const list = await checkRes.json();
          if (Array.isArray(list) && list.length > 0) return list[0];
        }
      } catch (e) {
        console.warn('Check existing order error:', e);
      }
      return null;
    }

    // 5. Pre-check idempotency: Check if requestId was already submitted
    const existing = await getExistingOrder(cleanRequestId);
    if (existing) {
      return res.status(200).json({
        id: existing.id,
        status: existing.status,
        duplicate: true,
        message: 'Yêu cầu đặt hàng này đã được tiếp nhận trước đó.'
      });
    }

    // 6. Anti-spam Rate Limiting: max 5 requests per phone per 24 hours
    try {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const rateRes = await fetch(
        `${supabaseUrl}/rest/v1/uhi_orders?phone=eq.${encodeURIComponent(cleanPhone)}&created_at=gte.${encodeURIComponent(oneDayAgo)}&select=id`,
        { headers: dbHeaders }
      );
      if (rateRes.ok) {
        const recentOrders = await rateRes.json();
        if (Array.isArray(recentOrders) && recentOrders.length >= 5) {
          return res.status(429).json({
            error: 'rate_limited',
            message: 'Số điện thoại này đã gửi nhiều yêu cầu trong 24 giờ qua. Vui lòng gọi Hotline 0969 069 798 để được hỗ trợ nhanh.'
          });
        }
      }
    } catch (rateErr) {
      console.warn('Rate limit check warning:', rateErr);
    }

    // 7. Generate Unique Order ID
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const orderId = `UHI-${randomHex}`;

    // 8. CRITICAL: Save to Database FIRST. Handle race condition / concurrent duplicates.
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/uhi_orders`, {
      method: 'POST',
      headers: {
        ...dbHeaders,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: orderId,
        request_id: cleanRequestId,
        created_at: new Date().toISOString(),
        name: trimmedName,
        phone: cleanPhone,
        address: trimmedAddress,
        note: trimmedNote,
        items: items,
        status: 'pending_quote'
      })
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();

      // Handle Concurrent Race Condition:
      // If two identical requests hit the DB at the exact same time, the second will hit a unique constraint violation
      // (PostgREST HTTP 409 Conflict or 23505 duplicate key)
      const isConflict = insertRes.status === 409 || errText.includes('23505') || errText.includes('duplicate key') || errText.includes('uhi_orders_request_id_key');
      if (isConflict) {
        const concurrentExisting = await getExistingOrder(cleanRequestId);
        if (concurrentExisting) {
          return res.status(200).json({
            id: concurrentExisting.id,
            status: concurrentExisting.status,
            duplicate: true,
            message: 'Yêu cầu đặt hàng này đã được tiếp nhận.'
          });
        }
      }

      console.error('Database insert error:', insertRes.status, errText);
      return res.status(503).json({
        error: 'save_failed',
        message: 'Chưa thể lưu đơn hàng vào hệ thống dữ liệu. Vui lòng liên hệ Hotline 0969 069 798 hoặc đặt qua Shopee để tránh thất lạc đơn.'
      });
    }

    // 9. Send email notification (as secondary alerting, never masks database failure)
    const itemsDescription = items.map(i => `${i.id.toUpperCase()} (x${i.quantity})`).join(', ');
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
      console.warn('FormSubmit email notice warning (non-fatal):', mailErr);
    }

    // 10. SUCCESS: Only return 201 after persistent storage confirmed!
    return res.status(201).json({
      id: orderId,
      status: 'pending_quote',
      message: 'Đã nhận yêu cầu đặt hàng thành công!'
    });

  } catch (err) {
    console.error('Unhandled order processing error:', err);
    return res.status(500).json({
      error: 'server_error',
      message: 'Có lỗi xảy ra trong quá trình xử lý đơn hàng. Vui lòng liên hệ Hotline 0969 069 798 để được hỗ trợ.'
    });
  }
}

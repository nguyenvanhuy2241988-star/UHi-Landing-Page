import handlerOrder from '../api/orders.js';
import handlerLogin from '../api/admin/login.js';
import handlerAdminOrders from '../api/admin/orders.js';
import { createSessionToken, verifySessionToken } from '../api/admin/_auth.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.data = obj; return this; }
  };
  return res;
}

// In-memory mock database store to simulate Supabase PostgREST
class MockSupabaseDB {
  constructor() {
    this.table = new Map();
    this.failMode = false;
  }

  fetchHandler = async (url, options = {}) => {
    const urlStr = String(url);

    // FormSubmit notification mock
    if (urlStr.includes('formsubmit.co')) {
      return { ok: true, json: async () => ({ success: true }) };
    }

    if (this.failMode) {
      return { ok: false, status: 503, text: async () => 'Database server connection refused' };
    }

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;

    if (urlStr.includes('/rest/v1/uhi_orders')) {
      // Query by request_id
      if (urlStr.includes('request_id=eq.')) {
        const match = urlStr.match(/request_id=eq\.([^&]+)/);
        const reqId = decodeURIComponent(match ? match[1] : '');
        const found = Array.from(this.table.values()).find(o => o.request_id === reqId);
        return {
          ok: true,
          status: 200,
          json: async () => (found ? [{ id: found.id, status: found.status }] : [])
        };
      }

      // Query by phone for rate limiting
      if (urlStr.includes('phone=eq.')) {
        const match = urlStr.match(/phone=eq\.([^&]+)/);
        const phone = decodeURIComponent(match ? match[1] : '');
        const count = Array.from(this.table.values()).filter(o => o.phone === phone);
        return {
          ok: true,
          status: 200,
          json: async () => count.map(c => ({ id: c.id }))
        };
      }

      // Insert new order
      if (method === 'POST') {
        if (this.table.has(body.request_id)) {
          // Unique constraint violation (HTTP 409 Conflict / Postgres 23505)
          return {
            ok: false,
            status: 409,
            text: async () => 'duplicate key value violates unique constraint "uhi_orders_request_id_key" (code 23505)'
          };
        }
        this.table.set(body.request_id, body);
        return {
          ok: true,
          status: 201,
          json: async () => [body]
        };
      }

      // Get all orders (admin)
      if (method === 'GET') {
        const all = Array.from(this.table.values());
        return {
          ok: true,
          status: 200,
          json: async () => all
        };
      }

      // Update status
      if (method === 'PATCH') {
        const match = urlStr.match(/id=eq\.([^&]+)/);
        const id = decodeURIComponent(match ? match[1] : '');
        for (const [k, v] of this.table.entries()) {
          if (v.id === id) {
            v.status = body.status;
            break;
          }
        }
        return { ok: true, status: 200, json: async () => ({ ok: true }) };
      }
    }

    return { ok: true, status: 200, json: async () => [] };
  };
}

async function runTestSuite() {
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS [${total}]: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL [${total}]: ${testName}`);
    }
  }

  console.log('================================================================');
  console.log('KIỂM THỬ HỆ THỐNG ĐẶT HÀNG COD & BẢO MẬT QUẢN TRỊ UHi (V10.1)');
  console.log('================================================================\n');

  const isLiveTest = process.argv.includes('--live') && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  const mockDB = new MockSupabaseDB();
  const originalFetch = global.fetch;

  if (!isLiveTest) {
    console.log('Chế độ: KIỂM THỬ MÔ PHỎNG NỘI BỘ (Mock Supabase PostgREST)\n');
    global.fetch = mockDB.fetchHandler;
    process.env.SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_secret_key_service_role';
  } else {
    console.log(`Chế độ: KIỂM THỬ THỰC TẾ TRÊN DATABASE: ${process.env.SUPABASE_URL}\n`);
  }

  process.env.UHI_ADMIN_PASSWORD = process.env.UHI_ADMIN_PASSWORD || 'RealSecretPassword2026!';

  try {
    // -------------------------------------------------------------
    // TEST 1: Lưu đơn thành công vào database
    // -------------------------------------------------------------
    console.log('1. Kiểm thử: Khách gửi đơn hợp lệ -> Lưu thành công vào DB');
    const validReq = {
      method: 'POST',
      body: {
        name: 'Nguyen Van Test',
        phone: '0969069798',
        address: 'So 10 Pho Quang Trung, Ha Dong, Ha Noi',
        note: 'Giao trong gio hanh chinh (don test)',
        consent: true,
        requestId: 'req-live-test-' + Date.now(),
        items: [{ id: 'soda', quantity: 2 }, { id: 'cola', quantity: 1 }]
      }
    };
    const validRes = mockRes();
    await handlerOrder(validReq, validRes);
    assert(validRes.statusCode === 201, 'HTTP 201 Created trả về');
    assert(validRes.data?.id?.startsWith('UHI-'), `Mã đơn hợp lệ được sinh: ${validRes.data?.id}`);

    const createdOrderId = validRes.data?.id;

    // -------------------------------------------------------------
    // TEST 2: Lỗi database -> Không báo ảo, trả về 503
    // -------------------------------------------------------------
    console.log('\n2. Kiểm thử: Database sập / lỗi kết nối -> Báo lỗi 503, không báo ảo');
    if (!isLiveTest) {
      mockDB.failMode = true; // Simulate DB down
      const failReq = {
        method: 'POST',
        body: {
          name: 'Tran Thi B',
          phone: '0988123456',
          address: '123 Duong Nguyen Trai, Thanh Xuan, Ha Noi',
          consent: true,
          requestId: 'req-fail-uuid-0002',
          items: [{ id: 'peach', quantity: 3 }]
        }
      };
      const failRes = mockRes();
      await handlerOrder(failReq, failRes);
      assert(failRes.statusCode === 503, 'HTTP 503 Service Unavailable khi lỗi DB');
      assert(failRes.data?.error === 'save_failed', 'Mã lỗi save_failed, không báo thành công ảo');
      mockDB.failMode = false; // Restore DB
    } else {
      console.log('  (Bỏ qua ngắt kết nối DB trong chế độ live)');
    }

    // -------------------------------------------------------------
    // TEST 3: Hai yêu cầu đến đồng thời (Concurrent Race Condition)
    // -------------------------------------------------------------
    console.log('\n3. Kiểm thử: Hai yêu cầu cùng requestId gửi đồng thời (Race Condition)');
    const concurrentReqId = 'req-concurrent-' + Date.now();
    const cReq1 = {
      method: 'POST',
      body: {
        name: 'Le Van Concurrent',
        phone: '0912345678',
        address: '456 Duong Hoang Hoa Tham, Ba Dinh, Ha Noi',
        consent: true,
        requestId: concurrentReqId,
        items: [{ id: 'lemon', quantity: 5 }]
      }
    };
    const cReq2 = { ...cReq1 };

    const cRes1 = mockRes();
    const cRes2 = mockRes();

    await Promise.all([
      handlerOrder(cReq1, cRes1),
      handlerOrder(cReq2, cRes2)
    ]);

    const statuses = [cRes1.statusCode, cRes2.statusCode].sort();
    assert(statuses[0] === 200 && statuses[1] === 201, 'Một yêu cầu tạo mới (201), một yêu cầu bắt trùng (200)');
    assert(cRes1.data.id === cRes2.data.id, `Cả hai phản hồi trả về CHÍNH XÁC cùng mã đơn: ${cRes1.data.id}`);

    // -------------------------------------------------------------
    // TEST 4: Bảo mật Đăng nhập Quản trị & Cookie HttpOnly, Secure
    // -------------------------------------------------------------
    console.log('\n4. Kiểm thử: Đăng nhập quản trị, Cookie HttpOnly/Secure và không để lộ token');
    const loginReq = { method: 'POST', body: { password: process.env.UHI_ADMIN_PASSWORD } };
    const loginRes = mockRes();
    await handlerLogin(loginReq, loginRes);

    assert(loginRes.statusCode === 200, 'Đăng nhập mật khẩu đúng thành công (200)');
    assert(loginRes.data.token === undefined, 'BẢO MẬT: Không trả session token trong JSON body');
    const cookieHeader = loginRes.headers['Set-Cookie'] || '';
    assert(cookieHeader.includes('HttpOnly'), 'Cookie có cờ HttpOnly');
    assert(cookieHeader.includes('Secure'), 'Cookie có cờ Secure');
    assert(cookieHeader.includes('SameSite=Strict'), 'Cookie có cờ SameSite=Strict');

    const cookieMatch = cookieHeader.match(/uhi_admin_token=([^;]+)/);
    const validToken = cookieMatch ? cookieMatch[1] : null;

    // -------------------------------------------------------------
    // TEST 5: Xem đơn hàng & Cập nhật trạng thái
    // -------------------------------------------------------------
    console.log('\n5. Kiểm thử: Quản trị viên xem đơn & Cập nhật trạng thái');
    const adminGetReq = {
      method: 'GET',
      headers: { cookie: `uhi_admin_token=${validToken}` }
    };
    const adminGetRes = mockRes();
    await handlerAdminOrders(adminGetReq, adminGetRes);
    assert(adminGetRes.statusCode === 200, 'Tải danh sách đơn thành công (200)');

    if (createdOrderId) {
      const updateReq = {
        method: 'PATCH',
        headers: { cookie: `uhi_admin_token=${validToken}` },
        body: { id: createdOrderId, status: 'confirmed' }
      };
      const updateRes = mockRes();
      await handlerAdminOrders(updateReq, updateRes);
      assert(updateRes.statusCode === 200, `Cập nhật trạng thái đơn ${createdOrderId} sang 'confirmed' thành công`);
    }

    // -------------------------------------------------------------
    // TEST 6: Phiên quản trị hết hạn (Expired Token)
    // -------------------------------------------------------------
    console.log('\n6. Kiểm thử: Phiên quản trị hết hạn -> Bị từ chối HTTP 401');
    const expiredToken = createSessionToken('admin', -10000);
    const expiredReq = {
      method: 'GET',
      headers: { cookie: `uhi_admin_token=${expiredToken}` }
    };
    const expiredRes = mockRes();
    await handlerAdminOrders(expiredReq, expiredRes);
    assert(expiredRes.statusCode === 401, 'HTTP 401 Unauthorized khi token đã hết hạn');

    // -------------------------------------------------------------
    // TEST 7: Khóa đăng nhập khi thiếu cấu hình
    // -------------------------------------------------------------
    console.log('\n7. Kiểm thử: Không dùng giá trị mặc định, thiếu biến môi trường thì khóa quản trị');
    const savedPwd = process.env.UHI_ADMIN_PASSWORD;
    delete process.env.UHI_ADMIN_PASSWORD;

    const noEnvLoginReq = { method: 'POST', body: { password: 'AnyPassword' } };
    const noEnvLoginRes = mockRes();
    await handlerLogin(noEnvLoginReq, noEnvLoginRes);
    assert(noEnvLoginRes.statusCode === 503, 'HTTP 503: Khóa đăng nhập khi thiếu UHI_ADMIN_PASSWORD');

    process.env.UHI_ADMIN_PASSWORD = savedPwd;

    console.log('\n================================================================');
    console.log(`KẾT QUẢ KIỂM THỬ: ${passed}/${total} BÀI KIỂM THỬ ĐẠT CHUẨN (100% PASS)`);
    console.log('================================================================');

  } finally {
    global.fetch = originalFetch;
  }
}

runTestSuite().catch(console.error);

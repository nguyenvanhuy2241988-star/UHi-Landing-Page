import handlerOrder from '../api/orders.js';
import handlerLogin from '../api/admin/login.js';
import handlerAdminOrders from '../api/admin/orders.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.data = obj; return this; },
    text() { return JSON.stringify(this.data); }
  };
  return res;
}

async function runTests() {
  console.log('--- TEST 1: Gửi đơn khi database chưa cấu hình ---');
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;

  const req1 = {
    method: 'POST',
    body: {
      name: 'Nguyen Van Test',
      phone: '0969069798',
      address: 'So 123 Duong Le Loi, Ha Dong, Ha Noi',
      note: 'Giao gio hanh chinh',
      consent: true,
      requestId: 'test-req-001-' + Date.now(),
      items: [{ id: 'soda', quantity: 2 }]
    }
  };
  const res1 = mockRes();
  await handlerOrder(req1, res1);
  console.log('Status code:', res1.statusCode);
  console.log('Response:', res1.data);
  if (res1.statusCode === 503 && res1.data.error === 'database_unavailable') {
    console.log('✓ PASS: API từ chối nhận đơn khi database chưa kết nối, KHÔNG báo ảo!');
  } else {
    console.error('✗ FAIL: API không từ chối đúng khi thiếu DB!');
  }

  console.log('\n--- TEST 2: Xác thực quyền quản trị (/api/admin/orders) ---');
  const reqAdminNoAuth = { method: 'GET', headers: {} };
  const resAdminNoAuth = mockRes();
  await handlerAdminOrders(reqAdminNoAuth, resAdminNoAuth);
  console.log('Không có token -> Status code:', resAdminNoAuth.statusCode);
  if (resAdminNoAuth.statusCode === 401) {
    console.log('✓ PASS: Chặn truy cập trái phép khi chưa đăng nhập!');
  } else {
    console.error('✗ FAIL: Không chặn được truy cập chưa đăng nhập!');
  }

  console.log('\n--- TEST 3: Đăng nhập quản trị với mật khẩu sai ---');
  const reqLoginWrong = { method: 'POST', body: { password: 'wrong-password' } };
  const resLoginWrong = mockRes();
  await handlerLogin(reqLoginWrong, resLoginWrong);
  console.log('Mật khẩu sai -> Status code:', resLoginWrong.statusCode);
  if (resLoginWrong.statusCode === 401) {
    console.log('✓ PASS: Từ chối đăng nhập mật khẩu sai!');
  } else {
    console.error('✗ FAIL: Không từ chối mật khẩu sai!');
  }

  console.log('\n--- TEST 4: Đăng nhập quản trị với mật khẩu đúng ---');
  process.env.UHI_ADMIN_PASSWORD = 'TestPassword123!';
  const reqLoginOk = { method: 'POST', body: { password: 'TestPassword123!' } };
  const resLoginOk = mockRes();
  await handlerLogin(reqLoginOk, resLoginOk);
  console.log('Mật khẩu đúng -> Status code:', resLoginOk.statusCode);
  console.log('Token received:', resLoginOk.data?.token?.substring(0, 20) + '...');
  if (resLoginOk.statusCode === 200 && resLoginOk.data.token) {
    console.log('✓ PASS: Đăng nhập thành công và cấp session token!');
  } else {
    console.error('✗ FAIL: Đăng nhập mật khẩu đúng thất bại!');
  }

  console.log('\n--- TEST 5: Truy cập quản trị với session token vừa cấp ---');
  const reqAdminWithToken = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${resLoginOk.data.token}`
    }
  };
  const resAdminWithToken = mockRes();
  await handlerAdminOrders(reqAdminWithToken, resAdminWithToken);
  console.log('Có token hợp lệ -> Status code:', resAdminWithToken.statusCode);
  if (resAdminWithToken.statusCode === 200) {
    console.log('✓ PASS: Xác thực token quản trị thành công!');
  } else {
    console.error('✗ FAIL: Xác thực token quản trị thất bại!');
  }
}

runTests().catch(console.error);

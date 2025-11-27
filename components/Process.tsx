import React from 'react';
import { FileText, PhoneCall, Truck, CheckSquare } from 'lucide-react';

const Process: React.FC = () => {
  const steps = [
    {
      icon: <FileText size={40} />,
      title: "1. Đăng Ký",
      desc: "Điền thông tin vào form tư vấn bên dưới hoặc gọi hotline.",
      color: "bg-cyan-400"
    },
    {
      icon: <PhoneCall size={40} />,
      title: "2. Tư Vấn",
      desc: "UHi liên hệ xác nhận khu vực & gửi bảng giá chi tiết.",
      color: "bg-uhi-pink"
    },
    {
      icon: <CheckSquare size={40} />,
      title: "3. Ký Hợp Đồng",
      desc: "Ký kết hợp đồng phân phối độc quyền khu vực.",
      color: "bg-uhi-yellow"
    },
    {
      icon: <Truck size={40} />,
      title: "4. Nhập Hàng",
      desc: "Giao hàng miễn phí. Hỗ trợ hình ảnh & marketing.",
      color: "bg-green-400"
    }
  ];

  return (
    <section className="py-16 bg-gray-100 border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-comic text-4xl md:text-5xl text-black">
            QUY TRÌNH <span className="text-blue-600">HỢP TÁC</span>
          </h2>
          <p className="text-gray-600 font-bold mt-2">Đơn giản - Nhanh chóng - Minh bạch</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-black border-t-2 border-dashed border-gray-400 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className={`w-24 h-24 ${step.color} border-4 border-black rounded-full flex items-center justify-center shadow-comic group-hover:scale-110 transition-transform mb-6`}>
                <div className="text-black">{step.icon}</div>
              </div>
              <h3 className="font-comic text-2xl mb-2">{step.title}</h3>
              <p className="text-gray-600 px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
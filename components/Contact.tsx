import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create Email Body
    const subject = `Đăng Ký Đại Lý UHi - ${formData.name} - ${formData.phone}`;
    const body = `
Xin chào UHi Vietnam,

Tôi muốn đăng ký làm đại lý phân phối. Dưới đây là thông tin của tôi:

- Họ và tên: ${formData.name}
- Số điện thoại/Zalo: ${formData.phone}
- Khu vực dự kiến: ${formData.area}
- Ghi chú thêm: ${formData.note}

Mong nhận được phản hồi sớm.
Xin cảm ơn!
    `.trim();

    // Construct Mailto Link
    const mailtoLink = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Mail Client
    window.location.href = mailtoLink;

    // Reset UI state
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Hệ thống đã mở ứng dụng Email của bạn. Vui lòng bấm Gửi để hoàn tất đăng ký!');
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-uhi-pink border-t-4 border-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-comic text-5xl mb-4 text-white text-stroke-black">LIÊN HỆ HỢP TÁC</h2>
              <p className="text-xl font-bold opacity-90">Trở thành đối tác phân phối của UHi ngay hôm nay!</p>
            </div>

            <div className="space-y-6 text-lg">
              <div className="flex items-start gap-4">
                <div className="bg-black p-3 rounded-lg"><MapPin size={24} className="text-uhi-yellow" /></div>
                <div>
                  <h4 className="font-bold text-black">Văn Phòng</h4>
                  <p>{CONTACT_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-lg"><Phone size={24} className="text-uhi-yellow" /></div>
                <div>
                  <h4 className="font-bold text-black">Hotline / Zalo</h4>
                  <a href={`tel:${CONTACT_INFO.hotline.replace(/\s/g, '')}`} className="hover:underline text-2xl font-bold">
                    {CONTACT_INFO.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-lg"><Mail size={24} className="text-uhi-yellow" /></div>
                <div>
                  <h4 className="font-bold text-black">Email</h4>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 p-6 rounded-xl border-2 border-white/50 backdrop-blur-sm">
                <p className="font-bold italic">
                   "Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 2 giờ làm việc. Hãy để lại thông tin để nhận bảng giá chiết khấu chi tiết nhất!"
                </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white text-black p-8 rounded-3xl border-4 border-black shadow-comic transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center uppercase border-b-2 border-gray-200 pb-4">
              Đăng Ký Tư Vấn Ngay
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-sm uppercase text-gray-600">Họ và Tên</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Nhập tên của bạn"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-uhi-pink focus:ring-2 focus:ring-uhi-pink focus:outline-none font-bold"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-sm uppercase text-gray-600">Số Điện Thoại / Zalo</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="09xx..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-uhi-pink focus:ring-2 focus:ring-uhi-pink focus:outline-none font-bold"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-sm uppercase text-gray-600">Khu Vực Bạn Muốn Phân Phối</label>
                <input 
                  type="text" 
                  name="area"
                  placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-uhi-pink focus:ring-2 focus:ring-uhi-pink focus:outline-none font-bold"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-sm uppercase text-gray-600">Ghi Chú (Nếu có)</label>
                <textarea 
                  name="note"
                  rows={3}
                  placeholder="Bạn đang kinh doanh tạp hóa hay online?..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-uhi-pink focus:ring-2 focus:ring-uhi-pink focus:outline-none font-bold"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-uhi-yellow font-bold text-xl py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none"
              >
                {isSubmitting ? 'Đang mở Email...' : 'Gửi Thông Tin & Nhận Báo Giá'} 
                {!isSubmitting && <Send size={20} />}
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                 *Thông tin sẽ được gửi trực tiếp đến email lyhu.vn@gmail.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
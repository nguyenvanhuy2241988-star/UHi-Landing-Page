import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Chị Lan Anh",
    role: "Chủ Tạp Hóa - Hà Nội",
    content: "Mới nhập thử 20 thùng hồi đầu tháng mà bán vèo cái hết. Học sinh mua nhiều lắm, nhất là vị Cola. Đã nhập thêm 50 thùng để bán Tết!",
    avatarColor: "bg-pink-200"
  },
  {
    name: "Anh Tuấn",
    role: "NPP Khu vực Đồng Nai",
    content: "Chính sách chiết khấu 45% quá tốt. Hàng date mới, công ty hỗ trợ hình ảnh với kệ trưng bày nên dễ chào hàng vào các quán tạp hóa.",
    avatarColor: "bg-blue-200"
  },
  {
    name: "Minh Thư",
    role: "Kinh doanh Online",
    content: "Kẹo này quay TikTok lên xu hướng nhanh cực. Bao bì đẹp, chụp hình sống ảo là khách hỏi mua liền. Vốn ít mà lời cao.",
    avatarColor: "bg-yellow-200"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-uhi-blue border-b-4 border-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '30px 30px'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-comic text-5xl md:text-6xl text-white text-stroke-black drop-shadow-lg mb-4">
            ĐỐI TÁC NÓI GÌ?
          </h2>
          <div className="inline-block bg-black text-uhi-yellow font-bold px-6 py-2 rounded-full transform rotate-2 border-2 border-white">
            1000+ Điểm bán đã tin tưởng hợp tác
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="flex flex-col">
              {/* Comic Bubble */}
              <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-comic relative mb-8 flex-grow">
                <div className="absolute -bottom-6 left-8 w-6 h-6 bg-white border-b-4 border-r-4 border-black transform rotate-45"></div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-lg font-medium text-gray-800 italic">"{review.content}"</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pl-4">
                <div className={`w-16 h-16 ${review.avatarColor} rounded-full border-4 border-black flex items-center justify-center font-comic text-2xl font-bold`}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl text-shadow-black">{review.name}</h4>
                  <p className="text-black bg-uhi-yellow px-2 py-0.5 text-xs font-bold inline-block rounded border border-black">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
import React, { useState } from 'react';
import { CERTIFICATIONS } from '../constants';
import { CheckCircle, ZoomIn, X, Award, ShieldCheck } from 'lucide-react';

const Trust: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="trust" className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 rounded-full mb-8 font-bold text-sm uppercase tracking-wider">
            <ShieldCheck size={18} className="text-uhi-yellow" /> Uy tín khẳng định thương hiệu
          </div>
          <h2 className="font-comic text-5xl md:text-6xl text-gray-900 mb-6 leading-tight">
            CHẤT LƯỢNG <span className="text-blue-600">QUỐC TẾ</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Content & Badge */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
               {/* Made in Korea Badge */}
               <div className="absolute top-0 right-0">
                  <div className="bg-blue-900 text-white text-xs font-bold px-8 py-1 transform rotate-45 translate-x-8 translate-y-4 shadow-md">
                    KOREA
                  </div>
               </div>

               <div className="flex items-start gap-4 mb-6">
                 <div className="bg-blue-100 p-4 rounded-full">
                    <Award size={40} className="text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-2">Nhập Khẩu Chính Ngạch 100%</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sản phẩm UHi được sản xuất trực tiếp tại nhà máy <strong>Kunyoung Confectionary Co., Ltd (Hàn Quốc)</strong> - đơn vị uy tín lâu năm trong ngành bánh kẹo.
                    </p>
                 </div>
               </div>

               <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-medium">Đầy đủ hồ sơ công bố chất lượng</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-medium">Tem phụ Tiếng Việt đúng quy định pháp luật</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-medium">Hóa đơn VAT đầy đủ cho Đại lý/Doanh nghiệp</span>
                  </div>
               </div>
            </div>

            {/* Certification List */}
            <div className="space-y-4">
               {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border-l-4 border-blue-600 shadow-sm hover:translate-x-2 transition-transform">
                  <div className="font-black text-gray-300 text-3xl">0{idx + 1}</div>
                  <div>
                    <h4 className="font-bold text-lg">{cert.name}</h4>
                    <p className="text-sm text-gray-500">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Images Grid */}
          <div>
            <div className="grid grid-cols-2 gap-4 relative">
               {/* Decorative border behind */}
               <div className="absolute -inset-4 border-4 border-gray-200 rounded-3xl -z-10"></div>
               
               {CERTIFICATIONS.map((cert, idx) => (
                 <div 
                  key={idx} 
                  className={`group relative bg-white p-2 border-4 border-yellow-400 rounded-xl shadow-lg cursor-pointer overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ${idx === 2 ? 'col-span-2 aspect-video' : 'aspect-[3/4]'}`}
                  onClick={() => setSelectedImage(cert.image)}
                 >
                    <img 
                      src={cert.image} 
                      alt={cert.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="text-white" size={32} />
                      <span className="text-white font-bold ml-2">Xem chi tiết</span>
                    </div>
                    {/* Gold Label */}
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded shadow-sm border border-black">
                      CERTIFIED
                    </div>
                 </div>
               ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-4 italic">
              *Nhấp vào hình để xem chứng nhận bản gốc
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Certificate Full Size" 
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-2 border-white"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
};

export default Trust;
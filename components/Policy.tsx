import React from 'react';
import { BENEFITS } from '../constants';
import { Percent, Truck, Package, Zap, Clock } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const Policy: React.FC = () => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'percent': return <Percent size={40} className="text-white" />;
      case 'truck': return <Truck size={40} className="text-white" />;
      case 'package': return <Package size={40} className="text-white" />;
      case 'zap': return <Zap size={40} className="text-white" />;
      default: return <Percent size={40} className="text-white" />;
    }
  };

  // Helper to highlight specific keywords/numbers in description
  const highlightDescription = (desc: string) => {
    // Basic replacements for emphasis
    let highlighted = desc
      .replace('35% - 45%', '<span class="text-red-600 font-black text-xl">35% - 45%</span>')
      .replace('20 thùng', '<span class="text-black font-black bg-yellow-200 px-1 text-lg">20 thùng</span>')
      .replace('0đ', '<span class="text-red-600 font-black text-xl">0đ</span>')
      .replace('Mua 10 tặng 1', '<span class="text-white bg-red-600 px-2 font-black rounded text-lg">MUA 10 TẶNG 1</span>');
    
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <section id="benefits" className="py-20 bg-uhi-yellow relative border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-comic text-5xl md:text-6xl mb-4 text-black">
            CHÍNH SÁCH <span className="text-uhi-pink drop-shadow-md text-stroke-black">VÀNG</span>
          </h2>
          <p className="text-xl font-bold bg-black text-white inline-block px-4 py-1 rounded-lg transform -rotate-2">
            Lợi nhuận cao nhất thị trường kẹo dẻo nhập khẩu
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6 bg-white p-8 rounded-2xl border-4 border-black shadow-comic hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-shrink-0 w-20 h-20 bg-black rounded-xl flex items-center justify-center transform -rotate-6 border-4 border-uhi-pink shadow-sm">
                {getIcon(benefit.icon)}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">{benefit.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {highlightDescription(benefit.description)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FOMO Section */}
        <div className="relative mt-24 md:mt-16 bg-black text-white p-8 md:p-12 rounded-[2.5rem] max-w-5xl mx-auto border-4 border-white text-center shadow-[10px_10px_0px_0px_rgba(255,0,0,1)] animate-pulse-fast">
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px'}}></div>

          {/* Badge - Responsive sizing to prevent clipping on mobile */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-bold px-6 py-2 md:px-8 md:py-3 text-xs md:text-base rounded-full border-4 border-white animate-bounce shadow-lg z-10 w-max max-w-[90%] text-center leading-tight whitespace-normal md:whitespace-nowrap">
            ƯU ĐÃI ĐỘC QUYỀN THÁNG NÀY
          </div>

          <div className="relative z-10 pt-4">
            <h3 className="font-comic text-4xl md:text-5xl text-uhi-yellow mb-4 text-stroke-black drop-shadow-sm">KHUYẾN MÃI KHỦNG</h3>
            
            <div className="bg-white text-black p-6 rounded-xl inline-block transform rotate-1 border-4 border-red-500 mb-8 max-w-3xl">
              <p className="text-2xl md:text-4xl font-black uppercase leading-tight">
                MUA 10 THÙNG <span className="text-red-600">TẶNG NGAY 1</span>
              </p>
              <p className="text-sm md:text-base text-gray-600 mt-2 font-bold italic">
                (Áp dụng cho đơn hàng đầu tiên của NPP mới)
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <p className="text-gray-300 flex items-center gap-2 bg-gray-800 px-4 py-1 rounded-full border border-gray-600">
                <Clock size={20} className="text-red-400" /> Ưu đãi tự động kết thúc sau:
              </p>
              <CountdownTimer />
            </div>

            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-uhi-yellow text-black font-black text-2xl px-12 py-4 rounded-full hover:scale-105 hover:bg-white transition-all border-4 border-black shadow-[0px_0px_20px_rgba(255,230,0,0.6)]"
            >
              ĐĂNG KÝ NHẬN ƯU ĐÃI NGAY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Policy;
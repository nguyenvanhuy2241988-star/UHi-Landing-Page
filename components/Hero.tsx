import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '../constants';
import Marquee from './Marquee';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section id="hero" className="relative bg-uhi-blue overflow-hidden min-h-[90vh] flex flex-col pt-4 md:pt-8">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 3px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex-grow grid lg:grid-cols-2 gap-8 items-center pb-12">
          
          {/* Left Column: Headline & Call to Action */}
          <div className="text-white space-y-6 text-center lg:text-left pt-8 lg:pt-0 z-20 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-black text-uhi-yellow font-bold px-4 py-2 rounded-full border-2 border-white animate-bounce mx-auto lg:mx-0 shadow-[4px_4px_0px_0px_white]">
              <Flame className="text-red-500 fill-red-500" size={20} />
              <span>SẢN PHẨM HOT TREND 2025</span>
            </div>

            <h1 className="font-comic text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-stroke-black drop-shadow-xl">
              KẸO DẺO <br/>
              <span className="text-uhi-yellow text-6xl md:text-8xl lg:text-9xl">SIÊU CHUA</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-bold max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Vị chua bùng nổ - Thiết kế Pop-art cực chất <br/>
              <span className="bg-uhi-pink px-2 text-black transform -rotate-1 inline-block mt-1 border-2 border-black">Hút giới trẻ ngay cái nhìn đầu tiên!</span>
            </p>

            {/* Scarcity / FOMO Bar */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border-2 border-white/50 max-w-md mx-auto lg:mx-0 shadow-lg">
              <div className="flex justify-between text-sm font-bold mb-2">
                 <span>🔥 Số lượng khu vực còn trống</span>
                 <span className="text-uhi-yellow animate-pulse">Sắp hết!</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-5 border border-white relative overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 h-full rounded-full w-[88%] relative">
                   <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite]"></div>
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">
                  CHỈ CÒN 12% SUẤT ĐỘC QUYỀN
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
               <button 
                onClick={scrollToContact}
                className="bg-uhi-pink text-white text-2xl font-black px-10 py-5 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 uppercase animate-wiggle"
              >
                Đăng Ký Ngay
                <ArrowRight size={28} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="relative z-10 flex items-center justify-center min-h-[500px] lg:min-h-[700px] order-1 lg:order-2">
            
            {/* 1. The Badge - Distinctly Placed Top Right */}
            <div className="absolute top-0 right-0 lg:-right-8 lg:-top-4 z-50 pointer-events-none">
               <div className="relative animate-float">
                 <div className="relative bg-yellow-400 w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full flex flex-col items-center justify-center border-4 border-black shadow-[0px_10px_30px_rgba(0,0,0,0.5)] transform rotate-12">
                    <span className="font-comic text-[5rem] md:text-[7rem] text-red-600 leading-none text-stroke-white drop-shadow-md filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      45%
                    </span>
                    <span className="bg-black text-white font-bold text-base md:text-xl px-4 py-1 transform -rotate-6 -mt-3 md:-mt-4 border-2 border-white shadow-md rounded-lg whitespace-nowrap">
                      LỢI NHUẬN
                    </span>
                 </div>
               </div>
            </div>

            {/* 2. Product Composition - Maximized Size & Fanned Out */}
            <div className="relative w-full h-full flex items-end justify-center pb-8">
                
                {/* Soda - Center Anchor */}
                <img 
                  src={PRODUCTS[0].packagingImage} 
                  className="relative z-20 w-[60%] md:w-[65%] lg:w-[70%] transform hover:-translate-y-4 transition-transform duration-300 drop-shadow-2xl filter contrast-110" 
                  alt="Soda UHi" 
                  referrerPolicy="no-referrer"
                />

                {/* Peach - Left Wing (More Tilted) */}
                <img 
                  src={PRODUCTS[2].packagingImage} 
                  className="absolute left-0 lg:-left-4 bottom-8 lg:bottom-12 z-10 w-[60%] md:w-[65%] lg:w-[70%] transform -rotate-[25deg] origin-bottom-right hover:-rotate-[20deg] transition-transform duration-300 drop-shadow-2xl" 
                  alt="Peach UHi" 
                  referrerPolicy="no-referrer"
                />

                {/* Cola - Right Wing (More Tilted) */}
                <img 
                  src={PRODUCTS[1].packagingImage} 
                  className="absolute right-0 lg:-right-4 bottom-8 lg:bottom-12 z-10 w-[60%] md:w-[65%] lg:w-[70%] transform rotate-[25deg] origin-bottom-left hover:rotate-[20deg] transition-transform duration-300 drop-shadow-2xl" 
                  alt="Cola UHi" 
                  referrerPolicy="no-referrer"
                />

                {/* Floating Labels */}
                <div className="absolute bottom-4 left-0 md:left-4 bg-white border-2 border-black px-4 py-2 rounded-full font-bold shadow-comic animate-bounce text-sm md:text-base z-30">
                   🍑 Vị Đào
                </div>
                <div className="absolute bottom-4 right-0 md:right-4 bg-white border-2 border-black px-4 py-2 rounded-full font-bold shadow-comic animate-bounce text-sm md:text-base z-30" style={{animationDelay: '0.3s'}}>
                   🥤 Vị Cola
                </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* Marquee Banner */}
      <Marquee text="LỢI NHUẬN 45% - VỐN THẤP - HÀNG HOT TREND - HỖ TRỢ MARKETING - MIỄN PHÍ VẬN CHUYỂN" className="bg-yellow-400 text-black border-b-4 border-black" />
    </>
  );
};

export default Hero;
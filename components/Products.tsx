import React from 'react';
import { PRODUCTS } from '../constants';
import { Sparkles, Flame } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <section id="products" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 relative">
          {/* Badge moved up to avoid overlapping */}
          <div className="relative inline-block mb-6">
             <div className="px-6 py-2 bg-black text-uhi-yellow font-bold rounded-full text-base md:text-lg animate-pulse shadow-lg border-2 border-uhi-pink z-10 relative">
              🎉 ĐÃ BÁN HƠN 50,000+ SẢN PHẨM THÁNG 10
            </div>
            {/* Decor elements */}
            <div className="absolute -left-4 -top-4 text-3xl animate-bounce">🚀</div>
            <div className="absolute -right-4 -bottom-4 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💥</div>
          </div>

          <h2 className="font-comic text-5xl md:text-7xl mb-6 text-black text-stroke-black-sm leading-tight">
            BỘ TỨ <span className="text-uhi-pink relative inline-block">
              SIÊU PHẨM
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-uhi-yellow" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Thiết kế Comic Pop-art nổi bật trên kệ. Hương vị chua cực đã, ăn là ghiền. 
            Sản phẩm <span className="font-bold text-black bg-yellow-200 px-1">bán chạy top 1</span> tại các cửa hàng tiện lợi và tiệm tạp hóa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          {PRODUCTS.map((product, idx) => (
            <div 
              key={product.id} 
              className={`group relative rounded-3xl border-4 border-black p-6 hover:-translate-y-3 transition-transform duration-300 bg-white shadow-comic hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col`}
            >
              {/* Product Color Accent Top */}
              <div className={`absolute top-0 left-0 w-full h-6 ${product.color} border-b-4 border-black rounded-t-[1.3rem]`}></div>

              {/* Badges Logic */}
              {idx === 0 && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-400 text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black shadow-comic flex items-center gap-1 w-max animate-wiggle">
                  <Sparkles size={16} className="text-red-600 fill-red-600" /> 👑 BEST SELLER
                </div>
              )}
              
              {idx === 1 && (
                 <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white text-sm font-black px-4 py-2 rounded-full border-2 border-black shadow-comic flex items-center gap-1 w-max">
                  <Flame size={16} className="text-yellow-300 fill-yellow-300" /> 🔥 HOT TREND
                </div>
              )}

              {/* Image Container with Hover Effect */}
              <div className="mt-6 mb-6 aspect-[3/4] rounded-2xl border-2 border-black overflow-hidden relative bg-gray-50 group-hover:bg-opacity-50 transition-colors">
                {/* Packaging Image (Default) */}
                <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 z-10 bg-white p-2">
                  <img 
                    src={product.packagingImage} 
                    alt={`${product.name} Packaging`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                
                {/* Product/Candy Image (Hover) */}
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm">
                   <img 
                    src={product.productImage} 
                    alt={`${product.name} Content`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transform scale-110 drop-shadow-xl"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-2 right-2 z-20 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
                  Chạm xem kẹo
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-2xl uppercase leading-none font-comic mb-2">{product.flavor}</h3>
                  <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
                     Quy cách: {product.weight}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm pt-4 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center px-4">
             <div className="bg-black text-white px-8 py-6 rounded-2xl border-4 border-gray-800 shadow-xl flex flex-col md:flex-row items-center gap-4 max-w-3xl transform rotate-1 hover:rotate-0 transition-transform">
                <span className="text-5xl animate-bounce">💡</span>
                <div>
                  <p className="font-bold text-lg md:text-xl">Mẹo trưng bày tăng doanh số:</p>
                  <p className="text-gray-300 mt-1">Nên trưng bày combo <span className="text-cyan-400 font-bold">Soda</span> + <span className="text-red-400 font-bold">Cola</span> cạnh nhau để tạo hiệu ứng màu sắc tương phản, kích thích khách hàng mua cả đôi!</p>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
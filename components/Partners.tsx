import React from 'react';

const LOCATIONS = [
  "Hà Nội",
  "Hải Phòng",
  "Hưng Yên",
  "Lạng Sơn",
  "Ninh Bình",
  "Yên Bái"
];

const Partners: React.FC = () => {
  return (
    <section className="bg-white py-12 border-b-4 border-black">
      <div className="container mx-auto px-4 text-center">
        <p className="font-bold text-gray-500 text-lg uppercase mb-6 tracking-widest">
          Sản phẩm đã có mặt tại tỉnh thành
        </p>
        
        {/* Locations Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-all duration-500">
           {LOCATIONS.map((location, idx) => (
             <div key={idx} className="font-black text-2xl md:text-4xl text-gray-400 hover:text-black transition-colors select-none font-comic uppercase">
               {location}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
import React from 'react';

const PARTNERS = [
  "WinMart+",
  "Circle K",
  "GS25",
  "7-Eleven",
  "Ministop",
  "FamilyMart"
];

const Partners: React.FC = () => {
  return (
    <section className="bg-white py-12 border-b-4 border-black">
      <div className="container mx-auto px-4 text-center">
        <p className="font-bold text-gray-500 text-lg uppercase mb-6 tracking-widest">
          Sản phẩm đã có mặt tại các hệ thống uy tín
        </p>
        
        {/* Logos Grid (Simulated with stylized text for now as we don't have logo images) */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
           {PARTNERS.map((partner, idx) => (
             <div key={idx} className="font-black text-2xl md:text-4xl text-gray-400 hover:text-black transition-colors select-none font-comic">
               {partner}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
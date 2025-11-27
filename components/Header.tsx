import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { CONTACT_INFO, LOGO_URL } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden p-1">
             <img 
               src={LOGO_URL} 
               alt="UHi Logo" 
               referrerPolicy="no-referrer"
               className="w-full h-full object-contain" 
             />
          </div>
          <span className="font-comic text-3xl hidden sm:block tracking-wide">UHi VIETNAM</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-lg">
          <button onClick={() => scrollTo('products')} className="hover:text-pink-600 transition-colors">Sản Phẩm</button>
          <button onClick={() => scrollTo('benefits')} className="hover:text-pink-600 transition-colors">Chính Sách</button>
          <button onClick={() => scrollTo('trust')} className="hover:text-pink-600 transition-colors">Chứng Nhận</button>
          <button 
            onClick={() => scrollTo('contact')}
            className="bg-uhi-yellow px-6 py-2 border-2 border-black shadow-comic hover:shadow-comic-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg flex items-center gap-2"
          >
            <Phone size={20} />
            Hợp Tác Ngay
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-uhi-yellow border-t-2 border-black p-4 flex flex-col gap-4 font-bold text-xl">
          <button onClick={() => scrollTo('products')} className="text-left py-2 border-b border-black/10">Sản Phẩm</button>
          <button onClick={() => scrollTo('benefits')} className="text-left py-2 border-b border-black/10">Chính Sách NPP</button>
          <button onClick={() => scrollTo('trust')} className="text-left py-2 border-b border-black/10">Chứng Nhận</button>
          <button onClick={() => scrollTo('contact')} className="bg-black text-white p-3 rounded text-center mt-2">
            Liên Hệ: {CONTACT_INFO.hotline}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
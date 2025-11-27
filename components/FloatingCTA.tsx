import React from 'react';
import { Phone } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <a 
        href={`tel:${CONTACT_INFO.hotline.replace(/\s/g, '')}`}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg border-2 border-white animate-bounce"
      >
        <Phone size={20} fill="currentColor" />
        <span className="font-bold">Gọi Ngay</span>
      </a>
    </div>
  );
};

export default FloatingCTA;
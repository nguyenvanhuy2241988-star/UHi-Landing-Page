import React from 'react';
import { CONTACT_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-comic text-2xl text-uhi-yellow mb-2">UHi VIETNAM</h2>
        <p className="text-gray-400 text-sm mb-4">
          Nhập khẩu và phân phối bởi {CONTACT_INFO.company}
        </p>
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} UHi Vietnam. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
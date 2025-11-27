import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';

const NAMES = ['Anh Minh (Hà Nội)', 'Chị Lan (TP.HCM)', 'Anh Tuấn (Đà Nẵng)', 'Chị Hoa (Hải Phòng)', 'Anh Hưng (Cần Thơ)'];
const ACTIONS = ['vừa đăng ký tư vấn', 'đã trở thành Đại Lý', 'vừa nhập 20 thùng'];

const RecentSales: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({ name: '', action: '' });

  useEffect(() => {
    const showNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setContent({ name, action });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000); // Show for 4s
    };

    // First show after 3s
    const initialTimer = setTimeout(showNotification, 3000);

    // Then show every 15-25s
    const loopTimer = setInterval(() => {
      showNotification();
    }, Math.random() * 10000 + 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(loopTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-sm animate-float">
      <div className="bg-white border-2 border-black shadow-comic p-3 rounded-lg flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-full border border-black">
          <UserCheck size={20} className="text-green-600" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{content.name}</p>
          <p className="text-xs text-gray-600">{content.action} <span className="text-gray-400 ml-1">vừa xong</span></p>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
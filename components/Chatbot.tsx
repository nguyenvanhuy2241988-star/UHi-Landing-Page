import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';

const QA_DATA = [
  {
    id: 'price',
    question: '💰 Cho tôi xin bảng giá đại lý?',
    answer: 'Chào bạn! UHi có chính sách chiết khấu lên đến 45%. Vốn khởi điểm chỉ từ 20 thùng. Bạn vui lòng để lại SĐT hoặc Zalo tại mục Đăng Ký để nhận bảng giá chi tiết nhé!'
  },
  {
    id: 'shipping',
    question: '🚛 Chính sách vận chuyển thế nào?',
    answer: 'UHi hỗ trợ 100% PHÍ VẬN CHUYỂN toàn quốc cho mọi đơn hàng của đại lý. Hàng đi từ kho Hà Nội, thời gian nhận hàng từ 2-4 ngày tùy khu vực ạ.'
  },
  {
    id: 'product',
    question: '🍬 Sản phẩm có giấy tờ gì không?',
    answer: 'Sản phẩm nhập khẩu chính ngạch Hàn Quốc, có đầy đủ công bố chất lượng, tem phụ tiếng Việt, hóa đơn VAT và chứng nhận ISO/HACCP quốc tế. Đảm bảo pháp lý để bán tại siêu thị, tạp hóa.'
  }
];

interface Message {
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Chào bạn! 👋 Tôi là trợ lý ảo của UHi. Bạn cần hỗ trợ thông tin gì về việc làm Đại Lý?', isBot: true }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (qa: typeof QA_DATA[0]) => {
    // Add user question
    const newMessages = [...messages, { text: qa.question, isBot: false }];
    setMessages(newMessages);

    // Simulate thinking delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: qa.answer, isBot: true }]);
    }, 600);
  };

  return (
    <>
      {/* Trigger Button - Left Side to avoid calling button */}
      <div className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white text-black p-4 rounded-full shadow-[0px_4px_10px_rgba(0,0,0,0.3)] border-2 border-black hover:scale-110 transition-transform relative group"
        >
           <MessageCircle size={28} className="text-uhi-pink fill-uhi-pink" />
           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">1</span>
           <span className="absolute left-14 top-2 bg-black text-white text-xs font-bold px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Chat tư vấn
           </span>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-4 left-4 md:left-8 z-50 w-[320px] md:w-[350px] bg-white rounded-2xl shadow-2xl border-2 border-black flex flex-col transition-all duration-300 origin-bottom-left ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-black text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold font-comic tracking-wide text-lg text-uhi-yellow">UHi Support</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-gray-800 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 h-[350px] overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                msg.isBot 
                  ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' 
                  : 'bg-uhi-pink text-white font-medium rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Options */}
        <div className="p-3 bg-white border-t border-gray-200 rounded-b-xl">
          <p className="text-xs text-gray-500 mb-2 font-bold ml-1">Chọn câu hỏi nhanh:</p>
          <div className="flex flex-col gap-2">
            {QA_DATA.map((qa) => (
              <button 
                key={qa.id}
                onClick={() => handleOptionClick(qa)}
                className="text-left text-sm bg-gray-100 hover:bg-uhi-yellow hover:text-black hover:font-bold p-2 rounded-lg transition-colors flex items-center justify-between group border border-gray-200"
              >
                {qa.question}
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </button>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-center text-sm bg-black text-white p-2 rounded-lg mt-1 font-bold hover:bg-gray-800"
            >
              Gặp nhân viên tư vấn ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
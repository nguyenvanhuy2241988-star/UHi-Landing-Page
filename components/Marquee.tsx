import React from 'react';

interface MarqueeProps {
  text: string;
  className?: string;
  direction?: 'left' | 'right';
}

const Marquee: React.FC<MarqueeProps> = ({ text, className = "bg-uhi-yellow text-black", direction = 'left' }) => {
  return (
    <div className={`overflow-hidden py-4 border-y-4 border-black whitespace-nowrap flex relative z-20 ${className}`}>
      <div className="animate-marquee flex min-w-full items-center gap-12 px-4">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="font-comic text-3xl md:text-4xl font-bold uppercase tracking-wide flex items-center gap-12">
            {text} 
            <span className="text-4xl">⚡</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
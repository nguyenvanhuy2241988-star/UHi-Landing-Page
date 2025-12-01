import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  // Set end time to 24 hours (1 day) from now for FOMO effect
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Stop at 0
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 justify-center font-comic text-3xl md:text-5xl text-red-600 drop-shadow-sm">
      <div className="bg-white px-3 py-2 rounded-lg border-2 border-black min-w-[70px]">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <span className="self-center">:</span>
      <div className="bg-white px-3 py-2 rounded-lg border-2 border-black min-w-[70px]">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <span className="self-center">:</span>
      <div className="bg-white px-3 py-2 rounded-lg border-2 border-black min-w-[70px]">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
};

export default CountdownTimer;
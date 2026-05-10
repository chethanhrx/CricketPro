import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ secondsRemaining }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 5 && secondsRemaining > 0) {
      setPulse(true);
    } else {
      setPulse(false);
    }
  }, [secondsRemaining]);

  const getColor = () => {
    if (secondsRemaining > 10) return 'text-green-500 border-green-500';
    if (secondsRemaining > 5) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  const barColor = () => {
    if (secondsRemaining > 10) return 'bg-green-500';
    if (secondsRemaining > 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const percentage = Math.max(0, Math.min(100, (secondsRemaining / 15) * 100)); // Assuming 15s max timer

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-bold uppercase text-gray-500">Time Remaining</span>
        <motion.span 
          animate={pulse ? { scale: [1, 1.2, 1], color: '#E63946' } : {}} 
          transition={{ repeat: Infinity, duration: 0.5 }}
          className={`font-black text-xl ${getColor()}`}
        >
          {secondsRemaining}s
        </motion.span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${barColor()}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

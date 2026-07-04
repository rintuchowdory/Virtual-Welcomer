import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Booking() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ filter: 'blur(20px)', opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}>
      
      <div className="absolute left-[15vw] flex flex-col justify-center h-full w-[40vw] z-10">
        <motion.h2 
          className="text-[5vw] font-bold text-white leading-tight mb-6 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, x: -40 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.8 }}
        >
          Books Appointments<br/><span className="text-[#06b6d4]">Instantly.</span>
        </motion.h2>
        
        <motion.div
          className="flex items-center gap-4 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-6 py-3 rounded-full w-fit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
          <span className="text-[1.2vw] font-semibold">Appointment Confirmed</span>
        </motion.div>
      </div>

      <motion.div 
        className="absolute right-[15vw] w-[25vw] h-[25vw] flex items-center justify-center"
        initial={{ opacity: 0, y: 100, rotateY: 45 }}
        animate={phase >= 2 ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 100, rotateY: 45 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ transformPerspective: 1200 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/calendar.png`} 
          alt="Calendar"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        {/* Animated glowing ring behind calendar */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-[#06b6d4]/40"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

    </motion.div>
  );
}
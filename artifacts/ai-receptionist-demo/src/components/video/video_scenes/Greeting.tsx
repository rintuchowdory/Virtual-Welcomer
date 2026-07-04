import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Greeting() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="absolute right-[-10vw] top-[10vh] w-[60vw] h-[80vh] bg-contain bg-no-repeat bg-right-bottom opacity-80 mix-blend-screen"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/avatar.png)` }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />

        <div className="absolute left-[10vw] flex flex-col justify-center h-full z-10 w-[50vw]">
          <motion.div 
            className="w-12 h-1 bg-[#06b6d4] mb-8"
            initial={{ width: 0 }}
            animate={phase >= 1 ? { width: 48 } : { width: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.h1 
            className="text-[6vw] font-bold text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Welcome to the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]">
              Future of Service
            </span>
          </motion.h1>
          <motion.p
            className="text-[1.5vw] text-white/60 mt-6 max-w-[30vw] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Meet your new AI Virtual Receptionist. Always on, flawlessly polite, and perfectly responsive.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
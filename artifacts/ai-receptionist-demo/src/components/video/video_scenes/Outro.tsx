import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Outro() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}>
      
      <motion.div
        className="text-center z-10"
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={phase >= 1 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : { scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-[7vw] font-black text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          NEXUS <span className="text-[#06b6d4]">AI</span>
        </h1>
        <motion.p 
          className="text-[1.8vw] text-white/60 tracking-widest uppercase mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your Next-Generation Receptionist
        </motion.p>
      </motion.div>

    </motion.div>
  );
}
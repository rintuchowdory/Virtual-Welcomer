import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function CTA() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}>
      
      {/* Midground animated accents */}
      <motion.div 
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full border-[1px] border-[#06b6d4]/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />
      <motion.div 
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full border-[1px] border-[#8b5cf6]/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.8, opacity: 1 }}
        transition={{ duration: 3.5, ease: 'easeOut', delay: 0.2 }}
      />

      <div className="z-10 flex flex-col items-center text-center px-12">
        <motion.h2 
          className="text-[5vw] font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Ready to hire your <span className="text-[#06b6d4]">AI Receptionist?</span>
        </motion.h2>

        <motion.div
          className="relative px-10 py-5 rounded-full overflow-hidden group cursor-default mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
          {/* Button Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] opacity-90" />
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ x: '-100%', opacity: 0 }}
            animate={phase >= 3 ? { x: '100%', opacity: 0.2 } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
          />
          {/* Button Text */}
          <span className="relative z-10 text-[2vw] font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            BOOK A DEMO TODAY
          </span>
        </motion.div>

        <motion.p
          className="text-[1.5vw] text-white/50 tracking-wider font-mono"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          nexus-ai.com/get-started
        </motion.p>
      </div>
    </motion.div>
  );
}
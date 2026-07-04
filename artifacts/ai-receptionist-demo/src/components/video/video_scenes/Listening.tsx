import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Listening() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
      
      <div className="relative flex flex-col items-center justify-center w-full h-full z-10">
        
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}>
          <h2 className="text-[4vw] font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Listens &amp; Speaks
          </h2>
          <p className="text-[1.5vw] text-[#06b6d4] mt-2 font-medium">Real-time voice interaction</p>
        </motion.div>

        {/* Waveform Visualization */}
        <div className="flex items-center justify-center gap-2 h-32">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-4 rounded-full bg-gradient-to-t from-[#8b5cf6] to-[#06b6d4]"
              initial={{ height: 8 }}
              animate={phase >= 2 ? {
                height: [8, Math.random() * 80 + 20, Math.random() * 100 + 40, Math.random() * 60 + 20, 8],
              } : { height: 8 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* User / AI transcript mockup */}
        <div className="absolute bottom-[20vh] flex flex-col gap-4 w-[40vw]">
          <motion.div 
            className="self-end bg-white/10 backdrop-blur-md rounded-2xl rounded-tr-sm px-6 py-4 text-white text-[1.2vw]"
            initial={{ opacity: 0, x: 20 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            "Hi, I'd like to book a consultation."
          </motion.div>
          <motion.div 
            className="self-start bg-gradient-to-r from-[#06b6d4]/20 to-[#8b5cf6]/20 backdrop-blur-md rounded-2xl rounded-tl-sm px-6 py-4 text-white text-[1.2vw] border border-[#06b6d4]/30"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            "Of course! I can help you with that right now."
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
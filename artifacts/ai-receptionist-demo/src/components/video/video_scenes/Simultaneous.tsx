import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Simultaneous() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => setPhase(5), 2600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const callers = [
    { id: 1, name: "Customer A", intent: "Booking", color: "#06b6d4" },
    { id: 2, name: "Customer B", intent: "Support", color: "#8b5cf6" },
    { id: 3, name: "Customer C", intent: "Inquiry", color: "#10B981" },
  ];

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
      
      <div className="relative flex flex-row items-center w-full h-full px-[10vw] z-10">
        
        <div className="flex-1">
          <motion.div className="mb-12"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}>
            <h2 className="text-[5vw] font-bold text-white tracking-tight leading-[1.1]" style={{ fontFamily: 'var(--font-display)' }}>
              Zero Wait<br/>Times
            </h2>
            <p className="text-[1.8vw] text-[#8b5cf6] mt-4 font-medium">Handles infinite simultaneous calls</p>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col gap-6 items-end">
          {callers.map((caller, index) => (
            <motion.div
              key={caller.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-[30vw] flex items-center justify-between"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={phase >= 2 + index ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div>
                <div className="text-white font-medium text-[1.2vw]">{caller.name}</div>
                <div className="text-white/50 text-[1vw]">{caller.intent}</div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{ backgroundColor: caller.color }}
                    initial={{ height: 4 }}
                    animate={phase >= 2 + index ? {
                      height: [4, Math.random() * 20 + 10, 4]
                    } : { height: 4 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

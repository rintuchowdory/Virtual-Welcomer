import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, ShieldCheck } from 'lucide-react';

export function Services() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const cards = [
    { title: "24/7 Availability", icon: Clock, desc: "Never miss a lead." },
    { title: "Call Routing", icon: Phone, desc: "Smart transferring." },
    { title: "Secure Data", icon: ShieldCheck, desc: "Enterprise grade." },
  ];

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
      
      <motion.h2 
        className="text-[4.5vw] font-bold text-white mb-16 text-center"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8 }}
      >
        Explains Your Services
      </motion.h2>

      <div className="flex gap-8 px-12 justify-center w-full max-w-[80vw]">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={phase >= i + 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ transformPerspective: 1000 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 flex items-center justify-center mb-6 border border-[#06b6d4]/30">
              <card.icon className="w-10 h-10 text-[#06b6d4]" />
            </div>
            <h3 className="text-[1.8vw] font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-[1.2vw] text-white/50">{card.desc}</p>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
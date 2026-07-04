import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Multilingual() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const languages = [
    { text: "Bonjour", lang: "French", x: "-20vw", y: "-25vh", color: "from-[#06b6d4] to-blue-500", scale: 0.8 },
    { text: "Hola", lang: "Spanish", x: "15vw", y: "-30vh", color: "from-[#8b5cf6] to-purple-500", scale: 0.9 },
    { text: "こんにちは", lang: "Japanese", x: "-25vw", y: "20vh", color: "from-[#10B981] to-emerald-500", scale: 0.85 },
    { text: "Ciao", lang: "Italian", x: "20vw", y: "15vh", color: "from-[#F59E0B] to-yellow-500", scale: 0.75 },
  ];

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
      
      <div className="relative w-full h-full flex items-center justify-center z-10">
        
        {/* Central Hub */}
        <motion.div className="text-center z-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 1, type: "spring", stiffness: 200, damping: 20 }}>
          <h2 className="text-[5vw] font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]">Reach</span>
          </h2>
          <p className="text-[1.5vw] text-white/70 mt-2 font-medium">Fluent in over 50 languages</p>
        </motion.div>

        {/* Orbiting Language Bubbles */}
        {languages.map((lang, index) => (
          <motion.div
            key={index}
            className={`absolute flex flex-col items-center justify-center bg-gradient-to-br ${lang.color} p-[1px] rounded-3xl shadow-lg`}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={phase >= 2 + index ? { opacity: 1, x: lang.x, y: lang.y, scale: lang.scale } : { opacity: 0, x: 0, y: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <div className="bg-[#0A0A0B]/90 backdrop-blur-md px-6 py-4 rounded-3xl text-center min-w-[12vw]">
              <div className="text-white text-[2vw] font-bold tracking-wider">{lang.text}</div>
              <div className="text-white/50 text-[1vw] mt-1">{lang.lang}</div>
            </div>
          </motion.div>
        ))}
        
      </div>
    </motion.div>
  );
}

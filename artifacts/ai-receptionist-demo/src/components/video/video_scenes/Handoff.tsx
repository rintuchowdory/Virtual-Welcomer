import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Handoff() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
      
      <motion.div className="text-center mb-16 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}>
        <h2 className="text-[4.5vw] font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#10B981]">Human Handoff</span>
        </h2>
        <p className="text-[1.5vw] text-white/70 mt-2 font-medium">Escalates complex requests instantly with full context.</p>
      </motion.div>

      <div className="flex items-center justify-center gap-6 w-full px-12 z-20 relative">
        
        {/* AI Agent */}
        <motion.div
          className="flex flex-col items-center bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-[22vw] relative"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#06b6d4]/20 to-blue-500/20 flex items-center justify-center mb-6 border border-[#06b6d4]/30 relative overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}images/avatar.png`} alt="AI" className="w-full h-full object-cover opacity-60" />
            <Bot className="w-10 h-10 text-[#06b6d4] absolute mix-blend-screen" />
          </div>
          <div className="text-[1.8vw] font-semibold text-white">AI Assistant</div>
          <div className="text-[1.1vw] text-[#06b6d4] mt-1">Gathering Details</div>
          
          {phase >= 3 && (
            <motion.div 
              className="absolute -right-[4vw] top-1/2 -translate-y-1/2 text-white/50 z-30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="bg-[#0A0A0B] p-3 rounded-full border border-white/10 shadow-xl">
                <ArrowRight className="w-6 h-6 text-[#10B981]" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Transfer Line */}
        <div className="w-[12vw] h-[3px] bg-white/5 relative rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#06b6d4] to-[#10B981]"
            initial={{ width: '0%' }}
            animate={phase >= 3 ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Human Agent */}
        <motion.div
          className="flex flex-col items-center bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-[22vw] relative overflow-hidden"
          animate={{ 
            opacity: phase >= 3 ? 1 : 0, 
            x: phase >= 3 ? 0 : 50,
            borderColor: phase >= 4 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'
          }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        >
          {phase >= 4 && (
            <motion.div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/10 to-transparent pointer-events-none" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
          )}
          <div className="w-24 h-24 rounded-full bg-[#1A1A1D] flex items-center justify-center mb-6 border border-white/10 relative z-10">
            <motion.div
              animate={{ color: phase >= 4 ? '#10B981' : '#94a3b8' }}
              transition={{ duration: 0.4 }}
            >
              <User className="w-10 h-10" />
            </motion.div>
            
            {phase >= 4 && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-[#10B981]"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div className="text-[1.8vw] font-semibold text-white relative z-10">Human Agent</div>
          <div className="text-[1.1vw] flex items-center gap-2 mt-1 relative z-10">
            <motion.span 
              animate={{ color: phase >= 4 ? '#10B981' : '#64748b' }}
              transition={{ duration: 0.4 }}
            >
              {phase >= 4 ? "Context Received" : "Standby..."}
            </motion.span>
            {phase >= 4 && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

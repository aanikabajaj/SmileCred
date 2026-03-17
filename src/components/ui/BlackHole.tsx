"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export const BlackHole = ({ isApproaching }: { isApproaching: boolean }) => {
  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden pointer-events-none">
      {/* Container that scales with the approach */}
      <motion.div
        initial={{ scale: 0.1, opacity: 0 }}
        animate={isApproaching ? { scale: 1, opacity: 1 } : { scale: 0.1, opacity: 0 }}
        transition={{ 
          duration: 3, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 1 }
        }}
      >
        {/* Inner Heart Aura */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-conic-gradient from-pink-200/40 via-primary/20 to-pink-200/40 blur-[40px] opacity-40"
        />

        {/* Pulsing Core Ring */}
        <motion.div
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="absolute inset-[15%] rounded-full border-[2px] border-[#fb2c6a]/40 shadow-[0_0_80px_rgba(251,44,106,0.2)] bg-[#fb2c6a]/5"
        />

        {/* The Heart Core */}
        <div className="absolute inset-[30%] bg-white/40 backdrop-blur-md rounded-full border-[2px] border-pink-100 z-20 overflow-hidden flex items-center justify-center shadow-inner">
             <motion.div 
               animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-[#fb2c6a]/10 blur-[20px]"
             />
        </div>

        {/* Radiating Rings */}
        <div className="absolute inset-[25%] rounded-full border-[10px] border-pink-50/50 blur-[15px] z-10 opacity-60" />
        <div className="absolute inset-[20%] rounded-full border-[5px] border-[#fb2c6a]/5 blur-[30px] z-0" />

        {/* Glow Rim */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[29%] rounded-full border-[2px] border-pink-100/80 blur-[2px] z-30" 
        />

        {/* Floating Hearts/Sparkles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ 
                x: (Math.random() - 0.5) * 600, 
                y: (Math.random() - 0.5) * 600, 
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                rotate: Math.random() * 360
            }}
            transition={{ 
                duration: 4 + Math.random() * 4, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeOut"
            }}
            className="absolute w-2 h-2 bg-[#fb2c6a]/40 rounded-full blur-[1px] z-10"
          />
        ))}
      </motion.div>
    </div>
  );
};

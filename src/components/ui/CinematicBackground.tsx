"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Sparkle = ({ delay, duration, left, top, size }: { delay: number; duration: number; left: string; top: string; size: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.5, 0],
      scale: [0, 1, 0],
      y: [-20, -100]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    style={{
      position: "absolute",
      left,
      top,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#fb2c6a",
      filter: "blur(2px) brightness(1.2)",
      boxShadow: "0 0 10px rgba(251, 44, 106, 0.4)",
      zIndex: 1
    }}
  />
);

export const CinematicBackground = () => {
  const [sparkles, setSparkles] = useState<{ id: number; delay: number; duration: number; left: string; top: string; size: number }[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Mesh Gadients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[100px] mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[80px] mix-blend-multiply"
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-125 brightness-110" />
      
      {/* Subtle lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb2c6a08_1px,transparent_1px),linear-gradient(to_bottom,#fb2c6a08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Sparkles */}
      {sparkles.map((s) => (
        <Sparkle key={s.id} {...s} />
      ))}
    </div>
  );
};

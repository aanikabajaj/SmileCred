"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Sparkles, Loader2 } from "lucide-react";

// Dynamically import the SmileDetector to prevent server-side evaluation of face-api.js
const SmileDetector = dynamic(
  () => import("@/components/features/SmileDetector").then((mod) => mod.SmileDetector),
  { 
    ssr: false,
    loading: () => (
      <Card className="glass overflow-hidden border-none shadow-2xl relative">
        <CardContent className="p-0 relative aspect-video bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-primary">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-medium animate-pulse">Loading Web Camera Interface...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
);

export default function SmileSessionPage() {
  const [points, setPoints] = useState(0);
  const [showRewardPop, setShowRewardPop] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  React.useEffect(() => {
    // Fetch initial points
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setPoints(data.user.points);
      })
      .catch(console.error);
  }, []);

  const handleSmileDetected = async (confidence: number) => {
    if (cooldown) return;
    
    // Prevent spamming
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000);

    // Optimistically show pop
    setShowRewardPop(true);
    setTimeout(() => setShowRewardPop(false), 2000);

    try {
      const res = await fetch('/api/user/credits', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.points !== undefined) {
        setPoints(data.points);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-[#fb2c6a]">Smile & Earn</h1>
          <p className="text-pink-400 font-medium italic">Focus on the camera and share your best smile! ✨</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-pink-300 uppercase tracking-widest mb-1">Session Credits</p>
          <div className="text-5xl font-black text-[#fb2c6a] flex items-center gap-2 drop-shadow-sm">
            {points}
            <Smile className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="relative">
        <SmileDetector onSmileDetected={handleSmileDetected} />
        
        <AnimatePresence>
          {showRewardPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: 1.2, opacity: 1, y: -100 }}
              exit={{ scale: 0, opacity: 0, y: -200 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2">
                <Badge className="bg-primary text-white text-2xl px-6 py-3 rounded-2xl shadow-2xl shadow-primary/40 border-none flex gap-3">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                  +1 CREDIT
                </Badge>
                <p className="font-bold text-primary text-lg animate-bounce">Awesome Smile!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[#fb2c6a]">Tips for max points</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-pink-400 font-medium space-y-2">
            <p>• Ensure your face is well-lit.</p>
            <p>• Avoid wearing sunglasses or masks.</p>
            <p>• Hold your smile for 1 second to count.</p>
          </CardContent>
        </Card>
        
        <Card className="glass border-none flex items-center justify-center p-8 bg-pink-50/50">
           <div className="text-center space-y-2">
             <p className="text-sm text-[#fb2c6a] font-medium italic">"A smile is a curve that sets everything straight."</p>
             <p className="text-xs font-bold uppercase tracking-widest text-pink-300">— Unknown</p>
           </div>
        </Card>
      </div>
    </div>
  );
}

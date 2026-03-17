"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Smile, ArrowRight, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlackHole } from "@/components/ui/BlackHole";
import { useEffect, useState } from "react";

export default function GatewayPage() {
  const [isApproaching, setIsApproaching] = useState(false);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    // Start approaching immediately on load
    const approachTimer = setTimeout(() => {
        setIsApproaching(true);
    }, 100);

    // Fade in UI after the black hole is close
    const uiTimer = setTimeout(() => {
        setShowUI(true);
    }, 2500);

    return () => {
        clearTimeout(approachTimer);
        clearTimeout(uiTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-50" />
      
      {/* Cinematic Black Hole Backdrop */}
      <div className="absolute inset-0 z-0">
        <BlackHole isApproaching={isApproaching} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={showUI ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-8 relative z-10 max-w-2xl"
      >
        <div className="flex justify-center mb-4">
          <motion.div 
            animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center shadow-2xl shadow-primary/20"
          >
            <Smile className="w-12 h-12 text-primary" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Welcome to <br />
            <span className="font-brand text-[#fb2c6a] text-8xl lowercase drop-shadow-sm">SmileCred</span>
          </h1>
          <p className="text-xl text-pink-400 font-medium italic">
            The world's first positivity-driven economy. Sign in or create an account to start earning rewards for your joy. ✨
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 group"
            )}
          >
            <LogIn className="mr-2 w-5 h-5" />
            Member Login
          </Link>
          <Link 
            href="/signup" 
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-16 px-10 text-lg font-bold border-pink-200 hover:bg-pink-50 rounded-2xl text-[#fb2c6a]"
            )}
          >
            <UserPlus className="mr-2 w-5 h-5 text-[#fb2c6a]" />
            Create Free Account
          </Link>
        </div>

        <div className="pt-12 text-sm text-muted-foreground">
          <p>Join 50,000+ people sharing joy every day.</p>
        </div>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-20" />
    </div>
  );
}

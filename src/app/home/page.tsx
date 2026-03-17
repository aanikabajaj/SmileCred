"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Sparkles, Trophy, Camera, ArrowRight, Zap, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary px-4 py-1 rounded-full flex gap-2 items-center">
              <Sparkles className="w-3 h-3" />
              <span>Public Beta 1.0 is Live</span>
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-tight"
          >
            Turn Your <span className="font-brand text-[#fb2c6a] lowercase italic drop-shadow-sm">Smile</span> <br />
            Into <span className="font-brand text-[#fb2c6a] lowercase italic drop-shadow-sm">Credits.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-pink-400 font-medium max-w-2xl mx-auto italic"
          >
            The world's first positivity-driven economy. Our AI tracks your smiles and turns them into tangible perks. ✨
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/dashboard" 
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-16 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 group"
              )}
            >
              Start Smiling Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-white/10 hover:bg-white/5 rounded-2xl">
              Learn How it Works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Smile, title: "AI Detection", desc: "Real-time facial expression tracking with neural networks." },
            { icon: Zap, title: "Instant Credits", desc: "Earn points for every second of joy you share on camera." },
            { icon: ShieldCheck, title: "Privacy First", desc: "Detection happens 100% on your device. Video never leaves." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-20 bg-white/5 border-y border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight opacity-50 uppercase tracking-[0.2em] text-sm">Empowering Smiles Globally</h2>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-24 grayscale opacity-40">
               {/* Replace with real brand logos */}
               <div className="font-black text-2xl tracking-tighter">MYNTRA</div>
               <div className="font-black text-2xl tracking-tighter">ZOMATO</div>
               <div className="font-black text-2xl tracking-tighter">MEESHO</div>
               <div className="font-black text-2xl tracking-tighter">AMAZON</div>
            </div>
         </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-pink-100">
         <div className="flex flex-col items-center gap-4">
            <div className="font-brand text-[#fb2c6a] text-4xl">SmileCred</div>
            <p className="text-sm text-pink-300 font-medium italic">© 2026 Positivity Labs. Designed for joy. ✨</p>
            <div className="flex gap-6 mt-4">
               <Link href="#" className="text-xs text-pink-300 hover:text-[#fb2c6a] underline decoration-pink-200 underline-offset-4">Privacy Policy</Link>
               <Link href="#" className="text-xs text-pink-300 hover:text-[#fb2c6a] underline decoration-pink-200 underline-offset-4">Terms of Service</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}

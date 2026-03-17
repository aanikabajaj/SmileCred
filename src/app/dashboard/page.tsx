"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  Smile, 
  Trophy, 
  Target, 
  ArrowRight,
  TrendingUp,
  Camera
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [rank, setRank] = useState<number | string>("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        
        if (userData.user) {
          setUser(userData.user);
          
          const leadRes = await fetch("/api/leaderboard");
          const leadData = await leadRes.json();
          if (leadData.leaderboard) {
            const index = leadData.leaderboard.findIndex((u: any) => u.username === userData.user.username);
            if (index !== -1) {
              setRank(index + 1);
            }
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const totalSmiles = user?.points || 0;
  const rewardGoal = 100; // Next goal at 100 smiles
  const progressPercent = Math.min((totalSmiles / rewardGoal) * 100, 100).toFixed(0);

  const stats = [
    { title: "Total Smiles", value: totalSmiles.toLocaleString(), icon: Smile, color: "text-primary" },
    { title: "Current Rank", value: `#${rank}`, icon: Trophy, color: "text-amber-400" },
    { title: "Global Goal", value: `${progressPercent}%`, icon: Target, color: "text-secondary" },
  ];

  if (loading) {
    return <div className="p-12 text-center animate-pulse text-muted-foreground font-bold tracking-widest uppercase">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#fb2c6a]">Welcome back{user ? `, ${user.username}` : ''}!</h1>
        <p className="text-pink-400 text-lg font-medium italic">You've shared {totalSmiles} smiles so far. Keep the vibe going! ✨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-none overflow-hidden group">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Smile className="text-primary" />
              Progress to Next Reward
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-pink-400 font-medium">Starter Coupon</span>
                <span className="font-bold text-[#fb2c6a]">{totalSmiles} / {rewardGoal} Smiles</span>
              </div>
              <Progress value={Number(progressPercent)} className="h-2 bg-pink-100" />
            </div>
            <p className="text-sm text-muted-foreground">
              {totalSmiles >= rewardGoal 
                ? "You've unlocked this reward! Go smile to reach the next milestone."
                : `Just ${rewardGoal - totalSmiles} more smiles to unlock your next reward. Ready for a session?`}
            </p>
            <Link 
              href="/smile"
              className={cn(
                buttonVariants(),
                "w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              )}
            >
              Start Smile Session <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="text-secondary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {totalSmiles > 0 ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50 border border-pink-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Smile className="w-5 h-5 text-[#fb2c6a]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Smile Session</p>
                      <p className="text-xs text-muted-foreground">Recently</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">Points Earned</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No activity yet. Share a smile to see it here!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/photobooth">
          <Card className="glass border-none hover:bg-white/5 transition-colors cursor-pointer group h-full">
            <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Open Photobooth</p>
                <p className="text-xs text-muted-foreground">Capture your glow</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Lock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ALL_REWARDS = [
  {
    id: "acwo_75",
    brand: "ACwO",
    title: "Flat 75% Off on TWS & Soundbars",
    code: "GPJECMAN1K04Z1KW",
    link: "https://acwo.com/pages/gpay75ecom?utm_source=googlepay&utm_medium=googlepay75ecomjan&utm_campaign=googlepay75ecomjancampaign",
    points: 50,
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    id: "bellavita_999",
    brand: "BellaVita",
    title: "Buy 3 @ ₹999 Perfumes",
    code: "GET999",
    link: "https://bellavitaorganic.com/products/gpay-perfume-trio?utm_source=Affiliate&utm_medium=Gpay999_Jan&utm_campaign=Trio100ml",
    points: 100,
    color: "bg-pink-500/20 text-pink-500",
  },
  {
    id: "palmonas_50",
    brand: "Palmonas",
    title: "Flat 50% Off",
    code: "GPAY50",
    link: "https://palmonas.com/collections/buy-1-get-1-free?utm_source=Gpay&utm_medium=FLAT50%25&utm_campaign=PAL-GPAY-ECOM-F-MAR",
    points: 150,
    color: "bg-purple-500/20 text-purple-500",
  },
  {
    id: "vaku_1",
    brand: "Vaku Luxos",
    title: "4-in-1 65W Cable Only at ₹1",
    code: "JP12ZM4I1CG8",
    link: "https://vaku.in/products/vaku-luxos-%C2%AE-4-in-1-65w-fast-charging-flat-nylon-braided-data-sync-cable-with-usb-lightning-c-type-ports?discount=JP12ZM4I1CG8&utm_source=GP&utm_medium=CPE&utm_campaign=CG8&utm_id=JP12ZM4I1CG8",
    points: 200,
    color: "bg-orange-500/20 text-orange-500",
  },
  {
    id: "zivx_399",
    brand: "ZivX on Zop",
    title: "Sonic Electric Toothbrush at ₹399",
    code: "ZGPZXETLAEC140pWh",
    link: "https://www.zop.in/collections/zivx/products/zivx-dentx-sonic-electric-toothbrush-5-cleaning-modes-3-brush-heads-40-000-strokes-min-ipx7-waterproof-usb-rechargeable-smart-2-min-timer?utm_source=SR_Gpay&utm_medium=ZivX_ElectricToothbrush&utm_campaign=Rs399_LAEC1&utm_content=Mar26",
    points: 250,
    color: "bg-teal-500/20 text-teal-500",
  },
  {
    id: "renee_25",
    brand: "Renee Cosmetics",
    title: "Extra 25% off",
    code: "GPAY5WEeG",
    link: "https://www.reneecosmetics.in/collections/gpay-offer-additional-25-off/?utm_source=alliance&utm_medium=gpay&utm_campaign=febtcpa25off&utm_content=febtcpa25off",
    points: 300,
    color: "bg-rose-500/20 text-rose-500",
  },
  {
    id: "foxtale_400",
    brand: "Foxtale",
    title: "Flat ₹400 off + 2 Freebies",
    code: "GPAY400CRPQJBE3XW",
    link: "https://foxtale.in/collections/gpay-offers2?utm_source=Partnerships&utm_medium=Gpay400&utm_campaign=Gpay400CPA-Feb26",
    points: 350,
    color: "bg-amber-500/20 text-amber-500",
  },
  {
    id: "giva_20",
    brand: "GIVA",
    title: "Get Flat 20% Off",
    code: "G-GPAYZA5L",
    link: "https://www.giva.co/collections/exclusive-gpay-collection-3?utm_source=gpay&utm_medium=scratchcard20baufemandt1&utm_campaign=March2026",
    points: 400,
    color: "bg-indigo-500/20 text-indigo-500",
  },
  {
    id: "mamaearth_bogo",
    brand: "Mamaearth",
    title: "Buy 1 Get 1 free",
    code: "GBG2C112U2US5Y8",
    link: "https://mamaearth.app.link/RfDL32NVB0b",
    points: 450,
    color: "bg-green-500/20 text-green-500",
  }
];

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUserPoints(data.user.points || 0);
        let unlocked = [];
        try {
          unlocked = JSON.parse(data.user.unlockedRewards || "[]");
        } catch(e) {}
        setUnlockedRewards(unlocked);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (reward: typeof ALL_REWARDS[0]) => {
    if (userPoints < reward.points) return;
    
    setUnlockingId(reward.id);
    try {
      const res = await fetch('/api/user/rewards/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardId: reward.id,
          cost: reward.points,
          code: reward.code
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUserPoints(data.points);
        setUnlockedRewards(data.unlockedRewards);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to unlock reward");
      }
    } catch (error) {
      alert("Error unlocking reward");
    } finally {
      setUnlockingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Code copied!");
  };

  if (loading) {
    return <div className="p-8 text-center text-pink-400">Loading rewards...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#fb2c6a]">Your Rewards</h1>
        <p className="text-pink-400 text-lg font-medium italic">Your smiles are worth more than you think. Unlock these exclusive coupons using your credits! ✨</p>
        <p className="text-sm font-bold bg-pink-100 text-[#fb2c6a] w-max px-4 py-1.5 rounded-full mt-2">
          Current Credits: {userPoints}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_REWARDS.map((reward, i) => {
          const isUnlocked = unlockedRewards.includes(reward.id);
          const canUnlock = userPoints >= reward.points;
          const isLocked = !isUnlocked && !canUnlock;
          const isUnlocking = unlockingId === reward.id;

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn(
                "glass border-none h-full flex flex-col relative overflow-hidden",
                isLocked && "opacity-60 grayscale-[0.3]"
              )}>
                {isLocked && (
                  <div className="absolute inset-0 bg-pink-200/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
                     <div className="glass px-4 py-2 rounded-full border-pink-100 shadow-2xl flex items-center gap-2">
                       <Lock className="w-4 h-4 text-[#fb2c6a]/80" />
                       <span className="text-xs font-bold text-[#fb2c6a]/80 uppercase tracking-widest">{reward.points} Points Needed</span>
                     </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                     <Badge className={cn("border-none px-3 font-bold", reward.color)}>
                       {reward.brand}
                     </Badge>
                     {isUnlocked && <Check className="text-green-500 w-5 h-5 drop-shadow-sm" />}
                  </div>
                  <CardTitle className="text-xl leading-tight">{reward.title}</CardTitle>
                  <CardDescription className="text-pink-500/70 italic mt-1 font-medium">Cost: {reward.points} smiles</CardDescription>
                </CardHeader>

                <CardContent className="mt-auto pt-4 space-y-4">
                  {isUnlocked ? (
                    <div className="space-y-3">
                       <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex justify-between items-center group">
                          <span className="font-mono font-bold tracking-widest text-[#fb2c6a] truncate mr-2">{reward.code}</span>
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-pink-100 hover:text-[#fb2c6a] shrink-0" onClick={() => copyToClipboard(reward.code)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                       </div>
                       <a href={reward.link} target="_blank" rel="noopener noreferrer" className="w-full flex">
                         <Button className="w-full bg-[#fb2c6a] hover:bg-[#fb2c6a]/90 text-white font-bold shadow-lg shadow-[#fb2c6a]/30">
                           Redeem Now
                         </Button>
                       </a>
                    </div>
                  ) : (
                    <Button 
                      className={cn(
                        "w-full font-bold transition-all",
                        canUnlock 
                          ? "bg-[#fb2c6a] hover:bg-[#fb2c6a]/90 text-white shadow-lg shadow-[#fb2c6a]/30" 
                          : "bg-pink-50 text-pink-300 pointer-events-none"
                      )}
                      onClick={() => handleUnlock(reward)}
                      disabled={!canUnlock || isUnlocking}
                    >
                      {isUnlocking ? "Unlocking..." : (canUnlock ? `Unlock for ${reward.points} Smiles` : "Keep Smiling")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import React, { useState, useEffect } from "react";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-amber-400" />;
    case 2: return <Medal className="w-5 h-5 text-slate-300" />;
    case 3: return <Medal className="w-5 h-5 text-amber-700" />;
    default: return <span className="text-xs font-bold text-muted-foreground ml-1">{rank}</span>;
  }
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(console.error);

    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.leaderboard) {
          setLeaderboardData(data.leaderboard.map((u: any, i: number) => ({
            rank: i + 1,
            name: u.username,
            smiles: u.points,
            avatar: "https://github.com/shadcn.png",
            isUser: currentUser && currentUser.username === u.username
          })));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-[#fb2c6a]">Top Smilers</h1>
        <p className="text-pink-400 text-lg font-medium italic">See where you stand in the global positivity race! ✨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {leaderboardData.slice(0, 3).map((user, i) => (
           <motion.div
             key={user.name}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass p-6 rounded-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden"
           >
             {i === 0 && <div className="absolute top-0 right-0 p-2 bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase tracking-widest">Global #1</div>}
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-pink-50 shadow-lg">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-pink-50 p-1.5 rounded-full border border-pink-100 shadow-xl">
                  {getRankIcon(user.rank)}
                </div>
              </div>
             <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {user.smiles} Smiles
                </Badge>
             </div>
           </motion.div>
         ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden border-none">
        <Table>
          <TableHeader className="bg-pink-50">
            <TableRow className="border-pink-100 hover:bg-transparent">
              <TableHead className="w-20 text-pink-400 uppercase text-xs font-bold">Rank</TableHead>
              <TableHead className="text-pink-400 uppercase text-xs font-bold">User</TableHead>
              <TableHead className="text-right text-pink-400 uppercase text-xs font-bold">Total Smiles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user) => (
              <TableRow 
                key={user.name} 
                className={cn(
                  "border-pink-50 hover:bg-pink-50/50 transition-colors",
                  user.isUser && "bg-pink-100/50 border-l-4 border-l-[#fb2c6a]"
                )}
              >
                <TableCell className="font-medium">
                  {getRankIcon(user.rank)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(user.isUser && "font-bold text-primary")}>
                      {user.name}
                      {user.isUser && <span className="ml-2 text-[10px] opacity-70">(You)</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-black tracking-tighter text-lg">
                  {user.smiles.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Smile } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 glass bg-white/80 border-b border-pink-100 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 flex gap-2 items-center">
            <Smile className="w-4 h-4" />
            <span className="font-bold">{user.points || 0} Credits</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium uppercase tracking-widest">{user.username}</p>
              <p className="text-xs text-muted-foreground cursor-pointer hover:text-red-500 transition-colors" onClick={handleLogout}>Log Out</p>
            </div>
            <Avatar className="h-9 w-9 border border-white/20">
              <AvatarFallback className="bg-primary/20 text-primary font-black uppercase">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </>
        ) : (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-primary cursor-pointer border px-4 py-1.5 rounded-lg border-primary/20 hover:bg-primary/20 transition-all font-bold" onClick={() => router.push('/login')}>Log In</p>
          </div>
        )}
      </div>
    </header>
  );
}

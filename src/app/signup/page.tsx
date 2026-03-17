"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smile, ArrowRight, Github, User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      router.push("/home"); // Redirect on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-radial-gradient from-secondary/10 via-transparent to-transparent opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-none shadow-2xl overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-2">
              <div className="flex justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center shadow-lg shadow-pink-200/50">
                    <Smile className="w-8 h-8 text-[#fb2c6a]" />
                 </div>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-4xl font-brand text-[#fb2c6a]">SmileCred</CardTitle>
                <CardDescription className="text-pink-400 font-medium italic">Join the positivity economy! ✨</CardDescription>
              </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {error && <p className="text-red-500 text-sm text-center font-bold bg-red-500/10 py-2 rounded-lg">{error}</p>}
            
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest opacity-70">Username</Label>
                   <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="aanika" className="bg-pink-50 border-pink-100 h-12 pl-10 focus:ring-[#fb2c6a]/30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest opacity-70 text-pink-400">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-pink-300" />
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-pink-50 border-pink-100 h-12 pl-10 focus:ring-[#fb2c6a]/30" />
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-xl shadow-secondary/20"
              >
                {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground leading-relaxed">
              Already have an account? <Link href="/login" className="text-secondary hover:underline font-bold underline-offset-4">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

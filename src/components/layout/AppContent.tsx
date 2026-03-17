"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { usePathname } from "next/navigation";
import { CinematicBackground } from "@/components/ui/CinematicBackground";
import { motion, AnimatePresence } from "framer-motion";

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isHomePage = pathname === "/home";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const content = (isLandingPage || isHomePage || isAuthPage) ? (
    <div className="min-h-screen relative z-10">{children}</div>
  ) : (
    <MainLayout>{children}</MainLayout>
  );

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <CinematicBackground />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-10"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

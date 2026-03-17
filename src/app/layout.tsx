import type { Metadata } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";
import { AppContent } from "@/components/layout/AppContent";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const brandFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "SmileCred - Turn Smiles into Points",
  description: "A fun and gamified experience that rewards your happiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${brandFont.variable} font-sans`}>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}

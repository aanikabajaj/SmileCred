"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoboothCanvasProps {
  photos: string[]; // Base64 data URLs
  onReset: () => void;
  onDownload: () => void;
}

const FONTS = [
  { name: "Classic", value: "bold 32px sans-serif" },
  { name: "Modern", value: "bold 32px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  { name: "Elegant", value: "italic 32px Georgia, 'Times New Roman', serif" },
  { name: "Retro", value: "bold 32px 'Courier New', Courier, monospace" },
  { name: "Fun", value: "bold 36px 'Comic Sans MS', 'Comic Sans', cursive" },
  { name: "Cursive", value: "italic 36px 'Brush Script MT', 'Dancing Script', cursive" },
  { name: "Minimal", value: "300 32px 'Inter', sans-serif" },
  { name: "Block", value: "900 32px 'Impact', 'Arial Black', sans-serif" },
  { name: "Stylized", value: "bold uppercase 32px 'Garamond', serif" },
  { name: "Hand", value: "bold 36px 'Caveat', 'Segoe Print', cursive" }
];

export function PhotoboothCanvas({ photos, onReset, onDownload }: PhotoboothCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [customText, setCustomText] = useState("PHOTOBOOTH");
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  useEffect(() => {
    if (!canvasRef.current || photos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Photobooth Strip Dimensions (Classic 2x6 ratio scaled up)
    // Width: 600px, Height: 1800px
    canvas.width = 600;
    canvas.height = 1800;

    // Background Color (White for classic photobooth look)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Layout configuration
    const padding = 40;
    const innerPadding = 20;
    const imageWidth = canvas.width - (padding * 2);
    // 4 photos, so divide available height (minus top/bottom padding and space for logo)
    const logoSpace = 200;
    const totalAvailableHeight = canvas.height - (padding * 2) - logoSpace;
    const imageHeight = Math.floor((totalAvailableHeight - (innerPadding * 3)) / 4);

    const drawImages = async () => {
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        
        await new Promise((resolve) => {
          img.onload = () => {
            // Calculate y position for each image
            const yPos = padding + (i * (imageHeight + innerPadding));
            
            // Draw image with object-cover style scaling (center crop)
            const imgAspect = img.width / img.height;
            const targetAspect = imageWidth / imageHeight;
            
            let sWidth = img.width;
            let sHeight = img.height;
            let sx = 0;
            let sy = 0;

            if (imgAspect > targetAspect) {
              // Image is wider than target
              sWidth = img.height * targetAspect;
              sx = (img.width - sWidth) / 2;
            } else {
              // Image is taller than target
              sHeight = img.width / targetAspect;
              sy = (img.height - sHeight) / 2;
            }

            // Optional: slight vintage filter effect
            ctx.filter = 'contrast(1.1) brightness(1.05) saturate(0.9)';
            
            ctx.drawImage(
              img, 
              sx, sy, sWidth, sHeight, // Source rectangle
              padding, yPos, imageWidth, imageHeight // Destination rectangle
            );
            
            // Reset filter
            ctx.filter = 'none';

            // Add inner border for contrast
            ctx.strokeStyle = '#f1f5f9';
            ctx.lineWidth = 1;
            ctx.strokeRect(padding, yPos, imageWidth, imageHeight);
            
            resolve(true);
          };
        });
      }

      // Draw Logo at the bottom
      const logoY = canvas.height - logoSpace + 80;
      ctx.fillStyle = '#fb2c6a';
      ctx.font = 'bold 32px sans-serif';
      ctx.letterSpacing = '8px'; // Note: Some older browsers don't support letterSpacing on canvas, but modern ones do
      ctx.textAlign = 'center';
      
      // We manually add spaces for letter spacing fallback
      ctx.font = selectedFont.value;
      const spacedText = customText.split('').join(' ').toUpperCase();
      ctx.fillText(spacedText, canvas.width / 2, logoY);
      
      // Draw Date
      const dateY = logoY + 40;
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 16px sans-serif';
      ctx.letterSpacing = '0px';
      ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, dateY);

      setIsRendered(true);
    };

    drawImages();
  }, [photos, customText, selectedFont]);

  const handleDownloadClick = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to data URL and trigger download
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `smile-photobooth-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Notify parent to deduct session
    onDownload();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <div className="flex justify-between w-full items-end pb-4 border-b border-pink-200">
         <div>
           <h2 className="text-3xl font-bold text-[#fb2c6a]">Your Photos Are Ready!</h2>
           <p className="text-pink-400">Download your strip or share the joy.</p>
         </div>
         <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-[#fb2c6a] font-bold">
            <RefreshCw className="mr-2 w-4 h-4" /> Start Over
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full place-items-center">
        {/* Canvas Display */}
        <div className="relative group">
           <canvas 
             ref={canvasRef} 
             className={cn(
               "h-[600px] w-auto shadow-2xl transition-all duration-700 ease-out",
               isRendered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
             )}
             style={{ 
               filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))"
             }}
           />
           {/* Decorative shine overlay */}
           <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Actions Menu */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
           <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-pink-100 space-y-6 flex flex-col items-center">
              <div className="w-full space-y-2 text-left mb-2">
                <label className="text-xs font-bold text-[#fb2c6a] uppercase tracking-wider">Custom Text</label>
                <input 
                  type="text" 
                  maxLength={15}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-bold text-[#fb2c6a] text-center uppercase tracking-widest placeholder:text-pink-300"
                  placeholder="PHOTOBOOTH"
                />
              </div>

              <div className="w-full space-y-2 text-left mb-4">
                <label className="text-xs font-bold text-[#fb2c6a] uppercase tracking-wider">Choose Style</label>
                <div className="grid grid-cols-5 gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font)}
                      className={cn(
                        "h-8 text-[10px] font-bold rounded-lg border transition-all",
                        selectedFont.name === font.name 
                          ? "bg-[#fb2c6a] text-white border-[#fb2c6a]" 
                          : "bg-white text-slate-400 border-slate-100 hover:border-pink-200 shadow-sm"
                      )}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center">
                <Download className="w-8 h-8 text-[#fb2c6a]" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1 text-[#fb2c6a]">Save to Device</h3>
                <p className="text-sm text-pink-400 text-balance">This will consume 1 of your sessions</p>
              </div>
              <Button 
                onClick={handleDownloadClick}
                disabled={!isRendered}
                className="w-full h-14 bg-[#fb2c6a] hover:bg-[#e02058] text-white rounded-xl text-lg font-bold shadow-[0_10px_25px_rgba(251,44,106,0.3)] transition-transform hover:-translate-y-1"
              >
                Download Memory
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

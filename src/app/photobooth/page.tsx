"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Constants
const POINTS_PER_MILESTONE = 20;
const SESSIONS_PER_MILESTONE = 3;
const POSES_REQUIRED = 4;
const DELAY_SECONDS = 3;

import { PhotoboothCanvas } from "@/components/features/PhotoboothCanvas";

export default function PhotoboothIOClone() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // App States: 'landing' | 'layout-select' | 'camera' | 'result'
  const [appState, setAppState] = useState<'landing' | 'layout-select' | 'camera' | 'result'>('landing');

  // Camera State
  const webcamRef = useRef<Webcam>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Fetch user data on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalAllowedSessions = user ? Math.floor(user.points / POINTS_PER_MILESTONE) * SESSIONS_PER_MILESTONE : 0;
  const remainingSessions = user ? totalAllowedSessions - (user.photobooth_uses || 0) : 0;
  
  // Calculate smiles needed for next milestone
  const currentMilestoneSmiles = user ? Math.floor(user.points / POINTS_PER_MILESTONE) * POINTS_PER_MILESTONE : 0;
  const nextMilestoneSmiles = currentMilestoneSmiles + POINTS_PER_MILESTONE;
  const smilesNeeded = user ? nextMilestoneSmiles - user.points : POINTS_PER_MILESTONE;

  const handleStartPurchasing = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }
    
    if (user.points < POINTS_PER_MILESTONE) {
      alert(`You need at least ${POINTS_PER_MILESTONE} smiles to unlock your first sessions!`);
      return;
    }

    if (remainingSessions <= 0) {
      alert(`No sessions remaining! You need ${smilesNeeded} more smiles to unlock 3 more sessions.`);
      return;
    }

    // Move to layout select, we will deduct the session ONLY when they actually download the strip
    setAppState('layout-select');
  };

  const handleDownloadComplete = async () => {
    try {
      const res = await fetch('/api/user/spend', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to deduct session.");
        return;
      }
      
      // Successfully consumed 1 session
      setUser({ ...user, points: data.points, photobooth_uses: data.photobooth_uses });
      setAppState('landing'); // Return to landing showing updated sessions
    } catch (err) {
      console.error(err);
      alert("Error contacting the server.");
    }
  };

  const captureFrame = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos(prev => [...prev, imageSrc]);
      }
    }
  }, [webcamRef]);

  // Handle the automatic multi-shot picture logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCapturing && photos.length < POSES_REQUIRED) {
      if (countdown === null || countdown === 0) {
        setCountdown(DELAY_SECONDS);
      } else {
        timer = setTimeout(() => {
          if (countdown === 1) {
            captureFrame();
            setCountdown(0);
          } else {
            setCountdown(countdown - 1);
          }
        }, 1000);
      }
    } else if (isCapturing && photos.length === POSES_REQUIRED) {
      setIsCapturing(false);
      setAppState('result');
    }
    
    return () => clearTimeout(timer);
  }, [isCapturing, countdown, photos.length, captureFrame]);

  const startPhotoSession = () => {
    setPhotos([]);
    setIsCapturing(true);
    setCountdown(DELAY_SECONDS);
  };

  const handleReset = () => {
    setPhotos([]);
    setAppState('layout-select');
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading Vault...</div>;

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center font-sans overflow-hidden px-4 py-12">
      {appState === 'landing' && (
        <div className="text-center space-y-8 flex flex-col items-center max-w-lg w-full">
           <div className="space-y-4">
             <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter">photobooth</h1>
             <p className="text-slate-500 italic text-lg">Capture the moment, cherish the magic</p>
           </div>
           
           <div className="p-8 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full border border-pink-100 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-6">
               <CameraIcon className="w-8 h-8 text-[#fb2c6a]" />
             </div>
             
             {user && user.points >= POINTS_PER_MILESTONE ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">You have <span className="text-[#fb2c6a]">{remainingSessions}</span> Sessions</h2>
                  <p className="text-slate-500 mb-6 text-center px-4">
                    You've unlocked {totalAllowedSessions} total free sessions globally across your {user.points} smiles!
                  </p>
                  
                  {remainingSessions > 0 ? (
                    <Button 
                       onClick={handleStartPurchasing}
                       className="w-full h-16 bg-[#fb2c6a] hover:bg-[#fb2c6a]/90 text-white rounded-2xl text-xl font-black shadow-[0_10px_25px_rgba(251,44,106,0.3)] transition-transform hover:-translate-y-1"
                    >
                       START BOOTH (1 Session)
                    </Button>
                  ) : (
                    <Button 
                       disabled
                       className="w-full h-16 bg-slate-200 text-slate-500 rounded-2xl text-xl font-bold cursor-not-allowed"
                    >
                       NEED {smilesNeeded} SMILES
                    </Button>
                  )}
                  {remainingSessions <= 0 && (
                    <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-widest text-center">
                      Earn {smilesNeeded} smiles to unlock 3 more sessions!
                    </p>
                  )}
                </>
             ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">Locked!</h2>
                  <p className="text-slate-500 mb-8 text-center px-4">
                    Reach your first milestone of {POINTS_PER_MILESTONE} smiles to unlock 3 free sessions!
                  </p>
                  <Button 
                     disabled
                     className="w-full h-16 bg-slate-200 text-slate-500 rounded-2xl text-xl font-bold cursor-not-allowed"
                  >
                     {user ? `NEED ${smilesNeeded} SMILES` : 'LOG IN FIRST'}
                  </Button>
                </>
             )}
           </div>
        </div>
      )}

      {appState === 'layout-select' && (
        <div className="text-center space-y-12 max-w-4xl w-full">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-medium text-slate-800 tracking-tight">choose your layout</h2>
            <p className="text-slate-500 italic">Select from our collection of photo booth layouts</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 mt-12 pb-12">
            <div 
              onClick={() => setAppState('camera')}
              className="group cursor-pointer flex flex-col items-center gap-6 transition-transform hover:-translate-y-4"
            >
               <div className="w-48 aspect-[1/2.5] bg-white rounded-md shadow-xl p-3 relative flex flex-col gap-2 border border-slate-100">
                 <div className="absolute -top-4 -right-4 bg-yellow-300 text-black text-[11px] font-black uppercase px-3 py-1.5 rounded-sm rotate-3 shadow-md">
                   Try It Now
                 </div>
                 <div className="flex-1 bg-slate-100 rounded-sm overflow-hidden flex items-center justify-center text-slate-300"><CameraIcon className="w-8 h-8" /></div>
                 <div className="flex-1 bg-slate-100 rounded-sm"></div>
                 <div className="flex-1 bg-slate-100 rounded-sm"></div>
                 <div className="flex-1 bg-slate-100 rounded-sm"></div>
                 <div className="h-10 flex items-center justify-center">
                   <span className="text-[10px] font-black tracking-widest text-slate-400">PHOTOBOOTH</span>
                 </div>
               </div>
               <div className="text-center">
                 <p className="font-bold text-slate-800 text-lg">Classic Strip</p>
                 <p className="text-sm text-slate-500">Size 2x6 Strip<br/>(4 Pose)</p>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {appState === 'camera' && (
        <div className="flex flex-col items-center w-full max-w-5xl space-y-6">
          <div className="flex justify-between w-full max-w-3xl items-end px-4">
             <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-slate-800 font-bold">
               ← Back to Layouts
             </Button>
             <div className="text-right">
                <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-700">
                  {photos.length} / {POSES_REQUIRED} Shots
                </span>
             </div>
          </div>

          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className={cn("w-full h-full object-cover", isCapturing && countdown === 0 && "opacity-50")}
            />
            
            {/* Visual Flash effect when countdown hits 0 */}
            {countdown === 0 && (
               <div className="absolute inset-0 bg-white animate-pulse" />
            )}

            {/* Countdown Overlay */}
            {isCapturing && countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-9xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-bounce">
                  {countdown}
                </span>
              </div>
            )}
            
            {/* Initial Placeholder Start Screen */}
            {!isCapturing && photos.length === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                 <Button 
                   onClick={startPhotoSession}
                   className="h-20 px-16 rounded-[2rem] bg-[#fb2c6a] hover:bg-[#fb2c6a]/90 text-white font-black text-4xl tracking-widest shadow-[0_0_40px_rgba(251,44,106,0.6)] animate-pulse"
                 >
                   START
                 </Button>
              </div>
            )}
          </div>

          {/* Captured Photos Preview Bar */}
          <div className="flex gap-4 w-full max-w-3xl justify-center h-24 mt-4">
             {Array.from({ length: POSES_REQUIRED }).map((_, i) => (
                <div key={i} className="h-full aspect-video bg-white rounded-xl shadow-sm border-2 border-slate-100 overflow-hidden relative">
                   {photos[i] ? (
                     <img src={photos[i]} alt={`Pose ${i+1}`} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-200">
                        {i + 1}
                     </div>
                   )}
                </div>
             ))}
          </div>
        </div>
      )}

      {appState === 'result' && (
        <div className="flex flex-col items-center w-full max-w-5xl space-y-6 pt-8 pb-16">
          <PhotoboothCanvas 
            photos={photos} 
            onReset={handleReset} 
            onDownload={handleDownloadComplete}
          />
        </div>
      )}
    </div>
  );
}

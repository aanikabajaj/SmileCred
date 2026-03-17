"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import Webcam from "react-webcam";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SmileDetectorProps {
  onSmileDetected?: (confidence: number) => void;
}

export function SmileDetector({ onSmileDetected }: SmileDetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [smileConfidence, setSmileConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSmiling, setIsSmiling] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load AI models. Please check your connection.");
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const detect = async () => {
      if (
        isModelLoaded &&
        webcamRef.current &&
        webcamRef.current.video?.readyState === 4
      ) {
        const video = webcamRef.current.video;
        
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          const currentSmileConf = expressions.happy;
          setSmileConfidence(currentSmileConf);

          if (currentSmileConf > 0.7) {
            if (!isSmiling) {
              setIsSmiling(true);
              onSmileDetected?.(currentSmileConf);
            }
          } else {
            setIsSmiling(false);
          }
        } else {
          setSmileConfidence(0);
          setIsSmiling(false);
        }
      }
    };

    if (isModelLoaded) {
      intervalId = setInterval(detect, 200);
    }

    return () => clearInterval(intervalId);
  }, [isModelLoaded, isSmiling, onSmileDetected]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Card className="glass overflow-hidden border-none shadow-2xl relative">
        <CardContent className="p-0 relative aspect-video bg-black flex items-center justify-center">
          {!isModelLoaded && !error && (
            <div className="flex flex-col items-center gap-4 text-primary">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium animate-pulse">Initializing Neural Network...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-2 text-destructive p-8 text-center">
              <AlertCircle className="w-12 h-12" />
              <p className="font-bold text-lg">{error}</p>
              <p className="text-sm opacity-80">Make sure the camera is permitted and models are loaded.</p>
            </div>
          )}

          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-1000",
              isModelLoaded ? "opacity-100" : "opacity-0"
            )}
            videoConstraints={{
              facingMode: "user",
            }}
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {isModelLoaded && (
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={cn(
                "px-3 py-1 flex gap-2 items-center transition-all duration-300",
                isSmiling ? "bg-primary text-white scale-110" : "glass text-white"
              )}>
                <Smile className={cn("w-4 h-4", isSmiling && "animate-bounce")} />
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {isSmiling ? "Smile Detected!" : "Share a Smile"}
                </span>
              </Badge>
            </div>
          )}

          {isModelLoaded && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 glass p-3 rounded-xl border-white/5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
                <span>Smile Intensity</span>
                <span>{Math.round(smileConfidence * 100)}%</span>
              </div>
              <Progress value={smileConfidence * 100} className="h-1.5 bg-white/10" />
            </div>
          )}
        </CardContent>
      </Card>

      {isSmiling && (
        <div className="absolute -inset-2 rounded-[2rem] border-2 border-primary/50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}

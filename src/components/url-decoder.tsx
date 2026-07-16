"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGlobe, FiEye, FiCalendar, FiArrowRight, FiShield, FiCpu } from "react-icons/fi";

const TARGET_UUID = "0190b4d2-f125-7b5a-93a8-429be9752f40";
const TIMESTAMP_PART = "0190b4d2-f125";
const REST_PART = "-7b5a-93a8-429be9752f40";
const DECODED_DATE_STR = "15 de Julho de 2024 às 15:13:24.901";

export default function UrlDecoder() {
  const [status, setStatus] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanCycle, setScanCycle] = useState(0);
  const urlTextRef = useRef<HTMLSpanElement>(null);
  const targetCardRef = useRef<HTMLDivElement>(null);

  // Position for the flying particle animation
  const [particleCoords, setParticleCoords] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });

  const startScan = () => {
    if (status === "scanning") return;
    setStatus("scanning");
    setScanCycle(1);

    // Get positions for particle flight path if refs exist
    if (urlTextRef.current && targetCardRef.current) {
      const startRect = urlTextRef.current.getBoundingClientRect();
      const endRect = targetCardRef.current.getBoundingClientRect();
      
      setParticleCoords({
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX: endRect.left + endRect.width / 2,
        endY: endRect.top + endRect.height / 2,
      });
    }

    // First scan cycle ends after 800ms, second cycle ends at 1600ms, then finish at 2000ms
    setTimeout(() => setScanCycle(2), 850);
    setTimeout(() => {
      setStatus("completed");
    }, 1800);
  };

  const handleReset = () => {
    setStatus("idle");
    setScanCycle(0);
  };

  return (
    <div className="w-full my-8 p-6 md:p-8 bg-zinc-950/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col gap-6 transition-all hover:border-zinc-800 relative">
      
      {/* 1. TOPO: BARRA DE URL DO NAVEGADOR (100% LARGURA) */}
      <div className="w-full flex flex-col border border-zinc-850 bg-zinc-950 rounded-xl overflow-hidden shadow-lg relative">
        <div className="flex items-center gap-3 px-4 py-3.5 bg-zinc-900 border-b border-zinc-900 relative">
          
          {/* Controles de janela fictícios */}
          <div className="flex gap-1.5 shrink-0 z-10">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          
          {/* Barra de URL 100% Largura */}
          <div className="flex-1 max-w-2xl mx-auto h-8 px-4 bg-zinc-950 border border-zinc-850 rounded-md flex items-center gap-2 relative overflow-hidden select-none">
            <FiGlobe className="text-zinc-650 text-xs shrink-0" />
            
            <div className="text-[11px] md:text-xs font-mono text-zinc-500 truncate flex items-center">
              socialnetwork.com/profiles/
              <span 
                ref={urlTextRef}
                className={`transition-all duration-300 font-bold px-0.5 rounded ${
                  status === "scanning"
                    ? "bg-red-950/50 text-red-300 ring-1 ring-red-500/30 animate-pulse"
                    : status === "completed"
                      ? "text-zinc-600 font-medium"
                      : "text-red-400"
                }`}
              >
                {TIMESTAMP_PART}
              </span>
              <span className="text-zinc-600 font-medium">
                {REST_PART}
              </span>
            </div>

            {/* LASER SWEEP ANIMATION (SCANS ENTIRE BAR) */}
            {status === "scanning" && (
              <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="absolute inset-y-0 w-[2px] bg-red-500 shadow-[0_0_8px_#ef4444] pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* FLYING PARTICLE EFFECT (GSAP/Framer Motion physics simulation) */}
      <AnimatePresence>
        {status === "scanning" && scanCycle === 2 && (
          <motion.div
            initial={{ 
              position: "fixed",
              left: particleCoords.startX - 60,
              top: particleCoords.startY - 10,
              opacity: 0,
              scale: 0.8
            }}
            animate={{ 
              left: [particleCoords.startX - 60, particleCoords.startX - 10, particleCoords.endX - 80],
              top: [particleCoords.startY - 10, particleCoords.startY + 60, particleCoords.endY - 60],
              opacity: [0, 1, 1, 0.2],
              scale: [0.8, 1.2, 0.9]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="z-50 font-mono text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)] select-none pointer-events-none"
          >
            {TIMESTAMP_PART}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. BASE: DIVISION 50% / 50% (OLHO CYBERPUNK VS CONVERSOR) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LADO ESQUERDO: OLHO CYBERPUNK (O SCANNER) */}
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-900 rounded-xl relative min-h-[220px]">
          
          {/* LASER BEAM PROJECTED UPWARD DURING SCAN */}
          {status === "scanning" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "130px", opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute bottom-28 w-[2px] bg-gradient-to-t from-red-600 via-red-400 to-transparent pointer-events-none z-10 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            />
          )}

          {/* CYBERPUNK SVG EYE */}
          <div className="w-32 h-32 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full select-none">
              <defs>
                <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Eye contour */}
              <motion.path 
                d="M10,50 Q50,20 90,50 Q50,80 10,50 Z" 
                fill="none" 
                stroke="#1f1f23" 
                strokeWidth="2.5"
                animate={status === "scanning" ? { stroke: "#7f1d1d" } : { stroke: "#1f1f23" }}
              />

              {/* Inner details / circles */}
              <circle cx="50" cy="50" r="28" fill="none" stroke="#18181b" strokeWidth="1" />
              
              {/* Iris */}
              <motion.circle 
                cx="50" 
                cy="50" 
                r="18" 
                fill="none" 
                stroke={status === "scanning" ? "#ef4444" : "#3f3f46"} 
                strokeWidth="1.5"
                filter={status === "scanning" ? "url(#red-glow)" : ""}
                animate={status === "scanning" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              {/* Pupil (Glowing Center) */}
              <motion.circle 
                cx="50" 
                cy="50" 
                r="8" 
                fill={status === "scanning" ? "#ef4444" : "#18181b"}
                stroke={status === "scanning" ? "#f97316" : "#27272a"}
                strokeWidth="1"
                filter={status === "scanning" ? "url(#red-glow)" : ""}
                animate={
                  status === "scanning" 
                    ? { r: [8, 10, 8] } 
                    : status === "completed" 
                      ? { r: 8, fill: "#b91c1c" } 
                      : { r: 6 }
                }
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              {/* Hacker alignment lines */}
              <line x1="50" y1="10" x2="50" y2="20" stroke="#27272a" strokeWidth="0.8" />
              <line x1="50" y1="80" x2="50" y2="90" stroke="#27272a" strokeWidth="0.8" />
              <line x1="10" y1="50" x2="20" y2="50" stroke="#27272a" strokeWidth="0.8" />
              <line x1="80" y1="50" x2="90" y2="50" stroke="#27272a" strokeWidth="0.8" />
            </svg>
          </div>

          {/* CONTROL ACTION */}
          <div className="mt-4 w-full flex justify-center z-10">
            {status !== "completed" ? (
              <button
                onClick={startScan}
                disabled={status === "scanning"}
                className={`h-10 px-5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
                  status === "scanning"
                    ? "bg-red-950/20 border-red-900/60 text-red-400 cursor-not-allowed"
                    : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white shadow-red-950/10 hover:border-red-900/50"
                }`}
              >
                <FiEye className={`text-base ${status === "scanning" ? "animate-pulse" : ""}`} />
                {status === "scanning" ? "Espionando..." : "Espionar Perfil"}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="h-10 px-5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-all active:scale-95"
              >
                Resetar Scanner
              </button>
            )}
          </div>
        </div>

        {/* LADO DIREITO: O CONVERSOR DE METADADOS */}
        <div 
          ref={targetCardRef}
          className="flex flex-col p-5 bg-zinc-950/80 border border-zinc-900 rounded-xl relative overflow-hidden min-h-[220px] justify-center"
        >
          <div className="flex items-center gap-2 text-zinc-500 mb-3 border-b border-zinc-900 pb-3 select-none">
            <FiCpu className="text-zinc-650 text-base" />
            <h4 className="font-semibold text-xs font-mono uppercase tracking-wider">Conversor de Metadados</h4>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-6 text-center text-zinc-600 font-mono text-[11px] gap-2 select-none"
                >
                  <FiCpu className="text-2xl text-zinc-800" />
                  Aguardando sinal de varredura...
                </motion.div>
              )}

              {status === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-6 text-center text-zinc-400 font-mono text-[11px] gap-2 select-none"
                >
                  <div className="h-5 w-5 rounded-full border border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-1" />
                  Recebendo bits da URL...
                </motion.div>
              )}

              {status === "completed" && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3.5"
                >
                  {/* Hex display */}
                  <div className="bg-zinc-950/90 border border-zinc-900 rounded p-2.5 text-center">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-1">Timestamp Hex Recebido</div>
                    <div className="font-mono text-xs font-bold text-red-400">{TIMESTAMP_PART}</div>
                  </div>

                  {/* Decoded Date */}
                  <div className="p-3 bg-red-950/5 border border-red-900/40 rounded-lg flex items-start gap-2.5">
                    <FiCalendar className="text-red-400 text-lg mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-0.5">Criação do Perfil</div>
                      <div className="font-mono text-xs font-semibold text-red-300 leading-tight">
                        {DECODED_DATE_STR}
                      </div>
                    </div>
                  </div>

                  {/* Privacy alert statement */}
                  <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-lg flex gap-2">
                    <FiShield className="text-zinc-500 text-base shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Saberemos exatamente quando este perfil de usuário foi gerado. O UUID v7 exposto publicamente na URL vazou a data e hora precisas de criação deste registro.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}

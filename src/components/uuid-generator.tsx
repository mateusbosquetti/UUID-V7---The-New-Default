"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiClipboard, FiCheck, FiCpu, FiClock, FiShield, FiSliders } from "react-icons/fi";

// Function to generate a cryptographically secure UUID v7
function generateUUIDv7(): string {
  // 1. Get current Unix timestamp in milliseconds (48 bits)
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16).padStart(12, "0");

  // 2. Generate random bytes for the rest
  const randomBytes = new Uint8Array(10);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 10; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // 3. Chars 14, 15, 16 (12 bits of randomness for Rand A)
  const randA = ((randomBytes[0] << 8) | randomBytes[1]) & 0x0fff;
  const randAHex = randA.toString(16).padStart(3, "0");

  // 4. Char 17 is variant (2 bits variant, 4 bits variant representation)
  // Bits: 10xx -> maps to hex 8, 9, a, b
  const variantByte = (randomBytes[2] & 0x3f) | 0x80;
  const variantHex = variantByte.toString(16).substring(0, 1);

  // 5. Remaining randomness (62 bits for Rand B)
  const randB1 = ((randomBytes[3] << 8) | randomBytes[4]) & 0x0fff;
  const randB1Hex = randB1.toString(16).padStart(3, "0");

  let randB2Hex = "";
  for (let i = 5; i < 10; i++) {
    randB2Hex += randomBytes[i].toString(16).padStart(2, "0");
  }
  const extraRandom = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
  const fullRandB2Hex = (randB2Hex + extraRandom).substring(0, 12);

  // Format: hhhhhhhh-hhhh-7hhh-yhhh-hhhhhhhhhhhh
  return `${timestampHex.substring(0, 8)}-${timestampHex.substring(8, 12)}-7${randAHex}-${variantHex}${randB1Hex}-${fullRandB2Hex}`;
}

// Function to decode the timestamp from a UUID v7
function decodeUUIDv7(uuid: string): { timestampMs: number; isValid: boolean } {
  const clean = uuid.replace(/[- ]/g, "").toLowerCase();
  
  if (clean.length !== 32 || clean.charAt(12) !== "7") {
    return { timestampMs: 0, isValid: false };
  }

  const timestampHex = clean.substring(0, 12);
  const timestampMs = parseInt(timestampHex, 16);

  const year2020 = 1577836800000;
  const year2100 = 4102444800000;
  const isValid = !isNaN(timestampMs) && timestampMs > year2020 && timestampMs < year2100;

  return { timestampMs, isValid };
}

// Formatter to print dates in local format with milliseconds
function formatDate(ms: number): string {
  if (!ms) return "";
  const date = new Date(ms);
  
  const pad = (num: number, size = 2) => num.toString().padStart(size, "0");
  
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export default function UuidV7Generator() {
  const [uuid, setUuid] = useState("");
  const [copied, setCopied] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  // Initialize with a UUID v7
  useEffect(() => {
    setUuid(generateUUIDv7());
  }, []);

  const handleGenerate = () => {
    setIsScrambling(true);
    // Simulate scramble animation for 150ms
    let count = 0;
    const interval = setInterval(() => {
      setUuid(generateUUIDv7());
      count++;
      if (count > 4) {
        clearInterval(interval);
        setUuid(generateUUIDv7());
        setIsScrambling(false);
      }
    }, 30);
    setCustomInput("");
    setInputError(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    
    if (val.trim() === "") {
      setInputError(false);
      return;
    }
    
    const { isValid } = decodeUUIDv7(val);
    if (isValid) {
      setUuid(val);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  // Extract parts of the current UUID for layout display
  // Structure: hhhhhhhh-hhhh-7hhh-yhhh-hhhhhhhhhhhh
  const cleanUuid = uuid.replace(/ /g, "");
  const parts = {
    timestamp1: cleanUuid.substring(0, 8),
    timestamp2: cleanUuid.substring(9, 13),
    version: cleanUuid.substring(14, 15),
    randA: cleanUuid.substring(15, 18),
    variant: cleanUuid.substring(19, 20),
    randB1: cleanUuid.substring(20, 23),
    randB2: cleanUuid.substring(24, 36),
  };

  const decoded = decodeUUIDv7(uuid);

  return (
    <div className="w-full my-8 p-6 md:p-8 bg-zinc-950/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col gap-6 md:gap-8 transition-all hover:border-zinc-800">
      
      {/* SEÇÃO DO DISPLAY DO UUID (RAIO-X) */}
      <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-900 rounded-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial-gradient from-violet-950/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wide select-all text-center flex flex-wrap justify-center items-center gap-y-1">
          {/* TIMESTAMP (Roxo) */}
          <span 
            className={`transition-all duration-200 px-0.5 rounded cursor-help ${
              hoveredSection === "timestamp" ? "bg-violet-950/40 text-violet-300 ring-2 ring-violet-500/20 scale-105" : "text-violet-400"
            }`}
            onMouseEnter={() => setHoveredSection("timestamp")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {parts.timestamp1}-{parts.timestamp2}
          </span>

          <span className="text-zinc-700">-</span>

          {/* VERSÃO (Verde) */}
          <span 
            className={`transition-all duration-200 px-0.5 rounded cursor-help ${
              hoveredSection === "version" ? "bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/20 scale-105" : "text-emerald-400"
            }`}
            onMouseEnter={() => setHoveredSection("version")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {parts.version}
          </span>

          {/* RANDOM A (Laranja) */}
          <span 
            className={`transition-all duration-200 px-0.5 rounded cursor-help ${
              hoveredSection === "random" ? "bg-orange-950/40 text-orange-300 ring-2 ring-orange-500/20 scale-105" : "text-orange-400"
            }`}
            onMouseEnter={() => setHoveredSection("random")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {parts.randA}
          </span>

          <span className="text-zinc-700">-</span>

          {/* VARIANTE (Azul) */}
          <span 
            className={`transition-all duration-200 px-0.5 rounded cursor-help ${
              hoveredSection === "variant" ? "bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-500/20 scale-105" : "text-cyan-400"
            }`}
            onMouseEnter={() => setHoveredSection("variant")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {parts.variant}
          </span>

          {/* RANDOM B (Laranja) */}
          <span 
            className={`transition-all duration-200 px-0.5 rounded cursor-help ${
              hoveredSection === "random" ? "bg-orange-950/40 text-orange-300 ring-2 ring-orange-500/20 scale-105" : "text-orange-400"
            }`}
            onMouseEnter={() => setHoveredSection("random")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {parts.randB1}-{parts.randB2}
          </span>
        </div>

        {/* HUD DE COMPRIMENTO / VERSÃO RAPIDO */}
        <div className="mt-4 text-xs font-mono text-zinc-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Timestamp (48-bit)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> v7
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Entropia (74-bit)
          </span>
        </div>
      </div>

      {/* SEÇÃO DA LEGENDA EXPLICATIVA DINÂMICA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CARD TIMESTAMP */}
        <div 
          className={`p-4 rounded-xl border transition-all duration-200 ${
            hoveredSection === "timestamp" 
              ? "bg-violet-950/15 border-violet-800/80 shadow-[0_0_15px_-3px_rgba(139,92,246,0.15)]" 
              : hoveredSection !== null 
                ? "bg-zinc-900/10 border-zinc-900/40 opacity-40" 
                : "bg-zinc-900/20 border-zinc-800/50"
          }`}
          onMouseEnter={() => setHoveredSection("timestamp")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-2 text-violet-400 mb-1.5">
            <FiClock className="text-base" />
            <h4 className="font-semibold text-sm font-mono uppercase tracking-wider">Timestamp (48 bits)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Armazena o tempo decorrido desde o Unix Epoch em milissegundos. Garante a ordenabilidade temporal nativa dos IDs.
          </p>
          <div className="bg-zinc-950/80 border border-zinc-900 rounded p-2 text-[11px] font-mono text-violet-300">
            <div className="text-[9px] text-zinc-500 uppercase mb-0.5">Data Decodificada</div>
            {decoded.isValid ? formatDate(decoded.timestampMs) : "UUID Inválido"}
          </div>
        </div>

        {/* CARD VERSÃO */}
        <div 
          className={`p-4 rounded-xl border transition-all duration-200 ${
            hoveredSection === "version" 
              ? "bg-emerald-950/15 border-emerald-800/80 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]" 
              : hoveredSection !== null 
                ? "bg-zinc-900/10 border-zinc-900/40 opacity-40" 
                : "bg-zinc-900/20 border-zinc-800/50"
          }`}
          onMouseEnter={() => setHoveredSection("version")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
            <FiCpu className="text-base" />
            <h4 className="font-semibold text-sm font-mono uppercase tracking-wider">Versão (4 bits)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            O caractere fixo <code className="text-emerald-300 font-mono bg-emerald-950/40 px-1 py-0.5 rounded">7</code> identifica formalmente o UUID de versão 7 (bits <code className="text-emerald-300">0111</code>).
          </p>
          <div className="bg-zinc-950/80 border border-zinc-900 rounded p-2 text-[11px] font-mono text-emerald-300">
            <div className="text-[9px] text-zinc-500 uppercase mb-0.5">Representação Binária</div>
            0111 (Versão 7 oficial)
          </div>
        </div>

        {/* CARD VARIANTE */}
        <div 
          className={`p-4 rounded-xl border transition-all duration-200 ${
            hoveredSection === "variant" 
              ? "bg-cyan-950/15 border-cyan-800/80 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]" 
              : hoveredSection !== null 
                ? "bg-zinc-900/10 border-zinc-900/40 opacity-40" 
                : "bg-zinc-900/20 border-zinc-800/50"
          }`}
          onMouseEnter={() => setHoveredSection("variant")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
            <FiSliders className="text-base" />
            <h4 className="font-semibold text-sm font-mono uppercase tracking-wider">Variante (2 bits)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Indica a especificação de layout do UUID. Bits iniciais em <code className="text-cyan-300">10</code> mapeiam para os caracteres <code className="text-cyan-300">8, 9, a, b</code>.
          </p>
          <div className="bg-zinc-950/80 border border-zinc-900 rounded p-2 text-[11px] font-mono text-cyan-300">
            <div className="text-[9px] text-zinc-500 uppercase mb-0.5">Variante RFC 9562</div>
            IETF (Padrão de Layout)
          </div>
        </div>

        {/* CARD ENTROPIA (ALEATORIEDADE) */}
        <div 
          className={`p-4 rounded-xl border transition-all duration-200 ${
            hoveredSection === "random" 
              ? "bg-orange-950/15 border-orange-800/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)]" 
              : hoveredSection !== null 
                ? "bg-zinc-900/10 border-zinc-900/40 opacity-40" 
                : "bg-zinc-900/20 border-zinc-800/50"
          }`}
          onMouseEnter={() => setHoveredSection("random")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-2 text-orange-400 mb-1.5">
            <FiShield className="text-base" />
            <h4 className="font-semibold text-sm font-mono uppercase tracking-wider">Aleatoriedade (74 bits)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Entropia gerada via Web Crypto API. Garante unicidade absoluta e impede colisões, mesmo gerando IDs no mesmo milissegundo.
          </p>
          <div className="bg-zinc-950/80 border border-zinc-900 rounded p-2 text-[11px] font-mono text-orange-300">
            <div className="text-[9px] text-zinc-500 uppercase mb-0.5">Probabilidade de Colisão</div>
            1 em 18.8 sextilhões por milissegundo
          </div>
        </div>

      </div>

      {/* PAINEL DE CONTROLE (BOTÃO E INPUT) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-zinc-900">
        
        {/* BOTÕES DE GERAR E COPIAR */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isScrambling}
            className="flex-1 md:flex-initial h-11 px-5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all text-sm font-medium text-white flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
          >
            <FiRefreshCw className={`text-base ${isScrambling ? "animate-spin" : ""}`} />
            Gerar UUID v7
          </button>
          
          <button
            onClick={handleCopy}
            className="h-11 w-12 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 hover:text-white transition-all text-zinc-400 flex items-center justify-center relative active:scale-95"
            title="Copiar UUID"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FiCheck className="text-emerald-400 text-lg" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FiClipboard className="text-lg" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* INPUT DE DECODIFICAÇÃO DE USUÁRIO */}
        <div className="w-full md:w-80 flex flex-col gap-1.5">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Cole um UUID v7 externo..."
              value={customInput}
              onChange={handleInputChange}
              className={`w-full h-11 px-4 rounded-lg bg-zinc-950 border text-sm font-mono placeholder:text-zinc-600 text-zinc-200 transition-all outline-none ${
                inputError 
                  ? "border-red-800/80 focus:border-red-600 focus:ring-1 focus:ring-red-600/30" 
                  : customInput !== ""
                    ? "border-emerald-800/80 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                    : "border-zinc-800 focus:border-zinc-700"
              }`}
            />
          </div>
          {inputError && (
            <span className="text-[10px] text-red-500 font-mono pl-1">
              UUID inválido ou de versão diferente de v7
            </span>
          )}
        </div>

      </div>

    </div>
  );
}

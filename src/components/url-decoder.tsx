"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiGlobe, FiEye, FiCpu, FiCalendar, FiArrowRight } from "react-icons/fi";

const TARGET_UUID = "0190b4d2-f125-7b5a-93a8-429be9752f40";
// 0x0190b4d2f125 in decimal is 1721067204901 ms -> 15/07/2024, 15:13:24.901
const DECODED_DATE_STR = "15 de Julho de 2024 às 15:13:24.901";

export default function UrlDecoder() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanCompleted(false);

    // Simulate scanning/laser sweep for 1.8 seconds
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1800);
  };

  const handleReset = () => {
    setIsScanning(false);
    setScanCompleted(false);
  };

  return (
    <div className="w-full my-8 p-6 md:p-8 bg-zinc-950/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col gap-6 transition-all hover:border-zinc-800">
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* LADO ESQUERDO: NAVEGADOR SIMULADO (FAKE BROWSER) */}
        <div className="md:col-span-3 flex flex-col border border-zinc-850 bg-zinc-950 rounded-xl overflow-hidden shadow-lg min-h-[300px] relative">
          
          {/* TOPO DO NAVEGADOR */}
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-900 relative">
            {/* Controles de janela (Red, Yellow, Green) */}
            <div className="flex gap-1.5 z-10">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            
            {/* Barra de Endereço */}
            <div className="flex-1 max-w-md mx-auto h-7 px-3 bg-zinc-950 border border-zinc-850 rounded-md flex items-center gap-2 relative overflow-hidden select-none">
              <FiGlobe className="text-zinc-650 text-xs shrink-0" />
              
              <div className="text-[10px] font-sans text-zinc-500 truncate flex items-center font-mono">
                socialnetwork.com/u/
                <span className={`transition-all duration-300 font-bold px-0.5 rounded ${
                  isScanning 
                    ? "bg-violet-950 text-violet-300 ring-1 ring-violet-500/30 animate-pulse" 
                    : scanCompleted 
                      ? "text-violet-400 bg-violet-950/20" 
                      : "text-zinc-400"
                }`}>
                  0190b4d2-f125
                </span>
                <span className="text-zinc-600">
                  {TARGET_UUID.substring(13)}
                </span>
              </div>

              {/* LASER SCANNING EFFECT */}
              {isScanning && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-violet-500/25 to-transparent pointer-events-none"
                />
              )}
            </div>
          </div>

          {/* CONTEÚDO MOCK DA REDE SOCIAL */}
          <div className="p-6 flex flex-col items-center justify-center flex-1 bg-zinc-950 text-center relative">
            <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-650 uppercase tracking-widest">
              Visualização Pública
            </div>

            {/* Avatar */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 border border-violet-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-violet-500/10">
              LR
            </div>

            {/* Nome e Nickname */}
            <h3 className="font-semibold text-zinc-200 text-base">Lucas Rocha</h3>
            <span className="text-xs text-zinc-500 font-mono">@lucas_rocha</span>

            {/* Bio */}
            <p className="text-xs text-zinc-400 max-w-xs mt-3 leading-relaxed">
              Full Stack Developer. Apaixonado por bancos de dados e engenharia reversa. Coding in public. 🚀
            </p>

            {/* Estatísticas Fakes */}
            <div className="flex gap-6 mt-5 text-[11px] border-t border-zinc-900 pt-4 w-full justify-center text-zinc-500 font-mono">
              <div><strong className="text-zinc-300">142</strong> posts</div>
              <div><strong className="text-zinc-300">1.2k</strong> seguidores</div>
              <div><strong className="text-zinc-300">490</strong> seguindo</div>
            </div>
          </div>

        </div>

        {/* LADO DIREITO: PAINEL DO ESPIÃO / DECODIFICADOR */}
        <div className="md:col-span-2 flex flex-col p-5 bg-zinc-950/80 border border-zinc-900 rounded-xl relative overflow-hidden">
          
          <div className="flex items-center gap-2 text-zinc-400 mb-3 border-b border-zinc-900 pb-3">
            <FiEye className="text-zinc-500 text-base" />
            <h4 className="font-semibold text-xs font-mono uppercase tracking-wider">Detector de Metadados</h4>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Qualquer ID público no formato UUID v7 expõe metadados de criação do registro no servidor. Clique abaixo para auditar esta URL.
          </p>

          {/* CONTEÚDO DINÂMICO DOS RESULTADOS */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isScanning && !scanCompleted && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-6 text-center text-zinc-600 font-mono text-[11px] gap-2"
                >
                  <FiGlobe className="text-2xl text-zinc-800" />
                  Pronto para analisar a URL...
                </motion.div>
              )}

              {isScanning && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-6 text-center text-zinc-400 font-mono text-[11px] gap-2"
                >
                  <div className="h-6 w-6 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-1" />
                  Escanenando e extraindo bits...
                </motion.div>
              )}

              {scanCompleted && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Bloco Hexadecimal Extraído */}
                  <div className="bg-zinc-950/90 border border-zinc-900 rounded p-3 text-center">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-1">Timestamp Hex Extraído</div>
                    <div className="font-mono text-sm font-bold text-violet-400">{TARGET_UUID.substring(0, 13)}</div>
                  </div>

                  {/* Relógio / Data Revelada */}
                  <div className="p-3 bg-violet-950/10 border border-violet-900/40 rounded-lg flex items-start gap-2.5">
                    <FiCalendar className="text-violet-400 text-lg mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-0.5">Data de Criação</div>
                      <div className="font-mono text-xs font-semibold text-violet-300 leading-tight">
                        {DECODED_DATE_STR}
                      </div>
                    </div>
                  </div>

                  {/* Explicação da Quebra de Privacidade */}
                  <div className="p-3 bg-red-950/5 border border-red-900/30 rounded-lg flex gap-2">
                    <FiCheckCircle className="text-red-400 text-base shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Descobrimos o milissegundo exato em que o usuário **Lucas Rocha** se registrou no sistema, apenas lendo a URL de perfil dele.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTÕES DE CONTROLE DO SCAN */}
          <div className="mt-5 pt-4 border-t border-zinc-900 flex gap-2">
            {!scanCompleted ? (
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-white active:scale-95 disabled:opacity-50"
              >
                Escanear Perfil
                <FiArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-white active:scale-95"
              >
                Limpar Análise
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

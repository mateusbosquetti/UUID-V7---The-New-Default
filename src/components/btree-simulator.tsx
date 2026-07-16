"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiRotateCcw, FiActivity, FiDatabase, FiAlertTriangle } from "react-icons/fi";

interface Page {
  id: string;
  items: string[];
  isSplitting?: boolean;
}

export default function BTreeSimulator() {
  const [activeTab, setActiveTab] = useState<"v7" | "v4">("v7");
  const [pages, setPages] = useState<Page[]>([]);
  const [splits, setSplits] = useState(0);
  const [fragmentation, setFragmentation] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sequenceCounter, setSequenceCounter] = useState(0);

  // Initialize the simulator
  useEffect(() => {
    resetSimulator();
  }, [activeTab]);

  const resetSimulator = () => {
    setPages([]);
    setSplits(0);
    setFragmentation(0);
    setLogs([`Simulador resetado. Pronto para iniciar gravação de ${activeTab === "v7" ? "UUID v7 (Time-Ordered)" : "UUID v4 (Random)"}.`]);
    setSequenceCounter(0);
    setIsSimulating(false);
  };

  // Helper to add a log entry
  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 19)]);
  };

  // Insert a single element in UUID v7 (Sequential Append-only)
  const insertV7 = (currentPages: Page[], counter: number) => {
    // Generate sequential key prefix representation
    // Using a base time prefix and an incremental hex counter
    const baseTime = 0x0190b4d0;
    const key = (baseTime + counter).toString(16).padStart(8, "0");
    const updatedPages = [...currentPages];

    if (updatedPages.length === 0) {
      updatedPages.push({ id: Math.random().toString(), items: [key] });
      addLog(`[Inserido] Chave "${key}" -> Criada Página 1.`);
    } else {
      const lastPageIndex = updatedPages.length - 1;
      const lastPage = updatedPages[lastPageIndex];

      if (lastPage.items.length < 4) {
        // Append item directly since it's larger
        const newItems = [...lastPage.items, key];
        updatedPages[lastPageIndex] = { ...lastPage, items: newItems };
        addLog(`[Inserido] Chave "${key}" adicionada ao fim da Página ${lastPageIndex + 1}.`);
      } else {
        // Page is full, create a new page sequentially (no split!)
        updatedPages.push({ id: Math.random().toString(), items: [key] });
        addLog(`[Nova Página] Página ${lastPageIndex + 1} cheia! Criada Página ${lastPageIndex + 2} para chave "${key}".`);
      }
    }
    return { pages: updatedPages, counter: counter + 1, splitOccurred: false };
  };

  // Insert a single element in UUID v4 (Random insertion with Page Splits)
  const insertV4 = (currentPages: Page[]) => {
    // Generate random 4-character hex key (simulating random UUID bits)
    const key = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
    const updatedPages = [...currentPages];
    let splitOccurred = false;

    if (updatedPages.length === 0) {
      updatedPages.push({ id: Math.random().toString(), items: [key] });
      addLog(`[Inserido] Chave "${key}" -> Criada Página 1.`);
    } else {
      // Find the correct page lexicographically
      let targetPageIndex = 0;
      for (let i = 0; i < updatedPages.length; i++) {
        const items = updatedPages[i].items;
        // If it's the last page, or if the key fits within this page's upper boundary
        if (i === updatedPages.length - 1 || key < items[items.length - 1]) {
          targetPageIndex = i;
          break;
        }
      }

      const targetPage = updatedPages[targetPageIndex];
      const newItems = [...targetPage.items, key].sort();

      if (newItems.length <= 4) {
        // Fit within page, just sort and update
        updatedPages[targetPageIndex] = { ...targetPage, items: newItems };
        addLog(`[Inserido] Chave "${key}" inserida na Página ${targetPageIndex + 1} (posição ordenada).`);
      } else {
        // Overlap! Must trigger a PAGE SPLIT
        splitOccurred = true;
        const leftItems = newItems.slice(0, 2);
        const rightItems = newItems.slice(2);

        const pageLeft: Page = {
          id: Math.random().toString(),
          items: leftItems,
          isSplitting: true
        };
        const pageRight: Page = {
          id: Math.random().toString(),
          items: rightItems,
          isSplitting: true
        };

        // Replace old page with two split pages
        updatedPages.splice(targetPageIndex, 1, pageLeft, pageRight);
        addLog(`[💥 Page Split] Página ${targetPageIndex + 1} transbordou! Dividida em duas para acomodar "${key}".`);
      }
    }
    return { pages: updatedPages, splitOccurred };
  };

  // Helper to dynamically adjust page layout based on total page count
  const getPageStyles = (numPages: number) => {
    if (numPages <= 3) {
      return {
        card: "w-40 md:w-44 min-h-[140px] p-3 gap-2",
        header: "text-[10px] pb-1.5",
        itemsGap: "gap-1.5",
        pill: "px-2 py-1.5 text-xs"
      };
    } else if (numPages === 4) {
      return {
        card: "w-32 md:w-36 min-h-[120px] p-2.5 gap-1.5",
        header: "text-[9px] pb-1",
        itemsGap: "gap-1",
        pill: "px-1.5 py-1 text-[11px]"
      };
    } else {
      return {
        card: "w-24 md:w-28 min-h-[100px] p-2 gap-1",
        header: "text-[8px] pb-0.5",
        itemsGap: "gap-0.5",
        pill: "px-1 py-0.5 text-[9px]"
      };
    }
  };

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Reset everything to start the simulation from scratch
    let currentPages: Page[] = [];
    let currentCounter = 0;
    let localSplits = 0;
    let localFrag = 0;

    setPages([]);
    setSplits(0);
    setFragmentation(0);
    setLogs([`Iniciando nova gravação de 15 registros de ${activeTab === "v7" ? "UUID v7 (Time-Ordered)" : "UUID v4 (Aleatório)"}...`]);
    setSequenceCounter(0);

    // Short delay to let the UI visually reset before animating
    await new Promise((r) => setTimeout(r, 300));

    const iterations = 15;
    for (let i = 0; i < iterations; i++) {
      let result;
      if (activeTab === "v7") {
        result = insertV7(currentPages, currentCounter);
        currentCounter = result.counter;
      } else {
        result = insertV4(currentPages);
        if (result.splitOccurred) {
          localSplits++;
          localFrag = Math.min(localFrag + 12, 95);
        }
      }

      currentPages = result.pages;
      setPages(currentPages);
      setSequenceCounter(currentCounter);
      setSplits(localSplits);
      setFragmentation(localFrag);

      // Clean up splitting flags after delay
      setTimeout(() => {
        setPages((prev) => 
          prev.map((p) => p.isSplitting ? { ...p, isSplitting: false } : p)
        );
      }, 400);

      // Slightly faster animation interval since we have more items to insert
      await new Promise((r) => setTimeout(r, 450));
    }

    setIsSimulating(false);
  };

  return (
    <div className="w-full my-8 p-6 md:p-8 bg-zinc-950/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col gap-6 transition-all hover:border-zinc-800">
      
      {/* TABS DE SELEÇÃO */}
      <div className="flex border-b border-zinc-900 pb-3 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => !isSimulating && setActiveTab("v7")}
            disabled={isSimulating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "v7"
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            UUID v7 (Time-Ordered)
          </button>
          <button
            onClick={() => !isSimulating && setActiveTab("v4")}
            disabled={isSimulating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "v4"
                ? "bg-red-950/40 text-red-400 border border-red-800/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            UUID v4 (Aleatório)
          </button>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-all text-white active:scale-95 ${
              isSimulating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiPlay className="text-xs" />
            Inserir Lote
          </button>
          
          <button
            onClick={resetSimulator}
            disabled={isSimulating}
            className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            title="Resetar Árvore"
          >
            <FiRotateCcw className="text-sm" />
          </button>
        </div>
      </div>

      {/* METRICS HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <FiDatabase className="text-base" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Páginas de Disco</div>
            <div className="text-lg font-bold font-mono text-zinc-200">{pages.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${splits > 0 ? "text-red-400" : "text-emerald-400"}`}>
            <FiAlertTriangle className="text-base" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Page Splits</div>
            <div className={`text-lg font-bold font-mono ${splits > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {splits}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">Fragmentação de Disco</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  fragmentation > 50 ? "bg-red-500" : fragmentation > 20 ? "bg-yellow-500" : "bg-emerald-500"
                }`}
                style={{ width: `${fragmentation}%` }}
              />
            </div>
            <span className="text-xs font-bold font-mono text-zinc-400 w-8 text-right">{fragmentation}%</span>
          </div>
        </div>
      </div>

      {/* ÁRVORE B-TREE (SIMULAÇÃO VISUAL PÁGINAS) */}
      <div className="min-h-[220px] p-6 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-wrap gap-4 items-start justify-center overflow-y-auto max-h-[360px]">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[180px] text-zinc-600 font-mono text-xs">
            <FiDatabase className="text-3xl mb-2 text-zinc-800" />
            Nenhum dado gravado. Clique em "Inserir Lote" para simular escritas.
          </div>
        ) : (
          <AnimatePresence>
            {(() => {
              const styles = getPageStyles(pages.length);
              return pages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    x: page.isSplitting ? [0, -8, 8, -6, 6, 0] : 0
                  }}
                  transition={{ 
                    y: { type: "spring", stiffness: 100, damping: 12 },
                    x: { duration: 0.35, ease: "easeInOut" }
                  }}
                  className={`bg-zinc-950 border rounded-xl flex flex-col shadow-lg relative ${styles.card} ${
                    page.isSplitting
                      ? activeTab === "v7" 
                        ? "border-emerald-600 bg-emerald-950/5 shadow-emerald-500/5" 
                        : "border-red-600 bg-red-950/5 shadow-red-500/5"
                      : "border-zinc-850 bg-zinc-950"
                  }`}
                >
                  {/* PAGE HEADER */}
                  <div className={`flex justify-between items-center font-mono text-zinc-500 border-b border-zinc-900 ${styles.header}`}>
                    <span className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${activeTab === "v7" ? "bg-emerald-500" : "bg-red-500"}`} />
                      Pág. {index + 1}
                    </span>
                    <span>{page.items.length}/4</span>
                  </div>

                  {/* ITEMS INSIDE PAGE */}
                  <div className={`flex flex-col flex-1 ${styles.itemsGap} mt-2`}>
                    {page.items.map((item, itemIdx) => (
                      <motion.div
                        key={`${page.id}-${item}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIdx * 0.05 }}
                        className={`font-mono rounded border text-center font-medium ${styles.pill} ${
                          activeTab === "v7"
                            ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-300"
                            : "bg-red-950/20 border-red-900/50 text-red-300"
                        }`}
                      >
                        {activeTab === "v7" ? `v7: ${item.substring(0, 4)}...` : `v4: ${item}`}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ));
            })()}
          </AnimatePresence>
        )}
      </div>

      {/* LOG DE OPERAÇÕES */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
          <FiActivity className="text-zinc-600" />
          Log de Escritas no Banco
        </div>
        <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl overflow-hidden">
          <div className="h-28 p-3 pr-4 font-mono text-xs overflow-y-auto flex flex-col gap-1.5 scrollbar-custom">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`leading-relaxed ${
                  index === 0 
                    ? activeTab === "v7" ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"
                    : "text-zinc-500"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

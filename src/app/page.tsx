"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UuidV7Generator from "@/components/uuid-generator";
import BTreeSimulator from "@/components/btree-simulator";
import UrlDecoder from "@/components/url-decoder";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    // 1. Step 1 -> Step 2: Centered to bottom footer-hero and scale up after 1s
    const introTl = gsap.timeline();
    
    // Determine responsive values
    const isMobile = window.innerWidth < 768;
    const targetY = isMobile ? "22vh" : "28vh";
    const targetScale = isMobile ? 1.3 : 1.8;

    introTl.fromTo(
      textRef.current,
      { y: 0, scale: 1 },
      {
        y: targetY,
        scale: targetScale,
        duration: 1.0,
        delay: 1.0,
        ease: "power3.inOut",
      }
    );

    // 2. Step 2 -> Step 3: Scroll-driven shrink and move to top of article (H1 position)
    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "100vh top", // Entire first viewport scroll duration
        scrub: true,
        pin: textRef.current, // Pin the text relative to the screen during scroll
        pinSpacing: false,
      },
      y: 0, // Align exactly back to natural top flow
      scale: 1, // Reset scale back to H1 size
      ease: "none",
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col overflow-x-clip bg-[#030303]">
      
      {/* HERO SECTION (100vh) */}
      <section className="h-screen w-full flex flex-col justify-between items-center relative overflow-hidden bg-black text-white px-6 z-10 select-none">
        {/* Subtle dark glow */}
        <div className="absolute inset-0 bg-radial-gradient from-zinc-950 via-black to-black opacity-70 pointer-events-none" />
        
        {/* Top-Left metadata */}
        <div className="absolute top-8 left-8 max-w-xs text-xs text-zinc-500 font-sans leading-relaxed">
          A evolução inevitável das chaves primárias. Unindo a unicidade de 128 bits com a ordenação temporal.
        </div>

        {/* Spacer for centered layout */}
        <div className="flex-1" />

        {/* Hero Footer navigation details */}
        <div className="w-full max-w-4xl mx-auto border-t border-zinc-900 py-6 flex justify-between items-center text-[10px] font-mono text-zinc-600">
          <span>INTRODUÇÃO</span>
          <span className="animate-bounce">ROLE PARA LER ↓</span>
          <span>V1.0</span>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pt-16 pb-16 md:px-8 md:pb-24 z-20">
        
        {/* Anchor point where the H1 will settle and continue normal scroll */}
        <header className="flex flex-col border-b border-zinc-900 pb-12 mb-12 relative">
          
          {/* Pinned target title element */}
          <h1 
            ref={textRef} 
            className="font-sans font-extrabold tracking-tighter text-white text-5xl md:text-7xl select-none flex flex-col origin-center"
          >
            UUID v7
            <span className="block text-3xl md:text-4xl text-zinc-500 font-semibold mt-2">
              The New Default.
            </span>
          </h1>

          {/* Spacer height equal to the H1's height to prevent page layout jump */}
          <div className="h-28 md:h-36 pointer-events-none" />

          {/* AUTHOR METADATA */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-sm">
              MB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-200">Mateus Bosquetti</span>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-zinc-500">
                <time dateTime="2026-07-15">15 de Julho, 2026</time>
                <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                <span>Leitura de 8 min</span>
              </div>
            </div>
          </div>
        </header>

        {/* ARTICLE CONTENTS */}
        <article className="space-y-12 text-zinc-300">
          
          {/* SEÇÃO 1: O PROBLEMA */}
          <section className="space-y-6">
            <p className="text-lg leading-relaxed text-zinc-400">
              A primeira coisa ao desenvolvermos uma modelagem de dados de uma tabela é pensar na PK, e por mais que pareça simples, as opções mais escolhidas trazem uma série de problemas inimagináveis.
            </p>
            <p className="text-lg leading-relaxed text-zinc-400">
              Durante décadas, fomos ensinados a usar chaves inteiras auto-incrementais (<code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">BIGINT AUTO_INCREMENT</code>) por serem eficientes e simples. No entanto, no ecossistema moderno de microsserviços, arquiteturas distribuídas e concorrência massiva, essa simplicidade desmorona:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-zinc-400">
              <li>
                <strong className="text-zinc-200 font-medium">Gargalo de Coordenação:</strong> Dois servidores de aplicação diferentes não podem gerar um ID numérico simultaneamente sem consultar um banco de dados centralizado. Isso cria um gargalo inevitável de latência e concorrência na escrita.
              </li>
              <li>
                <strong className="text-zinc-200 font-medium">Vazamento de Métricas de Negócio:</strong> Expor IDs sequenciais na URL (<code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">/pedidos/1004</code>) permite que concorrentes mapeiem sua taxa de vendas ou quantidade de usuários cadastrados simplesmente fazendo duas requisições consecutivas.
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-zinc-400">
              Para resolver isso, muitos desenvolvedores adotaram o <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">UUID v4</code> (IDs de 128 bits gerados aleatoriamente). Embora resolva a descentralização, o UUID v4 traz um problema silencioso e ainda mais perigoso: **a destruição da velocidade de escrita dos índices em árvores B-Tree**, forçando o banco de dados a reordenar páginas físicas no disco a cada nova inserção.
            </p>
          </section>

          {/* SEÇÃO 2: A SOLUÇÃO */}
          <section className="space-y-6 pt-8 border-t border-zinc-900">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              02. A Solução: UUID v7
            </h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              O melhor dos dois mundos. O UUID v7 une a unicidade universal de 128 bits com a ordenação temporal (Time-Ordered), sendo hoje suportado nativamente por diversos bancos de dados modernos.
            </p>
            <p className="text-lg leading-relaxed text-zinc-400">
              O UUID v7 codifica a data e hora atual (Unix epoch em milissegundos) em seus primeiros 48 bits, seguidos por bits fixos de versão e variante, e finalizando com 74 bits de entropia aleatória. Isso significa que, lexicograficamente, os IDs gerados cronologicamente serão sempre sequenciais.
            </p>

            {/* GERADOR & RAIO-X INTERATIVO */}
            <UuidV7Generator />
          </section>

          {/* SEÇÃO 3: FUNCIONAMENTO & PERFORMANCE */}
          <section className="space-y-6 pt-8 border-t border-zinc-900">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              03. Performance no Banco: B-Tree
            </h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              Por que a ordenação temporal importa tanto para o banco de dados? A maioria dos bancos de dados relacionais (PostgreSQL, MySQL, SQL Server) organiza suas chaves primárias em estruturas de dados chamadas **B-Trees** (Árvores B).
            </p>
            <p className="text-lg leading-relaxed text-zinc-400">
              Quando você insere um registro com UUID v4 (totalmente aleatório), o banco tenta inseri-lo em um local aleatório no meio do índice. Se o bloco (página de disco) correspondente já estiver cheio, o banco é forçado a dividir a página física ao meio para abrir espaço (<strong className="text-zinc-200 font-medium">Page Split</strong>). Isso resulta em I/O de disco pesado, fragmentação e degradação drástica da performance conforme a tabela cresce.
            </p>
            <p className="text-lg leading-relaxed text-zinc-400">
              Com o UUID v7, como os primeiros bits são baseados no tempo incremental, cada nova chave inserida é naturalmente maior que a anterior. O banco de dados insere os novos registros sempre no final da estrutura do índice, de forma linear e ordenada, com **zero quebra de páginas**.
            </p>

            {/* SIMULADOR DE B-TREE */}
            <BTreeSimulator />
          </section>

          {/* SEÇÃO 4: CONTRAS & TRADE-OFFS */}
          <section className="space-y-6 pt-8 border-t border-zinc-900">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              04. Contras e o Risco de Privacidade
            </h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              Nenhuma escolha de arquitetura vem de graça. O UUID v7 apresenta desvantagens objetivas que você deve levar em conta antes de adotá-lo:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-zinc-400">
              <li>
                <strong className="text-zinc-200 font-medium">Espaço em Disco e Cache:</strong> Um UUID v7 ocupa **16 bytes**, enquanto um ID numérico sequencial (`BIGINT`) consome apenas **8 bytes**. Em bancos de dados gigantescos, esse dobro de tamanho se propaga por todas as chaves estrangeiras (`FKs`) e índices secundários, exigindo mais memória RAM para manter os índices em cache.
              </li>
              <li>
                <strong className="text-zinc-200 font-medium">Dificuldade de Debug em Testes:</strong> Em logs ou scripts de testes unitários rápidos, ler e rastrear visualmente registros relacionados é muito mais prático e simples com IDs simples como <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">ID: 1</code>, <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">ID: 2</code> do que chaves de 36 caracteres hexadecimais.
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-zinc-400">
              O contra mais grave, contudo, é a **Vazamento de Privacidade Temporal (Metadata Leak)**. Como os primeiros 48 bits do UUID v7 representam a data de criação, qualquer usuário que tenha acesso ao ID exposto publicamente na URL pode descobrir o milissegundo exato em que aquele recurso foi criado.
            </p>

            {/* DECODIFICADOR DE URL E PRIVACIDADE */}
            <UrlDecoder />
          </section>

          {/* SEÇÃO 5: QUAL ESCOLHER */}
          <section className="space-y-6 pt-8 border-t border-zinc-900">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              05. Qual Chave Escolher?
            </h2>
            <p className="text-lg leading-relaxed text-zinc-400 font-sans">
              A resposta curta e sem enrolação é: **na esmagadora maioria dos sistemas distribuídos, microsserviços e aplicações web modernas, o UUID v7 será bem-vindo e deve ser o seu padrão.**
            </p>
            <p className="text-lg leading-relaxed text-zinc-400 font-sans">
              Use chaves inteiras auto-incrementais apenas para tabelas puramente internas onde o armazenamento é crítico e a legibilidade no desenvolvimento local é prioritária. Evite o UUID v4 inteiramente para chaves primárias, a menos que você precise ocultar 100% da data de criação da chave por questões rígidas de privacidade.
            </p>
          </section>

        </article>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-zinc-900 bg-[#060606] z-30">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase font-mono">
            UUID V7 vs Outros IDs
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
            <span>mateusbosquetti123@gmail.com</span>
            <a
              href="https://www.linkedin.com/in/mateus-bosquetti/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/mateusbosquetti"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

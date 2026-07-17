# Especificação da Animação de Introdução (Hero Intro)

Esta especificação define o comportamento visual, cronograma de animações e integração de rolagem para a abertura triunfal do artigo **"UUID V7 The New Default."**

---

## 📋 Estados da Animação

### 1. Estado Inicial: Centralizado (Step 1)
*   **Visual:** Tela inteira preta (`bg-[#030303]`). O texto **"UUID V7 The New Default."** está posicionado no centro absoluto do viewport (horizontal e vertical).
*   **Tipografia:** Fonte `Inter`, peso `Extra Bold` (`font-extrabold`), cor branca (`text-zinc-100`), estilo minimalista sem serifa.
*   **Tamanho do Texto:** Médio/Grande (ex: `text-3xl md:text-5xl`).
*   **Duração:** Mantém-se centralizado por exatamente **1 segundo** após o carregamento inicial da página (`onload`).

### 2. Estado de Transição: Rodapé da Hero (Step 2)
*   **Gatilho:** Disparado automaticamente após o atraso de 1 segundo.
*   **Movimento:** O texto transiciona suavemente do centro para a base do viewport (Footer da Hero Section).
*   **Escala:** O texto sofre um aumento de escala massivo (ex: `text-6xl md:text-9xl`), assentando-se rente ao rodapé da seção inicial (`100vh`).
*   **Background:** Permanece na cor preta (`bg-[#030303]`).
*   **Duração da Transição:** Transição suave de **800ms** utilizando uma curva de aceleração suave (`ease-out` ou `power2.out`).

### 3. Integração com Scroll: Título do Artigo (Step 3)
*   **Gatilho:** Rolagem da página pelo usuário (Scroll físico).
*   **Mecânica (GSAP ScrollTrigger):** 
    *   A Hero Section de `100vh` desliza para cima na rolagem fluida contínua.
    *   À medida que a página é scrollada, o texto gigante no rodapé da Hero encolhe e se desloca proporcionalmente para cima.
    *   **Ponto de Destino:** O texto se encaixa perfeitamente como o cabeçalho `<h1>` principal que inicia a leitura do artigo na Seção 1.
*   **Efeito:** Conexão contínua entre a introdução cinemática e o início real da leitura do artigo técnico.

---

## 🛠️ Detalhes de Implementação Recomendados

### CSS e Estrutura DOM
```tsx
// Exemplo de estrutura conceitual
<div className="relative min-h-screen">
  {/* Hero Section Container */}
  <section className="h-screen w-full flex flex-col justify-between items-center relative overflow-hidden bg-black">
    {/* Elemento de texto animado */}
    <div id="intro-text" className="font-sans font-extrabold tracking-tight text-white z-20">
      UUID V7 The New Default.
    </div>
  </section>

  {/* Conteúdo do Artigo */}
  <main className="max-w-4xl mx-auto px-6 py-20">
    <div id="article-title-anchor" className="h-20 w-full" /> {/* Âncora destino */}
    ...
  </main>
</div>
```

### Script de Animação (GSAP + ScrollTrigger)
1.  **Entrada (Step 1 -> Step 2):**
    ```javascript
    gsap.fromTo("#intro-text", 
      { scale: 1, yPercent: 0 }, 
      { scale: 2.2, y: "35vh", duration: 0.8, delay: 1.0, ease: "power2.out" }
    );
    ```
2.  **Scroll (Step 2 -> Step 3):**
    ```javascript
    gsap.to("#intro-text", {
      scrollTrigger: {
        trigger: "main",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
      scale: 1,
      y: "120vh", // Deslocamento calculado para bater com a âncora
      ease: "none"
    });
    ```

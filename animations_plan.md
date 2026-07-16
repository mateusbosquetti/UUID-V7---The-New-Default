# Planejamento de Animações Gerais (GSAP)

Este documento registra as decisões de animações gerais e globais para a página do UUID v7.

---

## 🌪️ Animações Planejadas

### 1. Rolagem Suave (GSAP ScrollSmoother)
*   **Descrição:** Aplica uma rolagem suavizada com inércia em toda a página.
*   **Comportamento:** Ao rodar o scroll do mouse ou arrastar no trackpad, a tela rola de forma amortecida, imitando o comportamento de rolagem física (smooth inertia scroll).
*   **Implementação:** Configurado globalmente no `layout.tsx` envolvendo a árvore de componentes principal em containers de wrapper e content exigidos pelo ScrollSmoother.

### 2. Abertura Triunfal no Hero (GSAP ScrollTrigger - Pinning)
*   **Descrição:** Sequência cinemática de introdução ativada pela rolagem no topo da página.
*   **Comportamento:**
    1. A página carrega com fundo preto total e o texto `UUID v7` gigante e centralizado.
    2. O scroll do leitor fica travado (pinned). Conforme ele rola o mouse, o texto `UUID v7` diminui e se move para a esquerda.
    3. Ao mesmo tempo, o complemento `The New Default.` entra da direita e se alinha com o título principal.
    4. Ao concluir a junção do título, a página destrava e o artigo desliza para cima com fade-in, enquanto o cabeçalho se fixa no topo da tela.

### 3. Revelação de Texto (GSAP ScrollTrigger - Text Scrubbing)
*   **Descrição:** Efeito de foco e leitura dinâmica.
*   **Comportamento:** Os parágrafos conceituais importantes iniciam com opacidade reduzida (cinza escuro). Conforme o usuário rola o scroll, as palavras ou linhas vão clareando (acendendo em branco puro) na altura do meio da tela, mantendo o foco visual na frase que está sendo lida no momento.

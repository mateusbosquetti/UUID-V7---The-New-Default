# Especificação Detalhada dos 3 Widgets Interativos

Este documento detalha o design, funcionamento, lógica e objetivos de negócio para cada um dos três widgets interativos da página do UUID v7.

---

## 🟣 Widget 1: Gerador & Raio-X de UUID v7

### 1. Objetivo
Demonstrar a anatomia física de um UUID v7, explicando de forma visual como o timestamp e a aleatoriedade se dividem nos 128 bits da chave.

### 2. Design e Layout
- **Container:** Card com fundo translúcido (Glassmorphism: `bg-zinc-900/40 backdrop-blur-md border border-zinc-800`), cantos arredondados (`rounded-2xl`).
- **Área do UUID:** Uma caixa central destacada com fonte mono grande (`font-mono text-2xl md:text-3xl`).
- **Cores dos Blocos (Raio-X):**
  - `Timestamp (48 bits / Roxo Neon)`: Primeiros 12 caracteres hexadecimais (ex: `0190b4d2-f125`).
  - `Versão (4 bits / Verde Esmeralda)`: O 13º caractere (sempre `7`).
  - `Aleatoriedade (74 bits / Laranja Neon)`: Bits de entropia divididos em duas partes pela versão e variante.
  - `Variante (2 bits / Azul Ciano)`: O 17º caractere (geralmente `8`, `9`, `a` ou `b`).
- **Painel de Controle:**
  - Um botão principal de ação "Gerar UUID v7" (gradiente violeta/indigo).
  - Um campo de entrada (input text) "Colar outro UUID para analisar...".

### 3. Funcionamento (Lógica)
- **Geração:** Ao clicar em "Gerar UUID v7", o componente gera uma nova chave válida em JavaScript (usando `crypto.getRandomValues`).
- **Tradutor de Timestamp:** O sistema converte a seção de tempo do ID atual em milissegundos e exibe abaixo a data e fração de segundo exata de criação em formato legível (ex: `15/07/2026 às 21:22:46.125 UTC`).
- **Decodificador Inteligente:** O usuário pode colar qualquer UUID v7 externo no input para decodificar seu timestamp correspondente instantaneamente.

### 4. Animações e Micro-interações
- **GSAP Scramble Effect:** As letras da seção de entropia (laranja) embaralham rapidamente antes de fixar o valor gerado.
- **Destaque Dinâmico:** Passar o mouse (hover) sobre uma seção colorida do UUID faz com que ela brilhe mais intensamente e seu respectivo card de legenda abaixo se expanda com sombra colorida, enquanto os outros cards apagam levemente.

---

## 🟢 Widget 2: Simulador de B-Tree (Postgres Index)

### 1. Objetivo
Provar visualmente como o UUID v4 degrada a performance de escrita em bancos de dados relacionais ao causar divisões de páginas (*page splits*) e fragmentação física no disco, enquanto o UUID v7 mantém a escrita linear estável.

### 2. Design e Layout (Ajuste de Responsividade e Espaço)
- **Interface baseada em Abas (Tabs):** Devido ao padding de leitura do artigo e restrição de espaço lateral, o simulador usará duas abas alternáveis:
  - **Aba 1: UUID v7 (Time-Ordered)** - Foco na eficiência e escrita sequencial.
  - **Aba 2: UUID v4 (Random)** - Foco no caos das inserções aleatórias.
- **HUD de Performance:**
  - Contador numérico digital: `Page Splits ocorridos`.
  - Gráfico de barra dinâmica: `Fragmentação de Disco (0% a 100%)`.
- **Representação Visual:**
  - Caixas retangulares escuras representando "Páginas do Banco" (capacidade máxima de 4 chaves por página).
  - Nós representados por pílulas simplificadas com o valor do ID ordenados dentro de cada página.

### 3. Funcionamento (Lógica)
- **Ação:** O usuário clica em "Simular Escrita (Inserir 10 IDs)".
- **Na Aba UUID v7:** Os nós gerados entram em ordem sequencial de tempo e preenchem as caixas de forma linear (Append-only). Quando uma caixa enche, uma nova surge à direita de forma limpa. `Page Splits` e `Fragmentação` se mantêm em 0.
- **Na Aba UUID v4:** Os nós entram em posições aleatórias da estrutura para manter a ordem do índice. Se tentam entrar em um bloco cheio, disparam a quebra da página.

### 4. Animações e Micro-interações
- **Animação do Page Split (GSAP):** A caixa alvo vibra fortemente (shake), pisca em vermelho e se divide fisicamente ao meio com uma rachadura brilhante. Duas caixas novas se formam e os nós se redistribuem deslizando com efeito elástico. A barra de fragmentação avança e muda de cor (verde -> amarelo -> vermelho).

---

## 🟠 Widget 3: Fake Browser & URL Decoder (Redesign)

### 1. Objetivo
Demonstrar na prática o risco de vazamento de privacidade temporal (Metadata Leak) contido em qualquer UUID v7 público na URL de um recurso do sistema.

### 2. Design e Layout
- **Barra de Endereços Superior (100% de largura):** Um cabeçalho de navegador simulado que se estende por toda a largura do widget, contendo a URL: `https://socialnetwork.com/u/0190b4d2-f125-7b5a-93a8-429be9752f40`.
- **Layout Inferior Dividido (50% / 50% de largura):**
  - **Lado Esquerdo (O Espião / Olho Cyberpunk):** Exibe um olho digital estilizado em SVG com temática cyberpunk. Ele pulsa e pisca sutilmente em estado de espera (standby). Possui um botão de ação integrado "Espionar Perfil".
  - **Lado Direito (O Conversor de Metadados):** Um painel de análise tecnológica que aguarda a captura dos bits do ID.

### 3. Funcionamento (Lógica)
- **Ação:** O usuário clica no botão "Espionar Perfil".
- **O Scanner:** O olho cyberpunk se ativa, abre sua pupila digital e emite uma projeção vertical de laser que sobe até a barra de endereços superior, varrendo-a lateralmente duas vezes.
- **A Extração:** O trecho de tempo `0190b4d2-f125` na URL brilha e se "descola", flutuando pelo ar até cair no painel do conversor.
- **A Revelação:** O conversor decodifica os 48 bits e revela de forma agnóstica o momento exato em que aquele perfil de usuário foi gerado no banco de dados.

### 4. Animações e Micro-interações
- **GSAP / Framer Motion:**
  - Animação do olho SVG (abertura de pupila, feixe de luz).
  - Linha laser varrendo a URL na horizontal.
  - Partícula de texto flutuante viajando em trajetória curva até o conversor.
  - Contador do conversor girando rapidamente até congelar na data final (`15 de Julho de 2024 às 15:13:24.901`).

---
name: mock-skill
description: Exemplo de skill local criada no projeto para demonstração de uso.
---

# Mock Skill

Esta é uma skill de exemplo criada no diretório correto do projeto para detecção do Antigravity.

## 📂 Estrutura de Pastas de uma Skill

Para criar uma nova skill detectável pelo Antigravity, ela deve seguir esta estrutura:

```text
<projeto-root>/.agents/skills/
  └── seu-nome-de-skill/
      ├── SKILL.md          <-- Arquivo de instruções principal (Obrigatório)
      ├── scripts/          <-- Scripts auxiliares se necessário (Opcional)
      └── resources/        <-- Recursos ou templates extras (Opcional)
```

## 📝 Regras do SKILL.md

1. **Frontmatter YAML (Obrigatório):** O arquivo deve começar com blocos YAML delimitados por `---` contendo:
   - `name`: Nome identificador único da skill (letras minúsculas e hífens).
   - `description`: Breve resumo explicando quando o agente deve usar esta skill.
2. **Markdown:** O restante do arquivo deve conter as instruções detalhadas, referências ou guias de desenvolvimento.

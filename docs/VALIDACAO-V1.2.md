# Validação V1.2

## Base e preservação

- Branch: `feat/barbearia-exemplo-v1-2`, baseada na V1.1 (`7923e0a`).
- `main` observada no início: `87a5e39` (merge da V1). A V1.1 ainda não estava integrada.
- Nenhum arquivo original de `assets/` modificado ou removido. Derivados são gerados em `dist/`.
- Sem nova fotografia, sem IA, sem reconstrução do layout e sem sistema público de avaliações.

## Verificações executadas

- `npm ci --no-fund`: instalação reproduzível concluída.
- `npm run build`: geração estática, formatos modernos, imagem OG e ícones concluída.
- `npm test`: validação de configuração e 20 cenários de navegador (modelo, completo, demo com contato, mínimo e inválido × 375/390/768/1280px).
- Teclado, foco visível, menu, links internos, mensagens WhatsApp, normalização, botões seguros, avaliações fracionadas, demo, metadados no HTML, robots/sitemap, imagens e fallback sem JS verificados.
- Axe-core WCAG A/AA e contraste: nenhuma violação nos 20 cenários.
- Sem erros JavaScript, 404 ou overflow nos cenários testados.
- Inspeção visual de screenshots nas quatro larguras.
- Imagem social conferida: 1200×630; ícones PNG: 180×180, 192×192 e 512×512.
- `git diff --check`, verificação de sintaxe e comparação dos originais passaram.

## Lighthouse mobile local

Medições reais no Chromium do ambiente, Lighthouse 12.8.2, perfil mobile padrão com throttling simulado, servidor local. Uma execução por cenário após a correção de estabilidade de layout; não são PageSpeed de uma URL pública nem garantia de desempenho futuro.

| Cenário | Performance | Acessibilidade | Boas práticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| V1.1 anterior | 100 | 100 | 100 | 100 |
| V1.2 demo padrão | 100 | 100 | 100 | 66 |
| V1.2 modo cliente, sem noindex | 100 | 100 | 100 | 100 |

O SEO 66 na demonstração resulta do bloqueio de indexação solicitado. O modo cliente medido usa uma cópia local da configuração com demo desligado; não representa publicação de uma barbearia real. Uma primeira medição detectou CLS causado pela aplicação tardia da classe de menu; a correção move a ativação para antes do CSS. Nas medições finais, CLS foi 0 em todos os cenários. LCP simulado: V1.1 1,13s; V1.2 demo 1,20s; cliente 1,35s, sujeito a variação do ambiente. O ganho comprovado está nos bytes das imagens, sem alegação de aumento da pontuação que já era 100.

Relatórios JSON/HTML em `/tmp/barbearia-audits`; screenshots em `/tmp/barbearia-v12-screenshots`. São artefatos temporários da execução. Os scripts permitem repetir os testes. Não foram enviados para a pasta pública do site.

## Imagem preservada e otimização

Original JPEG 1536×1024: 266.302 bytes. Na mesma largura: WebP 123.650 bytes, AVIF 66.917 bytes. Os derivados menores e respectivas medidas estão no README e em `dist/image-report.json`. Arquivo OG é um recorte com texto do hero original, não uma fotografia nova.

## Limites e preparação de produção

- Domínio oficial não fornecido: canonical, URLs sociais absolutas e entradas de sitemap são omitidos com aviso; a configuração completa de teste comprova sua geração quando existe URL HTTPS.
- Número comercial, endereço, fonte de avaliações e contato de desenvolvedor não fornecidos: nenhum contato funcional, mapa ou avaliação é inventado.
- Mapa de teste interceptado localmente: disponibilidade de mapa externo real não foi medida.
- Titularidade do WhatsApp, autenticidade das avaliações, dados comerciais, domínio, DNS e privacidade exigem conferência humana.
- A origem da imagem está documentada; substituir por fotografias reais autorizadas antes da entrega comercial.
- O Pages precisa de comando `npm run build` e saída `dist`. Nenhuma configuração remota ou deploy em produção foi alterado.
- Auditoria com leitor de tela e PageSpeed da URL final permanecem como verificações de entrega após publicação autorizada.

## Arquivos desta versão

Modificados: `.gitignore`, `README.md`, `config.js`, `index.html`, `script.js`, `styles.css`, `tests/smoke.cjs`.

Criados: `.node-version`, `package.json`, `package-lock.json`, `wrangler.jsonc`, `scripts/config.cjs`, `scripts/build.cjs`, `scripts/serve.cjs`, `scripts/audit.cjs`, `tests/config.cjs`, `docs/VALIDACAO-V1.2.md`, `docs/PULL_REQUEST_V1.2.md`.

Removidos: nenhum arquivo fonte ou imagem original. Artefatos de publicação (HTML, robots, sitemap, manifest, headers, imagens otimizadas, OG e ícones) são gerados em `dist/` e não são versionados.

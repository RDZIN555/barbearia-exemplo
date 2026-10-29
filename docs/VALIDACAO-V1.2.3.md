# V1.2.3 — auditoria concluída; galeria pendente

Branch `feat/barbearia-exemplo-v1-2`, sobre V1.2.2 (`eb80f0b`). Nenhuma reconstrução, merge ou deploy direto em produção. Esta etapa **não atende ainda ao critério final de quatro fotos verificadas**.

## Implementado

- Sharp 0.34.5 → 0.35.5; Lighthouse 12.8.2 → 13.6.0, com justificativa e avisos em [SEGURANCA-V1.2.3.md](SEGURANCA-V1.2.3.md).
- Node mínimo 22.19 para a ferramenta de auditoria corrigida, sem mudar a linha 22 configurada no ambiente.
- Cache de imagens e OG com assinatura Sharp/libvips, obrigando regeneração quando o motor muda.
- Teste de teclado aguarda a navegação da âncora antes de conferir a URL, evitando uma corrida de eventos; a verificação funcional foi preservada.
- Fontes Pexels fornecidas pelo proprietário registradas sem inventar licença confirmada ou arquivo físico ausente.
- Guia Windows atualizado com o sucesso manual informado pelo proprietário; nenhum teste com número pessoal repetido.

## Preservado

Hero/original, galeria atual, CSS, JS público, favicon B, logotipo do cabeçalho, preços, botões e faixa de valores. Mensagens genéricas/por serviço e contato público comparados ao commit anterior: idênticos, sem imprimir valores. Modo privado, Git ignore e configuração do Cloudflare sem mudanças funcionais.

Nenhum arquivo pessoal foi lido, solicitado ou incluído no commit. A configuração privada continua ignorada, excluída da produção e coberta por comparação dos bytes da saída.

## Resultados reais

- Instalação em cópia limpa com `npm ci --include=dev`, seguida de `npm run build`: status 0; dist/index.html, imagens, CSS/JS, SEO, manifest, ícones e recursos conferidos pelo verificador.
- `npm test` na cópia limpa: status 0. 36 cenários públicos + seis privados, nas larguras 375/390/768/1280/1440/1920px, além das validações unitárias.
- Público: teclado/foco/menu, links, alinhamento, três valores, WhatsApp com/sem número, avaliações manuais 4,0/4,5 e ausentes, demo, configuração mínima, SEO e carregamento aprovados. Sem erros JS, 404, overflow ou violações axe/contraste nos cenários executados.
- Privado: links/mensagens, nova aba sem opener, flutuante móvel, comparação byte a byte de dist com/sem configuração pessoal sintética, ausência do contato em artefatos/logs, ignore, override bloqueado, loopback e Host/Origin/cross-site aprovados. Nenhuma mensagem enviada; navegações wa.me interceptadas. Fixtures apagadas.
- `npm audit`: antes 30 alertas (19 moderados e 11 altos), depois 0. `npm audit --omit=dev`: 0 antes/depois. Auditoria pontual, sem garantia sobre vulnerabilidades futuras.
- Lighthouse 13.6.0 mobile local, modo demo: Performance 100, Acessibilidade 100, Boas práticas 100, SEO 66. Sem warnings. SEO reduzido intencionalmente pelo noindex. Não é PageSpeed de produção nem validação da galeria ainda incompleta.
- Capturas das seis larguras inspecionadas em arquivos compactos. O layout foi mantido; a galeria atual carrega, mas a galeria de quatro fotos **não foi validada** porque os novos arquivos não foram incorporados.
- Original JPEG preservado: 266.302 bytes. Derivados na largura 1536: WebP 123.650, AVIF 64.228 bytes com o motor atualizado.
- Sintaxe e git diff --check aprovados. Mensagens/contato público e arquivos visuais originais comparados ao commit anterior.

## Bloqueios reais da galeria

As fotos apareceram inline na conversa, mas não foram localizadas como arquivos baixáveis no executor. As páginas e o CDN do Pexels retornaram HTTP 403 no proxy, impedindo baixar originais, conferir correspondência e ler a licença oficial. Não foram geradas fotos com IA, reconstruídos pixels ou criados arquivos fictícios.

Fontes/autores informados, restrições e próximos passos: [FONTES-FOTOGRAFIAS-V1.2.3.md](FONTES-FOTOGRAFIAS-V1.2.3.md). A rede necessária foi salva no rascunho do ambiente, mas não ativada automaticamente. Faltam as três fotos verificadas para completar quatro; não aprovar como galeria concluída antes dessa etapa.

## Arquivos

Modificados: README.md, config.js (somente versão no comentário), package.json, package-lock.json, scripts/build.cjs, tests/smoke.cjs, docs/DEPLOY-CLOUDFLARE.md, docs/TESTE-PRIVADO-WINDOWS.md e docs/PULL_REQUEST_V1.2.md.

Criados: docs/SEGURANCA-V1.2.3.md, docs/FONTES-FOTOGRAFIAS-V1.2.3.md e docs/VALIDACAO-V1.2.3.md.

Nenhuma fotografia adicionada/removida, nenhuma mensagem aprovada modificada e nenhum arquivo privado versionado. Não há mudanças de layout ou configuração remota do Cloudflare. Arquivos de publicação seguem gerados em dist e ignorados pelo Git.

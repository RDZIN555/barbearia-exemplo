# Barbearia Exemplo V1.2.2 — acabamento visual e teste local privado

Preserva o site e as melhorias V1.1/V1.2/V1.2.1, com build estático, configuração comercial, SEO no HTML, avaliações exclusivamente manuais e verificação dos artefatos. O acabamento harmoniza o WhatsApp com a identidade premium e permite testar um contato pessoal apenas no computador do proprietário.

- Botões de serviço dourados com ícone preto; faixa dourada com botão preto e texto legível. Só o flutuante móvel permanece verde, com foco, hover, mensagens e resposta sem número preservados.
- Contêineres e hero alinhados em 1280/1440/1920, conteúdo até 1440px, imagem principal full width e sem distorção. Cards/preços maiores, textos de contato e faixa de valores refinados sem reconstrução.
- Favicon B vetorial com pequena estrela, PNGs 16/32/48 e ícones relacionados gerados, sem dependência de fonte para B. Cabeçalho preservado.
- Modo privado: config.private.json ignorado pelo Git, exemplo vazio e npm run preview:private. Servidor somente em loopback, injeção de contato em memória, cache desativado e restrições de Host/Origin/cross-site; nenhum dado pessoal em dist ou no config.js público.
- O build de publicação continua npm ci --include=dev && npm run build, saída dist, e recusa override privado para essa saída. Nenhuma configuração do Cloudflare ou deploy direto em produção foi alterado.

**Galeria:** fontes consultadas continuam bloqueadas por HTTP 403. Nenhuma fotografia nova foi adicionada sem autorização ou gerada por IA. Original e hero preservados; uma foto única exibida, estrutura para quatro. Faltam três fotografias distintas autorizadas. A licença MIT do ícone WhatsApp continua incluída.

**Privacidade e entrega:** nenhum número pessoal foi fornecido/solicitado nesta tarefa; testes usam somente fixtures sintéticas temporárias e wa.me interceptado. O guia docs/TESTE-PRIVADO-WINDOWS.md explica o uso do próprio número apenas localmente, sem GitHub/Cloudflare, e sua remoção. Windows real e deploy remoto não foram executados; não confundir prévia pública com ambiente privado.

Validação e lista de arquivos: docs/VALIDACAO-V1.2.2.md. Testes públicos nas seis larguras com menu, foco, contraste/axe, valores, alinhamento, galeria, avaliações, SEO e ausência de erros/404/overflow. Testes privados com comparação de todos os bytes de dist, ausência do contato em artefatos/logs, ignore, override de produção, HTTP local e navegação segura por mensagem genérica/serviço/flutuante.

A branch inclui V1.1/V1.2 ainda não integradas à main observada anteriormente. Conferir a base no GitHub antes de aprovar a integração. Sem nova branch, merge automático ou publicação direta em produção.

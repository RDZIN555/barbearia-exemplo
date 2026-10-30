# Barbearia Exemplo V1.2.2 — acabamento e teste privado

Branch: `feat/barbearia-exemplo-v1-2`, sobre V1.2.1 (`cd24a39`), sem recriação do site ou alteração direta da main.

## Acabamento

- Cards: WhatsApp dourado/preto, com SVG, contraste, foco e feedback preservados. Preços maiores no desktop e cards com melhor aproveitamento de largura.
- Faixa dourada: botão preto, texto escuro com contraste alto, descrições e notas de tamanho maior.
- Somente o flutuante móvel permanece verde. Continua a sair de cena sobre textos e controles, agora incluindo a faixa de valores.
- Cabeçalho, hero e seções usam a mesma referência horizontal no desktop, com conteúdo de até 1440px e margens iguais. Hero e sua foto continuam em largura total, sem distorção de aspecto.
- Espaçamento superior do hero ajustado moderadamente, sem alterar texto ou tipografia.
- Três valores legíveis; no mobile recebem linhas próprias para evitar cortes.
- Favicon B vetorial com estrela dourada e fundo preto, sem dependência de fontes para B. SVG, PNGs 16/32/48, ícones 180/192/512 e manifest atualizados pelo build. Links com versão de conteúdo para cache. Logotipo do cabeçalho preservado.

## Galeria

Unsplash CDN e Wikimedia Commons voltaram a retornar HTTP 403 no proxy desta tarefa. Não foram obtidas fotos com autorização verificável, nem geradas novas fotografias por IA. O original e o hero permanecem idênticos; a galeria tem uma imagem única e segue pronta para até quatro. **Faltam exatamente três fotografias distintas autorizadas.** Nenhuma fotografia ou nova licença de fotografia foi adicionada. A licença MIT do ícone WhatsApp já existente continua distribuída.

## Teste pessoal privado

- `config.private.example.json` é versionado com campo vazio. `config.private.json` é ignorado pelo Git; nenhum número pessoal foi solicitado ou usado nesta tarefa.
- `npm run preview:private` executa o build público e depois serve somente 127.0.0.1:8788. O número local substitui os links apenas em uma resposta em memória/navegador, não em dist.
- Endpoint temporário aleatório, cache no-store, Host/Origin restritos e bloqueio cross-site. O CLI recusa execução no Cloudflare Pages; nenhuma autenticação fictícia ou prévia pública foi chamada de privada.
- O build de publicação não lê a configuração privada, bloqueia --config alternativo para dist e exclui o arquivo privado da cópia de recursos.
- A prévia não registra o número nem o conteúdo de JSON inválido. Não há arquivo JS privado em disco, pedido de número no GitHub ou alteração do config.js público para teste pessoal.
- Guia Windows: [TESTE-PRIVADO-WINDOWS.md](TESTE-PRIVADO-WINDOWS.md), com instalação, arquivo local, comando PowerShell, checagem de mensagens e remoção após Ctrl+C.
- O modo privado foi exercitado no ambiente Linux com Chromium e dados sintéticos temporários, com wa.me interceptado. Não houve sessão Windows real disponível; o procedimento Windows ainda precisa do teste manual do proprietário.

## Testes e limites

A validação abrange as larguras 375, 390, 768, 1280, 1440 e 1920px. A suíte pública tem seis configurações (modelo, completa, demo, mínima, inválida e nota 4,0), além da suíte privada. As seções de avaliações continuam exclusivamente manuais, sem formulário ou endpoint público.

As capturas estão em `/tmp/barbearia-v122-screenshots`; exemplos de favicon renderizados em 16/32/48 foram inspecionados. Artefatos de teste privados são temporários e apagados automaticamente. Nenhuma nova nota Lighthouse/PageSpeed é declarada nesta versão. Deploy remoto/Windows real não são resultados destes testes.

## Arquivos

Modificados: `.gitignore`, `config.js`, `package.json`, `package-lock.json`, `scripts/build.cjs`, `script.js`, `styles.css`, `tests/config.cjs`, `tests/smoke.cjs`, `README.md`, `docs/PULL_REQUEST_V1.2.md`.

Criados: `config.private.example.json`, `scripts/private-preview.cjs`, `scripts/brand-icon.cjs`, `tests/private-preview.cjs`, `docs/TESTE-PRIVADO-WINDOWS.md`, `docs/VALIDACAO-V1.2.2.md`.

Não removidos/alterados: fotografias originais, SVG original de fallback, template HTML e logotipo do cabeçalho. Não alterados: wrangler.jsonc, .node-version e comando de build/publicação. Os novos ícones são artefatos gerados em dist, não novas fotografias.

## Resultados executados

- `npm ci --include=dev && npm run build` em cópia limpa, sem dist ou node_modules: status 0. A saída e referências locais passaram no verificador de publicação.
- Suíte final em cópia limpa: status 0; 36 cenários públicos e seis privados, cobrindo 375/390/768/1280/1440/1920px. Validações unitárias de configuração, galeria e B vetorial também passaram.
- Alinhamento entre hero/serviços e margens iguais validado em 1280/1440/1920; seis capturas de layout inspecionadas visualmente. Valores sem cortes e hero em largura total.
- Público: menu/teclado/foco, WhatsApp com/sem número, mensagens por serviço, avaliações 4,0/4,5 e ausentes, demo/mínimo, SEO, imagens e recursos aprovados. Sem JS errors, 404, overflow ou violações axe/contraste nos cenários executados.
- Privado: mensagem geral, serviço e flutuante móveis testados com abertura real de nova aba, wa.me interceptado e opener nulo, sem enviar mensagens.
- Produção gerada com e sem arquivo privado permaneceu idêntica em todos os bytes. O contato sintético não apareceu em nenhum arquivo de dist nem nos logs. Cópia acidental do arquivo privado sob assets também foi excluída. Override privado para dist foi recusado antes da geração.
- Git ignore e exemplo vazio, HTTP em loopback, rejeição de Host/Origin externos e cross-site, não exposição do JSON local e cache no-store: aprovados. Fixtures privadas apagadas ao encerrar os testes.
- PNGs 16/32/48 confirmados nas dimensões corretas e inspecionados em montagem ampliada; SVG B não contém dependência de texto/fonte.
- Sintaxe e git diff --check aprovados. Originais, cabeçalho/template, configuração do Cloudflare e .node-version preservados.

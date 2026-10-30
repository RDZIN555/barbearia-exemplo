# V1.2.1 — auditoria funcional e limites

Branch exclusiva: `feat/barbearia-exemplo-v1-2`, a partir da correção de deploy `a30c723`. Sem nova branch, merge ou alteração direta de main.

## Galeria e licenças

Nenhuma fotografia foi adicionada: Unsplash (CDN), Wikimedia Commons (API) e Wikimedia (arquivos) retornaram HTTP 403 no proxy. Não houve geração de fotografias com IA nem uso de material sem licença verificável. Foi aplicada a alternativa explicitamente autorizada no pedido.

O original `assets/barbearia.jpg` e o hero são preservados byte a byte. A segunda entrada que reutilizava a mesma foto foi retirada da configuração; a seção de galeria permanece com uma imagem única, em largura completa. A grade está pronta para até quatro fotos distintas. O normalizador rejeita `src` repetido, e o build continua gerando WebP/AVIF, dimensões, srcset e lazy loading. Quatro fotos reais continuam pendentes de fornecimento autorizado.

Único recurso visual adicionado: `assets/icons/whatsapp.svg`, Bootstrap Icons v1.11.3, The Bootstrap Authors, licença MIT. Origem: https://github.com/twbs/icons/blob/v1.11.3/icons/whatsapp.svg. Licença integral: `licenses/bootstrap-icons-MIT.txt`, também distribuída em `dist/licenses/`.

## WhatsApp

Botão principal, botões por serviço e flutuante usam verde #25D366, texto/ícone escuros com contraste AA, SVG reconhecível, alvo adequado, foco visível e feedback discreto de hover/toque. O restante da identidade preta e dourada permanece.

Com número válido: links oficiais wa.me com normalização brasileira/internacional, mensagem genérica ou com nome do serviço, nova aba e noopener noreferrer. Nenhuma mensagem é enviada automaticamente.

Sem número ou com número inválido: os controles são botões, não links externos nem botões desativados. Exibem a mensagem configurada em `whatsappUnavailableMessage`, cujo padrão é “WhatsApp disponível em breve”. Fecham por repetição do clique, controle de fechar, Escape ou interação/foco externo. Não abrem janelas de erro nem contatos fictícios. Com JavaScript desativado, a mensagem está disponível para leitura no agendamento; a interação do aviso depende de JavaScript.

O flutuante continua móvel, respeita safe area e se oculta ao coincidir com texto/controles importantes ou perto de agendamento/rodapé. A ausência de número não exige removê-lo: ele dá a mesma resposta acessível de indisponibilidade.

## Configuração e avaliações

A auditoria usa apenas config.js para trocar nome, slogan, textos, serviços/preços/durações, horários, WhatsApp/mensagens, endereço/mapa, redes, avaliações, modo demo, domínio e SEO. O HTML final não depende de edição manual e não mantém nome/serviços/horários antigos após a personalização completa.

Avaliações são somente cadastradas pelo desenvolvedor, com verificação manual do conjunto e de cada depoimento. Não existe formulário público, conta, API ou armazenamento que permita ao visitante enviar/modificar avaliações. Testes cobrem nota 4,0 (quatro estrelas) e 4,5 (meia estrela), quantidade/fonte, descarte de depoimentos não verificados e ausência da seção sem dados verificados.

## Arquivos

Modificados: config.js, scripts/config.cjs, scripts/build.cjs, script.js, styles.css, tests/config.cjs, tests/smoke.cjs, package.json, package-lock.json, README.md e docs/PULL_REQUEST_V1.2.md.

Criados: assets/icons/whatsapp.svg, licenses/bootstrap-icons-MIT.txt e docs/VALIDACAO-V1.2.1.md.

Nenhuma imagem original foi removida ou alterada. Não houve alteração de wrangler.jsonc, .node-version, comando de build, verificador de publicação ou configuração remota do Cloudflare.

## Resultados executados

- `npm ci --include=dev && npm run build` em cópia limpa, sem dependências e sem dist pré-existentes: aprovado, com status 0. Verificador confirmou HTML, CSS, JavaScript, SEO, manifest, ícones e referências locais; licença MIT também presente na saída.
- `npm test`: aprovado. Validação de configuração mais 24 cenários (modelo, cliente completo, demo com contato, mínimo, inválido e avaliação 4,0 × 375/390/768/1280px).
- Sem número: mensagem padrão/personalizada, clique, teclado, repetição, fechamento, foco e resposta de serviço/flutuante verificados; nenhuma nova aba.
- Com número: normalização e mensagens por serviço verificadas; clique real abre nova aba com URL esperada e `window.opener === null`. As navegações wa.me são interceptadas antes de sair do navegador para não acessar os números de teste ou enviar mensagens.
- Menu, links internos, dados comerciais, modo demo, configuração mínima e metadados estáticos conferidos. Avaliações 4,0 e 4,5 renderizam quatro estrelas e quatro estrelas e meia, respectivamente; sem dados verificados não há seção nem formulário público.
- Todas as imagens renderizadas carregadas; nenhuma repetição de src na galeria, imagem quebrada, 404, erro JavaScript ou overflow horizontal nos cenários.
- Axe-core WCAG A/AA e contraste: nenhuma violação nas quatro larguras, inclusive com o aviso aberto. Foco e movimento reduzido conferidos. Não é uma auditoria manual com leitor de tela.
- Capturas inspecionadas visualmente; artefatos temporários em `/tmp/barbearia-v121-screenshots` e builds de teste em `/tmp/barbearia-v121-tests`.
- Nenhum Lighthouse/PageSpeed novo foi executado nesta correção; não são reivindicadas notas novas.
- Deploy remoto não executado manualmente; a prévia anteriormente publicada foi informada pelo usuário, não medida por esta tarefa.

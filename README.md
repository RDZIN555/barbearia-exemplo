# Barbearia Exemplo V1.2.2

Modelo comercial estático, em preto e dourado, com personalização em `config.js`. O build gera HTML completo, SEO, imagens responsivas, imagem de compartilhamento e ícones. A produção não precisa de Node, backend, banco de dados, pagamentos ou serviços pagos obrigatórios. Não existe sistema público de avaliações nem agenda automática.

A V1.2.2 continua na branch `feat/barbearia-exemplo-v1-2`, preservando V1.1, V1.2 e a correção de build. Nenhuma outra branch, merge ou publicação direta em produção é necessária. O estado de integração deve ser conferido no PR antes de aprovar o merge.

## Desenvolvimento e build

Requer Node 22.12+ (a versão principal está em `.node-version`) e npm. Validação desta tarefa em Node 24.19.0. Instale pelo lockfile:

```sh
npm ci
npm run build
npm run preview
```

O servidor de desenvolvimento serve **dist/** na porta 8080, somente em loopback; `PORT` permite escolher outra porta. Faça novo build após editar a configuração ou arquivos. Não sirva a raiz como versão final: `index.html` é o template do build, não o produto personalizado.

`npm run build` termina verificando os arquivos publicados e a consistência com `wrangler.jsonc`; falhas deixam código de saída diferente de zero. `npm run verify:dist` repete apenas essa verificação.

O build não acessa APIs remotas. Os avisos `[config]` no terminal informam campos inválidos sem revelar seus valores; a renderização usa padrões seguros e omite recursos opcionais. Uma imagem cadastrada que não existe causa erro de build explícito para impedir links 404 na entrega. A pasta `dist/` é recriada pelo build; não a utilize para arquivos manuais.

## Estrutura

| Arquivo/pasta | Finalidade |
| --- | --- |
| `config.js` | Única fonte dos dados comerciais, textos e seleção de imagens |
| `index.html` | Estrutura e componentes preservados da V1.1; conteúdo sobrescrito pelo build |
| `styles.css` | Identidade, responsividade, foco, movimento reduzido e recursos opcionais |
| `script.js` | Menu acessível, visibilidade do flutuante e aviso de contato sem número; mensagem fornecida pelo build |
| `assets/` | Originais preservados, usados como fallback e fonte de otimização |
| `scripts/config.cjs` | Normalização e validação da configuração |
| `scripts/build.cjs` | Geração estática e otimização local com Cheerio/Sharp |
| `scripts/verify-dist.cjs` | Confere a saída e seus recursos antes da publicação |
| `scripts/serve.cjs` | Servidor local de teste; não é backend de produção |
| `scripts/private-preview.cjs` | Prévia privada exclusivamente em loopback, com injeção em memória |
| `scripts/brand-icon.cjs` | Monograma vetorial e favicon independente de fonte para a letra B |
| `config.private.example.json` | Exemplo vazio para teste pessoal local |
| `scripts/audit.cjs` | Lighthouse mobile local, com relatórios em `/tmp/barbearia-audits` |
| `tests/` | Validação de configuração e testes reais de navegador |
| `dist/` | Saída gerada, ignorada pelo Git; apenas esta pasta é publicada |
| `wrangler.jsonc` | Diretório de saída para Cloudflare Pages; sem comando de deploy automático |

## Configuração para um cliente

Edite apenas `config.js` e as fotografias, depois execute `npm run build`. Não é necessário editar o HTML, os metadados ou os ícones manualmente. Todos os dados gerados também funcionam sem JavaScript.

O único campo comercial recomendado como obrigatório é `name`. Uma configuração mínima `{ name: 'Nome confirmado', demo: { enabled: false } }` funciona sem contatos, serviços, horários, mapa ou avaliações; o nome ausente tem o padrão neutro “Barbearia” com aviso. Para uma entrega comercial completa, forneça também os dados confirmados abaixo. Não coloque credenciais, segredos ou informações privadas no arquivo.

| Campo | Uso |
| --- | --- |
| `name` | Marca, texto institucional, rodapé, SEO, manifest e monograma automático |
| `slogan` | SEO, imagem social e assinatura padrão; o título editorial do hero está em `content.hero` |
| `city`, `state`, `country` | Localidade confirmada; título local, contato e JSON-LD; vazios não são inventados |
| `address` | Endereço textual confirmado, sem geocodificação automática |
| `siteUrl` | URL HTTPS oficial, com caminho base se necessário; canonical, OG, sitemap e JSON-LD |
| `description` | Meta description, Open Graph, Twitter e descrição estruturada |
| `whatsapp` | Somente número comercial público confirmado; nunca use aqui um número pessoal de teste |
| `whatsappMessage` | Mensagem genérica das chamadas gerais e do botão flutuante |
| `whatsappUnavailableMessage` | Aviso sem número; padrão “WhatsApp disponível em breve” |
| `serviceMessage` | Mensagem por serviço; `{service}` é substituído pelo nome do cartão |
| `floatingWhatsapp` | `enabled`, `desktop` e `label`; desktop é desativado por padrão |
| `hours` | Lista de `{ day, time }`; lista vazia omite o bloco sem inventar atendimento |
| `services` | Lista de `{ id, name, description, price, duration }` |
| `socialLinks` | Lista de `{ label, url }` de redes oficiais HTTPS |
| `mapa` | `{ link, embed }`, URLs HTTPS, nunca código HTML de iframe |
| `images` | `hero` e `gallery`: arquivos locais, textos alternativos e legendas |
| `reviews` | Dados manualmente verificados pelo desenvolvedor, descritos abaixo |
| `demo` | `{ enabled, titulo, texto, contatoLabel, contatoLink }` |
| `content` | Textos editoriais e rótulos das seções, descritos abaixo |

### Textos e identidade

`content` organiza `nav`, `headerCta`, `hero`, `values`, `services`, `gallery`, `about`, `booking`, `contact`, `reviews` e `footer`. Os campos preenchidos no arquivo mostram a estrutura completa. Para títulos editoriais, `first` é a linha normal e `accent` a linha dourada; o hero tem ainda `lead` antes do trecho dourado. `description` aceita `\n` para quebra de linha. `about.paragraphs` é uma lista de textos e aceita `{name}`. O conteúdo é escapado como texto; HTML não é executado.

Campos opcionais vazios não exibem conteúdo antigo do template. Campos estruturais, como nome de navegação e títulos, recebem rótulos neutros. O monograma é a primeira letra do nome com estrela dourada; alterar `name` regenera SVG e PNG sem trocar o estilo.

Os preços e horários que acompanham o modelo são exemplos **explicitamente configurados**. Não representam dados comerciais verificados. Troque-os antes da entrega. Não há avaliações, endereços ou telefones pré-preenchidos.

### Serviços, preços e WhatsApp

`price` é número em reais, sem “R$”; centavos são preservados. Preço ausente ou inválido aparece como “Sob consulta”. Um serviço sem nome é omitido com aviso. `description` e `duration` vazios não mantêm textos de serviços anteriores. A ordem e quantidade dos cartões seguem a lista configurada.

Use número brasileiro com DDD ou com DDI 55; espaços, parênteses e hífens são normalizados. Um número nacional de 10/11 dígitos recebe 55; um número já com 55 e 12/13 dígitos não recebe DDI duplicado. DDD 55 também é tratado corretamente. Para outros países, use `+` com DDI explícito; `00` internacional também é aceito. A validação é apenas de formato, não comprova titularidade ou disponibilidade. Nunca use número inventado.

Sem número válido, o botão geral, os botões por serviço e o flutuante são **botões verdes funcionais**, sem URL nem telefone. Ao clicar, mostram `whatsappUnavailableMessage` em um aviso não modal com região de status acessível. O aviso fecha pelo mesmo botão, pelo controle de fechar, por Escape, por clique externo ou quando o foco segue para outro controle. O botão que abriu o aviso recupera o foco ao fechar pelo controle ou por Escape. Com JavaScript desativado, o bloco de agendamento mostra a mensagem via `noscript`; a interação do aviso requer JavaScript.

Com número válido, os links usam `https://wa.me/`, texto codificado, nova aba e `noopener noreferrer`. Eles não enviam a mensagem sozinhos nem garantem agendamento. Os cards usam botões dourados com ícone/texto pretos; a faixa dourada usa botão preto com texto claro. Somente o flutuante mantém o verde `#25D366`. Todos preservam o SVG, contraste AA, foco e feedback de hover/toque. O flutuante respeita a safe area, tem alvo de 54px e sai de cena quando o agendamento ou rodapé se aproximam da tela, ou quando sua posição se sobrepõe a texto e controles importantes. Há espaço inferior no celular e alternativa sem JavaScript.

### Teste pessoal privado, exclusivamente local

**Não coloque um número pessoal em config.js, GitHub, HTML ou Cloudflare.** Use `config.private.json` no seu próprio computador, a partir de `config.private.example.json` vazio. Esse arquivo é ignorado pelo Git e não é lido pelo build de produção. O comando `npm run preview:private` faz o build público e inicia o servidor em 127.0.0.1:8788. A substituição do contato acontece apenas no navegador local, por uma resposta em memória com cache desativado; nada é escrito em dist. Não se trata de uma prévia pública protegida por autenticação.

Veja o [passo a passo para iniciantes no Windows](docs/TESTE-PRIVADO-WINDOWS.md). No PowerShell, utilize `npm.cmd run preview:private`. Encerre com Ctrl+C e remova o arquivo pessoal depois do teste. Os links oficiais ainda abrem o serviço WhatsApp; não compartilhe as URLs ou capturas contendo seu número.

O build de publicação bloqueia `--config` alternativo para dist e exclui `config.private.json` da cópia de recursos. As opções de configuração usadas por testes automatizados só podem gerar saídas temporárias, não dist. O servidor privado escuta somente em loopback, usa endpoint temporário imprevisível e rejeita Host/Origin externos e requisições cross-site. Qualquer pessoa com acesso ao seu computador/arquivo local ainda poderá lê-lo; não publique ou compartilhe a pasta privada.

### Avaliações — manutenção exclusiva do desenvolvedor

O proprietário fornece a fonte, o desenvolvedor verifica a autenticidade e autorização e só então cadastra os dados. Não existe formulário, cadastro, comentário público, botão de envio, banco de dados ou integração de coleta de avaliações.

- `reviews.verified: true` confirma a revisão humana do conjunto.
- `average`: nota real de 0 a 5, com frações, apresentada numericamente e em estrelas SVG proporcionais. Sem nota válida, o resumo de estrelas não é criado.
- `count`: quantidade real positiva; ausente/inválida não aparece nem é calculada a partir dos depoimentos escolhidos.
- `source` e `url`: plataforma e link HTTPS da fonte, apenas quando confirmados; sem link, o nome da plataforma é texto simples.
- `testimonials`: lista de `{ author, text, verified: true }`, exclusivamente textos reais autorizados. Itens não verificados são descartados individualmente.

Sem conjunto verificado e sem nota válida ou depoimentos autorizados, a seção é removida do HTML final, sem espaços vazios. A verificação é manual, não fornecida por uma API. Não existe dado fictício nem marcação de estrelas de autoavaliação para rich snippets do Google.

### Endereço e mapa

`mapa.link` ativa “Como chegar” com URL HTTPS confirmada. `mapa.embed` deve conter a URL de incorporação, não a tag iframe. Fontes aceitas: `https://www.google.com/maps/embed...` e `https://www.openstreetmap.org/export/embed.html...`, sem portas alternativas, credenciais ou host semelhante. Outras origens são rejeitadas. O iframe tem título acessível, carregamento lazy e só existe quando há URL válida. O carregamento envia uma requisição ao provedor do mapa; revise as obrigações de privacidade aplicáveis ao cliente antes de habilitá-lo. Nenhum mapa externo está ativado no modelo.

Sem endereço ou mapa, o cartão de localização é omitido; horários e contato mantêm composição adaptada. Horários vazios também não deixam uma coluna reservada.

### Modo comercial de demonstração

O modelo vem com `demo.enabled: true`, sem link de desenvolvedor. Assim, tem `noindex, nofollow` no HTML, cabeçalho `X-Robots-Tag` no Pages, robots bloqueado e sitemap sem URLs. **Não há faixa de aviso nem seção comercial vazia.**

Somente ao configurar `demo.contatoLink` HTTPS, a pequena seção com `titulo`, `texto` e `contatoLabel` aparece perto do rodapé. Nenhum contato de desenvolvedor é inventado.

Para um cliente real, use `demo.enabled: false` e refaça o build. A seção comercial e as diretivas noindex somem, robots libera rastreamento e o sitemap usa `siteUrl`. A ausência de `demo` adota o padrão seguro de não indexação. Confirme os arquivos gerados antes de entregar; `noindex` é política de busca, não controle de acesso.

## Imagens, licença e compartilhamento

`assets/barbearia.jpg` é a imagem original gerada pela ferramenta OpenAI na V1, de 1536×1024. Não é uma fotografia de um estabelecimento real. A V1.2.2 preserva seus bytes e o favicon original. A galeria exibe apenas uma entrada única, sem usar dois recortes da mesma imagem como variedade. Não foi criada nenhuma nova fotografia. Direitos sujeitos aos termos aplicáveis da OpenAI; não há pressuposição de exclusividade. **Antes da entrega comercial, substitua as imagens do modelo por fotografias autorizadas do estabelecimento**, registre autoria/licença e não apresente a imagem gerada como registro de uma barbearia específica.

Cadastre `images.hero` com `{ src, alt }`; `images.gallery` aceita até quatro objetos `{ src, alt, caption }` com arquivos distintos. Entradas que repetem o mesmo `src` são descartadas com aviso no build. Não reutilize fotos em outros arquivos ou recortes para simular variedade. A grade adapta uma, duas, três ou quatro imagens, sem espaços reservados vazios. Use caminhos em `assets/`, sem `..`, URLs externas ou symlinks para fora dessa pasta. Formatos: JPG/JPEG, PNG, WebP e AVIF. O build lê as dimensões reais, usa originais como fallback e cria derivados WebP/AVIF até 480, 768, 1200 e 1600px, sem ultrapassar a largura original; inclui a largura original quando ela não coincide com as faixas. Não edite os derivados manualmente.

A imagem principal usa `<picture>`, `srcset`, `sizes`, dimensões, `fetchpriority="high"` e carregamento eager; as secundárias têm lazy loading e decodificação assíncrona. O hero mantém a composição original; os itens da galeria não usam zoom artificial para simular imagens diferentes. A cache local em `node_modules/.cache/barbearia` evita recompressão desnecessária e é invalidada pelos bytes da foto e parâmetros de geração.

Pesos medidos para a imagem atual (bytes, sem arredondar para KiB):

| Largura | JPEG original | WebP | AVIF |
| --- | ---: | ---: | ---: |
| 480 | — | 19.680 | 11.770 |
| 768 | — | 43.058 | 24.507 |
| 1200 | — | 84.242 | 46.067 |
| 1536 | 266.302 | 123.650 | 66.917 |

Na largura original, o AVIF é cerca de 75% menor que o JPEG. O peso realmente transferido depende da largura, DPR, formato e cache do navegador; isso não é uma promessa de PageSpeed. O relatório exato de cada build está em `dist/image-report.json`.

O build cria **assets/og-image.jpg, 1200×630**, recortando exclusivamente o hero atual e sobrepondo nome/slogan em preto e dourado. Para atualizar, troque a foto em `images.hero`, nome e slogan e rode o build. A imagem anterior é regenerada automaticamente. Também gera `brand-icon.svg` com B vetorial e estrela (outros nomes usam a inicial configurada), PNGs 16/32/48, Apple Touch Icon 180px, PNGs 192/512 e manifest. Os links de ícone recebem versão baseada no conteúdo para evitar cache antigo. O logotipo do cabeçalho é preservado. Os originais não são apagados.

### Fotografias adicionais e licença do ícone

Nenhuma fotografia nova foi incorporada nesta correção. O acesso ao CDN do Unsplash, à API do Wikimedia Commons e ao servidor de arquivos Wikimedia retornou `403 Forbidden` no proxy do ambiente. Sem arquivos e autorização verificáveis, foi aplicada a alternativa segura prevista no pedido: galeria preparada para quatro fotos autorizadas, com apenas o original único disponível. Essa limitação não foi mascarada por recortes, arquivos fictícios ou imagens de IA novas.

Quando o cliente fornecer as fotos autorizadas, coloque os arquivos em `assets/` e acrescente três entradas reais a `images.gallery`. Confira autoria, origem, licença comercial e autorizações necessárias antes de utilizar cada uma; registre-os na documentação. Não use rostos de terceiros para sugerir que sejam clientes ou profissionais da barbearia.

O único recurso visual adicional é **um ícone SVG**, não uma fotografia: `assets/icons/whatsapp.svg`, Bootstrap Icons 1.11.3, autoria The Bootstrap Authors, licença MIT. Origem: https://github.com/twbs/icons/blob/v1.11.3/icons/whatsapp.svg. A licença integral está em `licenses/bootstrap-icons-MIT.txt` e é copiada para a saída publicada. O SVG é embutido nos botões, sem CDN ou fontes externas. As condições de uso de marca do WhatsApp continuam aplicáveis; não se sugere associação ou endosso.

## SEO local e domínio

O HTML publicado contém título baseado em nome/cidade/estado, description, Open Graph, Twitter Card, um H1 e JSON-LD `HairSalon`, sem depender de JavaScript. Só são incluídos endereço, telefone, redes e URLs explicitamente configurados. Reviews não geram rich snippets de autoavaliação.

Preencha `siteUrl` com o domínio HTTPS oficial e refaça o build. Isso gera canonical, `og:url`, `og:image` absoluto, dimensões 1200×630, texto alternativo social, `og:locale=pt_BR`, Twitter `summary_large_image` e sitemap coerente. **O modelo não tem domínio confirmado**: canonical, URLs sociais e entradas do sitemap ficam omitidos com aviso, em vez de usar um endereço falso. O arquivo da imagem social ainda é gerado para inspeção. Em modo demonstração, o sitemap fica sem URLs mesmo que um domínio seja informado.

Para domínio próprio, primeiro cadastre o domínio e confirme o DNS/certificado no painel do Cloudflare Pages; depois configure a URL final no arquivo. Use apenas o domínio escolhido como canonical e configure redirecionamentos de aliases no provedor quando necessário. Teste a versão final sem dados da Barbearia Exemplo antes de liberar indexação. A configuração completa de teste verifica ausência desse nome no HTML personalizado.

## Cloudflare Pages

A saída continua sendo exclusivamente estática. O build novo precisa ser configurado no Pages:

- Framework: nenhum.
- Instalação: `npm ci` usando `package-lock.json` (o Pages pode executar instalação automaticamente).
- Comando de build no Pages: **`npm ci --include=dev && npm run build`**.
- Diretório de saída: **`dist`**.
- Node: 22.12+; `.node-version` seleciona a versão principal.
- Branch de produção: mantenha a atual (`main`) e publique somente após aprovação/merge autorizado.

`wrangler.jsonc` registra `pages_build_output_dir` para ferramentas do Pages. Se o painel ainda estiver com comando vazio, **configure o comando acima antes de repetir o deploy**. A raiz do projeto deve ser a raiz do repositório (campo vazio ou `/`), e não `dist`. O arquivo não altera sozinho os campos do painel nem configura DNS. O erro `Output directory "dist" not found` indica que a etapa de publicação não encontrou a saída; escolher `dist` no Wrangler não executa o build. Veja [diagnóstico e configuração exata](docs/DEPLOY-CLOUDFLARE.md). Para upload direto manual, envie somente o conteúdo de `dist/`, incluindo `_headers`. Não envie código fonte, testes, documentação ou `node_modules`.

Nenhum comando desta tarefa altera a configuração remota, faz deploy ou merge. Uma integração Git já ativa pode gerar previews da branch conforme suas regras; produção não deve ser trocada para esta branch. Deploy e PageSpeed na URL pública precisam de validação após a aprovação do responsável.

## Testes e auditoria

```sh
npm test
npm run audit:mobile
```

Playwright utiliza Chromium do ambiente em `/usr/bin/chromium`; configure `CHROMIUM_PATH` para outro caminho. Se necessário em uma máquina nova, instale Chromium pelo gerenciador oficial ou execute `npx playwright install chromium` e informe o caminho. Lighthouse usa o mesmo binário. Testes são somente de desenvolvimento.

A suíte cria builds temporários isolados em `/tmp/barbearia-v122-tests` e testa modelo, cliente completo, demonstração com contato, configuração mínima, configuração inválida e nota 4,0 em **375, 390, 768, 1280, 1440 e 1920px**. Verifica teclado, foco, menu, links internos, normalização e mensagem por serviço do WhatsApp, botão flutuante e rodapé, avaliações fracionárias/ausentes, modo demo, SEO no HTML, robots/sitemap, originais intactos, imagens responsivas, erros JavaScript e 404. O mapa e as navegações externas de WhatsApp dos testes são interceptados localmente: não comprovam disponibilidade de um mapa de cliente nem atendimento do número. Não há envio de mensagens ou avaliações. A personalização completa substitui nome, slogan, textos, serviços, preços, horários, contato, mapa, redes e metadados, verificando ausência dos dados anteriores no HTML.

São 36 cenários públicos, além de seis cenários privados com dados sintéticos temporários. O teste privado compara todos os bytes da saída, verifica ausência do contato nos artefatos/logs, Git ignore, rejeição de override para dist e isolamento HTTP local. Nenhum número pessoal é necessário para executar a suíte. Axe-core verifica WCAG A/AA básico e contraste nos cenários públicos, inclusive com o aviso aberto. A suíte testa movimento reduzido e conteúdo sem JavaScript. Capturas ficam em `/tmp/barbearia-v122-screenshots`, incluindo avisos abertos. Isso não substitui teste manual com leitor de tela, titularidade do contato ou verificação humana de avaliações e dados comerciais.

Para reproduzir Lighthouse: `node scripts/audit.cjs PASTA LABEL`. Relatórios JSON/HTML em `/tmp/barbearia-audits`; medidas locais com simulação mobile, não PageSpeed de produção. Registre os valores efetivamente medidos na entrega; a demonstração recebe penalidade SEO intencional pelo noindex. A indexação real e os cartões de compartilhamento ainda precisam de teste no domínio publicado.

## Checklist antes da entrega comercial

- [ ] Dados comerciais e textos aprovados pelo cliente.
- [ ] WhatsApp confirmado, normalizado e testado manualmente com o destinatário correto.
- [ ] Serviços, preços, durações e mensagens conferidos.
- [ ] Horários confirmados.
- [ ] Endereço, mapa e redes verificados.
- [ ] Fotografias reais autorizadas inseridas; licença e textos alternativos registrados.
- [ ] Avaliações verificadas e depoimentos autorizados, ou seção inativa.
- [ ] Modo demonstração desativado e build refeito.
- [ ] Nome, domínio, SEO, canonical, imagem social e JSON-LD corretos no HTML gerado.
- [ ] Indexação liberada em meta, `_headers`, robots e sitemap; nenhum dado do modelo remanescente.
- [ ] Cloudflare Pages com comando `npm ci --include=dev && npm run build`, saída `dist`, raiz do repositório e domínio aprovado.
- [ ] Responsividade, teclado, contraste, foco e movimento reduzido verificados.
- [ ] Testes locais executados e PageSpeed verificado na URL final após publicação autorizada.

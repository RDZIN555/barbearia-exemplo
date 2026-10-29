# Barbearia Exemplo V1.1

Site estático demonstrativo de uma barbearia fictícia. HTML, CSS e JavaScript puro, sem backend, rastreamento, dependências de produção ou serviços pagos obrigatórios.

## Executar localmente

Na raiz do projeto:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abra o endereço local indicado pelo servidor. Não é necessário instalar pacotes nem executar build.

## Arquivos e personalização

- `index.html`: estrutura, textos editoriais e fallbacks para leitura sem JavaScript. Os serviços e horários no HTML espelham os exemplos do arquivo de configuração.
- `styles.css`: cores em `:root`, tipografia, componentes e pontos de adaptação. Fontes do sistema, sem chamadas externas.
- `config.js`: nome, descrição de SEO, WhatsApp, endereço e mapa, horários, serviços e preços, redes sociais, imagens adicionais e avaliações verificadas.
- `script.js`: menu acessível, aplicação segura da configuração, contatos e ativação condicional de avaliações.
- `assets/`: imagem local e ícone SVG original.

### WhatsApp

Preencha `whatsapp` em `config.js` somente com o número comercial confirmado pelo proprietário, em formato internacional, com código do país e DDD, apenas dígitos. Não utilize números fictícios. Vazio ou fora do formato mantém o botão desativado. A validação de formato não confirma a existência ou titularidade do número.

A mensagem padrão é:

> Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.

O botão abre uma conversa em uma nova aba; não consulta agenda, não reserva horários e não envia a mensagem automaticamente. Confirme o número manualmente antes de entregar a um cliente.

### Entrega para uma barbearia real

1. Configure `name`, `description`, `services` e `hours` com dados aprovados pelo cliente. Os valores atuais são exemplos configuráveis, não dados comerciais verificados. Nome e descrição atualizam título e metadados; nome também atualiza cabeçalho, texto institucional e rodapé. A marca gráfica B é preservada: personalize o monograma no HTML e no favicon ao mudar de marca. Sincronize os fallbacks de nome, SEO, serviços e horários em `index.html` para leitores sem JavaScript e robôs que não executam scripts.
2. Configure o WhatsApp e confira o destinatário.
3. Preencha `address` e `mapUrl` somente com dados autorizados. O link do mapa exige endereço preenchido e URL HTTPS. Redes oficiais entram em `socialLinks`, com `label` e `url` HTTPS. URLs com credenciais ou protocolos inseguros são rejeitadas. Não há endereço, mapa ou telefone de terceiros no modelo.
4. A V1.1 preserva integralmente os arquivos e imagens existentes. Antes de apresentar o modelo como site de um estabelecimento específico, obtenha fotografias autorizadas e registre autoria e licença. Não atribua a imagem gerada ao estabelecimento como se fosse um registro real.
5. Atualize título, descrição, favicon e metadados sociais. Ao definir o domínio, adicione URL canônica e imagem social com URLs absolutas; eles foram omitidos para não inventar um domínio.
6. A interface V1.1 não exibe avisos de demonstração, conforme solicitado; a procedência das imagens e a natureza dos dados permanecem documentadas aqui e no código. Não inclua avaliações ou depoimentos sem autorização e origem verificável.
7. Repita os testes de navegação, contraste, teclado e telas pequenas.

## Configuração de serviços, galeria e avaliações

`services` define uma lista com `id`, `name`, `description`, `price` (número em reais) e `duration`. A lista determina ordem e quantidade dos cartões; preços inválidos aparecem como “Sob consulta”. Valores com centavos são preservados. `hours` recebe objetos `day` e `time`; uma lista vazia orienta a consultar o atendimento, sem inventar horários.

### Galeria preservada e extensível

A orientação final de preservação tem prioridade sobre a solicitação anterior de substituir a repetição: os dois enquadramentos existentes e a imagem do hero permanecem. A galeria aceita até duas novas imagens **diferentes**, totalizando quatro, por `galleryAdditionalImages`. Nenhuma nova imagem foi gerada, substituída ou adicionada nesta versão. A grade adapta a composição para três ou quatro imagens; não exibe espaços vazios enquanto os arquivos não forem cadastrados.

Para cada imagem autorizada, informe `src` local em `assets/`, `alt` descritivo, `width` e `height` reais positivos; `caption` é opcional. Formatos aceitos: JPG/JPEG, PNG, WebP e AVIF. Não use caminhos relativos com `..`, URLs externas ou arquivos duplicados. O carregamento é lazy com decodificação assíncrona. Otimize novos arquivos antes de incluí-los e documente a licença. A imagem atual não foi recomprimida ou modificada.

### Avaliações reais, somente após verificação

A seção `#avaliacoes` está preparada no HTML, com identidade preta e dourada e layout responsivo, mas fica inativa até existirem **todos** estes campos em `reviews`:

- `verified: true`, após verificação humana da fonte;
- `average`: nota numérica real entre 0 e 5;
- `count`: quantidade real, inteiro positivo;
- `source`: nome da fonte;
- `url`: URL HTTPS pública da fonte.

Não há nota, quantidade, autor ou depoimento pré-preenchido. Dados ausentes, inválidos ou não verificados não ativam a seção. O navegador não consulta plataformas nem comprova autenticidade: a responsabilidade pela confirmação e atualização é do proprietário do site. Não declare `verified: true` apenas para preencher espaço.

`testimonials` recebe apenas depoimentos reais autorizados, cada um com `author`, `text` e `verified: true`. Itens não verificados são descartados, mesmo quando a nota geral está ativa. Não é necessário cadastrar depoimentos para exibir a nota e a fonte. O texto é inserido como texto simples, sem interpretar HTML.

A média aparece em escala de 5, com vírgula decimal e até duas casas, acompanhada de quantidade e link da fonte. As estrelas SVG têm preenchimento parcial proporcional, sem arredondar a nota para estrelas inteiras, e rótulo acessível. Nenhum dado estruturado de avaliação ou nota fictícia é produzido. Fixtures nos testes são exclusivamente locais e não são publicadas na configuração.

## Imagens e direitos

`assets/barbearia.jpg` é uma imagem conceitual original gerada com a ferramenta de imagens da OpenAI para este projeto, em 29/10/2026. Não foi copiada de uma barbearia ou banco de fotografias de terceiros. O destaque e os dois enquadramentos da galeria usam a mesma imagem; não são registros de trabalhos ou de um estabelecimento real. Uso sujeito aos termos aplicáveis da OpenAI; não se presume exclusividade. O favicon e a identidade tipográfica foram criados para esta demonstração. Nenhum recurso visual de repositórios externos foi incorporado.

## Verificação

O teste `tests/smoke.cjs` utiliza Playwright e Chromium apenas para desenvolvimento. Com o servidor local ativo e Playwright disponível:

```sh
node tests/smoke.cjs
```

Em outro ambiente, instale Playwright fora do checkout (ou em diretório temporário) e disponibilize-o via `NODE_PATH`; defina `CHROMIUM_PATH` se o binário estiver em outro local. Nenhuma instalação é necessária para servir o site.

O teste verifica larguras 375, 390, 768 e 1280, ausência de overflow horizontal, SEO básico, remoção de avisos públicos, âncoras, menu móvel (navegação, Escape, clique externo e foco), CTAs, imagens e erros do navegador. Intercepta a configuração localmente para testar nome, endereço, mapa, redes, serviços com centavos, horários, galeria com quatro imagens, avaliações verificadas e estrelas parciais. Verifica rejeição de avaliações incompletas, contatos inválidos e HTML nos depoimentos. Há fallback seguro sem JavaScript. Nenhum teste contata WhatsApp ou fontes de avaliações. Capturas vão para `/tmp/barbearia-v1-1-screenshots`; `SCREENSHOT_DIR` e `SITE_URL` podem ser configurados.

Há link para pular ao conteúdo, foco visível, navegação por teclado, títulos semânticos, textos alternativos e suporte a movimento reduzido. Validação automatizada não substitui uma auditoria completa com tecnologias assistivas.

## Cloudflare Pages — compatibilidade preservada

O projeto está pronto para hospedagem estática. No painel, escolha a integração Git ou envio direto. Framework: nenhum. Comando de build: deixe vazio. Diretório de saída: raiz do projeto (`.`). Nenhuma variável de ambiente ou segredo é necessário; a configuração do site é pública.

Para envio direto, inclua somente `index.html`, `styles.css`, `config.js`, `script.js` e `assets/`. Não envie `.git`, testes ou documentação. Em integração Git, se desejar excluir esses arquivos da distribuição, crie um estágio de cópia para uma pasta de saída em uma tarefa futura. Não há arquivos de CI ou configuração de deploy no checkout. A V1.1 não altera configurações de Cloudflare Pages, gatilhos de deploy ou a branch de produção. Se a integração Git já estiver habilitada no painel do Cloudflare, ela continua sob as regras existentes; push de uma branch pode gerar preview se essa opção estiver ativa no serviço. O deploy remoto não foi consultado nem validado por esta tarefa.

A V1.1 é preparada em `feat/barbearia-exemplo-v1-1` para revisão por Pull Request, sem merge automático ou alteração direta de `main`.

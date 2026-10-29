# Barbearia Exemplo

Site estático demonstrativo de uma barbearia fictícia. HTML, CSS e JavaScript puro, sem backend, rastreamento, dependências de produção ou serviços pagos obrigatórios.

## Executar localmente

Na raiz do projeto:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abra o endereço local indicado pelo servidor. Não é necessário instalar pacotes nem executar build.

## Arquivos e personalização

- `index.html`: nome, textos, serviços, horários, localização, títulos e metadados de SEO. Todos os valores e horários atuais são demonstrativos.
- `styles.css`: cores em `:root`, tipografia, componentes e pontos de adaptação. Fontes do sistema, sem chamadas externas.
- `config.js`: preços em reais e configuração do WhatsApp.
- `script.js`: menu acessível, personalização de preços e ativação do contato.
- `assets/`: imagem local e ícone SVG original.

### WhatsApp

Preencha `whatsapp` em `config.js` somente com o número comercial confirmado pelo proprietário, em formato internacional, com código do país e DDD, apenas dígitos. Não utilize números fictícios. Vazio ou fora do formato mantém o botão desativado. A validação de formato não confirma a existência ou titularidade do número.

A mensagem padrão é:

> Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.

O botão abre uma conversa em uma nova aba; não consulta agenda, não reserva horários e não envia a mensagem automaticamente. Confirme o número manualmente antes de entregar a um cliente.

### Entrega para uma barbearia real

1. Substitua nome, identidade, preços, serviços, durações e horários com dados aprovados pelo cliente.
2. Configure o WhatsApp e confira o destinatário.
3. Adicione endereço real autorizado e link de mapa somente após confirmação. Não há mapa nem telefone de terceiros no modelo.
4. Substitua as imagens conceituais por fotografias autorizadas do estabelecimento e atualize os textos alternativos e créditos.
5. Atualize título, descrição, favicon e metadados sociais. Ao definir o domínio, adicione URL canônica e imagem social com URLs absolutas; eles foram omitidos para não inventar um domínio.
6. Remova avisos de demonstração e de IA apenas quando o conteúdo tiver sido substituído. Não inclua avaliações ou depoimentos sem autorização e origem verificável.
7. Repita os testes de navegação, contraste, teclado e telas pequenas.

## Imagens e direitos

`assets/barbearia.jpg` é uma imagem conceitual original gerada com a ferramenta de imagens da OpenAI para este projeto, em 29/10/2026. Não foi copiada de uma barbearia ou banco de fotografias de terceiros. O destaque e os dois enquadramentos da galeria usam a mesma imagem; não são registros de trabalhos ou de um estabelecimento real. Uso sujeito aos termos aplicáveis da OpenAI; não se presume exclusividade. O favicon e a identidade tipográfica foram criados para esta demonstração. Nenhum recurso visual de repositórios externos foi incorporado.

## Verificação

O teste `tests/smoke.cjs` utiliza Playwright e Chromium apenas para desenvolvimento. Com o servidor local ativo e Playwright disponível:

```sh
node tests/smoke.cjs
```

Em outro ambiente, instale Playwright fora do checkout (ou em diretório temporário) e disponibilize-o via `NODE_PATH`; defina `CHROMIUM_PATH` se o binário estiver em outro local. Nenhuma instalação é necessária para servir o site.

O teste verifica larguras 375, 390, 768 e 1280, ausência de overflow horizontal, âncoras, menu móvel e Escape, CTA, carregamento das imagens e erros do navegador. Também intercepta a configuração localmente para testar o URL e a mensagem do WhatsApp, sem abrir o serviço ou contatar qualquer número. Capturas vão para `/tmp/barbearia-screenshots`; `SCREENSHOT_DIR` e `SITE_URL` podem ser configurados.

Há link para pular ao conteúdo, foco visível, navegação por teclado, títulos semânticos, textos alternativos e suporte a movimento reduzido. Validação automatizada não substitui uma auditoria completa com tecnologias assistivas.

## Cloudflare Pages — publicação manual

O projeto está pronto para hospedagem estática. No painel, escolha a integração Git ou envio direto. Framework: nenhum. Comando de build: deixe vazio. Diretório de saída: raiz do projeto (`.`). Nenhuma variável de ambiente ou segredo é necessário; a configuração do site é pública.

Para envio direto, inclua somente `index.html`, `styles.css`, `config.js`, `script.js` e `assets/`. Não envie `.git`, testes ou documentação. Em integração Git, se desejar excluir esses arquivos da distribuição, crie um estágio de cópia para uma pasta de saída em uma tarefa futura. Não há publicação automática configurada neste repositório.

As alterações foram preparadas em `feat/barbearia-exemplo-v1`, sem integração com a branch principal, push ou publicação.

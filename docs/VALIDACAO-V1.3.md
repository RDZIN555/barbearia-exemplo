# V1.3 Premium — entrega e validação

Base: `main`, merge `31938fc` do PR #2, incluindo a V1.2.4. Desenvolvimento isolado em `feat/barbearia-exemplo-v1-3-premium`. Validação em 30/10/2026.

## O que mudou

- Hero com oferta explícita, título curto e WhatsApp direto, além do acesso aos serviços. A mesma mensagem geral é usada na versão pública e no teste privado; sem número, abre apenas o aviso seguro.
- Hierarquia editorial refinada: título, contraste, espaçamento, divisórias e serviços alinhados para comparar preço e duração. Três opções e valores intactos.
- Galeria mantém quatro arquivos, legendas, atribuições/licenças e filtro da quarta foto (`brightness(.9) contrast(1.02)`). Espaçamentos e altura do panorâmico ajustados; nenhuma nova imagem.
- “Onde estamos” reúne endereço e horários antes da chamada final. Sem endereço, cartão compacto “Localização a definir”, sem mapa e sem rota. Com endereço, bairro/cidade/estado e links fornecidos pelo cliente são renderizados; embed somente de origem permitida.
- Nome, cores principais, logotipo local opcional, bairro, fotos e textos podem ser personalizados em `config.js`. Sem logotipo, monograma aprovado permanece. Favicon preservado.
- Instagram e avaliações verificados continuam opcionais; equipe não foi adicionada por falta de dados reais. Nenhuma seção vazia criada para essas áreas.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| `npm run build` e verificador de saída | Aprovados; `dist/index.html`, CSS, JS, imagens, ícones, manifest e SEO presentes; saída consistente com Wrangler. |
| Instalação limpa | `npm ci --include=dev && npm run build`, sem dist/node_modules prévios, aprovado. O pequeno ajuste final de `sizes` do logotipo também foi copiado e reconstruído nessa instalação. |
| `npm test` | Aprovado: configuração + 42 cenários públicos (6 configurações × 7 larguras) + 7 privados. |
| Larguras | 375, 390, 768, 1024, 1280, 1440 e 1920px, Chromium; capturas e inspeção visual de hero, serviços, galeria, localização e agendamento. |
| Navegação e acessibilidade | Menu abre/fecha, Escape, foco, teclado, skip link, alvos internos, contraste e axe WCAG A/AA; nenhuma violação nos cenários executados. |
| Contato | Hero, cartões por serviço, chamada final e flutuante; mensagem e nova aba segura testadas. Destinos wa.me interceptados localmente, sem contatar terceiros. |
| Configurações alternativas | Marca/logotipo/cores próprios, serviços/horários distintos, localização completa com mapa de teste interceptado, configuração mínima, entradas inválidas, avaliações 4 e 4,5; navegação sem JavaScript. |
| Localização ausente | Nenhuma rota ou iframe, inclusive com URLs preenchidas sem endereço; horários vazios não reservam coluna. |
| Logotipo | Duas instâncias corretas e teste específico de `sizes` 40/58px após o refinamento final. |
| Imagens/fontes | Imagens locais carregadas, dimensões e srcsets válidos; Georgia/Arial do sistema, nenhuma fonte remota nova. |
| Estabilidade e erros | Sem rolagem horizontal, erros JavaScript ou respostas 404 nos cenários públicos. |
| Privacidade | Configuração sensível ignorada pelo Git; testes usam apenas dados sintéticos temporários. Build com/sem arquivo privado gera bytes idênticos, sem contato em dist ou logs. Proteções loopback/Host/Origin/cross-site e bloqueio de override preservados. |
| Preservação | Comparação com a main confirmou serviços, valores/duração, horários, imagens, reviews, mapa e configurações/mensagens WhatsApp intactos. Originais copiados byte a byte; assets, licenças, favicon e script de menu/flutuante sem alteração. Flutuante continua 54×54px. |
| Dependências | `npm audit`: zero vulnerabilidades. Nenhuma dependência adicionada ou atualizada; somente versão do projeto para 1.3.0. |
| Git | `git diff --check` aprovado; alterações isoladas na branch V1.3. |

## Lighthouse mobile local

Lighthouse 13.6.0, Chromium headless, mesmo script, execuções sequenciais na mesma máquina. Relatórios locais: `/tmp/barbearia-audits/v124-baseline.{json,html}` e `v13-premium.{json,html}`.

| Métrica | V1.2.4 / main | V1.3 Premium |
| --- | --- | --- |
| Performance | 100 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 66 | 66 |
| FCP | 0,9 s | 1,2 s |
| LCP | 1,5 s | 1,7 s |
| TBT | 0 ms | 0 ms |
| CLS | 0 | 0 |

Nenhum aviso de execução. A única auditoria de SEO pontuada que falhou foi `is-crawlable`, devido ao `noindex` intencional do modelo. Não se removeu essa proteção para melhorar uma nota. São medições locais isoladas, não dados de usuários reais, PageSpeed de produção ou prova de ganho de conversão. A variação dos tempos está registrada sem atribuir causalidade ao redesign.

## Auditoria crítica

1. **Apresentação:** comparação visual com a main mostra hero mais compacto no celular, título mais direto e serviços com hierarquia de decisão mais forte; identidade mantida.
2. **Localização:** agora existe um estado pendente visível e honesto, sem mapa fictício. A personalização completa foi testada com fixture, não com endereço de terceiros.
3. **WhatsApp:** o hero elimina uma etapa de rolagem. Sem contato comercial real o aviso permanece; isso é uma limitação intencional do modelo, não um agendamento funcional.
4. **Identidade própria:** composição preta/dourada, foto, monograma e tipografia existentes refinados; nenhuma referência foi copiada. Veja `REFERENCIAS-V1.3.md`.
5. **Honestidade:** rodapé identifica “Modelo de site para barbearias”; preços/horários são exemplos documentados. Galeria é apresentada como inspiração, sem declarar pessoas/ambientes como clientes, equipe ou trabalhos próprios.
6. **Mobile:** sete larguras testadas e capturas inspecionadas. Não se afirma teste em todos os aparelhos físicos/navegadores.
7. **Seções:** conteúdo institucional encurtado; avaliações e redes só com dados reais, equipe omitida. Localização e horários agrupados para evitar duplicação.
8. **Apresentação a proprietários:** modelo pronto para revisão comercial. Para operar com clientes reais, confirmar contato, endereço/rota, horários, serviços e autorização das fotos próprias; ajustar textos, `siteUrl` e indexação. Nenhuma promessa de resultado garantido.

## Arquivos e publicação

Alterados: `index.html`, `styles.css`, `config.js`, `scripts/build.cjs`, `scripts/config.cjs`, `scripts/private-preview.cjs`, `tests/config.cjs`, `tests/smoke.cjs`, `tests/private-preview.cjs`, `package.json`, `package-lock.json` e `README.md`. Acrescentados este relatório e `docs/REFERENCIAS-V1.3.md`.

Cloudflare Pages preservado: build `npm ci --include=dev && npm run build`, saída `dist`, raiz do repositório. Não houve alteração de configuração remota, merge ou comando de deploy em produção. O push da branch pode gerar preview pela integração Git já existente. A revisão visual final e aprovação da V1.3 cabem ao responsável antes do merge.

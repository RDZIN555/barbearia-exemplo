# Auditoria de dependências V1.2.3

## Resultado npm

| Consulta | Antes | Depois |
| --- | --- | --- |
| `npm audit` (árvore completa) | 30 pacotes com alertas: 19 moderados, 11 altos | 0 |
| `npm audit --omit=dev` | 0 | 0 |

A contagem inclui propagação de avisos na árvore: não significa 30 CVEs independentes. Todas as dependências npm do projeto são ferramentas de desenvolvimento/build. A saída de produção é estática e não distribui node_modules, Sharp, Lighthouse, Puppeteer ou Sentry. Isso não torna os riscos do computador de build irrelevantes: processamento de imagens/arquivos e auditorias devem usar ferramentas corrigidas.

## Correções explícitas e justificativa

| Ferramenta | Antes | Depois | Risco/compatibilidade |
| --- | --- | --- | --- |
| Sharp | 0.34.5 | 0.35.5 | Corrige alertas altos das bibliotecas nativas de imagem. As APIs usadas (metadata, resize, composite, JPEG/PNG/WebP/AVIF) foram validadas com o build e testes. |
| Lighthouse | 12.8.2 | 13.6.0 | Remove a cadeia vulnerável de Sentry/OpenTelemetry/Puppeteer. É ferramenta de auditoria, não código do site; o wrapper e a medição mobile foram executados com sucesso. |

Os saltos de versão foram deliberados porque o npm indicou essas versões corrigidas; não foi usado `npm audit fix --force`. Não houve atualização de framework, reconstrução do frontend ou mudança de mensagens do WhatsApp.

Lighthouse 13.6.0 requer Node >=22.19; package.json, lockfile e documentação foram alinhados. `.node-version` continua selecionando a linha 22; usar o patch atualizado dessa linha ou Node 24 suportado. O ambiente desta verificação usa Node 24.19.0.

As versões nativas observadas após a atualização foram Sharp 0.35.5, libvips 8.18.7, libheif 1.23.5 e librsvg 2.63.2. O cache das imagens/OG passou a incluir versões Sharp/libvips para não reaproveitar derivados de um motor antigo após a atualização. Os originais não foram alterados.

## Avisos de referência

- Sharp/libvips: https://github.com/advisories/GHSA-f88m-g3jw-g9cj
- Sharp/libheif: https://github.com/advisories/GHSA-rgj7-g3m4-5g8c
- Sharp/librsvg: https://github.com/advisories/GHSA-wq5f-xc86-pv6w
- OpenTelemetry: https://github.com/advisories/GHSA-8988-4f7v-96qf
- Instrumentação de banco: https://github.com/advisories/GHSA-qqmp-wf37-98f9
- Extração de ZIP: https://github.com/advisories/GHSA-jmr9-qjv8-65gv e https://github.com/advisories/GHSA-7pqw-9j4j-h8q3
- basic-ftp: https://github.com/advisories/GHSA-c475-qrg2-pj4r
- Zod: https://github.com/advisories/GHSA-mrhx-c7xc-m3w5

## Riscos e limites remanescentes

O npm não reportou vulnerabilidades conhecidas na consulta desta execução; isso não é garantia sobre vulnerabilidades futuras ou pacotes do sistema operacional. A ausência de dependências npm em produção limita a exposição do site estático, mas o computador de desenvolvimento continua executando ferramentas e processando arquivos. Repetir a auditoria em atualizações futuras.

A pendência da galeria foi resolvida na continuação: as fontes oficiais ficaram acessíveis, a licença foi verificada e o proprietário autorizou usar as três fotos oficiais após informar a divergência dos anexos. Fontes e condições em FONTES-FOTOGRAFIAS-V1.2.3.md. A auditoria npm final permaneceu em zero; isso não substitui cumprir as condições da licença ou a aprovação do proprietário.

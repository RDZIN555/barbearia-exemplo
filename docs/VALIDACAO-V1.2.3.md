# V1.2.3 — galeria completa e auditoria final

Branch `feat/barbearia-exemplo-v1-2`, continuando `c3de979`, sem reconstrução do site, merge ou deploy direto em produção.

## Galeria e autorização

As páginas oficiais, a licença e os três JPEGs do Pexels retornaram HTTP 200. Os metadados confirmaram autoria, URL e dimensões; os hashes dos arquivos baixados e incluídos no build foram conferidos. Foi informada a divergência em relação aos anexos inline e o proprietário autorizou expressamente usar as fotos oficiais dos links.

A galeria tem quatro imagens únicas: original preservado e três novas fotos de Alex Urezkov (9992818), Pavel Danilyuk (7518742) e Jonathan Cooper (12685938), sob Pexels License verificada. Nenhuma imagem foi gerada por IA nesta etapa. Hero/original, favicon, logotipo e mensagens aprovadas continuam intactos.

Fontes, condições e arquivos: [FONTES-FOTOGRAFIAS-V1.2.3.md](FONTES-FOTOGRAFIAS-V1.2.3.md). Licença e registro de autores/hashes em licenses, incluídos no build. As pessoas/locais não são apresentados como clientes, funcionários ou instalações reais da marca.

A composição usa o original panorâmico, seguido de três retratos em colunas no desktop e uma coluna no celular. Todos carregam localmente, com dimensões, alt, lazy loading, WebP/AVIF e srcset/sizes. Derivados novos limitados a 1600px, sem ampliar arquivos menores. Os JPEGs originais permanecem como fallback.

| Fonte | Original | Maior WebP | Maior AVIF | Largura do derivado |
| --- | ---: | ---: | ---: | ---: |
| Original da V1 | 266.302 bytes | 123.650 | 64.228 | 1536px |
| Corte — Alex Urezkov | 2.684.059 bytes | 287.472 | 110.899 | 1600px |
| Barba — Pavel Danilyuk | 1.795.534 bytes | 334.728 | 138.493 | 1600px |
| Ambiente — Jonathan Cooper | 3.754.022 bytes | 181.000 | 91.058 | 1600px |

Originais Pexels têm larguras 4000, 2681 e 4480px respectivamente; a comparação de pesos inclui redução de dimensões. A transferência real depende do viewport/DPR/formato escolhido pelo navegador. Todas as variantes estão em dist/image-report.json.

## Verificações executadas

- `npm ci --include=dev && npm run build` em cópia limpa: status 0. dist/index.html, quatro imagens locais e licenças presentes; verificador aprovou CSS/JS, imagens/srcset, SEO, manifest e ícones.
- `npm test`: status 0. 36 cenários públicos + seis privados, em 375/390/768/1280/1440/1920px, além de validações unitárias.
- Galeria: exatamente quatro src distintos e os arquivos configurados; todas as imagens renderizadas carregaram, com dimensões/alt e lazy loading. Nenhuma URL externa de fotografia na navegação.
- Menu/teclado/foco, links, alinhamento, valores, WhatsApp com/sem número, mensagens por serviço, avaliações manuais/ausentes, demo/mínimo e SEO aprovados. Sem JS errors, 404, overflow ou violações axe/contraste nos cenários executados.
- Galeria inspecionada visualmente nas seis larguras usando capturas compactas; não foram impressos bytes nem imagens Base64 em texto.
- Modo privado: navegação interceptada, nova aba sem opener, saída idêntica com/sem configuração sintética, ausência do contato em artefatos/logs, ignore e controles HTTP aprovados. Nenhum número pessoal solicitado/lido ou teste pessoal repetido. O sucesso Windows continua sendo o informado pelo proprietário.
- Fonte e build: três hashes SHA-256 conferidos e originais idênticos aos arquivos copiados em dist; licença presente na saída. Imagem original/hero e fallback SVG comparados ao commit de referência.
- `npm audit`: zero alertas na consulta final; as correções 30→0 do commit anterior foram preservadas. Detalhes em [SEGURANCA-V1.2.3.md](SEGURANCA-V1.2.3.md).
- Lighthouse 13.6.0 mobile local **com a galeria completa**: Performance 100, Acessibilidade 100, Boas práticas 100, SEO 66, sem warnings. SEO reduzido pelo noindex intencional; não é medição da URL pública de produção.
- Sintaxe e git diff --check aprovados. Contato público e mensagens genérica/por serviço/indisponibilidade comparados ao c3de979: iguais, sem exibir valores.

## Preservação e limites

O modo demo/noindex continua ativo. Domínio oficial/contato comercial real não foram inventados. Para um cliente real, preencher dados aprovados, usar fotografias próprias/autorizadas e conferir as condições da licença, domínio/SEO/indexação e privacidade antes de publicar.

Nenhuma alteração de configuração remota do Cloudflare, implantação manual em produção ou merge. A aprovação final e a publicação continuam sob controle do proprietário. Nenhum número privado incluído no código, relatório ou build.

## Arquivos desta continuação

Modificados: config.js, scripts/build.cjs, styles.css, tests/smoke.cjs, README.md, docs/FONTES-FOTOGRAFIAS-V1.2.3.md, docs/SEGURANCA-V1.2.3.md, docs/VALIDACAO-V1.2.3.md e docs/PULL_REQUEST_V1.2.md.

Criados: assets/gallery/corte-pexels-9992818.jpg, assets/gallery/barba-pexels-7518742.jpg, assets/gallery/ambiente-pexels-12685938.jpg, licenses/PEXELS-LICENSE.txt e licenses/pexels-gallery-sources.json.

Nenhum arquivo anterior removido. Código do WhatsApp privado, Git ignore, HTML-base, ícones originais, dependências corrigidas e configuração do Pages preservados. Derivados e artefatos de publicação são gerados em dist, ignorado pelo Git.

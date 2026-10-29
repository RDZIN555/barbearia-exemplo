# Correção do build Cloudflare Pages — V1.2

## Diagnóstico

O erro fornecido, `Error: Output directory "dist" not found.`, acontece na procura dos artefatos de publicação. O código gera `dist/` a partir da raiz do checkout, e `wrangler.jsonc` já declara `pages_build_output_dir: "./dist"`. Não existe divergência entre esses dois caminhos. A pasta é ignorada pelo Git intencionalmente: deve ser gerada no ambiente de build, não enviada como cópia estática desatualizada.

O Wrangler declara a saída, mas não define o comando de build do painel do Pages. O projeto era estático sem build antes da V1.2. Um comando vazio, execução em raiz diferente ou falha anterior de instalação/build são causas compatíveis com o erro. Sem o log completo e acesso ao painel não é possível afirmar qual desses casos ocorreu no serviço. O comando abaixo instala explicitamente as dependências de build, inclusive quando NODE_ENV estiver em production, gera a saída e verifica seus arquivos.

## Configuração exata no Cloudflare Pages

| Campo | Valor |
| --- | --- |
| Framework preset | None / Nenhum |
| Root directory | Raiz do repositório: vazio ou `/` |
| Build command | `npm ci --include=dev && npm run build` |
| Build output directory | `dist` |
| Versão Node | 22.12+; `.node-version` seleciona Node 22 |
| Branch desta correção | `feat/barbearia-exemplo-v1-2` |

Não use `dist` como Root directory. Não use a raiz `.` como saída, pois ela contém o template e não o HTML final personalizado. Não use `npm run preview` como build: esse comando só inicia um servidor local. Não mude a branch de produção nem faça merge automaticamente.

Salve os campos de build para a branch de preview e repita o deploy do novo commit. No log devem aparecer `Build concluído` e `Publicação validada` antes da etapa de upload. Os campos do painel não podem ser alterados apenas por um commit no repositório; nenhuma configuração remota foi modificada por esta correção.

## Correção no código

`npm run build` agora executa o gerador e, em sequência, `scripts/verify-dist.cjs`. A verificação falha com status diferente de zero se a saída estiver ausente/incompleta ou se o caminho no Wrangler divergir de `dist`. Confere HTML, CSS, JavaScript, robots, sitemap, headers, manifest, ícones, referências de imagens/srcset e recursos locais do CSS. `npm run verify:dist` permite repetir a checagem sem reconstruir.

Nenhum design, texto comercial, imagem original ou funcionalidade da V1.1/V1.2 foi alterado. Não é necessário versionar `dist` nem reconstruir o site.

## Validação local

A reprodução deve partir de um checkout sem `dist` e sem dependências instaladas, executar exatamente `npm ci --include=dev && npm run build` e depois servir apenas `dist` para verificar os recursos gerados. O resultado local é evidência de geração dos artefatos; não comprova sucesso de deploy remoto ou configuração já aplicada no painel.

### Resultado confirmado nesta correção

- Cópia limpa, sem `dist/` e sem `node_modules/`: `npm ci --include=dev && npm run build` terminou com status 0.
- Gerados `dist/index.html`, CSS, JavaScript, imagens originais e otimizadas, imagem social, ícones, manifest, robots, sitemap e headers.
- Verificação de referências locais e consistência com Wrangler: aprovada.
- Servidor local: HTML e todos os 23 arquivos de saída retornaram HTTP 200 com conteúdo.
- Teste negativo: remoção temporária de `styles.css` na cópia de validação produziu status 1 e mensagem explícita; restauração fez a verificação passar novamente.
- `git diff --check` e comparação dos arquivos de interface/imagens com a V1.2 anterior: sem alterações visuais ou de conteúdo.
- Deploy remoto não foi executado nem confirmado; o painel continua sendo uma etapa externa necessária.

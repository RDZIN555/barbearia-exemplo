# V1.3.1 — refinamento final da localização

Base: `2c47d89`, mesma branch `feat/barbearia-exemplo-v1-3-premium`, PR #3. Validação em 30/10/2026.

## Resultado

O cartão sem endereço agora apresenta “Sua barbearia aqui.” e “Seu endereço, sua identidade e o caminho até você. Tudo em um só lugar.”, editáveis nos mesmos campos `content.contact.pendingTitle` e `pendingDescription` do `config.js`.

Uma composição SVG original usa curvas geométricas e marcador em dourado discreto. Não contém ruas, coordenadas, rótulos geográficos ou rota; não carrega mapas externos. O SVG é decorativo (`aria-hidden`, sem foco), sem animação, bibliotecas ou imagens adicionais. O conteúdo ocupa a parte inferior do cartão, com proporção compacta no celular e alinhamento ao cartão de horários em tablet/desktop.

Com endereço cadastrado, o SVG demonstrativo é removido no build. O ícone de localização real é preservado. Rua/número (`address`), bairro (`neighborhood`), cidade/estado e os links fornecidos são exibidos conforme a configuração. Mapa exige endereço e URL de incorporação válida; rota exige endereço e link HTTPS válido. Nenhuma dessas regras de validação foi alterada.

## Validação executada

- `npm run build`: aprovado; `dist/index.html` e recursos de publicação verificados pelo script existente.
- `npm run test:location`: 25 cenários aprovados — cinco estados × 375, 390, 768, 1280 e 1440px. Reexecutado após refinar o enquadramento SVG, incluindo teste de marcador inteiro dentro do cartão.
- Estados: sem endereço; endereço sintético + mapa válido; endereço sem mapa/rota; endereço + rota sem embed; endereço + URLs inválidas.
- Endereços são fixtures locais sintéticas. URLs externas de mapa são interceptadas em Playwright; nenhum endereço de terceiro é consultado nem publicado.
- `npm test`: configuração, 42 cenários públicos em sete larguras (incluindo 1024/1920px) e 7 cenários privados; menu, teclado/foco, links, imagens, contraste/axe, SEO, mensagens, nova aba segura, ausência de overflow/404/erros de JavaScript e isolamento privado.
- Comparação do HTML gerado com a base `2c47d89`: `head`, cabeçalho, hero, serviços, galeria, sobre, agendamento, horários, rodapé e flutuante idênticos byte a byte.
- Assets/licenças, filtros, script de menu/flutuante, normalizador de configuração, servidor privado, testes privados, ignore e Wrangler sem alterações.
- Lockfile verificado por comparação estrutural: apenas a versão do projeto mudou para 1.3.1; nenhuma dependência foi adicionada ou atualizada.
- `git diff --check`: aprovado.

## Auditoria visual

Capturas de viewport em `/tmp/barbearia-v131-location`, inspecionadas nas cinco larguras principais. O enquadramento foi refinado para manter o marcador inteiro no tablet e no celular. Texto dentro dos limites, sem sobreposição; cartão mobile limitado a até 340px no teste; cartões lado a lado com mesma altura a partir de 768px.

Em comparação com a V1.3, o cartão comunica uma apresentação intencional da marca, em vez de uma localização pendente. A área antes vazia recebe desenho discreto, com a mesma paleta e proporções do site. Nenhuma rua ou localização é sugerida como real. O cartão de horários não precisou de alteração.

A validação visual foi feita em Chromium emulado; não se afirma teste em todos os dispositivos físicos. Não houve nova medição Lighthouse, pois este ajuste é localizado e não muda recursos externos nem o SEO. Resultados da V1.3 continuam documentados como históricos, sem apresentá-los como nova execução.

## Arquivos

`config.js`, `index.html`, `styles.css`, `scripts/build.cjs`, `tests/smoke.cjs`, novo `tests/location.cjs`, `package.json`, `package-lock.json`, `README.md` e este relatório.

Build do Cloudflare preservado: `npm ci --include=dev && npm run build`, saída `dist`. Somente commit/push da branch e atualização do PR #3; sem merge e sem comando de publicação em produção.

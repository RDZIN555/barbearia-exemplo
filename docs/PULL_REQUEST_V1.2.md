# Barbearia Exemplo V1.2 — configuração comercial, SEO estático e otimização

**Dependência:** esta branch parte da V1.1 (`feat/barbearia-exemplo-v1-1`, commit `7923e0a`), que ainda não está integrada à `main` observada (`87a5e39`). O diff para main inclui a V1.1. Revisar essa dependência antes da integração; não fazer merge automático.

Transforma a personalização em um build estático baseado em `config.js`, preservando o design preto e dourado, tipografia, hero, componentes e bytes das imagens originais. Configuração completa ou mínima gera HTML publicado com os dados corretos, sem alterações manuais no template e sem dependência de JavaScript para SEO.

- WhatsApp normalizado, chamadas por serviço e botão flutuante com safe area, alvo de 54px e ocultação perto de agendamento/rodapé. Contatos ausentes não geram links inválidos.
- Avaliações exclusivamente manuais e verificadas, sem formulário público, com nota numérica, estrelas parciais, quantidade/fonte opcionais e depoimentos autorizados.
- Modo comercial opcional perto do rodapé; sem link de desenvolvedor não aparece. Demo produz noindex, robots e cabeçalho coerentes. Modo cliente remove o bloqueio.
- SEO local gerado no HTML: título, descrição, canonical/URLs somente com domínio confirmado, OG, Twitter, HairSalon, robots e sitemap.
- Derivados AVIF/WebP responsivos sem upscale; OG 1200×630 usa exclusivamente o hero atual. Ícones e manifest são gerados a partir da marca.
- Mapas restritos a origens de incorporação confiáveis, lazy loading e campos opcionais omitidos sem colunas vazias.

Validação: instalação por npm ci, build, testes de configuração e 20 cenários de navegador (5 configurações × 375/390/768/1280), teclado/menu/foco, links, WhatsApp, avaliações, demo, imagens, SEO estático, robots/sitemap, contraste com axe, movimento reduzido, ausência de JS errors/404/overflow e originais intactos. Lighthouse mobile local: V1.1 100/100/100/100; V1.2 demo 100/100/100/66 (SEO penalizado intencionalmente pelo noindex); modo cliente 100/100/100/100. Sem promessa de PageSpeed público. Detalhes em docs/VALIDACAO-V1.2.md.

**Preparação do deploy:** Pages precisa usar `npm run build` e saída `dist`. Nenhuma configuração remota foi alterada e nenhum deploy em produção foi executado. Não integrar até revisar esses campos no Pages. Número, domínio, endereço e avaliações reais ainda não foram fornecidos; não são inventados. Fotografias do modelo devem ser substituídas por imagens reais autorizadas antes da entrega comercial.

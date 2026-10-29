# Barbearia Exemplo V1.2.1 — personalização, WhatsApp e auditoria final

Preserva o site premium e as melhorias V1.1/V1.2, com build estático, SEO gerado no HTML e configuração comercial centralizada. Os ajustes finais tornam o WhatsApp reconhecível e funcional também antes de cadastrar um número, sem contatos fictícios.

- Botões gerais, por serviço e flutuante verdes (#25D366), com ícone SVG reconhecível, contraste AA, foco, hover/toque e área adequada.
- Com número: normalização internacional, mensagem geral ou com nome do serviço, link oficial e nova aba com noopener noreferrer.
- Sem número: botões mostram mensagem configurável em aviso acessível, com fechamento por repetição, controle, Escape e interação externa. Sem link falso nem janela de erro.
- Avaliações permanecem exclusivamente manuais e verificadas, com estrelas proporcionais e sem qualquer formulário público.
- Personalização de nome, slogan, textos, serviços/preços, horários, contato, mapa, redes, reviews, demo, domínio e SEO auditada sem editar HTML.
- Build e verificador de dist preservados; nenhuma mudança em configuração remota do Cloudflare.

**Limitação de fotos:** nenhuma fotografia adicional foi incorporada. Unsplash e Wikimedia retornaram HTTP 403 no proxy; não foram usadas imagens sem autorização nem geradas novas fotos por IA. O original e o hero permanecem idênticos. A galeria mantém uma entrada única, sem o segundo recorte repetido, e aceita até quatro fotos distintas quando fornecidas com autorização. Isso segue a alternativa prevista no pedido, mas quatro fotografias ainda são uma pendência de conteúdo.

O único visual novo é o ícone WhatsApp do Bootstrap Icons 1.11.3, licença MIT integral em licenses/bootstrap-icons-MIT.txt, incluída na publicação. A imagem original continua com sua procedência documentada.

**Validação V1.2.1:** instalação/build limpos com `npm ci --include=dev && npm run build`, artefatos de dist conferidos; testes de configuração e 24 cenários reais de navegador (6 configurações × 375/390/768/1280), teclado/menu/foco, aviso sem número, cliques com nova aba interceptada localmente, avaliações 4,0/4,5, imagens, SEO, contraste via axe, ausência de JS errors/404/overflow. Sem mensagens enviadas a terceiros. Relatório: docs/VALIDACAO-V1.2.1.md. Não há nova medição Lighthouse nesta correção.

**Base:** main observada permanece em 87a5e39; a branch inclui V1.1 e V1.2 ainda não integradas. O diff para main inclui essas melhorias. Conferir a dependência antes da integração. Trabalhar na mesma branch feat/barbearia-exemplo-v1-2; sem merge automático ou publicação direta em produção.

Cloudflare Pages: raiz do repositório, build `npm ci --include=dev && npm run build`, saída `dist`, Node 22.12+. Não mudar a branch de produção para esta branch de revisão.

# Barbearia Exemplo V1.2.3 — galeria completa e auditoria final

Completa a galeria do modelo premium com quatro imagens únicas, preservando o hero, a identidade preta e dourada, favicon B, serviços/preços, mensagens aprovadas e teste privado do WhatsApp. Nenhum redesenho, formulário público, pagamento ou agendamento automático foi criado.

- Três fotografias oficiais do Pexels: corte de Alex Urezkov (9992818), barba de Pavel Danilyuk (7518742) e ambiente de Jonathan Cooper (12685938). Origem/autoria/licença/dimensões verificadas; SHA-256 e créditos em licenses. As fotos diferem dos anexos iniciais, e o proprietário autorizou expressamente usar as versões oficiais dos links antes da incorporação.
- Original panorâmico preservado, três retratos no desktop e uma coluna no celular; JPEGs locais, WebP/AVIF até 1600px, srcset/sizes, alt, dimensões e lazy loading. Sem CDN externo durante a navegação ou fotos repetidas para simular variedade.
- Pexels License permite uso comercial em sites/templates com restrições registradas. Não se sugere endosso nem que as pessoas/locais sejam clientes, equipe ou instalações reais da Barbearia Exemplo. Hero, logo e favicon não foram substituídos por stock.
- Segurança anterior preservada: Sharp 0.35.5, Lighthouse 13.6.0 e auditoria npm 30→0. Cache versionado por motor, Node 22.19+, sem audit fix --force.
- Mensagens aprovadas intactas. Nenhum contato pessoal foi solicitado ou colocado no código/build; config.private.json continua ignorado e o modo privado local permanece testado.

Validação: instalação/build em cópia limpa, verificador de publicação, 36 cenários públicos e seis privados em 375/390/768/1280/1440/1920; quatro arquivos locais distintos carregados, sem imagens quebradas, JS errors/404/overflow ou violações axe/contraste. Inspeção visual da galeria nas seis larguras. Hashes de origem/build e licenças conferidos. Lighthouse mobile local com galeria completa: 100/100/100/66, sem warnings; SEO penalizado intencionalmente pelo noindex demo. Não é PageSpeed de produção.

Documentação: docs/VALIDACAO-V1.2.3.md, docs/FONTES-FOTOGRAFIAS-V1.2.3.md e docs/SEGURANCA-V1.2.3.md. Personalização e guia Windows preservados. Modo demonstração continua ativo; preencher domínio/contatos reais e revisar indexação antes de entregar a cliente real.

Mesmo branch e PR existente. Nenhum merge ou deploy direto em produção. Pages continua com `npm ci --include=dev && npm run build`, saída `dist`.

# Barbearia Exemplo V1.2.3 — segurança auditada; galeria ainda pendente

Mantém as melhorias V1.1/V1.2/V1.2.1/V1.2.2: identidade preta e dourada, hero/foto original, monograma B, WhatsApp por serviço/sem número, teste local privado, personalização e SEO estático. Esta etapa corrige as dependências de build/auditoria e registra o bloqueio da galeria, sem reconstrução do site.

- Sharp atualizado para 0.35.5 e Lighthouse para 13.6.0, com APIs/CLI exercitados. Saltos justificados pelos avisos de segurança; nenhum audit fix --force.
- Auditoria npm de 30 alertas (19 moderados/11 altos) para zero. São ferramentas de desenvolvimento/build, não dependências executadas pelo site estático; detalhes em docs/SEGURANCA-V1.2.3.md.
- Node mínimo 22.19 para Lighthouse corrigido; linha de Node e comando do Pages mantidos. Cache das imagens/OG inclui versões do motor para evitar derivados antigos.
- Mensagens e modo privado aprovados preservados. Sucesso manual Windows informado pelo proprietário registrado, sem solicitar/repetir seu contato pessoal.

**Não considerar a galeria concluída:** os três anexos estão visíveis inline, mas sem arquivos baixáveis no executor; Pexels retorna 403 no proxy. Fontes/autores recebidos estão registrados em docs/FONTES-FOTOGRAFIAS-V1.2.3.md, com verificação de correspondência e licença pendente. Nenhuma foto nova foi usada sem confirmação. O original e a galeria atual permanecem; faltam três fotos verificadas para chegar a quatro. A mudança de rede necessária está salva em rascunho do ambiente, sem ativação automática e sem publicar o site.

Validação em cópia limpa: instalação/build, 36 cenários públicos e seis privados em 375/390/768/1280/1440/1920, axe/contraste, links, imagens existentes, SEO, menu, ausência de JS errors/404/overflow e saída privada idêntica à pública. Lighthouse 13.6.0 mobile local no modo demo: 100/100/100/66, SEO afetado pelo noindex intencional. Nenhuma medição de produção ou da galeria de quatro imagens foi reivindicada.

Relatório e lista de arquivos: docs/VALIDACAO-V1.2.3.md. Não há números pessoais nos artefatos/commit; configuração privada continua ignorada. Sem nova branch, merge automático ou deploy direto em produção. O PR continua pendente da galeria antes da aprovação final.

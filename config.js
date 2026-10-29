/* CONFIGURAÇÃO PÚBLICA V1.2.3. Sem senhas ou credenciais.
   Os serviços, preços e horários abaixo são exemplos explicitamente configurados.
   Confirme todos os dados e substitua as fotografias antes da entrega comercial.
   Execute npm run build após qualquer alteração. */
module.exports = {
  name: 'Barbearia Exemplo',
  slogan: 'Seu estilo. Nossa assinatura.',
  city: '', state: '', country: '', address: '', siteUrl: '',
  description: 'Corte, barba e cuidado com atenção a cada detalhe. Conheça os serviços da {name} e consulte a disponibilidade de horários.',
  whatsapp: '', // SOMENTE número comercial público confirmado. Para teste pessoal use config.private.json.
  // DDD + número brasileiro, 55 + DDD + número, ou internacional com +.
  whatsappMessage: 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.',
  whatsappUnavailableMessage: 'WhatsApp disponível em breve',
  serviceMessage: 'Olá! Gostaria de agendar um {service}. Quais horários estão disponíveis?',
  floatingWhatsapp: { enabled: true, desktop: false, label: 'Consultar disponibilidade pelo WhatsApp' },
  mapa: { link: '', embed: '' }, // Embed: Google Maps ou OpenStreetMap; nunca HTML de iframe.
  hours: [
    { day: 'Segunda-feira', time: 'Fechado' },
    { day: 'Terça a sexta', time: '09h — 19h' },
    { day: 'Sábado', time: '09h — 17h' },
    { day: 'Domingo', time: 'Fechado' }
  ],
  services: [
    { id: 'corte', name: 'Corte masculino', description: 'Do clássico ao contemporâneo, um corte que respeita sua identidade.', price: 55, duration: '45 min' },
    { id: 'barba', name: 'Barba & cuidado', description: 'Desenho, alinhamento e toalha quente. Um ritual de cuidado completo.', price: 40, duration: '30 min' },
    { id: 'combo', name: 'Corte + barba', description: 'A experiência completa para renovar o visual e sair com tudo em dia.', price: 85, duration: '75 min' }
  ],
  socialLinks: [], // { label, url } HTTPS oficial, após confirmação.
  images: {
    hero: { src: 'assets/barbearia.jpg', alt: 'Composição de interior com cadeira de couro e iluminação acolhedora' },
    gallery: [
      { src: 'assets/barbearia.jpg', alt: 'Composição de interior com cadeira de barbeiro em couro e luz quente', caption: '01 — AQUI, O TEMPO É SEU' }
    ] // Até quatro fotos distintas e autorizadas. Não repita arquivos para simular variedade.
  },
  reviews: {
    verified: false, average: null, count: null, source: '', url: '',
    testimonials: [] // Somente reais e autorizados: { author, text, verified: true }.
  },
  demo: {
    enabled: true,
    titulo: 'Quer um site assim para sua barbearia?',
    texto: 'Uma presença digital à altura do seu negócio.',
    contatoLabel: 'Vamos conversar', contatoLink: ''
  },
  content: {
    nav: ['Serviços', 'O espaço', 'Nossa essência', 'Contato'],
    headerCta: 'Agende seu horário',
    hero: {
      eyebrow: 'O CLÁSSICO ENCONTRA O SEU ESTILO',
      first: 'Seu estilo.', lead: 'Nossa', accent: 'assinatura.',
      description: 'Mais que um corte. Um momento seu.\nTécnica, cuidado e personalidade em cada detalhe.',
      primaryCta: 'Vamos agendar?', secondaryCta: 'Conheça os serviços',
      note: 'Feito com tempo. Pensado para você.',
      caption: 'O SEU PRÓXIMO CAPÍTULO COMEÇA NA CADEIRA.'
    },
    values: ['RESPEITO AO SEU ESTILO', 'ATENÇÃO AOS DETALHES', 'O PRAZER DE SE CUIDAR'],
    services: { eyebrow: '01 / SERVIÇOS', first: 'Clássicos bem feitos.', accent: 'Do seu jeito.', description: 'Da primeira conversa ao acabamento final,\ncada detalhe faz parte da experiência.', footnote: 'Seu próximo visual começa com uma boa conversa.', cta: 'Consulte a disponibilidade', serviceCta: 'Agendar este serviço' },
    gallery: { eyebrow: '02 / O ESPAÇO', first: 'Uma pausa na rotina.', accent: 'Um lugar para você.', description: 'Texturas, luz e conforto.\nUma atmosfera que faz parte do cuidado.' },
    about: { eyebrow: '03 / NOSSA ESSÊNCIA', first: 'Tradição no gesto.', accent: 'Personalidade no resultado.', paragraphs: ['A {name} nasce de uma ideia simples: cuidar do visual deve ser uma experiência tão boa quanto o resultado.', 'A técnica encontra a escuta. O ambiente convida a desacelerar. E cada corte é pensado para quem ocupa a cadeira.'], signature: 'O bom estilo começa no cuidado.', sealTop: 'ESTILO QUE FICA.', sealBottom: 'CUIDADO QUE MARCA.' },
    booking: { eyebrow: 'RESERVE UM MOMENTO PARA VOCÊ', first: 'Um novo visual.', accent: 'Uma boa conversa.', description: 'Quer agendar seu horário? Entre em contato pelo WhatsApp para consultar a disponibilidade.', cta: 'Consultar pelo WhatsApp' },
    contact: { eyebrow: '04 / QUANDO & ONDE', first: 'Te esperamos', accent: 'na cadeira.', description: 'Converse sobre o seu próximo visual.\nConsulte as informações de contato\ne os horários de atendimento.', cta: 'Informações de agendamento', hoursTitle: 'Horário de funcionamento', locationTitle: 'Localização', locationLabel: 'O CUIDADO COMEÇA AQUI' },
    reviews: { eyebrow: 'EXPERIÊNCIAS & CONEXÕES', first: 'Cuidado que marca.', accent: 'Palavras de quem viveu.' },
    footer: { signature: 'Estilo é pessoal. Cuidado também.', note: 'Cuidado em cada detalhe.' }
  }
};

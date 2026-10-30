/* CONFIGURAÇÃO PÚBLICA V1.3. Sem senhas ou credenciais.
   Os serviços, preços e horários abaixo são exemplos explicitamente configurados.
   Confirme todos os dados e substitua as fotografias antes da entrega comercial.
   Execute npm run build após qualquer alteração. */
module.exports = {
  name: 'Barbearia Exemplo',
  slogan: 'Seu estilo. Nossa assinatura.',
  brand: {
    logo: null, // Opcional: { src: 'assets/logo.png', alt: 'Nome da marca' }.
    colors: { background: '#151714', panel: '#1d201c', accent: '#c8aa75', text: '#f4f0e7', muted: '#b7b8ad', border: '#393c32' }
  },
  city: '', state: '', country: '', address: '', neighborhood: '', siteUrl: '',
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
      { src: 'assets/barbearia.jpg', alt: 'Composição de interior com cadeira de barbeiro em couro e luz quente', caption: '01 — AQUI, O TEMPO É SEU' },
      { src: 'assets/gallery/corte-pexels-9992818.jpg', alt: 'Profissional aparando o cabelo de um homem visto de costas, com capa clara', caption: '02 — PRECISÃO NO CORTE' },
      { src: 'assets/gallery/barba-pexels-7518742.jpg', alt: 'Atendimento de barba com cliente reclinado em salão com parede de tijolos', caption: '03 — CUIDADO NO ACABAMENTO' },
      { src: 'assets/gallery/ambiente-pexels-12685938.jpg', alt: 'Cadeira de barbeiro preta diante de espelho em ambiente claro', caption: '04 — DETALHES QUE ACOLHEM' }
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
    nav: ['Serviços', 'O espaço', 'Nossa essência', 'Onde estamos'],
    headerCta: 'Agende seu horário',
    hero: {
      eyebrow: 'CORTE MASCULINO · BARBA · CUIDADO',
      first: 'Bom corte.', lead: '', accent: 'Seu estilo.',
      description: 'Corte e barba com atenção a cada detalhe.\nEscolha seu serviço. Converse pelo WhatsApp.',
      primaryCta: 'Agendar pelo WhatsApp', secondaryCta: 'Conheça os serviços',
      note: 'Feito com tempo. Pensado para você.',
      caption: 'O SEU PRÓXIMO CAPÍTULO COMEÇA NA CADEIRA.'
    },
    values: ['RESPEITO AO SEU ESTILO', 'ATENÇÃO AOS DETALHES', 'O PRAZER DE SE CUIDAR'],
    services: { eyebrow: '01 / SERVIÇOS', first: 'Escolha o cuidado.', accent: 'Encontre seu estilo.', description: 'Serviços, valores e tempo de atendimento.\nTudo claro antes de agendar.', footnote: 'Seu próximo visual começa com uma boa conversa.', cta: 'Consulte a disponibilidade', serviceCta: 'Agendar este serviço' },
    gallery: { eyebrow: '02 / O ESPAÇO', first: 'O cuidado nos detalhes.', accent: 'O estilo no conjunto.', description: 'Uma seleção de cortes, cuidado e atmosfera.\nInspiração para o seu próximo visual.' },
    about: { eyebrow: '03 / NOSSA ESSÊNCIA', first: 'Tradição no gesto.', accent: 'Personalidade no resultado.', paragraphs: ['A proposta da {name} é simples: escutar, cuidar e valorizar o seu estilo.', 'Do corte ao acabamento, atenção ao que faz diferença para você.'], signature: 'O bom estilo começa no cuidado.', sealTop: 'ESTILO QUE FICA.', sealBottom: 'CUIDADO QUE MARCA.' },
    booking: { eyebrow: 'RESERVE UM MOMENTO PARA VOCÊ', first: 'Seu próximo corte.', accent: 'Começa na conversa.', description: 'Quer agendar seu horário? Entre em contato pelo WhatsApp para consultar a disponibilidade.', cta: 'Consultar pelo WhatsApp' },
    contact: { eyebrow: '04 / VISITE & CONVERSE', first: 'Onde estamos.', accent: 'Quando quiser cuidar de você.', description: 'Localização e horários em um só lugar.', cta: 'Consultar horários pelo WhatsApp', hoursTitle: 'Horário de funcionamento', locationTitle: 'Nosso endereço', locationLabel: 'ESPERAMOS POR VOCÊ', pendingTitle: 'Sua barbearia aqui.', pendingDescription: 'Seu endereço, sua identidade e o caminho até você. Tudo em um só lugar.', hoursNote: 'Atendimento mediante consulta de disponibilidade.' },
    reviews: { eyebrow: 'EXPERIÊNCIAS & CONEXÕES', first: 'Cuidado que marca.', accent: 'Palavras de quem viveu.' },
    footer: { signature: 'Estilo é pessoal. Cuidado também.', note: 'Modelo de site para barbearias.' }
  }
};

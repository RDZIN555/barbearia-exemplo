/* CONFIGURAÇÃO PÚBLICA — nunca coloque credenciais neste arquivo.
   Nome, serviços, preços e horários abaixo são dados de exemplo configuráveis.
   Substitua por dados comerciais aprovados antes de entregar a um cliente.
   Contatos e avaliações ficam vazios até existirem dados reais verificados. */
window.BARBEARIA_CONFIG = Object.freeze({
  name: 'Barbearia Exemplo',
  description: 'Corte, barba e cuidado com atenção a cada detalhe. Conheça os serviços da Barbearia Exemplo e consulte a disponibilidade de horários.',
  whatsapp: '', // Número comercial confirmado: código do país + DDD + número, só dígitos.
  whatsappMessage: 'Olá! Gostaria de consultar os horários disponíveis para agendar um atendimento.',
  address: '',
  mapUrl: '', // URL HTTPS do mapa do endereço confirmado.
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
  socialLinks: [], // Objetos { label, url } com URLs HTTPS oficiais, somente após confirmação.
  // Acrescente até duas imagens DIFERENTES e autorizadas, sem alterar as imagens existentes.
  // Objetos { src: 'assets/arquivo.jpg', alt, caption, width, height }.
  // Use arquivos locais otimizados; registre autoria e licença no README.
  galleryAdditionalImages: [],
  reviews: {
    verified: false, // Ative somente depois de conferir a fonte e obter autorização.
    average: null,   // Nota real de 0 a 5, inclusive decimais.
    count: null,     // Quantidade real, inteiro positivo.
    source: '',
    url: '',        // URL HTTPS pública da fonte verificável.
    testimonials: [] // { author, text, verified: true }; só conteúdo real autorizado.
  }
});

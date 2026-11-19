/* =========================================================
   HUFF STUDIO · dados do portfólio
   Tudo o que muda com frequência fica aqui:
   - CONFIG: e-mail de contato e textos de rodapé
   - PROJECTS: os sites do portfólio (ordem = ordem no site)
   Para adicionar um site novo: copie um bloco de PROJECTS,
   coloque as imagens em assets/img (nome.webp, nome-2.webp,
   nome-m.webp) e troque os textos.
   ========================================================= */

window.CONFIG = {
  email: 'contato@huffstudio.com.br', // TROCAR pelo e-mail real do estúdio
  city: 'Mato Grosso · Brasil',
  year: 2026
};

/* Setores: cada um tem uma cor no anel e no destaque da frase */
window.SECTORS = {
  imob:  { label: 'IMOBILIÁRIO',  color: '#B5552F', on: '#FFF4EC', blurb: 'Lançamentos e construtoras: planta 3D, tour pelos ambientes, mapa da região e espelho de vendas.' },
  ind:   { label: 'INDÚSTRIA',    color: '#C9A36A', on: '#1E1714', blurb: 'Marmorarias, vidraçarias e fábricas que querem mostrar o material como ele é: de perto.' },
  campo: { label: 'CAMPO & ENERGIA', color: '#8FA86A', on: '#10140C', blurb: 'Agro e energia solar contados com imagem grande, movimento e números que convencem.' }
};

window.PROJECTS = [
  {
    id: 'altavera',
    name: 'Altavera Residence',
    short: 'Altavera',
    sector: 'imob',
    kind: 'Site de lançamento',
    url: 'https://huffstudio.github.io/Site-APR/altavera/',
    desc: 'Duas torres de alto padrão apresentadas como uma visita: a fachada acende ao passar o mouse, a planta abre em 3D e o passeio percorre cada ambiente do apartamento.',
    features: ['Planta 3D navegável', 'Passeio pelos ambientes', 'Mapa com pontos da região', 'Espelho de vendas'],
    palette: ['#1B1414', '#7A2E22', '#D9A27A', '#EDE6DF'],
    block: '#5A1D16'
  },
  {
    id: 'huff',
    name: 'Huff Empreendimentos',
    short: 'Huff',
    sector: 'imob',
    kind: 'Site institucional',
    url: 'https://huffstudio.github.io/Site-APR/',
    desc: 'Página de construtora com fundo de seda em movimento, linha do tempo da empresa e os empreendimentos abrindo dentro da própria página.',
    features: ['Seda animada em WebGL', 'Linha do tempo', 'Empreendimentos em destaque', 'Prévia em moldura de celular'],
    palette: ['#2A0F0C', '#6B2A1E', '#C8775A', '#E9D8CF'],
    block: '#3B1410'
  },
  {
    id: 'marble',
    name: 'VEIO · Atelier de Mármores',
    short: 'VEIO',
    sector: 'ind',
    kind: 'Site de catálogo',
    url: 'https://huffstudio.github.io/Marble/',
    desc: 'Mármore vivo gerado por código, sem nenhuma foto: a luz segue o cursor, as chapas se abrem como um livro e cada pedra tem ficha técnica com troca de acabamento.',
    features: ['Mármore gerado por código', 'Bookmatch animado', 'Catálogo com 17 pedras', 'Tabela de cores'],
    palette: ['#F3EEE6', '#C9A36A', '#8C8A82', '#2B2723'],
    block: '#4B4A33'
  },
  {
    id: 'vidros',
    name: 'Vidros e Esquadrias',
    short: 'Vidros',
    sector: 'ind',
    kind: 'Site institucional',
    url: 'https://huffstudio.github.io/Vidros/',
    desc: 'A página começa cortada em placas de vidro 3D que inclinam com o mouse, sobem quando você passa por cima e se estilhaçam ao abrir as especificações.',
    features: ['Placas de vidro em 3D', 'Vidro que refrata o fundo', 'História em linha do tempo', 'Pedido de orçamento'],
    palette: ['#0B0C0C', '#2A2D2D', '#9EE6C4', '#E9ECEC'],
    block: '#1F2120'
  },
  {
    id: 'sorriso',
    name: 'Sorriso Aviação Agrícola',
    short: 'Sorriso',
    sector: 'campo',
    kind: 'Site institucional',
    url: 'https://huffstudio.github.io/Sorriso-avia-o-agr-cola/',
    desc: 'Um Air Tractor recortado da foto se solta do fundo e sai voando com a rolagem. Frota, serviços e área atendida contados com imagem de campo e números.',
    features: ['Avião que voa com a rolagem', 'Parallax nas fotos', 'Frota com especificações', 'Mapa da área atendida'],
    palette: ['#0E1A10', '#2F4A2A', '#F2C230', '#8EE08E'],
    block: '#24301F'
  },
  {
    id: 'soltury',
    name: 'Soltury',
    short: 'Soltury',
    sector: 'campo',
    kind: 'Hero interativo',
    url: '', // repositório privado: sem link público por enquanto
    desc: 'A cobertura solar afunda na névoa e a cena vira do dia para a noite com um toque: Manhã mostra a energia do telhado, Noite mostra os créditos na conta.',
    features: ['Cena Manhã / Noite', 'Transição na névoa', 'Céu estrelado animado', 'Chamada para simulação'],
    palette: ['#0D1838', '#2B3D7A', '#E9F59A', '#F4F1E8'],
    block: '#16213F'
  }
];

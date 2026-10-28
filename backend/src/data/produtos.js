/**
 * Catálogo Oficial da Elite Game Store
 * 
 * Fonte única de verdade para produtos, identificadores, descrições e preços oficiais.
 * Os preços são armazenados em centavos inteiros para evitar erros de ponto flutuante.
 */

export const PRODUTOS = [
  // 3 Produtos Obrigatórios do Desafio Original
  {
    id: 'headset-pulse',
    nome: 'Headset Gamer Pulse',
    descricao: 'Som imersivo, isolamento acústico e conforto para suas partidas.',
    precoCentavos: 19990,
    preco: 199.90,
    categoria: 'Áudio Gamer',
    imagem: 'assets/headset-pulse.jpg'
  },
  {
    id: 'mouse-velocity',
    nome: 'Mouse Gamer Velocity',
    descricao: 'Precisão milimétrica, sensor óptico de alta definição e agilidade.',
    precoCentavos: 12990,
    preco: 129.90,
    categoria: 'Periféricos',
    imagem: 'assets/mouse-velocity.jpg'
  },
  {
    id: 'teclado-phantom',
    nome: 'Teclado Mecânico Phantom',
    descricao: 'Desempenho com switches mecânicos e iluminação RGB por tecla.',
    precoCentavos: 24990,
    preco: 249.90,
    categoria: 'Teclados Mecânicos',
    imagem: 'assets/teclado-phantom.jpg'
  },
  // Produtos Oficiais Adicionais
  {
    id: 'monitor-horizon',
    nome: 'Monitor Gamer Horizon 240Hz',
    descricao: 'Painel curvo ultra-rápido de 1ms e taxa de atualização de 240Hz.',
    precoCentavos: 129990,
    preco: 1299.90,
    categoria: 'Monitores',
    imagem: 'assets/monitor-curvo.jpg'
  },
  {
    id: 'mousepad-goliath',
    nome: 'Mousepad Speed Goliath XXL',
    descricao: 'Superfície de tecido micro-texturizado com bordas costuradas e LED RGB.',
    precoCentavos: 8990,
    preco: 89.90,
    categoria: 'Acessórios',
    imagem: 'assets/mousepad-rgb.jpg'
  },
  {
    id: 'microfone-streamer',
    nome: 'Microfone Condensador Streamer Pro',
    descricao: 'Captação cardioide cristalina com shock mount e filtro pop integrado.',
    precoCentavos: 28990,
    preco: 289.90,
    categoria: 'Áudio Gamer',
    imagem: 'assets/microfone-gamer.jpg'
  },
  {
    id: 'controle-elite',
    nome: 'Controle Sem Fio Trigger Elite',
    descricao: 'Gatilhos magnéticos de efeito Hall e ergonomia de competição.',
    precoCentavos: 21990,
    preco: 219.90,
    categoria: 'Controles',
    imagem: 'assets/controle-gamer.jpg'
  }
];

/**
 * Retorna todos os produtos ativos do catálogo oficial.
 * @returns {Array} Lista de produtos
 */
export function listarProdutos() {
  return PRODUTOS.map(p => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: p.preco,
    precoCentavos: p.precoCentavos,
    categoria: p.categoria,
    imagem: p.imagem
  }));
}

/**
 * Busca um produto por seu ID único.
 * @param {string} id 
 * @returns {Object|null}
 */
export function obterProdutoPorId(id) {
  return PRODUTOS.find(p => p.id === id) || null;
}

/**
 * ELITE GAME STORE — Front-end Script Oficial
 * 
 * Atividade: Desafio 1 — Minha Loja: Simulador de Compras
 * Curso: Técnico em Desenvolvimento de Sistemas — Trilhas (2026)
 * Autor: Luã Hayalla Oliveira Silva
 * 
 * Requisitos Obrigatórios Implementados:
 * - prompt() para interação de entrada
 * - Number() para conversão numérica
 * - alert() para exibição de mensagens e relatórios
 * - fetch() para comunicação com a API REST
 * - Intl.NumberFormat para formatação monetária em BRL
 */

// URL base da API REST Node.js/Express
const API_BASE_URL = 'http://localhost:3002/api';

// Formatador oficial de moeda em Real Brasileiro (BRL)
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

// Catálogo local padrão de fallback (utilizado apenas para renderização caso a API ainda não tenha respondido)
const CATALOGO_LOCAL_FALLBACK = [
  {
    id: 'headset-pulse',
    nome: 'Headset Gamer Pulse',
    descricao: 'Som imersivo, isolamento acústico e conforto para suas partidas.',
    preco: 199.90,
    imagem: 'assets/headset-pulse.jpg'
  },
  {
    id: 'mouse-velocity',
    nome: 'Mouse Gamer Velocity',
    descricao: 'Precisão milimétrica, sensor óptico de alta definição e agilidade.',
    preco: 129.90,
    imagem: 'assets/mouse-velocity.jpg'
  },
  {
    id: 'teclado-phantom',
    nome: 'Teclado Mecânico Phantom',
    descricao: 'Desempenho com switches mecânicos e iluminação RGB por tecla.',
    preco: 249.90,
    imagem: 'assets/teclado-phantom.jpg'
  },
  {
    id: 'monitor-horizon',
    nome: 'Monitor Gamer Horizon 240Hz',
    descricao: 'Painel curvo ultra-rápido de 1ms e taxa de atualização de 240Hz.',
    preco: 1299.90,
    imagem: 'assets/monitor-curvo.jpg'
  },
  {
    id: 'mousepad-goliath',
    nome: 'Mousepad Speed Goliath XXL',
    descricao: 'Superfície de tecido micro-texturizado com bordas costuradas e LED RGB.',
    preco: 89.90,
    imagem: 'assets/mousepad-rgb.jpg'
  },
  {
    id: 'microfone-streamer',
    nome: 'Microfone Condensador Streamer Pro',
    descricao: 'Captação cardioide cristalina com shock mount e filtro pop integrado.',
    preco: 289.90,
    imagem: 'assets/microfone-gamer.jpg'
  },
  {
    id: 'controle-elite',
    nome: 'Controle Sem Fio Trigger Elite',
    descricao: 'Gatilhos magnéticos de efeito Hall e ergonomia de competição.',
    preco: 219.90,
    imagem: 'assets/controle-gamer.jpg'
  }
];

// Estado global em memória da aplicação
let produtosAtivos = [...CATALOGO_LOCAL_FALLBACK];
let backendDisponivel = false;

/* ==========================================================================
   INICIALIZAÇÃO E INTEGRAÇÃO COM A API
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMobile();
  verificarStatusBackend();
  carregarCatalogoDaAPI();
});

/**
 * Controla a navegação responsiva em dispositivos móveis
 */
function inicializarMenuMobile() {
  const btnMenuMobile = document.getElementById('btnMenuMobile');
  const menuNavegacao = document.getElementById('menuNavegacao');
  const linksNavegacao = document.querySelectorAll('.nav-link');

  if (btnMenuMobile && menuNavegacao) {
    btnMenuMobile.addEventListener('click', () => {
      const expandido = btnMenuMobile.getAttribute('aria-expanded') === 'true';
      btnMenuMobile.setAttribute('aria-expanded', String(!expandido));
      menuNavegacao.classList.toggle('active');
    });

    // Fecha o menu móvel ao clicar em um link
    linksNavegacao.forEach(link => {
      link.addEventListener('click', () => {
        menuNavegacao.classList.remove('active');
        btnMenuMobile.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * Verifica a disponibilidade do servidor Express
 */
async function verificarStatusBackend() {
  const dot = document.getElementById('apiStatusDot');
  const text = document.getElementById('apiStatusText');

  try {
    const resposta = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (resposta.ok) {
      backendDisponivel = true;
      if (dot) dot.className = 'status-indicator status-online';
      if (text) text.textContent = 'Servidor API Online (localhost:3002)';
    } else {
      throw new Error('Status inesperado');
    }
  } catch (erro) {
    backendDisponivel = false;
    if (dot) dot.className = 'status-indicator status-offline';
    if (text) text.textContent = 'Servidor API Offline — Inicie o backend na porta 3002';
  }
}

/**
 * Sincroniza o catálogo de produtos com a rota GET /api/produtos
 */
async function carregarCatalogoDaAPI() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/produtos`, { method: 'GET' });
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    const dados = await resposta.json();
    if (dados && dados.produtos && Array.isArray(dados.produtos)) {
      produtosAtivos = dados.produtos;
      atualizarPrecosNoDOM(produtosAtivos);
    }
  } catch (erro) {
    console.warn('Não foi possível sincronizar o catálogo com o servidor:', erro.message);
  }
}

/**
 * Atualiza os valores visíveis no DOM com base na resposta oficial
 */
function atualizarPrecosNoDOM(produtos) {
  produtos.forEach(produto => {
    const elementoPreco = document.getElementById(`preco-${produto.id}`);
    if (elementoPreco) {
      elementoPreco.innerHTML = formatadorMoeda.format(produto.preco).replace(/\s/g, '&nbsp;');
    }
  });
}

/* ==========================================================================
   FUNÇÃO PRINCIPAL: SIMULADOR DE COMPRAS (REQUISITOS DO TRILHAS)
   ========================================================================== */
/**
 * Executa o fluxo interativo do simulador utilizando:
 * - prompt() para interação e captura
 * - Number() para coerção numérica
 * - alert() para comunicação e resultados
 * - fetch() para validação e cálculos no servidor
 */
async function simularCompra() {
  // Passo 1: Obter catálogo mais recente da API
  let catalogo = produtosAtivos;
  try {
    const respostaCatalogo = await fetch(`${API_BASE_URL}/produtos`);
    if (respostaCatalogo.ok) {
      const dados = await respostaCatalogo.json();
      if (dados && Array.isArray(dados.produtos)) {
        catalogo = dados.produtos;
        produtosAtivos = catalogo;
      }
    }
  } catch (e) {
    // Se o servidor estiver indisponível no primeiro momento
    alert(
      "⚠️ ATENÇÃO: O servidor da Elite Game Store está indisponível.\n\n" +
      "Por favor, verifique se o back-end Node.js está em execução na porta 3002.\n" +
      "Comando: npm start (dentro da pasta backend/)"
    );
    return;
  }

  // Lista de itens validados que serão enviados para a API
  const itensParaEnvio = [];
  let totalItensDigitados = 0;

  // Boas-vindas ao simulador
  alert(
    "=========================================\n" +
    "   🎮 BEM-VINDO À ELITE GAME STORE! 🎮   \n" +
    "      Simulador de Compras Interativo    \n" +
    "=========================================\n\n" +
    "A seguir, informe a quantidade desejada de cada produto.\n" +
    "-> Digite 0 se não quiser incluir o produto.\n" +
    "-> Apenas números inteiros maiores ou iguais a zero são válidos."
  );

  // Passo 2 & 3: Percorrer cada produto do catálogo e solicitar quantidade
  for (let i = 0; i < catalogo.length; i++) {
    const produto = catalogo[i];
    let quantidadeValida = null;

    while (quantidadeValida === null) {
      const precoFormatado = formatadorMoeda.format(produto.preco);
      const mensagemPrompt = 
        `Produto [${i + 1}/${catalogo.length}]: ${produto.nome}\n` +
        `Preço unitário: ${precoFormatado}\n` +
        `Descrição: ${produto.descricao}\n\n` +
        `Quantas unidades você deseja comprar? (0 para ignorar)`;

      // Chamada obrigatória com prompt()
      const respostaEntrada = prompt(mensagemPrompt, "0");

      // Verificação estrita de cancelamento
      if (respostaEntrada === null) {
        alert("❌ Simulação cancelada pelo usuário. Nenhuma compra foi processada.");
        return; // Interrompe o fluxo sem disparar requisição
      }

      const entradaLimpa = respostaEntrada.trim();

      // Validação: não permitir campo vazio
      if (entradaLimpa === "") {
        alert("⚠️ Entrada vazia! Por favor, digite um número inteiro maior ou igual a zero (ex: 0, 1, 2).");
        continue;
      }

      // Validação de formato inteiro via expressão regular (impede "1.5", "abc", etc)
      if (!/^\d+$/.test(entradaLimpa)) {
        alert("⚠️ Entrada inválida! Digite apenas números inteiros sem vírgula, ponto ou letras.");
        continue;
      }

      // Conversão obrigatória com Number()
      const numeroConvertido = Number(entradaLimpa);

      // Validação estrita: NaN, finito, positivo
      if (isNaN(numeroConvertido) || !Number.isFinite(numeroConvertido) || numeroConvertido < 0) {
        alert("⚠️ Quantidade inválida! O valor precisa ser um número maior ou igual a zero.");
        continue;
      }

      quantidadeValida = numeroConvertido;
    }

    totalItensDigitados += quantidadeValida;

    // Regra de segurança: Guardamos SOMENTE o id e a quantidade. O preço JAMAIS é enviado pelo cliente.
    itensParaEnvio.push({
      produtoId: produto.id,
      quantidade: quantidadeValida
    });
  }

  // Verificação de seleção nula
  if (totalItensDigitados === 0) {
    alert(
      "🛒 NENHUM PRODUTO SELECIONADO\n\n" +
      "Você definiu quantidade 0 para todos os itens do catálogo.\n" +
      "Subtotal: R$ 0,00\n" +
      "Desconto: R$ 0,00\n" +
      "Total Final: R$ 0,00\n\n" +
      "A simulação foi concluída sem itens a pagar."
    );
    renderizarResultadoNoDOM({
      resumo: {
        quantidadeTotalItens: 0,
        subtotal: 0,
        desconto: 0,
        percentualDesconto: 0,
        totalFinal: 0,
        nenhumProdutoSelecionado: true
      },
      itens: []
    });
    return;
  }

  // Passo 4: Envio do payload para validação e cálculos oficiais no back-end
  try {
    const payload = { itens: itensParaEnvio };

    const respostaServidor = await fetch(`${API_BASE_URL}/compras/simular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resultado = await respostaServidor.json();

    if (!respostaServidor.ok || !resultado.sucesso) {
      alert(
        `❌ ERRO NA SIMULAÇÃO:\n\n` +
        `${resultado.mensagem || 'Ocorreu um erro ao processar o cálculo no servidor.'}\n` +
        `Código: ${resultado.codigo || respostaServidor.status}`
      );
      return;
    }

    // Passo 5: Apresentar o extrato financeiro oficial computado pelo servidor via alert()
    const resumo = resultado.resumo;
    let mensagemExtrato = 
      "=========================================\n" +
      "     🧾 DEMONSTRATIVO DE COMPRA 🧾       \n" +
      "           ELITE GAME STORE              \n" +
      "=========================================\n\n" +
      "ITENS DO PEDIDO:\n";

    resultado.itens.forEach(item => {
      if (item.quantidade > 0) {
        mensagemExtrato += 
          `• ${item.nome}\n` +
          `  Qtd: ${item.quantidade} x ${formatadorMoeda.format(item.precoUnitario)} = ${formatadorMoeda.format(item.subtotalItem)}\n`;
      }
    });

    mensagemExtrato += 
      "\n-----------------------------------------\n" +
      `Subtotal: ${formatadorMoeda.format(resumo.subtotal)}\n`;

    if (resumo.desconto > 0) {
      mensagemExtrato += `Desconto (${resumo.percentualDesconto}%): -${formatadorMoeda.format(resumo.desconto)}\n`;
    } else {
      mensagemExtrato += "Desconto: R$ 0,00 (Desconto de 10% concedido a partir de R$ 500,00)\n";
    }

    mensagemExtrato += 
      `TOTAL FINAL: ${formatadorMoeda.format(resumo.totalFinal)}\n` +
      "=========================================\n\n" +
      "Status: Simulação calculada pelo servidor com sucesso!\n" +
      "Aviso: Simulação acadêmica — nenhum valor real foi cobrado.";

    // Exibição obrigatória com alert()
    alert(mensagemExtrato);

    // Atualiza adicionalmente o painel visual no DOM para inspeção rica
    renderizarResultadoNoDOM(resultado);

  } catch (erroConexao) {
    alert(
      "❌ FALHA DE COMUNICAÇÃO COM O SERVIDOR:\n\n" +
      "Não foi possível conectar ao back-end para calcular os valores oficiais.\n" +
      "Verifique se o servidor Express está em execução em http://localhost:3002.\n\n" +
      `Detalhes técnicos: ${erroConexao.message}`
    );
  }
}

/**
 * Renderiza o demonstrativo visualmente no painel da página
 */
function renderizarResultadoNoDOM(resultado) {
  const painel = document.getElementById('painelResultado');
  const corpo = document.getElementById('resultBody');
  const badge = document.getElementById('resultStatusBadge');

  if (!painel || !corpo) return;

  const resumo = resultado.resumo;
  painel.style.display = 'block';

  if (resumo.nenhumProdutoSelecionado) {
    if (badge) {
      badge.textContent = 'Nenhum Item';
      badge.style.color = '#EAB308';
    }
    corpo.innerHTML = `
      <p style="color: var(--color-text-muted); padding: 1rem 0;">
        Nenhum item foi selecionado nesta simulação. Valor total: R$ 0,00.
      </p>
    `;
    return;
  }

  if (badge) {
    badge.textContent = 'Cálculo Oficial do Servidor';
    badge.style.color = '#4ADE80';
  }

  let html = '<div class="result-items-list">';
  resultado.itens.forEach(item => {
    if (item.quantidade > 0) {
      html += `
        <div class="result-item-row">
          <span><strong>${item.quantidade}x</strong> ${item.nome} (${formatadorMoeda.format(item.precoUnitario)})</span>
          <span>${formatadorMoeda.format(item.subtotalItem)}</span>
        </div>
      `;
    }
  });
  html += '</div>';

  html += `
    <div class="result-total-box">
      <div class="result-item-row">
        <span>Subtotal</span>
        <span>${formatadorMoeda.format(resumo.subtotal)}</span>
      </div>
      <div class="result-item-row" style="color: ${resumo.desconto > 0 ? '#4ADE80' : 'var(--color-text-muted)'};">
        <span>Desconto ${resumo.percentualDesconto > 0 ? `(${resumo.percentualDesconto}%)` : ''}</span>
        <span>-${formatadorMoeda.format(resumo.desconto)}</span>
      </div>
      <div class="result-total-row" style="margin-top: 0.75rem;">
        <span>Total Final</span>
        <span>${formatadorMoeda.format(resumo.totalFinal)}</span>
      </div>
    </div>
  `;

  corpo.innerHTML = html;
  painel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Alterna dinamicamente a foto real exibida no cartão do produto
 * @param {string} produtoId - ID do produto
 * @param {string} novaSrc - Caminho da nova foto
 * @param {HTMLElement} botaoEl - Botão miniatura clicado
 */
function trocarFoto(produtoId, novaSrc, botaoEl) {
  const imgElemento = document.getElementById(`img-${produtoId}`);
  if (imgElemento) {
    imgElemento.src = novaSrc;
  }

  // Atualizar classe ativa nas miniaturas do cartão
  if (botaoEl && botaoEl.parentElement) {
    const botoes = botaoEl.parentElement.querySelectorAll('.gallery-thumb-btn, .thumb-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    botaoEl.classList.add('active');
  }
}

/**
 * Alterna entre modo escuro e claro, persiste a escolha em localStorage.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  // Atualizar ícone do botão para refletir o tema
  const btn = document.getElementById('btnToggleTheme');
  if (btn) {
    btn.innerHTML = next === 'dark' ? '🌓' : '☀️';
  }
}


/**
 * Abre o modal genérico e monta a UI de simulação do produto.
 * Funciona para botões com data-screen="simular" dentro de cards de produto
 * ou no header (exibe todos os produtos neste caso).
 */
function mostrarTela(event) {
  const btn = event.currentTarget;
  const card = btn.closest('.product-card');
  const body = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');

  if (card) {
    // Botão dentro de um card — simula apenas aquele produto
    const productId = card.dataset.id || card.id.replace('card-', '');
    const produto = produtosAtivos.find(p => p.id === productId);
    if (modalTitle) modalTitle.textContent = produto ? `Simular: ${produto.nome}` : 'Simular compra';

    if (!produto) {
      body.innerHTML = `<p style="color:var(--color-text-muted)">Produto não encontrado.</p>`;
    } else {
      montarSimulacaoUnico(body, produto);
    }
  } else {
    // Botão do header — exibe todos os produtos
    if (modalTitle) modalTitle.textContent = '🛒 Simulador de Compras';
    montarSimulacaoTodos(body);
  }

  const modal = document.getElementById('genericModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('show');
  }
}

/**
 * Monta a UI de simulação para UM produto específico.
 */
function montarSimulacaoUnico(body, produto) {
  const precoFmt = formatadorMoeda.format(produto.preco);
  body.innerHTML = `
    <div class="simulacao-unico">
      <div class="sim-produto-info">
        <span class="sim-nome">${produto.nome}</span>
        <span class="sim-preco">Preço unit.: ${precoFmt}</span>
      </div>
      <div class="sim-linha">
        <label for="simQty">Quantidade:</label>
        <div class="sim-qty-ctrl">
          <button type="button" class="sim-btn-qty" id="simBtnMinus">−</button>
          <input type="number" id="simQty" min="0" value="1" />
          <button type="button" class="sim-btn-qty" id="simBtnPlus">+</button>
        </div>
      </div>
      <div class="sim-subtotal-row">
        <span>Subtotal:</span>
        <span id="simSubtotal" class="sim-subtotal-val">${formatadorMoeda.format(produto.preco)}</span>
      </div>
      <div class="sim-subtotal-row" id="simUnicoDescRow" style="display:none; color:#4ADE80; border-color:rgba(74,222,128,0.3);">
        <span>Desconto (10%):</span>
        <span id="simUnicoDescVal" style="font-weight:700;">-R$ 0,00</span>
      </div>
      <div class="sim-total-row" id="simUnicoTotalRow" style="display:none;">
        <span>Total Final:</span>
        <span id="simUnicoTotalVal" class="sim-total-val">${formatadorMoeda.format(produto.preco)}</span>
      </div>
      <button type="button" class="btn btn-primary btn-glow sim-finalizar" id="simBtnFinalizar">
        ✅ Finalizar Compra
      </button>
    </div>`;

  const qtyEl = document.getElementById('simQty');
  const subtotalEl = document.getElementById('simSubtotal');
  const descRow = document.getElementById('simUnicoDescRow');
  const descVal = document.getElementById('simUnicoDescVal');
  const totalRow = document.getElementById('simUnicoTotalRow');
  const totalVal = document.getElementById('simUnicoTotalVal');

  const atualizar = () => {
    const qty = Math.max(0, Number(qtyEl.value) || 0);
    qtyEl.value = qty;
    const subtotal = produto.preco * qty;
    const temDesconto = subtotal >= 500;
    const desconto = temDesconto ? subtotal * 0.10 : 0;
    const totalFinal = subtotal - desconto;

    subtotalEl.textContent = formatadorMoeda.format(subtotal);
    if (temDesconto) {
      descRow.style.display = 'flex';
      descVal.textContent = `-${formatadorMoeda.format(desconto)}`;
      totalRow.style.display = 'flex';
      totalVal.textContent = formatadorMoeda.format(totalFinal);
    } else {
      descRow.style.display = 'none';
      totalRow.style.display = 'none';
    }
  };

  document.getElementById('simBtnMinus').addEventListener('click', () => { qtyEl.value = Math.max(0, (Number(qtyEl.value) || 0) - 1); atualizar(); });
  document.getElementById('simBtnPlus').addEventListener('click', () => { qtyEl.value = (Number(qtyEl.value) || 0) + 1; atualizar(); });
  qtyEl.addEventListener('input', atualizar);
  atualizar();

  document.getElementById('simBtnFinalizar').addEventListener('click', () => {
    const qty = Number(qtyEl.value) || 0;
    if (qty === 0) {
      alert('⚠️ Nenhum produto selecionado! Digite uma quantidade maior que zero.');
      return;
    }
    const subtotal = produto.preco * qty;
    const temDesconto = subtotal >= 500;
    const desconto = temDesconto ? subtotal * 0.10 : 0;
    const totalFinal = subtotal - desconto;

    let msg = `✅ Compra Finalizada com Sucesso!\n\n`;
    msg += `Produto: ${produto.nome}\n`;
    msg += `Quantidade: ${qty}x\n`;
    msg += `Preço unitário: ${formatadorMoeda.format(produto.preco)}\n`;
    msg += `Subtotal: ${formatadorMoeda.format(subtotal)}\n`;
    if (temDesconto) {
      msg += `Desconto especial (10%): -${formatadorMoeda.format(desconto)}\n`;
    }
    msg += `\nTOTAL A PAGAR: ${formatadorMoeda.format(totalFinal)}`;
    alert(msg);

    renderizarResultadoNoDOM({
      resumo: {
        quantidadeTotalItens: qty,
        subtotal: subtotal,
        desconto: desconto,
        percentualDesconto: temDesconto ? 10 : 0,
        totalFinal: totalFinal,
        nenhumProdutoSelecionado: false
      },
      itens: [{
        nome: produto.nome,
        quantidade: qty,
        precoUnitario: produto.preco,
        subtotalItem: subtotal
      }]
    });

    fecharModal();
  });
}

/**
 * Monta a UI de simulação para TODOS os produtos (chamado pelos botões gerais).
 */
function montarSimulacaoTodos(body) {
  const produtos = produtosAtivos;
  let rows = produtos.map((p, i) => `
    <div class="sim-row" id="sim-row-${i}">
      <span class="sim-row-nome">${p.nome}</span>
      <span class="sim-row-preco">${formatadorMoeda.format(p.preco)}</span>
      <div class="sim-qty-ctrl">
        <button type="button" class="sim-btn-qty" onclick="simAjustarQty(${i},-1)">−</button>
        <input type="number" id="simQtyAll${i}" min="0" value="0" oninput="simAtualizarTodos()" />
        <button type="button" class="sim-btn-qty" onclick="simAjustarQty(${i},1)">+</button>
      </div>
      <span class="sim-row-sub" id="simSub${i}">${formatadorMoeda.format(0)}</span>
    </div>`).join('');

  body.innerHTML = `
    <div class="simulacao-todos">
      <div class="sim-header-row">
        <span>Produto</span><span>Preço</span><span>Qtd</span><span>Subtotal</span>
      </div>
      ${rows}
      <div class="sim-subtotal-row" style="margin-top:0.5rem;">
        <span>Subtotal:</span>
        <span id="simSubtotalGeral" style="font-weight:700;">${formatadorMoeda.format(0)}</span>
      </div>
      <div class="sim-subtotal-row" id="simDescontoRow" style="display:none; color:#4ADE80; border-color:rgba(74,222,128,0.3);">
        <span>Desconto Especial (10%):</span>
        <span id="simDescontoValor" style="font-weight:700;">-R$ 0,00</span>
      </div>
      <div class="sim-total-row">
        <span>Total Final:</span>
        <span id="simTotalFinal" class="sim-total-val">${formatadorMoeda.format(0)}</span>
      </div>
      <button type="button" class="btn btn-primary btn-glow sim-finalizar" id="simBtnFinalizarTodos">
        ✅ Finalizar Compra
      </button>
    </div>`;

  document.getElementById('simBtnFinalizarTodos').addEventListener('click', () => {
    const linhas = produtosAtivos.map((p, i) => ({ ...p, qty: Number(document.getElementById(`simQtyAll${i}`)?.value) || 0 }));
    const selecionados = linhas.filter(l => l.qty > 0);
    if (selecionados.length === 0) {
      alert('⚠️ Nenhum produto selecionado! Informe a quantidade de pelo menos um item.');
      return;
    }
    let subtotal = 0;
    let msg = '🛒 RESUMO DA COMPRA — ELITE GAME STORE\n=========================================\n\n';
    selecionados.forEach(l => {
      const sub = l.preco * l.qty;
      subtotal += sub;
      msg += `• ${l.nome}\n  ${l.qty}x ${formatadorMoeda.format(l.preco)} = ${formatadorMoeda.format(sub)}\n`;
    });
    const temDesconto = subtotal >= 500;
    const desconto = temDesconto ? subtotal * 0.10 : 0;
    const totalFinal = subtotal - desconto;

    msg += '\n-----------------------------------------\n';
    msg += `Subtotal: ${formatadorMoeda.format(subtotal)}\n`;
    if (temDesconto) {
      msg += `Desconto especial (10%): -${formatadorMoeda.format(desconto)}\n`;
    }
    msg += `TOTAL FINAL: ${formatadorMoeda.format(totalFinal)}\n`;
    msg += '=========================================\nStatus: Compra simulada com sucesso!';
    
    alert(msg);

    renderizarResultadoNoDOM({
      resumo: {
        quantidadeTotalItens: selecionados.reduce((acc, cur) => acc + cur.qty, 0),
        subtotal: subtotal,
        desconto: desconto,
        percentualDesconto: temDesconto ? 10 : 0,
        totalFinal: totalFinal,
        nenhumProdutoSelecionado: false
      },
      itens: selecionados.map(s => ({
        nome: s.nome,
        quantidade: s.qty,
        precoUnitario: s.preco,
        subtotalItem: s.preco * s.qty
      }))
    });

    fecharModal();
  });
}

/** Ajusta qty de produto i na simulação de todos */
function simAjustarQty(i, delta) {
  const el = document.getElementById(`simQtyAll${i}`);
  if (el) { el.value = Math.max(0, (Number(el.value) || 0) + delta); simAtualizarTodos(); }
}

/** Recalcula subtotais e total na simulação de todos */
function simAtualizarTodos() {
  let subtotal = 0;
  produtosAtivos.forEach((p, i) => {
    const qty = Math.max(0, Number(document.getElementById(`simQtyAll${i}`)?.value) || 0);
    const sub = p.preco * qty;
    subtotal += sub;
    const el = document.getElementById(`simSub${i}`);
    if (el) el.textContent = formatadorMoeda.format(sub);
  });

  const temDesconto = subtotal >= 500;
  const desconto = temDesconto ? subtotal * 0.10 : 0;
  const totalFinal = subtotal - desconto;

  const subtotalEl = document.getElementById('simSubtotalGeral');
  if (subtotalEl) subtotalEl.textContent = formatadorMoeda.format(subtotal);

  const descRow = document.getElementById('simDescontoRow');
  const descVal = document.getElementById('simDescontoValor');
  if (descRow && descVal) {
    if (temDesconto) {
      descRow.style.display = 'flex';
      descVal.textContent = `-${formatadorMoeda.format(desconto)}`;
    } else {
      descRow.style.display = 'none';
    }
  }

  const totalEl = document.getElementById('simTotalFinal');
  if (totalEl) totalEl.textContent = formatadorMoeda.format(totalFinal);
}

/**
 * Fecha o modal genérico.
 */
function fecharModal() {
  const modal = document.getElementById('genericModal');
  if (modal) {
    modal.classList.remove('show');
    modal.classList.add('hidden');
  }
}

/* ==========================================================================
   INICIALIZAÇÃO ÚNICA — Tema + Listeners de modal
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Aplicar tema salvo ou padrão
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const btnTheme = document.getElementById('btnToggleTheme');
  if (btnTheme) {
    btnTheme.textContent = savedTheme === 'dark' ? '🌓' : '☀️';
  }

  // 2. Botão noturno no header
  if (btnTheme) {
    btnTheme.addEventListener('click', toggleTheme);
  }

  // 3. Registrar cliques nos botões Simular (Header, Hero e Cards de Produtos)
  const botoesSimulacao = new Set([
    ...document.querySelectorAll('[data-screen="simular"]'),
    ...document.querySelectorAll('.product-card .btn-secondary')
  ]);
  botoesSimulacao.forEach(btn => {
    btn.addEventListener('click', mostrarTela);
  });

  // 5. Fechar modal ao clicar no backdrop ou no X
  const modal = document.getElementById('genericModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  }
  const btnFechar = document.getElementById('modalClose');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);

  // 6. Inicializar barra de pesquisa interativa no navbar
  inicializarBarraPesquisa();
});

/* ==========================================================================
   BARRA DE PESQUISA INTERATIVA (FILTRAGEM DE PRODUTOS NO NAVBAR)
   ========================================================================== */
function inicializarBarraPesquisa() {
  const inputBusca = document.getElementById('navSearchInput');
  const btnLimpar = document.getElementById('btnLimparBusca');
  const gridProdutos = document.getElementById('gridProdutos');
  if (!inputBusca) return;

  const filtrar = () => {
    const termo = inputBusca.value.trim().toLowerCase();
    if (btnLimpar) {
      btnLimpar.style.display = termo.length > 0 ? 'inline-flex' : 'none';
    }

    const cards = document.querySelectorAll('.product-card');
    let encontrados = 0;

    cards.forEach(card => {
      const nome = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
      const tag = card.querySelector('.product-tag')?.textContent.toLowerCase() || '';
      
      const corresponde = termo === '' || nome.includes(termo) || desc.includes(termo) || tag.includes(termo);
      if (corresponde) {
        card.style.display = '';
        encontrados++;
      } else {
        card.style.display = 'none';
      }
    });

    let avisoSemResultados = document.getElementById('avisoSemProdutosBusca');
    if (encontrados === 0 && termo.length > 0) {
      if (!avisoSemResultados && gridProdutos) {
        avisoSemResultados = document.createElement('div');
        avisoSemResultados.id = 'avisoSemProdutosBusca';
        avisoSemResultados.className = 'search-no-results';
        gridProdutos.parentNode.insertBefore(avisoSemResultados, gridProdutos.nextSibling);
      }
      if (avisoSemResultados) {
        avisoSemResultados.innerHTML = `
          <div class="search-empty-box">
            <span class="search-empty-icon">🔍</span>
            <h3>Nenhum periférico encontrado para "${inputBusca.value.trim()}"</h3>
            <p>Tente buscar por termos como <em>mouse, teclado, headset, monitor, gamer</em> ou limpe a pesquisa.</p>
            <button type="button" class="btn btn-outline btn-sm" onclick="limparPesquisa()">✕ Limpar pesquisa</button>
          </div>
        `;
        avisoSemResultados.style.display = 'block';
      }
    } else {
      if (avisoSemResultados) {
        avisoSemResultados.style.display = 'none';
      }
    }
  };

  inputBusca.addEventListener('input', () => {
    filtrar();
    // Se o usuário digitou mais de 1 caractere e não está vendo os produtos, rola suavemente
    if (inputBusca.value.trim().length >= 2) {
      const secaoProdutos = document.getElementById('produtos');
      if (secaoProdutos) {
        const rect = secaoProdutos.getBoundingClientRect();
        if (rect.top < -100 || rect.top > window.innerHeight - 150) {
          secaoProdutos.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });

  if (btnLimpar) {
    btnLimpar.addEventListener('click', limparPesquisa);
  }
}

/**
 * Reseta o campo de busca e restaura todos os produtos
 */
function limparPesquisa() {
  const inputBusca = document.getElementById('navSearchInput');
  const btnLimpar = document.getElementById('btnLimparBusca');
  if (inputBusca) {
    inputBusca.value = '';
    inputBusca.focus();
  }
  if (btnLimpar) btnLimpar.style.display = 'none';
  document.querySelectorAll('.product-card').forEach(card => card.style.display = '');
  const aviso = document.getElementById('avisoSemProdutosBusca');
  if (aviso) aviso.style.display = 'none';
}

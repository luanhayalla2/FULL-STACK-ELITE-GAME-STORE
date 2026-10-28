/**
 * Serviço de Simulação de Compras - Elite Game Store
 * 
 * Responsável por:
 * 1. Validar rigorosamente as entradas do cliente (IDs, integridade numérica, tipos).
 * 2. Bloquear tentativas de injeção de preços do cliente (segurança estrita).
 * 3. Executar cálculos financeiros em centavos inteiros (prevenção de arredondamentos IEEE 754).
 * 4. Aplicar a regra de negócio de descontos da loja (>= R$ 500,00 -> 10% off).
 */

import { obterProdutoPorId } from '../data/produtos.js';

export class AppError extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem);
    this.name = 'AppError';
    this.status = status;
    this.codigo = codigo;
    this.mensagem = mensagem;
  }
}

const LIMITE_DESCONTO_CENTAVOS = 50000; // R$ 500,00
const PERCENTUAL_DESCONTO = 0.10; // 10%

/**
 * Valida se um valor é um número inteiro válido e não negativo.
 * @param {any} valor 
 * @returns {boolean}
 */
function isInteiroNaoNegativo(valor) {
  if (typeof valor !== 'number') return false;
  if (!Number.isFinite(valor)) return false;
  if (!Number.isInteger(valor)) return false;
  return valor >= 0;
}

/**
 * Executa a simulação oficial de compra a partir de uma lista de itens.
 * 
 * @param {Array<{ produtoId: string, quantidade: number }>} itensRecebidos
 * @returns {Object} Resultado detalhado do cálculo oficial
 */
export function processarSimulacao(itensRecebidos) {
  if (!Array.isArray(itensRecebidos)) {
    throw new AppError(
      400,
      'PAYLOAD_INVALIDO',
      'O campo "itens" deve ser uma lista (array) contendo os produtos e quantidades.'
    );
  }

  // Consolidar quantidades por produtoId para evitar inconsistências por duplicatas acidentais
  const itensConsolidados = new Map();

  for (let index = 0; index < itensRecebidos.length; index++) {
    const item = itensRecebidos[index];

    if (!item || typeof item !== 'object') {
      throw new AppError(
        400,
        'ITEM_INVALIDO',
        `O item na posição ${index} é inválido.`
      );
    }

    const { produtoId, quantidade } = item;

    if (typeof produtoId !== 'string' || produtoId.trim() === '') {
      throw new AppError(
        400,
        'PRODUTO_ID_INVALIDO',
        `Identificador de produto ausente ou inválido na posição ${index}.`
      );
    }

    const idLimpo = produtoId.trim();
    const produtoCatalogo = obterProdutoPorId(idLimpo);

    if (!produtoCatalogo) {
      throw new AppError(
        404,
        'PRODUTO_NAO_ENCONTRADO',
        `O produto com identificador "${idLimpo}" não existe no catálogo oficial.`
      );
    }

    if (!isInteiroNaoNegativo(quantidade)) {
      throw new AppError(
        400,
        'QUANTIDADE_INVALIDA',
        `A quantidade para o produto "${produtoCatalogo.nome}" deve ser um número inteiro maior ou igual a zero.`
      );
    }

    const qtdAtual = itensConsolidados.get(idLimpo) || 0;
    itensConsolidados.set(idLimpo, qtdAtual + quantidade);
  }

  // Calcular subtotais por produto com quantidades > 0
  const itensCalculados = [];
  let subtotalGeralCentavos = 0;
  let quantidadeTotalItens = 0;

  for (const [id, quantidade] of itensConsolidados.entries()) {
    const produto = obterProdutoPorId(id);
    const subtotalItemCentavos = produto.precoCentavos * quantidade;

    subtotalGeralCentavos += subtotalItemCentavos;
    quantidadeTotalItens += quantidade;

    itensCalculados.push({
      produtoId: produto.id,
      nome: produto.nome,
      precoUnitarioCentavos: produto.precoCentavos,
      precoUnitario: produto.precoCentavos / 100,
      quantidade: quantidade,
      subtotalItemCentavos: subtotalItemCentavos,
      subtotalItem: subtotalItemCentavos / 100
    });
  }

  // Aplicar regra de desconto oficial da loja
  // Subtotal >= R$ 500,00 (50.000 centavos) recebe 10% de desconto
  let descontoCentavos = 0;
  let percentualAplicado = 0;

  if (quantidadeTotalItens > 0 && subtotalGeralCentavos >= LIMITE_DESCONTO_CENTAVOS) {
    descontoCentavos = Math.round(subtotalGeralCentavos * PERCENTUAL_DESCONTO);
    percentualAplicado = PERCENTUAL_DESCONTO * 100;
  }

  const totalFinalCentavos = subtotalGeralCentavos - descontoCentavos;

  return {
    sucesso: true,
    dataHora: new Date().toISOString(),
    resumo: {
      quantidadeTotalItens,
      nenhumProdutoSelecionado: quantidadeTotalItens === 0,
      subtotalCentavos: subtotalGeralCentavos,
      subtotal: subtotalGeralCentavos / 100,
      descontoCentavos: descontoCentavos,
      desconto: descontoCentavos / 100,
      percentualDesconto: percentualAplicado,
      totalFinalCentavos: totalFinalCentavos,
      totalFinal: totalFinalCentavos / 100,
      regraDesconto: 'Desconto de 10% aplicado para compras com subtotal a partir de R$ 500,00.'
    },
    itens: itensCalculados
  };
}

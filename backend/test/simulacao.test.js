/**
 * Suíte de Testes Automatizados - Regras de Negócio e Cálculos da Elite Game Store
 * Executa os cenários A, B, C, D, E, F e G exigidos na especificação.
 */

import { processarSimulacao } from '../src/services/simulacaoService.js';
import { listarProdutos, obterProdutoPorId } from '../src/data/produtos.js';
import assert from 'node:assert/strict';

console.log('--- INICIANDO BATERIA DE TESTES DE ENGENHARIA [ELITE GAME STORE] ---');

let passou = 0;
let total = 0;

function executarTeste(nome, fn) {
  total++;
  try {
    fn();
    console.log(`[PASSOU] ${nome}`);
    passou++;
  } catch (error) {
    console.error(`[FALHOU] ${nome}`);
    console.error(`  -> Erro: ${error.message}`);
  }
}

// Teste Catálogo: produtos oficiais
executarTeste('Catálogo Oficial: deve conter os produtos cadastrados (incluindo os 3 obrigatórios)', () => {
  const produtos = listarProdutos();
  assert.ok(produtos.length >= 3);
  assert.equal(produtos.length, 11);
  assert.ok(obterProdutoPorId('headset-pulse'));
  assert.ok(obterProdutoPorId('mouse-velocity'));
  assert.ok(obterProdutoPorId('teclado-phantom'));
  assert.ok(obterProdutoPorId('pc-gamer-titan'));
  assert.ok(obterProdutoPorId('notebook-gamer-helios'));
  assert.ok(obterProdutoPorId('gpu-rtx-4090'));
  assert.ok(obterProdutoPorId('volante-force-gt'));
});

// Teste A — Nenhum produto selecionado
executarTeste('Teste A — Nenhum produto selecionado (quantidades = 0)', () => {
  const payload = [
    { produtoId: 'headset-pulse', quantidade: 0 },
    { produtoId: 'mouse-velocity', quantidade: 0 },
    { produtoId: 'teclado-phantom', quantidade: 0 }
  ];
  const resultado = processarSimulacao(payload);
  assert.equal(resultado.resumo.nenhumProdutoSelecionado, true);
  assert.equal(resultado.resumo.quantidadeTotalItens, 0);
  assert.equal(resultado.resumo.subtotal, 0);
  assert.equal(resultado.resumo.desconto, 0);
  assert.equal(resultado.resumo.totalFinal, 0);
});

// Teste B — Dois headsets
executarTeste('Teste B — Dois headsets (R$ 399,80 / Sem desconto)', () => {
  const payload = [
    { produtoId: 'headset-pulse', quantidade: 2 }
  ];
  const resultado = processarSimulacao(payload);
  assert.equal(resultado.resumo.subtotalCentavos, 39980);
  assert.equal(resultado.resumo.subtotal, 399.80);
  assert.equal(resultado.resumo.descontoCentavos, 0);
  assert.equal(resultado.resumo.desconto, 0);
  assert.equal(resultado.resumo.totalFinalCentavos, 39980);
  assert.equal(resultado.resumo.totalFinal, 399.80);
});

// Teste C — Um headset e três teclados (Subtotal R$ 949,60 / Desconto R$ 94,96 / Total R$ 854,64)
executarTeste('Teste C — Um headset e três teclados (Com desconto de 10%)', () => {
  const payload = [
    { produtoId: 'headset-pulse', quantidade: 1 },
    { produtoId: 'teclado-phantom', quantidade: 3 }
  ];
  const resultado = processarSimulacao(payload);
  assert.equal(resultado.resumo.subtotalCentavos, 94960);
  assert.equal(resultado.resumo.subtotal, 949.60);
  assert.equal(resultado.resumo.descontoCentavos, 9496);
  assert.equal(resultado.resumo.desconto, 94.96);
  assert.equal(resultado.resumo.totalFinalCentavos, 85464);
  assert.equal(resultado.resumo.totalFinal, 854.64);
});

// Teste D — Um mouse
executarTeste('Teste D — Um mouse (R$ 129,90 / Sem desconto)', () => {
  const payload = [
    { produtoId: 'mouse-velocity', quantidade: 1 }
  ];
  const resultado = processarSimulacao(payload);
  assert.equal(resultado.resumo.subtotalCentavos, 12990);
  assert.equal(resultado.resumo.subtotal, 129.90);
  assert.equal(resultado.resumo.desconto, 0);
  assert.equal(resultado.resumo.totalFinal, 129.90);
});

// Teste E — Validação de Entradas Inválidas (texto, decimal, negativo)
executarTeste('Teste E.1 — Rejeitar quantidade textual', () => {
  assert.throws(
    () => processarSimulacao([{ produtoId: 'mouse-velocity', quantidade: 'cinco' }]),
    (err) => err.codigo === 'QUANTIDADE_INVALIDA' && err.status === 400
  );
});

executarTeste('Teste E.2 — Rejeitar quantidade decimal', () => {
  assert.throws(
    () => processarSimulacao([{ produtoId: 'mouse-velocity', quantidade: 2.5 }]),
    (err) => err.codigo === 'QUANTIDADE_INVALIDA' && err.status === 400
  );
});

executarTeste('Teste E.3 — Rejeitar quantidade negativa', () => {
  assert.throws(
    () => processarSimulacao([{ produtoId: 'mouse-velocity', quantidade: -1 }]),
    (err) => err.codigo === 'QUANTIDADE_INVALIDA' && err.status === 400
  );
});

// Teste F — Segurança dos Cálculos (ignorar preços adulterados pelo cliente)
executarTeste('Teste F — Segurança: ignorar preço falso enviado no payload', () => {
  const payloadComPrecoFalso = [
    { produtoId: 'teclado-phantom', quantidade: 1, preco: 1.00, precoCentavos: 100 }
  ];
  const resultado = processarSimulacao(payloadComPrecoFalso);
  assert.equal(resultado.resumo.subtotalCentavos, 24990);
  assert.equal(resultado.resumo.subtotal, 249.90);
});

// Teste G — Produto Inexistente
executarTeste('Teste G — Rejeitar identificador de produto inexistente (404)', () => {
  assert.throws(
    () => processarSimulacao([{ produtoId: 'produto-fantasma-xyz', quantidade: 1 }]),
    (err) => err.codigo === 'PRODUTO_NAO_ENCONTRADO' && err.status === 404
  );
});

console.log('--------------------------------------------------------------------');
console.log(`TOTAL DE TESTES: ${total} | APROVADOS: ${passou} | FALHAS: ${total - passou}`);
if (passou === total) {
  console.log('>>> TODOS OS TESTES FORAM APROVADOS COM SUCESSO! <<<');
  process.exit(0);
} else {
  console.error('>>> HOUVE FALHA EM TESTES! <<<');
  process.exit(1);
}

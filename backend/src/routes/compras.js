/**
 * Rota de Simulação de Compras - Elite Game Store
 * POST /api/compras/simular
 */

import { Router } from 'express';
import { processarSimulacao } from '../services/simulacaoService.js';

const router = Router();

router.post('/simular', (req, res, next) => {
  try {
    const { itens } = req.body || {};

    if (!itens) {
      return res.status(400).json({
        sucesso: false,
        codigo: 'CAMPOS_OBRIGATORIOS',
        mensagem: 'O corpo da requisição deve conter o campo "itens".'
      });
    }

    const resultado = processarSimulacao(itens);
    return res.status(200).json(resultado);
  } catch (error) {
    if (error && error.status) {
      return res.status(error.status).json({
        sucesso: false,
        codigo: error.codigo || 'ERRO_VALIDACAO',
        mensagem: error.mensagem || 'Falha na validação da simulação.'
      });
    }
    return next(error);
  }
});

export default router;

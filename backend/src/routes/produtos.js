/**
 * Rota de Catálogo de Produtos - Elite Game Store
 * GET /api/produtos
 */

import { Router } from 'express';
import { listarProdutos } from '../data/produtos.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const produtos = listarProdutos();
    return res.status(200).json({
      sucesso: true,
      total: produtos.length,
      produtos: produtos
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      codigo: 'ERRO_LISTAGEM_PRODUTOS',
      mensagem: 'Não foi possível carregar o catálogo de produtos no momento.'
    });
  }
});

export default router;

import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Caminho absoluto para o arquivo JSON que armazena os pedidos
const ordersFilePath = path.resolve('backend/data/orders.json');

function lerPedidos() {
  try {
    const raw = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function gravarPedidos(pedidos) {
  fs.writeFileSync(ordersFilePath, JSON.stringify(pedidos, null, 2), 'utf-8');
}

// GET /api/pedidos – lista todos os pedidos
router.get('/', (req, res) => {
  const pedidos = lerPedidos();
  res.json({ sucesso: true, pedidos });
});

// POST /api/pedidos – cria um novo pedido
router.post('/', (req, res) => {
  const novoPedido = req.body; // esperado: { itens, resumo, data }
  if (!novoPedido || !novoPedido.itens) {
    return res.status(400).json({ sucesso: false, mensagem: 'Payload inválido' });
  }
  const pedidos = lerPedidos();
  const pedidoComId = { ...novoPedido, id: Date.now() };
  pedidos.push(pedidoComId);
  gravarPedidos(pedidos);
  res.status(201).json({ sucesso: true, pedido: pedidoComId });
});

export default router;

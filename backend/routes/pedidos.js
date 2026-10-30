import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();

// Caminho para o arquivo JSON de pedidos (usa tmpdir em ambientes serverless como Vercel)
const ordersFilePath = process.env.VERCEL
  ? path.join(os.tmpdir(), 'orders.json')
  : path.resolve('backend/data/orders.json');

function lerPedidos() {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    const raw = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function gravarPedidos(pedidos) {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ordersFilePath, JSON.stringify(pedidos, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Não foi possível persistir pedidos em disco:', err.message);
  }
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

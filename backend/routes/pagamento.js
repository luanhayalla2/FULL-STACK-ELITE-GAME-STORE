import express from 'express';
import Stripe from 'stripe';
import path from 'path';
import fs from 'fs';
import os from 'os';

const router = express.Router();

// Use Stripe test secret key (no real charge)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51Hxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// Helper to read orders (reuse same as pedidos route)
const ordersFilePath = process.env.VERCEL
  ? path.join(os.tmpdir(), 'orders.json')
  : path.resolve('backend/data/orders.json');

function readOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
  } catch (_) {
    return [];
  }
}

// POST /api/pagamento/checkout -> creates a test Checkout Session for an order id
router.post('/checkout', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId required' });
  }
  const orders = readOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  // Build line items from order.itens
  const lineItems = order.itens.map(item => ({
    price_data: {
      currency: 'brl',
      product_data: { name: item.nome },
      unit_amount: Math.round(item.precoUnitario * 100) // cents
    },
    quantity: item.quantidade
  }));

  const origin = req.headers.origin || (req.headers.host ? `${req.protocol || 'http'}://${req.headers.host}` : 'http://localhost:3002');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/sucesso.html`,
      cancel_url: `${origin}/cancelado.html`
    });
    res.json({ success: true, url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Stripe error' });
  }
});

export default router;

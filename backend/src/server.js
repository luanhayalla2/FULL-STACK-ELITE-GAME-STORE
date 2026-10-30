/**
 * Servidor Principal - Elite Game Store
 * Padrão de Engenharia de Software Sênior
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';
import produtosRouter from './routes/produtos.js';
import comprasRouter from './routes/compras.js';
import pedidosRouter from '../routes/pedidos.js';
import pagamentoRouter from '../routes/pagamento.js';


const app = express();
const PORT = process.env.PORT || 3002;

// Configuração de CORS - Permite integração local transparente com o front-end
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser seguro para JSON
app.use(express.json({ limit: '100kb' }));

// Middleware de tratamento para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      sucesso: false,
      codigo: 'JSON_MALFORMADO',
      mensagem: 'O formato do JSON enviado no corpo da requisição é inválido.'
    });
  }
  next(err);
});

// Middleware de log simples para depuração profissional
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check para monitoramento
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    servico: 'Elite Game Store API',
    versao: '1.0.0',
    autor: 'Luã Hayalla Oliveira Silva',
    dataHora: new Date().toISOString()
  });
});

// Registro de rotas da aplicação
app.use('/api/produtos', produtosRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/pagamento', pagamentoRouter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../frontend')));

// Fallback to index.html for client‑side routing (except API routes)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
  } else {
    res.status(404).json({ sucesso: false, codigo: 'ROTA_NAO_ENCONTRADA', mensagem: `A rota "${req.method} ${req.originalUrl}" não foi encontrada no servidor.` });
  }
});

// Tratamento de rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    codigo: 'ROTA_NAO_ENCONTRADA',
    mensagem: `A rota "${req.method} ${req.originalUrl}" não foi encontrada no servidor.`
  });
});

// Middleware de erro interno (500)
app.use((err, req, res, next) => {
  console.error('Erro interno capturado:', err);
  res.status(500).json({
    sucesso: false,
    codigo: 'ERRO_INTERNO',
    mensagem: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
  });
});

// Exporta o app para facilitar testes unitários/integrados
export default app;

// Se executado diretamente pelo Node, inicializa a escuta
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log('   ELITE GAME STORE — API REST INICIADA COM SUCESSO');
    console.log('====================================================');
    console.log(`-> Servidor rodando em: http://localhost:${PORT}`);
    console.log(`-> Catálogo:            http://localhost:${PORT}/api/produtos`);
    console.log(`-> Simulação:           http://localhost:${PORT}/api/compras/simular`);
    console.log(`-> Health Check:        http://localhost:${PORT}/api/health`);
    console.log('====================================================');
  });
}

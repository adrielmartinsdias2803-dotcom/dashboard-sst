import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/trpc';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint para o tRPC
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// Endpoint de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;

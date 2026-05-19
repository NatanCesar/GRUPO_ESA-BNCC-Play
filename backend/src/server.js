import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import sessionsRouter from './routes/sessions.js';
import { registerSocketHandlers } from './socket/handlers.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_ORIGIN },
});

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

// Injeta io em cada request para os controllers emitirem eventos
app.use((req, _res, next) => {
    req.io = io;
    next();
});

app.use('/api', sessionsRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

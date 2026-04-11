import express from 'express';
import serverRoutes from './routes/serverRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
const app = express();
const port = 3000;

app.use(express.json());

app.use('/', serverRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
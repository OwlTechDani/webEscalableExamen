import express, { type Application, type ErrorRequestHandler } from 'express';
import cors from 'cors';
import router from '../routes/persons.routes.ts';
import { dbConnection } from '../database/config.ts';

export class Server {
  public readonly app: Application;
  private readonly port = Number(process.env['PORT'] ?? 8080);
  private readonly apiPaths = { persons: '/api/persons' };

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errors();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use(this.apiPaths.persons, router);
  }

  private errors(): void {
    this.app.use((_req, res) => {
      res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
    });
    const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
      if (error?.type === 'entity.parse.failed') {
        res.status(400).json({ ok: false, message: 'JSON invalido' });
        return;
      }
      res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    };
    this.app.use(handleError);
  }

  public async listen() {
    // No aceptar solicitudes antes de que MongoDB esté disponible.
    await dbConnection();
    return this.app.listen(this.port, () => {
      console.log('Servidor escuchando el puerto ' + this.port);
    });
  }
}

import { Server } from './models/server.ts';

const server = new Server();
server.listen().catch(() => {
  console.error('No se pudo iniciar el servidor. Revisa MONGODB_URI y la disponibilidad de MongoDB.');
  process.exitCode = 1;
});

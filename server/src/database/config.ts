import mongoose from 'mongoose';

export async function dbConnection(): Promise<void> {
  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    throw new Error('Falta MONGODB_URI. Configura server/.env siguiendo .env.example.');
  }

  await mongoose.connect(uri, {
    dbName: process.env['MONGODB_DB_NAME'] ?? 'directorio-db',
    serverSelectionTimeoutMS: 5000,
  });
  console.log('Base de datos conectada con exito');
}

import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { Server as HttpServer } from 'node:http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { dbConnection } from '../src/database/config.ts';
import { Server } from '../src/models/server.ts';
import { PersonModel } from '../src/models/person.model.ts';

let mongo: MongoMemoryServer;
let server: HttpServer;
let base: string;
const originalUri = process.env['MONGODB_URI'];
const originalDb = process.env['MONGODB_DB_NAME'];
const person = { name: 'Ana López', username: 'anal', email: 'ana@example.com', image: '' };

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env['MONGODB_URI'] = mongo.getUri();
  process.env['MONGODB_DB_NAME'] = 'directorio-test';
  await dbConnection();
  server = new Server().app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  base = `http://127.0.0.1:${address.port}/api/persons`;
});

after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await mongoose.disconnect();
  await mongo?.stop();
  if (originalUri === undefined) delete process.env['MONGODB_URI'];
  else process.env['MONGODB_URI'] = originalUri;
  if (originalDb === undefined) delete process.env['MONGODB_DB_NAME'];
  else process.env['MONGODB_DB_NAME'] = originalDb;
});

function write(method: string, data: unknown) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}

test('CRUD persiste en MongoDB, genera _id y devuelve la versión actualizada', async () => {
  const created = await fetch(base, write('POST', { ...person, _id: 'no-permitido', role: 'admin' }));
  assert.equal(created.status, 201);
  const { ok, data } = await created.json();
  assert.equal(ok, true);
  assert.match(data._id, /^[a-f\d]{24}$/);
  assert.equal(data.role, undefined);
  assert.equal((await PersonModel.findById(data._id))?.name, person.name);

  const byId = await fetch(`${base}/${data._id}`);
  assert.equal(byId.status, 200);
  assert.equal((await byId.json()).username, person.username);

  const updated = await fetch(`${base}/${data._id}`, write('PUT', { ...person, name: 'Ana editada' }));
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).data.name, 'Ana editada');
  assert.equal((await PersonModel.findById(data._id))?.name, 'Ana editada');

  const removed = await fetch(`${base}/${data._id}`, { method: 'DELETE' });
  assert.equal(removed.status, 200);
  assert.equal(await PersonModel.findById(data._id), null);
  for (const method of ['GET', 'DELETE', 'PUT']) {
    const response = await fetch(`${base}/${data._id}`, method === 'PUT' ? write(method, person) : { method });
    assert.equal(response.status, 404);
  }
});

test('filtro parcial por nombre o username sin distinguir mayúsculas, con regex literal', async () => {
  await PersonModel.create([
    person,
    { ...person, name: 'Beatriz', username: 'ANALISTA' },
    { ...person, name: 'Carlos', username: 'c++' },
  ]);
  const filtered = await fetch(`${base}?searchTerm=ANA`);
  assert.equal(filtered.status, 200);
  assert.equal((await filtered.json()).length, 2);
  const literal = await fetch(`${base}?searchTerm=${encodeURIComponent('c++')}`);
  assert.equal((await literal.json()).length, 1);
  const all = await fetch(base);
  assert.equal((await all.json()).length, 3);
  const empty = await fetch(`${base}?searchTerm=no-existe`);
  assert.deepEqual(await empty.json(), []);
  await PersonModel.deleteMany({});
});

test('body ausente, incompleto o de tipo incorrecto responde 400 sin insertar documentos', async () => {
  const noBody = await fetch(base, { method: 'POST' });
  assert.equal(noBody.status, 400);
  for (const data of [null, [], {}, { ...person, name: '  ' }, { ...person, username: 12 }, { ...person, image: {} }]) {
    const response = await fetch(base, write('POST', data));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  }
  assert.equal(await PersonModel.countDocuments(), 0);
});

test('image es opcional y se validan datos de actualización', async () => {
  const { image, ...withoutImage } = person;
  const created = await fetch(base, write('POST', withoutImage));
  assert.equal(created.status, 201);
  const { data } = await created.json();
  assert.equal(data.image, '');
  const invalid = await fetch(`${base}/${data._id}`, write('PUT', { name: 'Incompleto' }));
  assert.equal(invalid.status, 400);
  assert.equal((await PersonModel.findById(data._id))?.name, person.name);
  await PersonModel.deleteMany({});
});

test('IDs inválidos, filtros repetidos, JSON malformado y rutas inexistentes', async () => {
  for (const method of ['GET', 'DELETE', 'PUT']) {
    const response = await fetch(`${base}/id-invalido`, method === 'PUT' ? write(method, person) : { method });
    assert.equal(response.status, 400);
  }
  const filter = await fetch(`${base}?searchTerm=ana&searchTerm=otro`);
  assert.equal(filter.status, 400);
  const malformed = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).ok, false);
  const missing = await fetch(`${base}/otra/ruta`);
  assert.equal(missing.status, 404);
});

test('el esquema también rechaza documentos sin campos obligatorios', async () => {
  await assert.rejects(new PersonModel({ name: 'Solo nombre' }).validate(), /email.*obligatorio|username.*obligatorio/);
});

test('un fallo de MongoDB responde 500 con JSON y no expone detalles internos', async () => {
  await mongoose.disconnect();
  const response = await fetch(base);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { ok: false, message: 'Error al obtener los datos' });
  const id = '507f1f77bcf86cd799439011';
  for (const [method, path] of [['GET', `/${id}`], ['POST', ''], ['PUT', `/${id}`], ['DELETE', `/${id}`]]) {
    const result = await fetch(base + path, method === 'POST' || method === 'PUT' ? write(method, person) : { method });
    assert.equal(result.status, 500);
    assert.equal((await result.json()).ok, false);
  }
});

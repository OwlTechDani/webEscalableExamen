import type { Request, Response } from 'express';
import { isObjectIdOrHexString } from 'mongoose';
import { PersonModel } from '../models/person.model.ts';

interface PersonInput {
  name: string;
  email: string;
  username: string;
  image: string;
}

function readPerson(body: unknown): PersonInput | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { name, email, username, image } = body as Record<string, unknown>;
  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof username !== 'string' || !username.trim() ||
    (image !== undefined && typeof image !== 'string')
  ) return null;

  // Solo se aceptan los campos del esquema; _id y operadores no provienen del body.
  return { name: name.trim(), email: email.trim(), username: username.trim(), image: image?.trim() ?? '' };
}

function validId(req: Request, res: Response): string | null {
  const id = req.params['id'];
  if (typeof id !== 'string' || !isObjectIdOrHexString(id)) {
    res.status(400).json({ ok: false, message: 'ID invalido' });
    return null;
  }
  return id;
}

export const getPersons = async (req: Request, res: Response): Promise<void> => {
  const searchTerm = req.query['searchTerm'];
  if (searchTerm !== undefined && typeof searchTerm !== 'string') {
    res.status(400).json({ ok: false, message: 'searchTerm debe ser un texto' });
    return;
  }

  // La búsqueda es por texto literal, aunque incluya símbolos de expresiones regulares.
  const search = searchTerm?.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const query = search ? {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ],
  } : {};

  try {
    const persons = await PersonModel.find(query);
    res.status(200).json(persons);
  } catch {
    res.status(500).json({ ok: false, message: 'Error al obtener los datos' });
  }
};

export const getPersonById = async (req: Request, res: Response): Promise<void> => {
  const id = validId(req, res);
  if (!id) return;
  try {
    const person = await PersonModel.findById(id);
    if (!person) {
      res.status(404).json({ ok: false, message: 'Elemento no encontrado' });
      return;
    }
    res.status(200).json(person);
  } catch {
    res.status(500).json({ ok: false, message: 'Error al obtener el elemento' });
  }
};

export const createPerson = async (req: Request, res: Response): Promise<void> => {
  const data = readPerson(req.body);
  if (!data) {
    res.status(400).json({ ok: false, message: 'Datos invalidos: name, email y username son obligatorios; image es opcional' });
    return;
  }
  try {
    const person = new PersonModel(data);
    await person.save();
    res.status(201).json({ ok: true, message: 'Elemento creado con exito', data: person });
  } catch {
    res.status(500).json({ ok: false, message: 'Error al crear el elemento' });
  }
};

export const updatePerson = async (req: Request, res: Response): Promise<void> => {
  const id = validId(req, res);
  if (!id) return;
  const data = readPerson(req.body);
  if (!data) {
    res.status(400).json({ ok: false, message: 'Datos invalidos: name, email y username son obligatorios; image es opcional' });
    return;
  }
  try {
    const person = await PersonModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true });
    if (!person) {
      res.status(404).json({ ok: false, message: 'Elemento no encontrado' });
      return;
    }
    res.status(200).json({ ok: true, message: 'Elemento actualizado con exito', data: person });
  } catch {
    res.status(500).json({ ok: false, message: 'Error al actualizar el elemento' });
  }
};

export const deletePerson = async (req: Request, res: Response): Promise<void> => {
  const id = validId(req, res);
  if (!id) return;
  try {
    const result = await PersonModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      res.status(404).json({ ok: false, message: 'Elemento no encontrado' });
      return;
    }
    res.status(200).json({ ok: true, message: 'Elemento eliminado con exito' });
  } catch {
    res.status(500).json({ ok: false, message: 'Error al eliminar el elemento' });
  }
};

import { Schema, model } from 'mongoose';

const personSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email: { type: String, required: [true, 'El email es obligatorio'], trim: true },
  username: { type: String, required: [true, 'El username es obligatorio'], trim: true },
  image: { type: String, default: '', trim: true },
}, {
  // La clase termina usando people (plural de Person); se declara para evitar ambigüedad.
  collection: 'people',
  versionKey: false,
  bufferCommands: false,
});

export const PersonModel = model('Person', personSchema);

import { Router } from 'express';
import { createPerson, deletePerson, getPersonById, getPersons, updatePerson } from '../controllers/persons.controller.ts';

const router = Router();

router.get('/', getPersons);
router.get('/:id', getPersonById);
router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;

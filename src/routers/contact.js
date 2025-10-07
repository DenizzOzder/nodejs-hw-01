import express from 'express';
import {
  getContactByIdController,
  getContactsController,
  AddContactCtrl,
  deleteByID,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema, patchSchema } from '../validators/contact.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(contactSchema), ctrlWrapper(AddContactCtrl));
/*
TODO: Patch Rotası Eklenecek ( unutmuşuz :) )
TODO: Paginationlar dahil edilecek

*/
router.patch('/:id', isValidId, validateBody(patchSchema), ctrlWrapper());
router.delete('/:id', isValidId, ctrlWrapper(deleteByID));

export default router;

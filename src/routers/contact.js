import express from 'express';
import {
  getContactByIdController,
  getContactsController,
  AddContactCtrl,
  deleteByID,
  updateContactByIdController, // <-- eklendi
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema, patchSchema } from '../validators/contact.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js'; // <-- eklendi

const router = express.Router();

// Tüm kontak rotaları için kimlik doğrulama
router.use(authenticate);

// GET /contacts
router.get('/', ctrlWrapper(getContactsController));

// GET /contacts/:id
router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

// POST /contacts
router.post('/', validateBody(contactSchema), ctrlWrapper(AddContactCtrl));

// PATCH /contacts/:id
router.patch(
  '/:id',
  isValidId,
  validateBody(patchSchema),
  ctrlWrapper(updateContactByIdController), // <-- düzeltildi
);

// DELETE /contacts/:id
router.delete('/:id', isValidId, ctrlWrapper(deleteByID));

export default router;

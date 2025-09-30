import express from 'express';
import {
  getContactByIdController,
  getContactsController,
  AddContactCtrl,
  deleteByID,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:id', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(AddContactCtrl));
router.delete('/:id', ctrlWrapper(deleteByID));

export default router;

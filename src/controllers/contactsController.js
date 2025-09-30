import mongoose from 'mongoose';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import httpErrors from 'http-errors';

export async function getContactsController(_req, res, next) {
  const contacts = await getAllContacts();
  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
export async function getContactByIdController(req, res, next) {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
    return next(httpErrors(404, 'Contact not Found'));
  }
  return res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}

export async function AddContactCtrl(req, res) {
  const contact = req.body;
  const data = await addContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
}

export async function deleteByID(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw httpErrors(400, 'Invalid id format');
  }
  const deleted = await deleteContact(id);
  if (!deleted) {
    throw httpErrors(404, 'Contact not found');
  }
  res.status(204).end();
}

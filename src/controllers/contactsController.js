import mongoose from 'mongoose';
import httpErrors from 'http-errors';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import { updateContactById } from '../services/contacts.js';
import { parsePagination } from '../utils/parsePagination.js';
import { parseSortParam } from '../utils/parseSortParam.js';
import { saveFileUpload } from '../utils/saveFileUpload.js';
import { saveFileCloud } from '../utils/saveFileCloud.js';

// GET /contacts  -> Sadece oturum sahibinin kontakları
export async function getContactsController(req, res) {
  const userId = req.user._id;

  const { page, perPage } = parsePagination(req.query);
  const { sortBy, sortOrder } = parseSortParam(req.query);

  const result = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result, // { data, pagination }
  });
}

// GET /contacts/:id  -> Sadece kendi kaydı ise getir
export async function getContactByIdController(req, res, next) {
  const userId = req.user._id;
  const { id: contactId } = req.params;

  const contact = await getContactById({ userId, contactId });
  if (!contact) {
    return next(httpErrors(404, 'Contact not found'));
  }

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}

// POST /contacts  -> userId daima oturum sahibinden
export async function AddContactCtrl(req, res) {
  const userId = req.user._id;
  const body = req.body;

  const resim = req.file;
  let resimUrl;
  if (resim) {
    resimUrl = await saveFileCloud(resim);
  }
  const created = await addContact(userId, body, { photo: resimUrl }); // service, body.userId'yi override eder
  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: created,
  });
}

// DELETE /contacts/:id  -> Sadece kendi kaydı ise sil
export async function deleteByID(req, res) {
  const userId = req.user._id;
  const { id: contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw httpErrors(400, 'Invalid id format');
  }

  const deleted = await deleteContact({ userId, contactId });
  if (!deleted) {
    throw httpErrors(404, 'Contact not found');
  }

  // 204 No Content
  return res.status(204).end();
}

export async function updateContactByIdController(req, res, next) {
  const userId = req.user._id;
  const { id: contactId } = req.params;

  const updated = await updateContactById({
    userId,
    contactId,
    body: req.body,
  });
  if (!updated) {
    return next(httpErrors(404, 'Contact not found'));
  }

  return res.status(200).json({
    status: 200,
    message: 'Updated',
    data: updated,
  });
}

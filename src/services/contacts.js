import mongoose from 'mongoose';
import { Contact } from '../models/contact.js';
import { calculatePagination } from '../utils/calculatePagination.js';
import { DEFAULT_PAGINATION_VALUES } from '../constants/pagination.js';

// GET /contacts
export async function getAllContacts({
  userId,
  page = DEFAULT_PAGINATION_VALUES.page,
  perPage = DEFAULT_PAGINATION_VALUES.perPage,
  sortBy = DEFAULT_PAGINATION_VALUES.sortBy,
  sortOrder = DEFAULT_PAGINATION_VALUES.sortOrder,
}) {
  const skip = (page - 1) * perPage;
  const order = sortOrder === 'asc' ? 1 : -1;

  const filter = { userId };
  const totalData = await Contact.countDocuments(filter);

  const data = await Contact.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(perPage)
    .lean();

  const pagination = calculatePagination(totalData, page, perPage);
  return { data, pagination };
}

// GET /contacts/:id
export async function getContactById({ userId, contactId }) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return await Contact.findOne({ _id: contactId, userId }).lean();
}

// POST /contacts
export async function addContact(userId, contactData) {
  // İstemciden gelen body'deki userId'yi YOK SAY ve oturum sahibini yaz
  const doc = await Contact.create({ ...contactData, userId });
  return doc.toObject(); // transform varsa password vs. zaten filtrelenir
}

// DELETE /contacts/:id
export async function deleteContact({ userId, contactId }) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  // Sadece oturum sahibinin kaydını sil
  const deleted = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  }).lean();
  return deleted; // bulunamazsa null döner
}

export async function updateContactById({ userId, contactId, body }) {
  if (!mongoose.isValidObjectId(contactId)) return null;

  // Sadece oturum sahibine ait kaydı günceller
  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    body,
    { new: true }, // güncellenmiş dökümanı döndür
  ).lean();

  return updated; // bulunamazsa null
}

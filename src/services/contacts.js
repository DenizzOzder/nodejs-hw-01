import mongoose from 'mongoose';
import { Contact } from '../models/contact.js';
import { calculatePagination } from '../utils/calculatePagination.js';
import { DEFAULT_PAGINATION_VALUES } from '../constants/pagination.js';

// Tümünü getir
export async function getAllContacts(
  page = DEFAULT_PAGINATION_VALUES.page,
  perPage = DEFAULT_PAGINATION_VALUES.perPage,
  sortBy = DEFAULT_PAGINATION_VALUES.sortBy,
  sortOrder = DEFAULT_PAGINATION_VALUES.sortOrder,
) {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  const totalData = await Contact.countDocuments();
  const pagination = calculatePagination(totalData, page, perPage);
  const data = await Contact.find({})
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({
      [sortBy]: sortOrder,
    });

  return {
    data,
    pagination,
  };
}

// ID'ye göre getir
export async function getContactById(contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return await Contact.findById(contactId).lean();
}

export async function addContact(contactData) {
  const data = await Contact.create(contactData);
  return data;
}
export async function deleteContact(contactId) {
  const data = await Contact.findByIdAndDelete(contactId);
  return data;
}

import mongoose from 'mongoose';
import { Contact } from '../models/contact.js';

// Tümünü getir
export async function getAllContacts() {
  return await Contact.find({}).lean();
}

// ID'ye göre getir
export async function getContactById(contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return await Contact.findById(contactId).lean();
}

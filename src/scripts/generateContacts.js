import { PATH_DB } from "../constants/contacts.js";
import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const generateContacts = async (number) => {
  console.log("DB PATH:", PATH_DB);

  const contacts = await readContacts();
  console.log("Başlangıç kişi sayısı:", contacts.length);

  for (let i = 0; i < number; i++) {
    const newContact = createFakeContact();
    contacts.push(newContact);
  }
  await writeContacts(contacts);
  const after = await readContacts();
  console.log("Güncel Liste: ", contacts.length)
};

generateContacts(5);

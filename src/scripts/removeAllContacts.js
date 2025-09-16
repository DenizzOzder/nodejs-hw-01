import { writeContacts } from "../utils/writeContacts.js";

export const removeAllContacts = async () => {
    console.log("Her şey siliniyor...")
    await writeContacts([]);
    console.log("Tüm bilgiler silindi.")
};

removeAllContacts();

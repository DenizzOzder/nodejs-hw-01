import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

export const removeLastContact = async () => {
    const data = await readContacts();
    const silinen = data.pop();
    data.length > 0 ? console.log("Dizi elemanı var") : console.log("Gelen veri boş herhangi bir işlem yapmadım.");
    console.log("Silinen İletişim --> ", silinen);
    console.log("Güncel Liste: ", data);
    writeContacts(data);
};

removeLastContact();

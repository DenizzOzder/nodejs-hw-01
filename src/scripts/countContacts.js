import { readContacts } from "../utils/readContacts.js";
export const countContacts = async () => {
    const data = await readContacts();
    console.log("Veritabanındaki İletişim Bilgisi Sayısı: ",data.length);
};

console.log(await countContacts());

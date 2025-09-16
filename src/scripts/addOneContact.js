import { faker } from "@faker-js/faker";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

export const addOneContact = async () => {
    const addOne = [{
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    job: faker.person.jobTitle(),
    }
    ];
    const data = await readContacts();
    console.log(" Güncel Liste: ", data.length);

    data.push(addOne);
    await writeContacts(data);
    console.log("Güncellendikten sonra Liste: ",data.length);
    console.log("Eklenen Data: ", addOne);

};

addOneContact();

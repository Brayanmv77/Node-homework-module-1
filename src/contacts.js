const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("src/db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(`${error.message}`);
  }
}


async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    let contact = null;

    for (let i = 0; i < contacts.length; i += 1) {
      if (contacts[i].id == contactId) {
        contact = contacts[i];
        break;
      }
    }

    if (contact) {
      return contact;
    } else {
      console.log("Contact not found");
      return null;
    }
  } catch (error) {
    console.log(`${error.message}`);
  }
}


async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    let remainingContacts = null;

    for (let i = 0; i < contacts.length; i += 1) {
      if (contacts[i].id == contactId) {
        // Metodo splice para remover el contacto
        contacts.splice(i, 1);
        remainingContacts = contacts;
        break;
      }
    }

    if (remainingContacts !== null) {
      // Contact was found and removed
      console.log(`Contact removed!`);
      await fs.writeFile(
        contactsPath,
        JSON.stringify(remainingContacts, null, 2)
      );
      return remainingContacts;
    } else {
      // Contact was not found
      console.log("Contact not found.");
      return null;
    }
  } catch (error) {
    console.log(`${error.message}`);
  }
}


async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    // Funcion para comprobar si el contacto existe
    const contactExists = contacts.some(
      (contact) =>
        contact.name === name &&
        contact.email === email &&
        contact.phone === phone
    );

    if (contactExists) {
      console.log("Contact already exists.");
      return;
    }


    // Función para generar un ID único
    function generateUniqueId(contacts) {
      let newId = 1;

      // Para encontrar el próximo ID no utilizado
      while (contacts.some((contact) => contact.id === newId.toString())) {
        newId += 1;
      }

      return newId.toString();
    }

    const newId = generateUniqueId(contacts);

    const newContact = {
      id: newId,
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    contacts.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Contact added successfully.");
    return contacts;
  } catch (error) {
    console.log(`${error.message}`);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

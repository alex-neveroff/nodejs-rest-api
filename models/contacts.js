import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");
const updateContactsStorage = (allContacts) =>
  fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

const listContacts = async () => {
  const allContacts = await fs.readFile(contactsPath);
  return JSON.parse(allContacts);
};

const getContactById = async (contactId) => {
  const stringedId = String(contactId);
  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === stringedId);
  return foundContact || null;
};

const addContact = async ({ name, email, phone }) => {
  const stringedPhone = String(phone);
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone: stringedPhone,
  };
  allContacts.push(newContact);
  await updateContactsStorage(allContacts);
  return newContact;
};

const updateContact = async (contactId, { name, email, phone }) => {
  const stringedId = String(contactId);
  const stringedPhone = String(phone);
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === stringedId);
  if (index === -1) {
    return null;
  }
  allContacts[index] = {
    id: stringedId,
    name,
    email,
    phone: stringedPhone,
  };
  await updateContactsStorage(allContacts);
  return allContacts[index];
};

const removeContact = async (contactId) => {
  const stringedId = String(contactId);
  const allContacts = await listContacts();
  const foundContact = allContacts.find((contact) => contact.id === stringedId);
  if (foundContact) {
    const withoutRemovedContact = allContacts.filter(
      (contact) => contact.id !== stringedId
    );
    await updateContactsStorage(allContacts);
  }
  return foundContact || null;
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

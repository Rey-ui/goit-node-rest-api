import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import Contact from "../schemas/contacsSchemas.js";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const contacts = await Contact.find();
  return contacts;
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const index = await Contact.findByIdAndDelete(contactId);
  if (index === -1) {
    return null;
  }
  return index;
}

async function addContact(contact) {
  const contacts = await Contact.create(contact);

  return contacts;
}
async function updateContact(id, contact) {
  const contacts = await Contact.findByIdAndUpdate(id, contact);
  if (contacts === -1) {
    return null;
  }
  return contacts;
}
async function updateStatusContact(contactId, update) {
  const existingContact = await Contact.findById(contactId);
  if (!existingContact) {
    return null;
  }

  const contact = await Contact.findByIdAndUpdate(contactId, update, {
    new: true,
  });

  return contact;
}
export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

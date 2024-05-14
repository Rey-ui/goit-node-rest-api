import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/httpError.js";
import { createContactSchema } from "../schemas/contacsSchemas.js";
export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  console.log(contacts);
  return res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const contactId = await contactsService.getContactById(req.params.id);
  if (contactId) {
    return res.status(200).json(contactId);
  } else {
    return res.send({ message: HttpError(404) });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const deleteContact = await contactsService.removeContact(req.params.id);
  if (id) {
    return res.status(200).json(deleteContact);
  } else {
    return res.send({ message: HttpError(404) });
  }
};

export const createContact = async (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const addContact = await contactsService.addContact(req.body);
  return res.status(201).send(addContact);
};

export const updateContact = async (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const updateContact = await contactsService.updateContact(
    req.params.id,
    req.body
  );
  if (updateContact) {
    return res.status(200).send(updateContact);
  } else {
    return res.status(404).json({ message: "Not found" });
  }
};

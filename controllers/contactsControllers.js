//import contactsService from "../services/contactsServices.js";
//import HttpError from "../helpers/httpError.js";
import mongoose from "mongoose";
import Contact from "../models/contacsSchemas.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactSchemaFavorite,
} from "../schemas/joiSchemas.js";
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};
export const getOneContact = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }
  try {
    const contactId = await Contact.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (typeof contactId === "undefined") {
      return null;
    }
    if (!contactId) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contactId);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }
  try {
    const deleteContact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (deleteContact) {
      return res.status(200).json(deleteContact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  const owner = req.user.id;
  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const addContact = await Contact.create({ ...req.body, owner });
    return res.status(201).send(addContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  const owner = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }
  const { error } = updateContactSchema.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const updateContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: owner },
      req.body,
      { new: true }
    );
    if (updateContact === -1) {
      return null;
    }
    if (updateContact) {
      return res.status(200).send(updateContact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateContactFavorite = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }
  const contact = {
    favorite: req.body.favorite,
  };

  const owner = req.user.id;
  const { error } = updateContactSchemaFavorite.validate(contact, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const updateContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: owner },
      contact,
      { new: true }
    );
    if (updateContact) {
      return res.status(200).send(updateContact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

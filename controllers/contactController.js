const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModel");

// GET api/contact/ (private)
const getContacts = asyncHandler(async (req, res, next) => {
  const constacts = await Contacts.find({ user_id: req.user.id });
  res.status(200).json(constacts);
});

// POST api/contact/ (private)
const createContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }
  Contacts.create({ name, email, phone, user_id: req.user.id })
    .then((user) => {
      console.log("New user created:", user);
      res.status(201).json({
        message: "Contact created successfully",
      });
    })
    .catch((error) => {
      console.error("Error creating contact", error);
    });
});

// GET api/contact/:id (private)
const getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

// PUT api/contact/:id (private)
const updateContact = asyncHandler(async (req, res, next) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contacts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// DELETE api/contact/:id (private)
const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }

  await Contacts.findByIdAndDelete(req.params.id);
  res.status(200).send({
    message: "Contact deleted successfully",
    contact,
  });
});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContact,
};

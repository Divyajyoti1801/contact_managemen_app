//ALL THE BASIC CRUD OPERATIONS.

const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get All Contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
})

//@desc Create New Contacts
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
    console.log("The Request body", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("Need All the Fields. Mandatory!")
    }
    const contact = await Contact.create({ name, email, phone,user_id:req.user.id });
    res.status(201).json(contact);
});

//@desc Get Contact
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        req.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc Update Contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
     if (!contact) {
        req.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Don't have permission to update this data");
    }

    const updateContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(updateContact);
});


//@desc Delete Contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
     if (!contact) {
        req.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Don't have permission to delete this data");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(201).json(contact);
}) 


module.exports = { getContacts,createContact,getContact,updateContact,deleteContact};
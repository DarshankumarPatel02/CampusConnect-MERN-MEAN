// controllers/contactController.js
const Contact = require('../model/Contact');

// Create a new contact
exports.createContact = async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const contact = new Contact({
        name,
        email,
        message,
      });
      await contact.save();
      res.status(201).json({ message: 'Contact created successfully', contact });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
};
// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

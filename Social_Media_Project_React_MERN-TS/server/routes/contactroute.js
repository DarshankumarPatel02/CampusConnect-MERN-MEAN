// routes/contact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST route for creating a new contact
router.post('/', contactController.createContact);

//Get all form submission data
router.get('/',contactController.getAllContacts);

//Delete using ID
router.delete('/:id',contactController.deleteContact);


module.exports = router;

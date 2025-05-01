const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware')
const path = require('path');
const { addBoardingListing } = require('../controllers/accomadationController');

// Route to add a boarding listing (requires user to be logged in)
router.post('/add-listing', verifyToken, addBoardingListing);



module.exports = router;

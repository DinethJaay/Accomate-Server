const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AccommodationRepository = require('../repositories/accomadationRepository');
const UserRepository = require('../repositories/userRepository');
const db = require("../config/db");

const userRepo = new UserRepository(db);
const accommodationRepo = new AccommodationRepository(db);

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../img'); 
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage }).array('images');

const addBoardingListing = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading images', error: err.message });
        }

        try {
            const formData = req.body;
            const userToken = req.user.uid;  // This comes from the verifyToken middleware

            // Check if the user exists
            const user = await userRepo.getUserById(userToken);
            if (!user || user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userObj = user[0];
            const imagePaths = req.files.map(file => `/img/${file.filename}`);

            // Save to DB with user ID
            const result = await accommodationRepo.addAccommodation(formData, userObj.id);
            const acc_id = result.insertId;

            if (!acc_id) {
                throw new Error('Failed to get accommodation ID after insertion');
            }

            // Save images, accessibility preferences, features, and property details
            await accommodationRepo.addImages(imagePaths, acc_id);
            await accommodationRepo.addAccessibilityPreferences(formData, acc_id, userObj.id);
            await accommodationRepo.addFeatures(formData, acc_id, userObj.id);
            await accommodationRepo.addPropertyDetails(formData, acc_id, userObj.id);

            return res.status(201).json({
                message: 'Accommodation listing added successfully',
                accommodationId: acc_id
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });
};

module.exports = {
    addBoardingListing,
};

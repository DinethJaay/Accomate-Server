const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const acc = require('./routes/accomadationRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static images from the img folder
app.use('/img', express.static('D:/Esost/Project/Accomate/server/img')); // <--- Added this line

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accommodation', acc);

// Error handling (always at the bottom)
app.use((err, req, res, next) => {
    res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

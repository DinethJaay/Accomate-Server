const admin = require('firebase-admin');
const serviceAccount = require('../config/accomate-58832-firebase-adminsdk-fbsvc-f8882eab2e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // storageBucket: 'bodo-app-18921.firebasestorage.app'
});

const firestore = admin.firestore();
// const bucket = admin.storage().bucket();

module.exports = { admin, firestore };

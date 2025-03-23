const db = require('../config/db');

(async () => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connected successfully. Test query result:', rows[0].solution);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

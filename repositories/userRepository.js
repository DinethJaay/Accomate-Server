class UserRepository {
    constructor(db) {
        this.db = db;
    }

    //check nic exists
    async nicExists(nic) {
        const nicCheckQuery = `
        SELECT COUNT(*) AS count FROM users WHERE nic = ?;
    `;
        const [rows] = await this.db.query(nicCheckQuery, [nic]);

        console.log('NIC Check Query Result:', rows);


        return rows[0].count > 0;
    }

    //check phone exists
    async phoneExist(phone) {
        const nicCheckQuery = `
        SELECT COUNT(*) AS count FROM users WHERE phone = ?;
    `;
        const [rows] = await this.db.query(nicCheckQuery, [phone]);

        console.log('Phone Check Query Result:', rows);


        return rows[0].count > 0;
    }

    //check email exists
    async emailExists(email) {
        const nicCheckQuery = `
        SELECT COUNT(*) AS count FROM users WHERE email = ?;
    `;
        const [rows] = await this.db.query(nicCheckQuery, [email]);

        console.log('Email Check Query Result:', rows);


        return rows[0].count > 0;
    }
     // Get user by userId
    async getUserById(userId) {
        const result = await this.db.query('SELECT * FROM users WHERE uId = ?', [userId]);
        return result[0]; // Assuming only one user is returned
    }

    //create new user
    async createUser(user) {
        const { uid, nic, name, phone, email, password, address, role } = user;

        const roleQuery = `
            SELECT id FROM roles WHERE role_name = ?;
        `;
        const [roleResult] = await this.db.query(roleQuery, [role]);

        if (!roleResult || roleResult.length === 0) {
            throw new Error(`Role '${role}' not found.`);
        }

        const roleId = roleResult[0].id;

        const userQuery = `
            INSERT INTO users (role_id, nic, name, phone, email, password, address, is_verified, created_at, uId)
            VALUES (?, ?, ?, ?, ?, ?, ?, false, NOW(), ?);
        `;
        const values = [roleId, nic, name, phone, email, password, address, uid];
        await this.db.query(userQuery, values);
    }

}

module.exports = UserRepository;

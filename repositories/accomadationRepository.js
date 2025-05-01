class AccommodationRepository {
    constructor(db) {
        this.db = db;
    }

    // Add new accommodation
    async addAccommodation(data, userId) {
        try {
            console.log('Adding accommodation with data:', data);

            // Ensure default values for missing properties
            const title = data.title || '';
            const description = data.description || '';
            const price = data.price || 0;
            const address = data.address || '';
            const city = data.city || '';
            const town = data.statezip || '';
            const country = data.country || 'Sri Lanka'; // Default to Sri Lanka if missing
            const status = data.status || 'pending';
            const category_id = data.category || 1; // Default category if not provided
            const pricing_type = data.pricingType || 'daily'; // Default to daily pricing type if missing

            const result = await this.db.query(
                'INSERT INTO accommodations (title, description, price, address, city, approved_by, conditions, status, category_id, pricing_type, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    title, description, price, address, city, null, data.conditions || null, status, category_id, pricing_type,
                    userId, userId
                ]
            );

            let insertId = result.insertId || result[0]?.insertId;
            return { insertId };
        } catch (error) {
            console.error('Error in addAccommodation:', error);
            throw error;
        }
    }

    // Add images to the images table
    async addImages(imagePaths, acc_id) {
        if (!acc_id) {
            throw new Error('Invalid accommodation ID provided to addImages');
        }

        for (const imagePath of imagePaths) {
            await this.db.query(
                'INSERT INTO images (acc_id, image_path, upload_date, status) VALUES (?, ?, ?, ?)',
                [acc_id, imagePath, new Date(), 'active']
            );
        }
    }

    // Add accessibility preferences
    async addAccessibilityPreferences(data, acc_id, userId) {
        console.log('Adding accessibility preferences with data:', data);

        // Handle missing data and apply defaults where needed
        const nosteps = data.noStep === 'true' || data.noStep === true ? 1 : 0;
        const grabbars = data.grabBars === 'true' || data.grabBars === true ? 1 : 0;
        const wheelchair = data.wheelchair === 'true' || data.wheelchair === true ? 1 : 0;
        const groundFloor = data.groundFloor === 'true' || data.groundFloor === true ? 1 : 0;

        const query = 'INSERT INTO accessibility_preferences (acc_id, nosteps, grabbars, wheelchair, ground_floor, status, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [acc_id, nosteps, grabbars, wheelchair, groundFloor, 'active', userId, userId];

        await this.db.query(query, params);
    }

    // Add features
    async addFeatures(data, acc_id, userId) {
        // Handle missing data and apply defaults where needed
        const singleBeds = data.singleBeds === 'true' || data.singleBeds === true ? 1 : 0;
        const doubleBeds = data.doubleBeds === 'true' || data.doubleBeds === true ? 1 : 0;
        const pantry = data.pantry === 'true' || data.pantry === true ? 1 : 0;
        const kitchen = data.kitchen === 'true' || data.kitchen === true ? 1 : 0;
        const livingRoom = data.livingRoom === 'true' || data.livingRoom === true ? 1 : 0;
        const cctv = data.cctv === 'true' || data.cctv === true ? 1 : 0;
        const separateEntrance = data.separateEntrance === 'true' || data.separateEntrance === true ? 1 : 0;
        const furnished = data.furnished === 'true' || data.furnished === true ? 1 : 0;
        const brandNew = data.brandNew === 'true' || data.brandNew === true ? 1 : 0;

        const query = 'INSERT INTO features (acc_id, singlebeds, doublebeds, pantry, kitchen, livingroom, cctv, seperateentrance, furnished, brandnew, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [acc_id, singleBeds, doubleBeds, pantry, kitchen, livingRoom, cctv, separateEntrance, furnished, brandNew, userId, userId];

        await this.db.query(query, params);
    }

    // Add property details
    async addPropertyDetails(data, acc_id, userId) {

        console.log('Adding property details with data:', data);
        const bedrooms = parseInt(data.bedrooms || 0, 10);
        const bathrooms = parseInt(data.bathrooms || 0, 10);
        const sqft_living = parseInt(data.sqftLiving || 0, 10);
        const sqft_lot = parseInt(data.sqftLot || 0, 10);
        const floors = parseInt(data.floors || 1, 10);
        const waterfront = data.waterfront === 'true' || data.waterfront === true ? 1 : 0;
        const view = parseInt(data.view || 0, 10);
        const condition = parseInt(data.condition || 0, 10);
        const sqft_above = parseInt(data.sqftAbove || 0, 10);
        const sqft_basement = parseInt(data.sqftBasement || 0, 10);
        const yr_built = parseInt(data.yrBuilt || new Date().getFullYear(), 10);
        const yr_renovated = data.yrRenovated ? parseInt(data.yrRenovated, 10) : null;

        const query = 'INSERT INTO property (acc_id, bedrooms, bathrooms, bathroomType, time_period, sqft_living, sqft_lot, floors, waterfront, view, `condition`, sqft_above, sqft_basement, yr_built, yr_renovated, city, statezip, country, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [acc_id, bedrooms, bathrooms, data.bathroomType || 0, data.timePeriod || 0, sqft_living, sqft_lot, floors, waterfront, view, condition, sqft_above, sqft_basement, yr_built, yr_renovated, data.city || '', data.statezip || '', data.country || 'Sri Lanka', userId, userId];

        await this.db.query(query, params);
    }
}

module.exports = AccommodationRepository;

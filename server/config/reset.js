import { pool } from "./database.js";

const createTables = async () => {
    const createTablesQuery = `
        DROP TABLE IF EXISTS incompatible_options CASCADE;
        DROP TABLE IF EXISTS custom_cars CASCADE;
        DROP TABLE IF EXISTS car_options CASCADE;

        CREATE TABLE IF NOT EXISTS car_options (
            id SERIAL PRIMARY KEY,
            category VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            price INTEGER NOT NULL DEFAULT 0,
            visual_value VARCHAR(255) NOT NULL,
            is_default BOOLEAN DEFAULT FALSE
        );
        
        CREATE TABLE IF NOT EXISTS custom_cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            exterior_id INTEGER REFERENCES car_options(id) ON DELETE RESTRICT,
            roof_id INTEGER REFERENCES car_options(id) ON DELETE RESTRICT,
            wheels_id INTEGER REFERENCES car_options(id) ON DELETE RESTRICT,
            interior_id INTEGER REFERENCES car_options(id) ON DELETE RESTRICT,
            total_price INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS incompatible_options (
            id SERIAL PRIMARY KEY,
            option1_id INTEGER REFERENCES car_options(id) ON DELETE CASCADE,
            option2_id INTEGER REFERENCES car_options(id) ON DELETE CASCADE,
            reason TEXT NOT NULL,
            UNIQUE(option1_id, option2_id)
        );
    `;

    try {
        await pool.query(createTablesQuery);
        console.log('Successfully created tables.');
    } catch (err) {
        console.error('Error creating tables:', err);
        throw err;
    }
}

const seedDatabase = async () => {
    const seedOptionsQuery = `
        INSERT INTO car_options (id, category, name, price, visual_value, is_default) VALUES
        (1, 'exterior', 'Silver Metallic', 0, '#c0c0c0', true),
        (2, 'exterior', 'Midnight Blue', 1000, '#001c40', false),
        (3, 'exterior', 'Matte Black', 2000, '#1a1a1a', false),
        (4, 'exterior', 'Pearl White', 1500, '#f0f3f4', false),
        (5, 'exterior', 'Sunset Orange', 1200, '#ff4500', false),

        (6, 'roof', 'Body Color Roof', 0, 'body', true),
        (7, 'roof', 'Panoramic Glass Roof', 1500, 'panoramic', false),
        (8, 'roof', 'Carbon Fiber Roof', 2500, 'carbon', false),
        (9, 'roof', 'Convertible Soft Top', 2000, 'convertible', false),

        (10, 'wheels', '18-inch Aero Wheels', 0, 'aero', true),
        (11, 'wheels', '19-inch Sport Alloys', 1200, 'sport', false),
        (12, 'wheels', '20-inch Black Performance', 2200, 'performance', false),
        (13, 'wheels', '21-inch Carbon Blade', 3500, 'carbonblade', false),

        (14, 'interior', 'Grey Fabric Seats', 0, '#595959', true),
        (15, 'interior', 'Black Vegan Leather', 1500, '#151515', false),
        (16, 'interior', 'White Premium Leather', 2000, '#eceae6', false),
        (17, 'interior', 'Red Performance Leather', 3000, '#8b0000', false);

        SELECT setval('car_options_id_seq', (SELECT MAX(id) FROM car_options));
    `;

    const seedIncompatibilitiesQuery = `
        INSERT INTO incompatible_options (option1_id, option2_id, reason) VALUES
        (3, 14, 'Matte Black exterior is not available with Grey Fabric seats.'),
        (9, 17, 'Convertible Soft Top is not available with Red Performance Leather.'),
        (8, 13, 'Carbon Fiber Roof cannot be paired with 21-inch Carbon Blade wheels.');
    `;

    try {
        await pool.query(seedOptionsQuery);
        console.log('Successfully seeded car_options.');

        await pool.query(seedIncompatibilitiesQuery);
        console.log('Successfully seeded incompatible_options.');
    } catch (err) {
        console.error('Error seeding database:', err);
        throw err;
    }
}

const main = async () => {
    try {
        await createTables();
        await seedDatabase();
        console.log('Database reset and seed complete.');
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
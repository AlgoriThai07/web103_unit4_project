import { pool } from '../config/database.js';

const getCars = async (req, res) => {
    try {
        const selectQuery = `
            SELECT
                custom_cars.*,
                ext.name as exterior_name,
                ext.visual_values as exterior_color,
                ext.price as exterior_price,
                roof.name as roof_name,
                roof.visual_values as roof_color,
                roof.price as roof_price,
                wh.name as wheels_name,
                wh.visual_values as wheels_color,
                wh.price as wheels_price,
                int.name as interior_name,
                int.visual_values as interior_color,
                int.price as interior_price
            FROM custom_cars
            JOIN car_options ext
            ON custom_cars.exterior_id = ext.id
            JOIN car_options roof
            ON custom_cars.roof_id = roof.id
            JOIN car_options wh
            ON custom_cars.wheels_id = wh.id
            JOIN car_options int
            ON custom_cars.interior_id = int.id
            ORDER BY custom_cars.created_at DESC;
        `
        const results = await pool.query(selectQuery);
        res.status(200).json({ success: true, data: results.rows });
    } catch (error) {
        console.error('Error fetching all cars:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch car configurations' });
    }
}

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const selectQuery = `
            SELECT
                custom_cars.*,
                ext.name as exterior_name,
                ext.visual_values as exterior_color,
                ext.price as exterior_price,
                roof.name as roof_name,
                roof.visual_values as roof_color,
                roof.price as roof_price,
                wh.name as wheels_name,
                wh.visual_values as wheels_color,
                wh.price as wheels_price,
                int.name as interior_name,
                int.visual_values as interior_color,
                int.price as interior_price
            FROM custom_cars
            JOIN car_options ext
            ON custom_cars.exterior_id = ext.id
            JOIN car_options roof
            ON custom_cars.roof_id = roof.id
            JOIN car_options wh
            ON custom_cars.wheels_id = wh.id
            JOIN car_options int
            ON custom_cars.interior_id = int.id
            WHERE custom_cars.id = $1;
        `;
        const result = await pool.query(selectQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        res.status(409).json({ success: false, error: 'Failed to fetch car configurations' });
    }
}

const createCar = async (req, res) => {
    const { name, exterior_id, roof_id, wheels_id, interior_id, total_price } = req.body;
    try {
        const insertQuery = `
            INSERT INTO custom_cars (name, exterior_id, roof_id, wheels_id, interior_id, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [name, exterior_id, roof_id, wheels_id, interior_id, total_price]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(409).json({ success: false, error: 'Failed to create car configuration' });
    }
}

const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, exterior_id, roof_id, wheels_id, interior_id, total_price } = req.body;
        const updateQuery = `
            UPDATE custom_cars
            SET name = $1, exterior_id = $2, roof_id = $3, wheels_id = $4, interior_id = $5, total_price = $6
            WHERE id = $7
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [name, exterior_id, roof_id, wheels_id, interior_id, total_price, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(409).json({ success: false, error: 'Failed to update car configuration' });
    }
}

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = `
            DELETE FROM custom_cars
            WHERE id = $1
            RETURNING *;
        `;
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, deletedCar: result.rows[0] });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(409).json({ success: false, error: 'Failed to delete car configuration' });
    }
}

const getOptions = async (req, res) => {
    try {
        const selectQuery = `
            SELECT * FROM car_options
            ORDER BY car_options.id ASC;
        `;
        const result = await pool.query(selectQuery);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching options:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch options' });
    }
}

const getIncompatibilities = async (req, res) => {
    try {
        const selectQuery = `
            SELECT * FROM incompatible_options
            ORDER BY incompatible_options.id ASC;
        `;
        const result = await pool.query(selectQuery);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching incompatibilities:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch incompatibilities' });
    }
}

export default { getCars, getCarById, createCar, updateCar, deleteCar, getOptions, getIncompatibilities };
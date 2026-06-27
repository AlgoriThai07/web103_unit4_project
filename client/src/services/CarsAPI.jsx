const API_URL = '/api/cars';

const getAllCars = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all cars:', error);
        throw error;
    }
};

const getCarById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching car with ID ${id}:`, error);
        throw error;
    }
};

const createCar = async (carData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating car:', error);
        throw error;
    }
};

const updateCar = async (id, carData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error updating car with ID ${id}:`, error);
        throw error;
    }
};

const deleteCar = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error deleting car with ID ${id}:`, error);
        throw error;
    }
};

const getAllOptions = async () => {
    try {
        const response = await fetch(`${API_URL}/options/all`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching car options:', error);
        throw error;
    }
};

const getIncompatibilities = async () => {
    try {
        const response = await fetch(`${API_URL}/options/incompatibilities`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching incompatibilities:', error);
        throw error;
    }
};

export default {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    getAllOptions,
    getIncompatibilities
};

import express from 'express'

import CarsController from '../controllers/cars.js'

const router = express.Router();

router.get('/', CarsController.getCars)
router.get('/:id', CarsController.getCarById)
router.post('/', CarsController.createCar)
router.put('/:id', CarsController.updateCar)
router.delete('/:id', CarsController.deleteCar)
router.get('/options/all', CarsController.getOptions)
router.get('/options/incompatibilities', CarsController.getIncompatibilities)

export default router
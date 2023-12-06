// Referencing week 6 source code

import express from 'express';
const router = express.Router();

interface Vehicle {
    model: string;
    color: string;
    year: number;
    power: number;
}

interface Car extends Vehicle {
    bodyType: string;
    wheelCount: number;
}

interface Boat extends Vehicle {
    draft: number;
}

interface Plane extends Vehicle {
    wingspan: number;
}

type VehicleType = Car | Boat | Plane;

let vehicles: VehicleType[] = [];

/* POST vehicle. */
router.post('/add', function (req, res) {
    const newVehicle: VehicleType = req.body;
    try {
        vehicles.push(newVehicle);
        res.status(201).send("Vehicle added");
    } catch (error) {
        res.status(400).send(error);
    }
});

/* GET vehicle. */
router.get('/search/:model', function (req, res) {
    const model: string = req.params.model;
    const searchedVehicle: VehicleType | undefined = vehicles.find(vehicle => vehicle.model === model);
    try {
        res.send(searchedVehicle);
    } catch (error) {
        res.status(404).send(error);
    }
});

export default router;

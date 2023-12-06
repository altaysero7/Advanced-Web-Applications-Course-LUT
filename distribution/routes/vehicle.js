"use strict";
// Referencing week 6 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
let vehicles = [];
/* POST vehicle. */
router.post('/add', function (req, res) {
    const newVehicle = req.body;
    try {
        vehicles.push(newVehicle);
        res.status(201).send("Vehicle added");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
/* GET vehicle. */
router.get('/search/:model', function (req, res) {
    const model = req.params.model;
    const searchedVehicle = vehicles.find(vehicle => vehicle.model === model);
    try {
        res.send(searchedVehicle);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.default = router;

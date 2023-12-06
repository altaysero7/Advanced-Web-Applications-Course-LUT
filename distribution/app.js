"use strict";
// Referencing week 6 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hello_1 = __importDefault(require("./routes/hello"));
const vehicle_1 = __importDefault(require("./routes/vehicle"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/hello', hello_1.default);
app.use('/vehicle', vehicle_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

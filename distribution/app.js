"use strict";
// Referencing week 8-9 source code
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const private_1 = __importDefault(require("./routes/private"));
const todos_1 = __importDefault(require("./routes/todos"));
const passport_config_1 = require("./passport-config");
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose_1.default.connect(mongoDB);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
(0, passport_config_1.setupAuthentication)(passport_1.default);
app.use(passport_1.default.initialize());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/user', users_1.default);
app.use('/api/private', private_1.default);
app.use('/api/todos', todos_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

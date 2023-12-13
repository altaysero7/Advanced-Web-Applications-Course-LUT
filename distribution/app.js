"use strict";
// Referencing week 7 source code
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const users_1 = __importStar(require("./routes/users"));
const secret_1 = __importDefault(require("./routes/secret"));
const todos_1 = __importDefault(require("./routes/todos"));
const setupAuthentication = require('./passport-config');
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'veryverysecretkey',
    resave: false,
    saveUninitialized: false
}));
setupAuthentication(passport_1.default, users_1.getUserbyName, users_1.getUserbyId);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/user', users_1.default);
app.use('/api/secret', secret_1.default);
app.use('/api/todos', todos_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

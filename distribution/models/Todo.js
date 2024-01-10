"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const todoSchema = new Schema({
    user: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    items: [String]
});
const Todo = mongoose_1.default.model('Todo', todoSchema);
exports.Todo = Todo;

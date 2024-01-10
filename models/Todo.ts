import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [String]
});

const Todo = mongoose.model('Todo', todoSchema);
export { Todo };
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    data: String,
    timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export { ChatMessage };
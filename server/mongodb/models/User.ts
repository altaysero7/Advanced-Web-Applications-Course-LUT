import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
    email: String,
    password: String,
});

const userInfoSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    email: String,
    name: String,
    surname: String,
    age: Number,
    favoriteFood: String,
    favoriteColor: String,
    favoriteMovieGenre: String,
});

const userInteractionsSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    liked: [String],
    disliked: [String],
    matched: [String],
});

const userAccount = mongoose.model('userAccount', userAccountSchema);
const UserInfo = mongoose.model('UserInfo', userInfoSchema);
const UserInteractions = mongoose.model('UserInteractions', userInteractionsSchema);
export { userAccount, UserInfo, UserInteractions};